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
import { User, Calendar, Clock, MapPin, Sparkles, MessageCircle, Lock } from "lucide-react";

const SIGNS_FULL = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

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

export default function Kundli() {
    const { profile, setProfile, loading } = useBirthProfile();
    const [form, setForm] = useState({ name: "", gender: "male", date: "", time: "06:00", place: "" });
    const [chart, setChart] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState(null);

    // Pre-fill everything from the saved profile — details never need re-entry
    useEffect(() => {
        if (!profile) return;
        setForm({
            name: profile.name || "",
            gender: profile.gender || "male",
            date: profile.date_of_birth || "",
            time: profile.time_of_birth || "",
            place: profile.place || "",
        });
        if (profile.houses && profile.houses.length) {
            setChart({
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
            });
        }
    }, [profile]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (profile || calculating) return; // free Kundli is one-time per user
        setCalculating(true);
        setError(null);
        try {
            // Simulate deep cosmic calculation pause for realism
            await new Promise((resolve) => setTimeout(resolve, 800));
            const rawChart = computeChart({
                name: form.name,
                gender: form.gender,
                date: form.date,
                time: form.time,
                place: form.place,
            });
            const built = assembleChart(form, rawChart);
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
                                    <h3 className="font-display text-2xl font-semibold text-foreground">Birth Details</h3>
                                    {profile ? (
                                        <div className="mt-6 border border-primary/40 bg-secondary/40 p-5">
                                            <div className="flex items-center gap-2 text-sm text-primary">
                                                <Lock className="h-4 w-4" /> Free Kundli generated
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                Your Vedic Kundli has been calculated and saved to your account. For deeper
                                                readings and yearly predictions, consult a verified astrologer.
                                            </p>
                                            <Link
                                                to="/consultation/chat"
                                                className="mt-4 inline-block bg-primary px-5 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
                                            >
                                                Consult an Astrologer
                                            </Link>
                                        </div>
                                    ) : null}
                                    <div className="mt-6 space-y-5">
                                        <div>
                                            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                <User className="h-3.5 w-3.5 text-primary" /> Name
                                            </label>
                                            <input
                                                required
                                                disabled={!!profile}
                                                value={form.name}
                                                onChange={field("name")}
                                                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Gender</label>
                                            <div className="flex gap-3">
                                                {["male", "female", "other"].map((g) => (
                                                    <button
                                                        type="button"
                                                        key={g}
                                                        disabled={!!profile}
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
                                                <input required type="date" max={new Date().toISOString().slice(0, 10)} disabled={!!profile} value={form.date} onChange={field("date")} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60" />
                                            </div>
                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5 text-primary" /> Time of Birth
                                                </label>
                                                <BirthTimePicker value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} disabled={!!profile} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 text-primary" /> Place of Birth
                                            </label>
                                            <PlaceInput
                                                required
                                                disabled={!!profile}
                                                value={form.place}
                                                onChange={(v) => setForm((f) => ({ ...f, place: v }))}
                                            />
                                        </div>
                                        {!profile && (
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
                                            <NorthChart houses={chart.houses} ascendant={chart.ascendant} />
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

function NorthChart({ houses, ascendant }) {
    const positions = [
        { x: 50, y: 15 }, { x: 75, y: 30 }, { x: 75, y: 55 }, { x: 50, y: 70 },
        { x: 25, y: 55 }, { x: 25, y: 30 }, { x: 50, y: 40 }, { x: 62, y: 40 },
        { x: 50, y: 52 }, { x: 38, y: 40 }, { x: 50, y: 28 }, { x: 38, y: 52 },
    ];
    return (
        <svg viewBox="0 0 100 100" className="w-full">
            <rect x="5" y="5" width="90" height="90" fill="none" stroke="hsl(var(--border))" strokeWidth="0.6" />
            <line x1="5" y1="5" x2="95" y2="95" stroke="hsl(var(--border))" strokeWidth="0.6" />
            <line x1="95" y1="5" x2="5" y2="95" stroke="hsl(var(--border))" strokeWidth="0.6" />
            <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="hsl(var(--border))" strokeWidth="0.6" />
            {houses.map((h, i) => {
                const p = positions[i];
                return (
                    <g key={i}>
                        <text x={p.x} y={p.y} fill="hsl(var(--muted-foreground))" fontSize="3.2" textAnchor="middle">{h.sign}</text>
                        {h.planets.map((pl, j) => (
                            <text key={j} x={p.x} y={p.y + 5 + j * 4} fill="hsl(var(--primary))" fontSize="3.6" fontWeight="600" textAnchor="middle">{pl}</text>
                        ))}
                    </g>
                );
            })}
            <text x="50" y="98" fill="hsl(var(--primary))" fontSize="3" textAnchor="middle">Asc: {ascendant}</text>
        </svg>
    );
}