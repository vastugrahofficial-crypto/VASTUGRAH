import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { ArrowUpRight, FileText, Heart, Briefcase, Gem, Calendar, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";

const REPORTS = [
    { title: "Complete Kundli Report", desc: "Full birth chart with planetary positions, houses, dashas and yogas.", icon: FileText },
    { title: "Marriage Compatibility", desc: "Ashtakoot Guna Milan between two birth charts.", icon: Heart },
    { title: "Career & Wealth Report", desc: "Professional strengths, favourable periods and remedies.", icon: Briefcase },
    { title: "Gemstone Recommendation", desc: "Planetary gemstones suited to your chart and ascendant.", icon: Gem },
    { title: "Muhurat Report", desc: "Auspicious timings for marriage, griha pravesh and launches.", icon: Calendar },
    { title: "Numerology Report", desc: "Name and destiny number analysis with corrections.", icon: Sparkles },
];

export default function Reports() {
    return (
        <>
            <PageHeader
                eyebrow="Personalised Reports"
                title="Vedic Reports & Insights"
                description="Detailed, chart-based reports that translate your planetary positions into clear, actionable guidance."
            />

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
                            {REPORTS.map((r) => {
                                const Icon = r.icon;
                                return (
                                    <div key={r.title} className="group bg-card p-7 transition-colors hover:bg-secondary">
                                        <div className="flex h-12 w-12 items-center justify-center border border-primary/40 bg-background text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-5 font-display text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                                            {r.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                                        <Link to="/kundli" className="mt-5 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary">
                                            Get Started <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border border-border rounded-xl bg-card p-5 sm:p-8">
                            <div className="relative h-56 overflow-hidden border border-border">
                                <Image src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop" alt="Astrological report scroll" fittingType="fill" className="h-full w-full" />
                            </div>
                            <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">How it works</h3>
                            <ol className="mt-5 space-y-4 text-sm text-muted-foreground">
                                {[
                                    "Generate your free Kundli with accurate birth details.",
                                    "Choose the report that matches your question.",
                                    "Receive a detailed, chart-based interpretation.",
                                ].map((s, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-primary text-xs text-primary">{i + 1}</span>
                                        {s}
                                    </li>
                                ))}
                            </ol>
                            <Link to="/kundli" className="mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:glow-copper">
                                Generate Kundli First
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}