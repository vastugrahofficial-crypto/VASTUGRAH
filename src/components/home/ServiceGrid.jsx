import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const SERVICES = [
    {
        title: "Astrology Consultation",
        desc: "Expert Vedic guidance for life's important decisions.",
        to: "/consultation/chat",
        img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Janam Kundli",
        desc: "Detailed birth chart insights and planetary predictions.",
        to: "/kundli",
        img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Daily Panchang",
        desc: "Muhurat, festivals and planetary guidance for today.",
        to: "/panchang",
        img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Know your Rudraksha",
        desc: "Authentic lab-certified beads selected for your energy.",
        to: "/know-your-rudraksha",
        img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Know your Gemstone",
        desc: "Planetary gemstones to strengthen your ruling planets.",
        to: "/know-your-gemstone",
        img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "AI Astrologer",
        desc: "Specialized AI guides for every dimension of life.",
        to: "/ai-astrologer",
        img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
    },
];

export default function ServiceGrid() {
    return (
        <section className="border-b border-border py-10 sm:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-14 max-w-2xl">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary">The Alignment Matrix</span>
                    <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        A Complete Spiritual Ecosystem
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        From sacred essentials and Vedic astrology to Rudraksha and gemstone guidance —
                        all within one trusted sanctuary.
                    </p>
                </div>

                <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.map((s) => (
                        <Link
                            key={s.title}
                            to={s.to}
                            className="group relative flex flex-col bg-card p-5 sm:p-8 transition-colors hover:bg-secondary"
                        >
                            <div className="relative mb-6 h-44 overflow-hidden border border-border">
                                <Image
                                    src={s.img}
                                    alt={s.title}
                                    fittingType="fill"
                                    className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                            </div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                                        {s.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                                </div>
                                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </div>
                            <div className="mt-6 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}