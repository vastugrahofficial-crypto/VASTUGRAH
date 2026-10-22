import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Link } from "react-router-dom";
import { computeChart } from "@/lib/vedic-api";
import useBirthProfile from "@/hooks/use-birth-profile";
import KundliLoader from "@/components/KundliLoader";
import KundliResult from "@/components/astrology/KundliResult";
import AstrologyChat from "@/components/astrology/AstrologyChat";
import PlaceInput from "@/components/PlaceInput";
import BirthTimePicker from "@/components/BirthTimePicker";
import NorthChart from "@/components/astrology/NorthChart";
import { User, Calendar, Clock, MapPin, Sparkles, MessageCircle, CheckCircle2, Eraser, RotateCcw } from "lucide-react";

const SIGNS_FULL = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const EMPTY_FORM = { name: "", gender: "male", date: "", time: "06:00", place: "" };

// ---- Result cache: the same birth details never hit FreeAstroApi twice ----
// The chart depends only on date + time + place, so name and gender are not part of the key.
// v2: older cached charts could have been built with wrong coordinates or placeholder data
const CACHE_KEY = "kundli_chart_cache_v2";
const CACHE_MAX = 10;

function cacheKey(form) {
    return [form.date, form.time, (form.place || "").trim().toLowerCase()].join("|");
}

function readCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") || {};
    } catch {
        return {};
    }
}

function writeCache(cache) {
    try {
        const keys = Object.keys(cache);
        while (keys.length > CACHE_MAX) delete cache[keys.shift()];
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // storage full or blocked — the app still works, it just won't cache
    }
}

function signIndex(s) {
    if (!s) return 0;
    const i = SIGNS_FULL.findIndex((n) => new RegExp(n, "i").test(s));
    return i >= 0 ? i : 0;
}

function assembleChart(form, c) {
    const ascIdx = signIndex(c.ascendant);
    const houses = Array.from({ length: 12 }, (_, h) => ({
        sign: SIGNS_FULL[(ascIdx + h) % 12],
        planets: [],
    }));
    (c.planets || []).forEach((p) => {
        const house = ((signIndex(p.sign) - ascIdx + 12) % 12) + 1;
        if (houses[house - 1]) houses[house - 1].planets.push(p.planet);
    });
    return {
        name: form.name,
        gender: form.gender,
        date: form.date,
        time: form.time,
        place: form.place,
        ascendant: c.ascendant,
        ascendant_degree: c.ascendant_degree,
        moon_sign: c.moon_sign,
        sun_sign: c.sun_sign,
        nakshatra: c.nakshatra,
        nakshatra_pada: c.nakshatra_pada,
        nakshatra_lord: c.nakshatra_lord,
        current_mahadasha: c.current_mahadasha,
        current_antardasha: c.current_antardasha,
        active_periods: c.active_periods,
        sade_sati: c.sade_sati,
        // Larger extras: shown right after calculating, not stored in the saved profile
        yogas: c.yogas,
        vargas: c.vargas,
        shadbala: c.shadbala,
        ashtakavarga: c.ashtakavarga,
        panchang: c.panchang,
        planets: c.planets || [],
        dashas: c.dashas || [],
        houses,
    };
}

function formFromProfile(profile) {
    return {
        name: profile.name || "",
        gender: profile.gender || "male",
        date: profile.date_of_birth || "",
        time: profile.time_of_birth || "",
        place: profile.place || "",
    };
}

function chartFromProfile(profile) {
    if (!profile || !profile.houses || !profile.houses.length) return null;
    return {
        name: profile.name,
        gender: profile.gender,
        date: profile.date_of_birth,
        time: profile.time_of_birth,
        place: profile.place,
        ascendant: profile.ascendant,
        ascendant_degree: profile.ascendant_degree,
        moon_sign: profile.moon_sign,
        sun_sign: profile.sun_sign,
        nakshatra: profile.nakshatra,
        current_mahadasha: profile.current_mahadasha,
        current_antardasha: profile.current_antardasha,
        active_periods: profile.active_periods,
        sade_sati: profile.sade_sati,
        planets: profile.planets || [],
        dashas: profile.dashas || [],
        houses: profile.houses,
    };
}

