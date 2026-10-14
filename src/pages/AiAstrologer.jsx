import React, { useState, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import useBirthProfile from "@/hooks/use-birth-profile";
import AstrologyChat from "@/components/astrology/AstrologyChat";
import { Sparkles, Heart, Briefcase, Gem, Flower, Clock, Hash, Layers, Wand2, Brain } from "lucide-react";

const SPECIALISTS = [
    { name: "VASTUGRAH AI", role: "Master Spiritual Intelligence", skills: "Vedic Astrology · Numerology + 49 more", icon: Brain, color: "text-amber-700", featured: true },
    { name: "Vedic Acharya", role: "Vedic Astrologer", skills: "Vedic Astrology · Birth Chart", icon: Sparkles, color: "text-amber-700" },
    { name: "Vivaah Mitra", role: "Marriage Compatibility", skills: "Ashtakoot · Relationships", icon: Heart, color: "text-rose-700" },
    { name: "Prem Sutra", role: "Love & Relationship", skills: "Emotional Bonding · Love", icon: Heart, color: "text-pink-700" },
    { name: "Dhanyog Guru", role: "Career & Wealth", skills: "Career Growth · Business", icon: Briefcase, color: "text-emerald-700" },
    { name: "Ratna Guru", role: "Gemstone Expert", skills: "Gemstone Selection · Planets", icon: Gem, color: "text-sky-700" },
    { name: "Rudra Guru", role: "Rudraksha Expert", skills: "Rudraksha Selection · Growth", icon: Flower, color: "text-orange-700" },
    { name: "Muhurat Acharya", role: "Muhurat Specialist", skills: "Marriage Muhurat · Launch", icon: Clock, color: "text-violet-700" },
    { name: "Ank Shastri", role: "Numerology Expert", skills: "Name · Destiny Number", icon: Hash, color: "text-cyan-700" },
    { name: "Tara Guru", role: "Tarot Expert", skills: "Tarot Readings · Guidance", icon: Layers, color: "text-fuchsia-700" },
    { name: "Manas", role: "Western Astrology", skills: "Natal Chart · Synastry", icon: Sparkles, color: "text-indigo-700" },
    { name: "Upaya Guru", role: "Remedies Specialist", skills: "Remedies · Spiritual Solutions", icon: Wand2, color: "text-lime-700" },
];

export default function AiAstrologer() {
    const [persona, setPersona] = useState("Vedic Acharya");
    const chatRef = useRef(null);
    const { profile } = useBirthProfile();

    const selectPersona = (name) => {
        setPersona(name);
        chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <PageHeader
                eyebrow="One Intelligence · Many Specialists"
                title="VASTUGRAH AI Astrologer"
                description="Specialized AI guides designed for different aspects of life. Select the one that best matches your needs and receive personalized spiritual guidance — free, instantly."
            />

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Free astrology chat */}
                    <div ref={chatRef} className="scroll-mt-40">
                        <div className="border border-border bg-card p-6 sm:p-8">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-display text-2xl font-semibold text-foreground">
                                        Chat with {persona}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Free astrology chat — guidance on kundli, planets, gemstones, vastu and remedies.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-2 border border-primary/40 px-3 py-1 text-xs uppercase tracking-widest text-primary">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live · Free
                                </span>
                            </div>
                            <AstrologyChat
                                key={persona}
                                personaName={persona}
                                kundli={profile
                                    ? {
                                        name: profile.name,
                                        gender: profile.gender,
                                        date_of_birth: profile.date_of_birth,
                                        time_of_birth: profile.time_of_birth,
                                        place_of_birth: profile.place,
                                        ascendant: profile.ascendant,
                                        houses: profile.houses,
                                    }
                                    : null}
                            />
                        </div>
                    </div>

                    {/* Specialist grid */}
                    <div className="mt-8 sm:mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                        {SPECIALISTS.map((s) => {
                            const Icon = s.icon;
                            const active = persona === s.name;
                            return (
                                <div
                                    key={s.name}
                                    className={`group relative bg-card p-7 transition-colors hover:bg-secondary ${active || s.featured ? "ring-1 ring-primary ring-inset" : ""
                                        }`}
                                >
                                    {s.featured && (
                                        <span className="absolute right-4 top-4 bg-primary px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary-foreground">
                                            Master
                                        </span>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div className={`flex h-12 w-12 items-center justify-center border border-border bg-background ${s.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Free Chat
                                        </div>
                                    </div>
                                    <h3 className="mt-5 font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                                        {s.name}
                                    </h3>
                                    <p className="text-sm text-primary">{s.role}</p>
                                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.skills}</p>
                                    <p className="mt-2 text-[11px] text-muted-foreground">Hindi · English</p>
                                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                        <span className="text-xs text-muted-foreground">Powered by VASTUGRAH AI</span>
                                        <button
                                            type="button"
                                            onClick={() => selectPersona(s.name)}
                                            className="text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:text-primary"
                                        >
                                            {active ? "Chatting →" : "Chat →"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}