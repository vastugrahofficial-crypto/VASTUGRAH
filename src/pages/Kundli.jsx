// @ts-nocheck
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
import { User, Calendar, Clock, MapPin, Sparkles, MessageCircle, Lock, UserPlus, ArrowLeft } from "lucide-react";

const SIGNS_FULL = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const EMPTY_FORM = { name: "", gender: "male", date: "", time: "06:00", place: "" };

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
        moon_sign: c.moon_sign,
        sun_sign: c.sun_sign,
        nakshatra: c.nakshatra,
        nakshatra_pada: c.nakshatra_pada,
        nakshatra_lord: c.nakshatra_lord,
        current_mahadasha: c.current_mahadasha,
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
        moon_sign: profile.moon_sign,
        sun_sign: profile.sun_sign,
        nakshatra: profile.nakshatra,
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
    // true while the user is making a Kundli for someone else (family, friend, client)
    const [otherMode, setOtherMode] = useState(false);

    // The form is locked only when the user's own Kundli is saved and they are viewing it
    const locked = !!profile && !otherMode;

    // Pre-fill everything from the saved profile — details never need re-entry
    useEffect(() => {
        if (!profile) return;
        setForm(formFromProfile(profile));
        setChart(chartFromProfile(profile));
    }, [profile]);

    const startOther = () => {
        setOtherMode(true);
        setForm(EMPTY_FORM);
        setChart(null);
        setError(null);
    };

    const backToMine = () => {
        setOtherMode(false);
        setError(null);
        if (profile) {
            setForm(formFromProfile(profile));
            setChart(chartFromProfile(profile));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (locked || calculating) return;
        setCalculating(true);
        setError(null);
        try {
            // Simulate deep cosmic calculation pause for realism
            await new Promise((resolve) => setTimeout(resolve, 800));
            const rawChart = await computeChart({
                name: form.name,
                gender: form.gender,
                date: form.date,
                time: form.time,
                place: form.place,
            });
            const built = assembleChart(form, rawChart);

            // Only the user's own Kundli is saved to the account.
            // A Kundli made for someone else is shown but never overwrites it.
            if (!otherMode) {
                const saved = {
                    name: form.name,
                    gender: form.gender,
                    date_of_birth: form.date,
                    time_of_birth: form.time || "06:00",
                    place: form.place,
                    ascendant: built.ascendant,
                    moon_sign: built.moon_sign,
                    sun_sign: built.sun_sign,
                    nakshatra: built.nakshatra,
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
                eyebrow="Free Kundli · One per seeker"
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
                                    <h3 className="font-display text-2xl font-semibold text-foreground">
                                        {otherMode ? "Birth Details of Another Person" : "Birth Details"}
                                    </h3>

                                    {/* Own Kundli already saved */}
                                    {profile && !otherMode ? (
                                        <div className="mt-6 border border-primary/40 bg-secondary/40 p-5">
                                            <div className="flex items-center gap-2 text-sm text-primary">
                                                <Lock className="h-4 w-4" /> Free Kundli generated
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                Your Vedic Kundli has been calculated and saved to your account. For deeper
                                                readings and yearly predictions, consult a verified astrologer.
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
                                                    onClick={startOther}
                                                    className="inline-flex items-center gap-2 border border-border px-5 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                                                >
                                                    <UserPlus className="h-4 w-4" /> Kundli for someone else
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Making a Kundli for another person */}
                                    {profile && otherMode ? (
                                        <div className="mt-6 border border-primary/40 bg-secondary/40 p-5">
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                You are creating a Kundli for someone else. It will not replace your own saved Kundli.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={backToMine}
                                                className="mt-4 inline-flex items-center gap-2 border border-border px-5 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                                            >
                                                <ArrowLeft className="h-4 w-4" /> Back to my Kundli
                                            </button>
                                        </div>
                                    ) : null}

                                    <div className="mt-6 space-y-5">
                                        <div>
                                            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                <User className="h-3.5 w-3.5 text-primary" /> Name
                                            </label>
                                            <input
                                                required
                                                disabled={locked}
                                                value={form.name}
                                                onChange={field("name")}
                                                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
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
                                                        disabled={locked}
                                                        onClick={() => setForm((f) => ({ ...f, gender: g }))}
                                                        className={`flex-1 border px-4 py-2.5 text-sm capitalize transition-colors disabled:opacity-60 ${form.gender === g ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
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
                                                <input required type="date" max={new Date().toISOString().slice(0, 10)} disabled={locked} value={form.date} onChange={field("date")} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60" />
                                            </div>
                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5 text-primary" /> Time of Birth
                                                </label>
                                                <BirthTimePicker value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} disabled={locked} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 text-primary" /> Place of Birth
                                            </label>
                                            <PlaceInput
                                                required
                                                disabled={locked}
                                                value={form.place}
                                                onChange={(v) => setForm((f) => ({ ...f, place: v }))}
                                            />
                                        </div>
                                        {!locked && (
                                            <button
                                                type="submit"
                                                disabled={calculating}
                                                className="group inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:glow-copper disabled:opacity-60"
                                            >
                                                <Sparkles className="h-4 w-4" /> {calculating ? "Calculating…" : "Generate Kundli"}
                                            </button>
                                        )}
                                        {error && <p className="text-sm text-destructive">{error}</p>}
                                    </div>
                                </form>

                                {/* Chart */}
                                <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
                                    <h3 className="font-display text-2xl font-semibold text-foreground">North Indian Chart</h3>
                                    {chart ? (
                                        <div className="mt-6">
                                            <NorthChart houses={chart.houses} ascendant={chart.ascendant} planets={chart.planets} />
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