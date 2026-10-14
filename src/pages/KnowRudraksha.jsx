import React from "react";
import PageHeader from "@/components/PageHeader";
import { Image } from "@/components/ui/image";
import RudrakshaMatch from "@/components/rudraksha/RudrakshaMatch";

const BEADS = [
    { mukhi: "1 Mukhi", ruling: "Shiva", benefit: "Supreme consciousness, clarity and liberation from fear." },
    { mukhi: "2 Mukhi", ruling: "Ardhanarishvara", benefit: "Harmony in relationships and unity of mind." },
    { mukhi: "3 Mukhi", ruling: "Agni", benefit: "Burns past karma, boosts confidence and digestion." },
    { mukhi: "4 Mukhi", ruling: "Brahma", benefit: "Sharpens intellect, memory and creativity." },
    { mukhi: "5 Mukhi", ruling: "Kalagni Rudra", benefit: "General well-being, peace and stress relief." },
    { mukhi: "6 Mukhi", ruling: "Kartikeya", benefit: "Willpower, focus and victory over obstacles." },
    { mukhi: "7 Mukhi", ruling: "Kamadeva", benefit: "Wealth, prosperity and financial growth." },
    { mukhi: "8 Mukhi", ruling: "Ganesha", benefit: "Removes obstacles and grants wisdom." },
    { mukhi: "9 Mukhi", ruling: "Durga", benefit: "Courage, protection and fearlessness." },
    { mukhi: "10 Mukhi", ruling: "Vishnu", benefit: "Protection from negative energies and peace." },
];

export default function KnowRudraksha() {
    return (
        <>
            <PageHeader
                eyebrow="Know your Rudraksha"
                title="The Sacred Bead of Shiva"
                description="Rudraksha — the eye of Shiva — is a seed of profound spiritual and therapeutic power. Discover the bead that aligns with your energy."
            />

            <RudrakshaMatch />

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="relative aspect-square overflow-hidden border border-border">
                            <Image src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop" alt="Rudraksha beads" fittingType="fill" className="h-full w-full" />
                        </div>
                        <div>
                            <h3 className="font-display text-3xl font-semibold text-foreground">What is Rudraksha?</h3>
                            <p className="mt-5 leading-relaxed text-muted-foreground">
                                Rudraksha beads are the seeds of the Elaeocarpus ganitrus tree, revered for millennia
                                in Vedic tradition. Each bead carries a natural number of faces or "mukhis," each
                                governed by a deity and planet. Worn against the skin, the bead is believed to
                                stabilise the body's electromagnetic field, calm the mind and align the wearer
                                with their ruling grahas.
                            </p>
                            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-border bg-border">
                                {[
                                    { k: "Lab Certified", v: "Authenticity guaranteed" },
                                    { k: "Energised", v: "Purified & mantra-charged" },
                                    { k: "Personalised", v: "Matched to your chart" },
                                ].map((b) => (
                                    <div key={b.k} className="bg-card p-5 text-center">
                                        <div className="text-sm font-medium text-primary">{b.k}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">{b.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h3 className="mt-12 sm:mt-20 font-display text-3xl font-semibold text-foreground">Types of Rudraksha</h3>
                    <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                        {BEADS.map((b) => (
                            <div key={b.mukhi} className="bg-card p-4 sm:p-6 transition-colors hover:bg-secondary">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-display text-xl font-semibold text-foreground">{b.mukhi}</h4>
                                    <span className="text-xs uppercase tracking-widest text-primary">{b.ruling}</span>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
