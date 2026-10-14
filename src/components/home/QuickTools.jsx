import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Sparkles, Diamond, ArrowUpRight } from "lucide-react";

const TOOLS = [
    {
        label: "Today's Panchang",
        desc: "Tithi, Nakshatra, Yoga & Karana for today",
        to: "/panchang",
        icon: Calendar,
    },
    {
        label: "Free Kundli",
        desc: "Generate your birth chart instantly",
        to: "/kundli",
        icon: Sparkles,
    },
    {
        label: "Daily Horoscope",
        desc: "Read your zodiac forecast for the day",
        to: "/horoscope",
        icon: Diamond,
    },
];

export default function QuickTools() {
    return (
        <section className="border-b border-border bg-secondary/30 py-10 sm:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12 text-center">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary">Quick Access</span>
                    <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Free Vedic Tools
                    </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {TOOLS.map((t) => {
                        const Icon = t.icon;
                        return (
                            <Link
                                key={t.label}
                                to={t.to}
                                className="group relative flex flex-col items-start border border-border bg-card p-5 sm:p-8 transition-all hover:border-primary"
                            >
                                <div className="flex h-14 w-14 items-center justify-center border border-primary/40 bg-background text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-6 font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {t.label}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                                <span className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary">
                                    Open <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                                <div className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}