export default function Kundli() {
    const { profile, setProfile, loading } = useBirthProfile();
    const [form, setForm] = useState(EMPTY_FORM);
    const [chart, setChart] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState(null);
    // When a Kundli is already saved, the user chooses whether a new calculation replaces it
    const [saveAsMine, setSaveAsMine] = useState(false);

    // Pre-fill from the saved profile — every field stays editable
    useEffect(() => {
        if (!profile) return;
        setForm(formFromProfile(profile));
        setChart(chartFromProfile(profile));
        setSaveAsMine(false);
    }, [profile]);

    const useMyDetails = () => {
        if (!profile) return;
        setForm(formFromProfile(profile));
        setChart(chartFromProfile(profile));
        setError(null);
    };

    const clearForm = () => {
        setForm(EMPTY_FORM);
        setError(null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (calculating) return;
        setCalculating(true);
        setError(null);
        try {
            // Reuse an earlier result for the same date, time and place; call the API only when new
            const key = cacheKey(form);
            const cache = readCache();
            let rawChart = cache[key];
            if (!rawChart) {
                // Simulate deep cosmic calculation pause for realism
                await new Promise((resolve) => setTimeout(resolve, 800));
                rawChart = await computeChart({
                    name: form.name,
                    gender: form.gender,
                    date: form.date,
                    time: form.time,
                    place: form.place,
                });
                if (rawChart) {
                    cache[key] = rawChart;
                    writeCache(cache);
                }
            }
            const built = assembleChart(form, rawChart);

            // The first Kundli is always saved. Later ones replace it only if the box is ticked.
            if (!profile || saveAsMine) {
                const saved = {
                    name: form.name,
                    gender: form.gender,
                    date_of_birth: form.date,
                    time_of_birth: form.time || "06:00",
                    place: form.place,
                    ascendant: built.ascendant,
                    ascendant_degree: built.ascendant_degree,
                    moon_sign: built.moon_sign,
                    sun_sign: built.sun_sign,
                    nakshatra: built.nakshatra,
                    current_mahadasha: built.current_mahadasha,
                    current_antardasha: built.current_antardasha,
                    active_periods: built.active_periods,
                    sade_sati: built.sade_sati,
                    houses: built.houses,
                    planets: built.planets,
                    dashas: built.dashas,
                    free_kundli_used: true,
                };
                setProfile(saved);
            }
            setChart(built);
        } catch {
            setError("Could not calculate your chart — please try again.");
        } finally {
            setCalculating(false);
        }
    };

    const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    return (
        <>
            <PageHeader
                eyebrow="Free Kundli"
                title="Generate Your Janam Kundli"
                description="Enter your birth details to reveal your Vedic birth chart — the celestial blueprint of your life."
            />

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                            Opening your celestial record…
                        </div>
                    ) : calculating ? (
                        <KundliLoader />
                    ) : (
                        <>
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Form */}
                                <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-5 sm:p-8">
                                    <h3 className="font-display text-2xl font-semibold text-foreground">Birth Details</h3>

                                    {profile ? (
                                        <div className="mt-6 border border-primary/40 bg-secondary/40 p-5">
                                            <div className="flex items-center gap-2 text-sm text-primary">
                                                <CheckCircle2 className="h-4 w-4" /> Your Kundli is saved
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                Edit any detail below and press Recalculate to see a new chart — for yourself or
                                                for someone else. For deeper readings and yearly predictions, consult a verified astrologer.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-3">
                                                <Link
                                                    to="/consultation/chat"
                                                    className="inline-block bg-primary px-5 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
                                                >
                                                    Consult an Astrologer
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={clearForm}
                                                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                                                >
                                                    <Eraser className="h-3.5 w-3.5" /> Clear form
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={useMyDetails}
                                                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                                                >
                                                    <RotateCcw className="h-3.5 w-3.5" /> My saved details
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="mt-6 space-y-5">
                                        <div>
                                            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                <User className="h-3.5 w-3.5 text-primary" /> Name
                                            </label>
                                            <input
                                                required
                                                value={form.name}
                                                onChange={field("name")}
                                                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                                                placeholder="Full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Gender</label>
                                            <div className="flex gap-3">
                                                {["male", "female", "other"].map((g) => (
                                                    <button
                                                        type="button"
                                                        key={g}
                                                        onClick={() => setForm((f) => ({ ...f, gender: g }))}
                                                        className={`flex-1 border px-4 py-2.5 text-sm capitalize transition-colors ${form.gender === g ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
                                                            }`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5 text-primary" /> Date of Birth
                                                </label>
                                                <input required type="date" max={new Date().toISOString().slice(0, 10)} value={form.date} onChange={field("date")} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5 text-primary" /> Time of Birth
                                                </label>
                                                <BirthTimePicker value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 text-primary" /> Place of Birth
                                            </label>
                                            <PlaceInput
                                                required
                                                value={form.place}
                                                onChange={(v) => setForm((f) => ({ ...f, place: v }))}
                                            />
                                        </div>

                                        {profile && (
                                            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                                                <input
                                                    type="checkbox"
                                                    checked={saveAsMine}
                                                    onChange={(e) => setSaveAsMine(e.target.checked)}
                                                    className="mt-0.5 h-4 w-4 accent-primary"
                                                />
                                                <span>Save this as my Kundli (replaces the one saved on my account)</span>
                                            </label>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={calculating}
                                            className="group inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:glow-copper disabled:opacity-60"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            {calculating ? "Calculating…" : profile ? "Recalculate Kundli" : "Generate Kundli"}
                                        </button>
                                        {error && <p className="text-sm text-destructive">{error}</p>}
                                    </div>
                                </form>

                                {/* Chart */}
                                <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
                                    <h3 className="font-display text-2xl font-semibold text-foreground">North Indian Chart</h3>
                                    {chart ? (
                                        <div className="mt-6">
                                            <NorthChart houses={chart.houses} ascendant={chart.ascendant} ascDegree={chart.ascendant_degree} planets={chart.planets} />
                                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                                <div className="border border-border p-3">
                                                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Name</div>
                                                    <div className="text-foreground">{chart.name}</div>
                                                </div>
                                                <div className="border border-border p-3">
                                                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Ascendant</div>
                                                    <div className="text-primary font-medium">{chart.ascendant}</div>
                                                </div>
                                                <div className="border border-border p-3">
                                                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Birth Date</div>
                                                    <div className="text-foreground">{chart.date}</div>
                                                </div>
                                                <div className="border border-border p-3">
                                                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Birth Time</div>
                                                    <div className="text-foreground">{chart.time}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6 flex h-80 items-center justify-center border border-dashed border-border text-center text-sm text-muted-foreground">
                                            Your birth chart will appear here
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Kundli Results */}
                            {chart && (
                                <div className="rounded-xl mt-8 border border-border bg-card p-4 sm:p-8 sm:mt-10">
                                    <KundliResult chart={chart} />
                                </div>
                            )}

                            {/* AI Kundli Predictions chat */}
                            {chart && (
                                <div className="rounded-xl mt-8 border border-border bg-card p-4 sm:p-8 sm:mt-10">
                                    <div className="mb-5 flex items-center gap-3">
                                        <MessageCircle className="h-5 w-5 text-primary" />
                                        <div>
                                            <h3 className="font-display text-2xl font-semibold text-foreground">
                                                AI Kundli Predictions
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Your chart is live with the astrologer — ask about career, marriage, health, wealth or remedies.
                                            </p>
                                        </div>
                                    </div>
                                    <AstrologyChat
                                        personaName="Kundli Acharya"
                                        autoReading
                                        kundli={{
                                            name: chart.name,
                                            gender: chart.gender,
                                            date_of_birth: chart.date,
                                            time_of_birth: chart.time,
                                            place_of_birth: chart.place,
                                            ascendant: chart.ascendant,
                                            moon_sign: chart.moon_sign,
                                            sun_sign: chart.sun_sign,
                                            nakshatra: chart.nakshatra,
                                            planets: chart.planets,
                                            dashas: chart.dashas,
                                            houses: chart.houses.map((h, i) => ({ house: i + 1, sign: h.sign, planets: h.planets })),
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}