import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function CtaBanner() {
    return (
        <section className="relative overflow-hidden border-b border-border py-28">
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                    alt="Vastu mandala"
                    fittingType="fill"
                    className="h-full w-full opacity-25 mandala-spin-slow"
                />
                <div className="absolute inset-0 bg-background/80" />
            </div>
            <div className="relative mx-auto max-w-3xl px-6 text-center">
                <span className="text-xs uppercase tracking-[0.3em] text-primary">The Cosmic Threshold</span>
                <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
                    Align your dwelling with the cosmos.
                </h2>
                <p className="mt-6 text-lg text-muted-foreground">
                    Begin with a free Kundli, explore your ruling planets, or consult a verified
                    astrologer. Your journey through sacred geometry starts here.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/kundli"
                        className="group inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:glow-copper"
                    >
                        Generate Free Kundli
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <Link
                        to="/consultation/chat"
                        className="inline-flex items-center gap-2 border border-border px-8 py-4 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                        Talk to an Astrologer
                    </Link>
                </div>
            </div>
        </section>
    );
}