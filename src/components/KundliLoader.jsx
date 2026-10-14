import React, { useEffect, useState } from "react";

const STEPS = [
    "Aligning your birth details…",
    "Computing sidereal planetary positions…",
    "Mapping nakshatra & mahadashas…",
    "Weaving your celestial blueprint…",
];

const GLYPHS = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "☊"];

export default function KundliLoader() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 3200);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center border border-border bg-card py-20 fade-up">
            <div className="relative h-40 w-40">
                <svg viewBox="0 0 160 160" className="h-full w-full mandala-spin">
                    <circle cx="80" cy="80" r="74" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.5" />
                    <circle cx="80" cy="80" r="54" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.4" />
                    <circle cx="80" cy="80" r="32" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.5" />
                    {GLYPHS.map((g, i) => {
                        const a = (i / GLYPHS.length) * Math.PI * 2;
                        return (
                            <text
                                key={i}
                                x={80 + 64 * Math.cos(a)}
                                y={80 + 64 * Math.sin(a)}
                                fill="hsl(var(--primary))"
                                fontSize="11"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {g}
                            </text>
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-primary glow-copper" />
                </div>
            </div>
            <p key={step} className="mt-8 text-center text-sm uppercase tracking-[0.3em] text-primary fade-up">
                {STEPS[step]}
            </p>
            <div className="mt-4 flex gap-2">
                {STEPS.map((_, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === step ? "bg-primary" : "bg-border"}`} />
                ))}
            </div>
        </div>
    );
}