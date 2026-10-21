import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Hero background. To host it yourself: save the picture into public/images/ and use "/images/hero.png".
const HERO_IMAGE = "https://media.base44.com/images/public/6acb4e24dc235007f51df03e/45ccaed33_generated_image.png";

export default function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-border">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src={HERO_IMAGE}
                    alt="Brass vastu compass on cream linen"
                    className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
            </div>

            {/* Grid lines overlay */}
            <div className="absolute inset-0 grid-lines opacity-30" />

            <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-12 sm:py-24">
                <div className="max-w-3xl fade-up">
                    <h1 className="font-display text-6xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                        VASTU<span className="text-primary">GRAH</span>
                    </h1>

                    <p className="mt-6 max-w-xl font-display text-2xl leading-snug text-foreground/90 sm:text-3xl">
                        Where the ancient precision of Vastu Shastra meets the celestial rhythm of the Grahas.
                    </p>

                    <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                        A digital sanctuary bridging terrestrial living and cosmic influence —
                        Vedic astrology, Kundli, Panchang, Rudraksha and gemstone guidance,
                        woven through sacred geometry.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link
                            to="/kundli"
                            className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:glow-copper"
                        >
                            Begin Your Alignment
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                        <Link
                            to="/consultation/chat"
                            className="inline-flex items-center gap-2 border border-border px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            Consult an Astrologer
                        </Link>
                    </div>
                </div>
            </div>

            {/* Diagonal copper thread */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-1/3 h-px w-full origin-left rotate-[-18deg] copper-ray opacity-50" />
            </div>
        </section>
    );
}