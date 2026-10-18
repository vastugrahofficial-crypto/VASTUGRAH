import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getDailyHoroscope } from "@/lib/vedic-api";
import useBirthProfile from "@/hooks/use-birth-profile";
import { Star } from "lucide-react";

const ZODIAC = [
    { name: "Aries", glyph: "♈", dates: "Mar 21 – Apr 19", element: "Fire" },
    { name: "Taurus", glyph: "♉", dates: "Apr 20 – May 20", element: "Earth" },
    { name: "Gemini", glyph: "♊", dates: "May 21 – Jun 20", element: "Air" },
    { name: "Cancer", glyph: "♋", dates: "Jun 21 – Jul 22", element: "Water" },
    { name: "Leo", glyph: "♌", dates: "Jul 23 – Aug 22", element: "Fire" },
    { name: "Virgo", glyph: "♍", dates: "Aug 23 – Sep 22", element: "Earth" },
    { name: "Libra", glyph: "♎", dates: "Sep 23 – Oct 22", element: "Air" },
    { name: "Scorpio", glyph: "♏", dates: "Oct 23 – Nov 21", element: "Water" },
    { name: "Sagittarius", glyph: "♐", dates: "Nov 22 – Dec 21", element: "Fire" },
    { name: "Capricorn", glyph: "♑", dates: "Dec 22 – Jan 19", element: "Earth" },
    { name: "Aquarius", glyph: "♒", dates: "Jan 20 – Feb 18", element: "Air" },
    { name: "Pisces", glyph: "♓", dates: "Feb 19 – Mar 20", element: "Water" },
];

const RANGES = [
    ["Aries", 3, 21, 4, 19], ["Taurus", 4, 20, 5, 20], ["Gemini", 5, 21, 6, 20],
    ["Cancer", 6, 21, 7, 22], ["Leo", 7, 23, 8, 22], ["Virgo", 8, 23, 9, 22],
    ["Libra", 9, 23, 10, 22], ["Scorpio", 10, 23, 11, 21], ["Sagittarius", 11, 22, 12, 21],
    ["Capricorn", 12, 22, 1, 19], ["Aquarius", 1, 20, 2, 18], ["Pisces", 2, 19, 3, 20],
];

function sunSignFor(dob) {
    if (!dob) return null;
    const [, m, d] = dob.split("-").map(Number);
    for (const [name, m1, d1, m2, d2] of RANGES) {
        const afterStart = m === m1 ? d >= d1 : m > m1;
        const beforeEnd = m === m2 ? d <= d2 : m < m2;
        if (m1 < m2 ? afterStart && beforeEnd : afterStart || beforeEnd) return name;
    }
    return null;
}

export default function Horoscope() {
    const { profile } = useBirthProfile();
    const [selected, setSelected] = useState(ZODIAC[0]);
    const [horo, setHoro] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nonce, setNonce] = useState(0);

    // Auto-select the user's own sun sign from their saved birth profile
    useEffect(() => {
        const sign = sunSignFor(profile?.date_of_birth);
        if (sign) {
            const found = ZODIAC.find((z) => z.name === sign);
            if (found) setSelected(found);
        }
    }, [profile]);

    useEffect(() => {
        if (!selected) return;
        let cancelled = false;
        setLoading(true);
        setHoro(null);
        setError(null);

        getDailyHoroscope(selected.name)
            .then((data) => {
                if (!cancelled) setHoro(data);
            })
            .catch(() => {
                if (!cancelled) setError("Could not load today's forecast — please try again.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [selected, nonce]);

    return (
        <>
            <PageHeader
                eyebrow="Daily Horoscope · Free"
                title="Your Zodiac Forecast"
                description="Today's accurate guidance for your sign — drawn from the planetary movements of the Grahas."
            />

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
                        {ZODIAC.map((z) => (
                            <button
                                key={z.name}
                                onClick={() => setSelected(z)}
                                className={`group bg-card p-6 text-left transition-colors hover:bg-secondary ${selected?.name === z.name ? "ring-1 ring-primary ring-inset" : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl text-primary">{z.glyph}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{z.element}</span>
                                </div>
                                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {z.name}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">{z.dates}</p>
                            </button>
                        ))}
                    </div>

                    {selected && (
                        <div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-10 sm:mt-12 fade-up">
                            <div className="flex items-center gap-5">
                                <span className="text-6xl text-primary">{selected.glyph}</span>
                                <div>
                                    <h2 className="font-display text-4xl font-semibold text-foreground">{selected.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {selected.dates} · {selected.element} sign
                                        {profile && selected.name === sunSignFor(profile.date_of_birth) ? " · Your sign" : ""}
                                    </p>
                                </div>
                            </div>

                            {loading && (
                                <div className="mt-8">
                                    <div className="h-4 w-full max-w-2xl animate-pulse bg-secondary" />
                                    <div className="mt-3 h-4 w-full max-w-xl animate-pulse bg-secondary" />
                                    <div className="mt-3 h-4 w-64 animate-pulse bg-secondary" />
                                    <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                                        Reading today's transits…
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="mt-8">
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

                            {!loading && !error && horo && (
                                <>
                                    <div className="mt-8 flex items-start gap-3">
                                        <Star className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                        <p className="max-w-3xl text-lg leading-relaxed text-foreground/90">{horo.forecast}</p>
                                    </div>
                                    <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
                                        {[
                                            { k: "Lucky Number", v: horo.lucky_number },
                                            { k: "Lucky Color", v: horo.lucky_color },
                                            { k: "Favourable Direction", v: horo.favourable_direction },
                                            { k: "Remedy", v: horo.remedy },
                                        ].map((m) => (
                                            <div key={m.k} className="bg-card p-5">
                                                <div className="text-xs uppercase tracking-widest text-muted-foreground">{m.k}</div>
                                                <div className="mt-2 text-sm font-medium text-primary">{m.v}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {horo.sections && horo.sections.length > 0 && (
                                        <div className="mt-10">
                                            <h4 className="font-display text-xl font-semibold text-foreground">Planetary Guidance by Life Domain</h4>
                                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                                {horo.sections.map((sec) => (
                                                    <div key={sec.key} className="border border-border bg-card/60 p-5 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-primary capitalize">{sec.key}</span>
                                                            <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                                sec.tone === "supportive"
                                                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                                                    : sec.tone === "cautious"
                                                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                                                    : "border-border bg-secondary text-muted-foreground"
                                                            }`}>
                                                                {sec.tone}
                                                            </span>
                                                        </div>
                                                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{sec.text}</p>
                                                        {sec.advice && (
                                                            <div className="mt-3 border-t border-border/50 pt-2 text-[11px] text-foreground/80 font-medium">
                                                                💡 <span className="text-muted-foreground font-normal">Advice:</span> {sec.advice}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}