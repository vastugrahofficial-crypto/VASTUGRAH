import React from "react";
import PageHeader from "@/components/PageHeader";
import { Image } from "@/components/ui/image";

const STONES = [
    { name: "Ruby", planet: "Sun", glyph: "☉", benefit: "Leadership, vitality and self-confidence." },
    { name: "Pearl", planet: "Moon", glyph: "☽", benefit: "Emotional calm, intuition and serenity." },
    { name: "Red Coral", planet: "Mars", glyph: "♂", benefit: "Courage, energy and physical strength." },
    { name: "Emerald", planet: "Mercury", glyph: "☿", benefit: "Intellect, communication and business acumen." },
    { name: "Yellow Sapphire", planet: "Jupiter", glyph: "♃", benefit: "Wisdom, fortune and marital harmony." },
    { name: "Diamond", planet: "Venus", glyph: "♀", benefit: "Love, beauty and artistic grace." },
    { name: "Blue Sapphire", planet: "Saturn", glyph: "♄", benefit: "Discipline, focus and sudden fortune." },
    { name: "Hessonite", planet: "Rahu", glyph: "☊", benefit: "Protection from illusions and obscurity." },
    { name: "Cat's Eye", planet: "Ketu", glyph: "☋", benefit: "Spiritual insight and protection from hidden foes." },
];

export default function KnowGemstone() {
    return (
        <>
            <PageHeader
                eyebrow="Know your Gemstone"
                title="Planetary Gemstones"
                description="Each graha rules a gemstone. Worn correctly, the right stone strengthens your ruling planet and restores cosmic balance."
            />

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="relative aspect-square overflow-hidden border border-border">
                            <Image src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop" alt="Precious gemstones" fittingType="fill" className="h-full w-full" />
                        </div>
                        <div>
                            <h3 className="font-display text-3xl font-semibold text-foreground">The Science of Ratna</h3>
                            <p className="mt-5 leading-relaxed text-muted-foreground">
                                In Vedic astrology, the nine precious gemstones — the Navaratna — correspond to the
                                nine planets. A gemstone acts as a prism for its planet's energy, channelling it
                                into the wearer's aura. The correct stone is chosen not by preference but by your
                                birth chart: it must strengthen a beneficial planet or pacify a challenging one,
                                and it must always be worn with the right ritual and metal.
                            </p>
                            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                                {[
                                    "Always matched to your Janam Kundli, never chosen casually.",
                                    "Natural, untreated and ethically sourced stones.",
                                    "Energised with planetary mantras before wearing.",
                                    "Set in the correct metal — gold, silver or panchadhatu.",
                                ].map((t) => (
                                    <div key={t} className="flex items-start gap-2 border-b border-border pb-3">
                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h3 className="mt-12 sm:mt-20 font-display text-3xl font-semibold text-foreground">The Navaratna — Nine Sacred Stones</h3>
                    <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                        {STONES.map((s) => (
                            <div key={s.name} className="group bg-card p-6 transition-colors hover:bg-secondary">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-primary">{s.name}</h4>
                                    <span className="text-2xl text-primary">{s.glyph}</span>
                                </div>
                                <div className="mt-2 text-xs uppercase tracking-widest text-primary">Ruling Planet · {s.planet}</div>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}