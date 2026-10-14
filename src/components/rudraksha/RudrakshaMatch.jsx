import React from "react";
import { Link } from "react-router-dom";
import useBirthProfile from "@/hooks/use-birth-profile";
import { recommendRudraksha } from "@/lib/rudraksha";
import { downloadRudrakshaPdf } from "@/lib/astro-pdf";
import { Sparkles, Download, Leaf } from "lucide-react";

export default function RudrakshaMatch() {
    const { profile, loading } = useBirthProfile();
    const rec = recommendRudraksha(profile?.moon_sign);

    return (
        <section className="border-b border-border bg-secondary/40 py-6 sm:py-12">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs uppercase tracking-[0.3em] text-primary">Your Match</span>
                </div>

                {loading ? (
                    <div className="mt-6 h-48 w-full max-w-3xl animate-pulse bg-card" />
                ) : !rec ? (
                    <div className="mt-6 max-w-2xl rounded-xl border border-border bg-card p-5 sm:p-8">
                        <h3 className="font-display text-2xl font-semibold text-foreground">Discover Your Rudraksha</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Your perfect bead is chosen from your Moon sign. Complete your free Kundli once, and your
                            Rudraksha match appears here automatically — no details to re-enter, ever.
                        </p>
                        <Link
                            to="/kundli"
                            className="mt-5 inline-block bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            Get My Free Kundli
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-6 fade-up lg:grid-cols-3">
                        <div className="rounded-xl border border-primary/40 bg-card p-5 sm:p-8">
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">
                                Matched to your Moon sign
                            </div>
                            <h3 className="mt-3 font-display text-4xl font-semibold text-primary">{rec.mukhi}</h3>
                            <div className="mt-5 space-y-2 text-sm text-foreground/90">
                                <div>
                                    Ruling Deity: <span className="text-primary">{rec.deity}</span>
                                </div>
                                <div>
                                    Ruling Planet: <span className="text-primary">{rec.planet}</span>
                                </div>
                                <div>
                                    Your Moon Sign: <span className="text-primary">{rec.moonSign}</span>
                                </div>
                            </div>
                            <p className="mt-5 border-t border-border pt-4 text-sm italic text-muted-foreground">
                                Mantra · {rec.mantra}
                            </p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-5 sm:p-8 lg:col-span-2">
                            <h4 className="font-display text-2xl font-semibold text-foreground">Spiritual Benefits</h4>
                            <ul className="mt-4 space-y-3">
                                {rec.benefits.map((b) => (
                                    <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
                                        <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground">{rec.wearing}</p>
                            <button
                                type="button"
                                onClick={() => downloadRudrakshaPdf(rec, profile)}
                                className="mt-6 inline-flex items-center gap-2 border border-primary px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                <Download className="h-4 w-4" /> Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}