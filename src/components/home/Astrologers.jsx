// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Star, Languages, Award } from "lucide-react";

// Placeholder portrait. To host it yourself: save a picture into public/images/ and use "/images/astrologer.jpg".
const PORTRAIT = "https://media.base44.com/images/public/6acb4e24dc235007f51df03e/d57736bb8_generated_32c5a66a.jpg";

const ASTROLOGERS = [
    { name: "Acharya Nandini Verma", skills: "Marriage & Relationships · Birth Chart", exp: "12 yrs", rating: 4.9, langs: "Hindi, English", img: PORTRAIT },
    { name: "Pandit Ramesh Shastri", skills: "Career · Vastu Audit", exp: "18 yrs", rating: 4.8, langs: "Hindi, English", img: PORTRAIT },
    { name: "Jyotish Kavita Joshi", skills: "Numerology · Name Correction", exp: "9 yrs", rating: 4.9, langs: "Hindi, English", img: PORTRAIT },
    { name: "Acharya Vikram Tripathi", skills: "Gemstone · Rudraksha Selection", exp: "15 yrs", rating: 4.7, langs: "Hindi, English", img: PORTRAIT },
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

                <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
                    {ASTROLOGERS.map((a) => (
                        <div key={a.name} className="group bg-card p-4 transition-colors hover:bg-secondary sm:p-6">
                            <div className="relative mb-5 aspect-square overflow-hidden border border-border">
                                <img src={a.img} alt={a.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute right-2 top-2 flex items-center gap-1 bg-background/90 px-2 py-1 text-[10px] text-primary">
                                    <BadgeCheck className="h-3 w-3" /> Verified
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-sm font-semibold text-foreground sm:text-lg">{a.name}</h3>
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