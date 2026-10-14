import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Briefcase, Gem, Flower, Clock, Hash, Layers, Wand2 } from "lucide-react";

const SPECIALISTS = [
    { name: "Vedic Acharya", role: "Vedic Astrologer", skills: "Vedic Astrology · Birth Chart", icon: Sparkles, color: "text-amber-700" },
    { name: "Vivaah Mitra", role: "Marriage Compatibility", skills: "Ashtakoot · Relationships", icon: Heart, color: "text-rose-700" },
    { name: "Dhanyog Guru", role: "Career & Wealth", skills: "Career Growth · Business", icon: Briefcase, color: "text-emerald-700" },
    { name: "Ratna Guru", role: "Gemstone Expert", skills: "Gemstone Selection · Planets", icon: Gem, color: "text-sky-700" },
    { name: "Rudra Guru", role: "Rudraksha Expert", skills: "Rudraksha Selection · Growth", icon: Flower, color: "text-orange-700" },
    { name: "Muhurat Acharya", role: "Muhurat Specialist", skills: "Marriage Muhurat · Launch", icon: Clock, color: "text-violet-700" },
    { name: "Ank Shastri", role: "Numerology Expert", skills: "Name · Destiny Number", icon: Hash, color: "text-cyan-700" },
    { name: "Tara Guru", role: "Tarot Expert", skills: "Tarot Readings · Guidance", icon: Layers, color: "text-fuchsia-700" },
    { name: "Upaya Guru", role: "Remedies Specialist", skills: "Remedies · Spiritual Solutions", icon: Wand2, color: "text-lime-700" },
];

export default function Specialists() {
    return (
        <section className="border-b border-border py-10 sm:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <span className="text-xs uppercase tracking-[0.3em] text-primary">One Intelligence · Many Specialists</span>
                        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            Choose Your Specialist
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Specialized AI guides designed for different aspects of life. Select the one
                            that best matches your needs and receive personalized spiritual guidance.
                        </p>
                    </div>
                    <Link
                        to="/ai-astrologer"
                        className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                        View All Specialists
                    </Link>
                </div>

                <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {SPECIALISTS.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.name}
                                className="group relative bg-card p-7 transition-colors hover:bg-secondary"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`flex h-12 w-12 items-center justify-center border border-border bg-background ${s.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Free Chat: 2 min
                                    </span>
                                </div>
                                <h3 className="mt-5 font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {s.name}
                                </h3>
                                <p className="text-sm text-primary">{s.role}</p>
                                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.skills}</p>
                                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                    <span className="text-xs text-muted-foreground">Hindi · English</span>
                                    <Link
                                        to="/ai-astrologer"
                                        className="text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:text-primary"
                                    >
                                        Chat →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}