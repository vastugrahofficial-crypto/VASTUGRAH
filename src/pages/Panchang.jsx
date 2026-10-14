import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getDailyPanchang } from "@/lib/vedic-api";
import { CalendarDays, Sun, Moon, Star, Sparkles, Clock, RefreshCw } from "lucide-react";

const WEEKDAYS = ["Ravivar (Sunday)", "Somvar (Monday)", "Mangalvar (Tuesday)", "Budhvar (Wednesday)", "Guruvar (Thursday)", "Shukravar (Friday)", "Shanivar (Saturday)"];

export default function Panchang() {
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [panchang, setPanchang] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nonce, setNonce] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        setPanchang(null);

        try {
            const result = getDailyPanchang(date);
            if (!cancelled) {
                setPanchang(result);
            }
        } catch (e) {
            if (!cancelled) setError("Could not load the Panchang — please try again.");
        } finally {
            if (!cancelled) setLoading(false);
        }

        return () => {
            cancelled = true;
        };
    }, [date, nonce]);

    const cards = panchang
        ? [
            { label: "Vaara", value: WEEKDAYS[new Date(date).getDay()], icon: CalendarDays },
            { label: "Tithi", value: panchang.tithi, icon: Moon },
            { label: "Nakshatra", value: panchang.nakshatra, icon: Star },
            { label: "Yoga", value: panchang.yoga, icon: Sparkles },
            { label: "Karana", value: panchang.karana, icon: Sun },
            { label: "Moon Sign", value: panchang.moon_sign, icon: Clock },
        ]
        : [];

    const muhurats = panchang
        ? [
            { k: "Rahu Kaal", v: panchang.rahu_kaal, note: "Avoid auspicious work" },
            { k: "Abhijit Muhurat", v: panchang.abhijit_muhurat, note: "Most auspicious midday" },
            { k: "Amrit Kaal", v: panchang.amrit_kaal, note: "Favourable for new beginnings" },
            { k: "Brahma Muhurat", v: panchang.brahma_muhurat, note: "Ideal for meditation" },
        ]
        : [];

    return (
        <>
            <PageHeader
                eyebrow="Daily Panchang · Free"
                title="Today's Panchang"
                description="The five limbs of time — Tithi, Vaara, Nakshatra, Yoga and Karana — with accurate, live daily Vedic calculations."
            >
                <div className="flex items-center gap-3">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground" htmlFor="panchang-date">
                        Select date
                    </label>
                    <input
                        id="panchang-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-border bg-card px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                </div>
            </PageHeader>

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                        <span>
                            {new Date(date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </span>
                        <button
                            type="button"
                            onClick={() => setNonce((n) => n + 1)}
                            className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            <RefreshCw className="h-3.5 w-3.5" /> Refresh
                        </button>
                    </div>

                    {loading && (
                        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-card p-5 sm:p-8">
                                    <div className="h-4 w-24 animate-pulse bg-secondary" />
                                    <div className="mt-4 h-8 w-40 animate-pulse bg-secondary" />
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-border bg-card p-5 sm:p-10 text-center">
                            <p className="text-sm text-muted-foreground">{error}</p>
                            <button
                                type="button"
                                onClick={() => setNonce((n) => n + 1)}
                                className="mt-4 bg-primary px-5 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && panchang && (
                        <>
                            <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                                {cards.map((c) => {
                                    const Icon = c.icon;
                                    return (
                                        <div key={c.label} className="bg-card p-5 sm:p-8">
                                            <div className="flex items-center gap-3 text-primary">
                                                <Icon className="h-5 w-5" />
                                                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{c.label}</span>
                                            </div>
                                            <div className="mt-4 font-display text-3xl font-semibold text-foreground">{c.value}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 sm:mt-12 grid gap-6 lg:grid-cols-2">
                                <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
                                    <h3 className="font-display text-2xl font-semibold text-foreground">Auspicious Muhurat</h3>
                                    <div className="mt-5 space-y-3">
                                        {muhurats.map((m) => (
                                            <div key={m.k} className="flex items-center justify-between border-b border-border pb-3">
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">{m.k}</div>
                                                    <div className="text-xs text-muted-foreground">{m.note}</div>
                                                </div>
                                                <div className="text-sm text-primary font-medium">{m.v}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
                                    <h3 className="font-display text-2xl font-semibold text-foreground">Day's Spiritual Significance</h3>
                                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{panchang.significance}</p>
                                    <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                                        <Sun className="h-4 w-4" /> Sunrise {panchang.sunrise} · Sunset {panchang.sunset}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}