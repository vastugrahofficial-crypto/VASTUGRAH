import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Star, Languages, Award } from "lucide-react";
import { Image } from "@/components/ui/image";

const ASTROLOGERS = [
    { name: "Acharya Nandini Verma", skills: "Marriage & Relationships · Birth Chart", exp: "12 yrs", rating: 4.9, langs: "Hindi, English", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" },
    { name: "Pandit Ramesh Shastri", skills: "Career · Vastu Audit", exp: "18 yrs", rating: 4.8, langs: "Hindi, English", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
    { name: "Jyotish Kavita Joshi", skills: "Numerology · Name Correction", exp: "9 yrs", rating: 4.9, langs: "Hindi, English", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
    { name: "Acharya Vikram Tripathi", skills: "Gemstone · Rudraksha Selection", exp: "15 yrs", rating: 4.7, langs: "Hindi, English", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
];

export default function Astrologers() {
    return (
        <section className="border-b border-border py-10 sm:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-14 max-w-2xl">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary">Verified Experts</span>
                    <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Find the Right Astrologer for Every Question
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Connect with verified Vedic astrology experts for personalized guidance on
                        life, love, career, business, marriage and more.
                    </p>
                </div>

                <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                    {ASTROLOGERS.map((a) => (
                        <div key={a.name} className="group bg-card p-6 transition-colors hover:bg-secondary">
                            <div className="relative mb-5 aspect-square overflow-hidden border border-border">
                                <Image src={a.img} alt={a.name} fittingType="fill" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute right-2 top-2 flex items-center gap-1 bg-background/90 px-2 py-1 text-[10px] text-primary">
                                    <BadgeCheck className="h-3 w-3" /> Verified
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-lg font-semibold text-foreground">{a.name}</h3>
                                <span className="flex items-center gap-1 text-xs text-primary">
                                    <Star className="h-3 w-3 fill-primary" /> {a.rating}
                                </span>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.skills}</p>
                            <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1"><Award className="h-3 w-3 text-primary" /> {a.exp}</span>
                                <span className="flex items-center gap-1"><Languages className="h-3 w-3 text-primary" /> {a.langs}</span>
                            </div>
                            <Link
                                to="/consultation/chat"
                                className="mt-5 block w-full border border-border py-2.5 text-center text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                            >
                                Consult Now
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

