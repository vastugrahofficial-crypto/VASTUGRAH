import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { BadgeCheck, Star, MessageCircle, Phone, Send, CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ConsultationPage({ mode }) {
    const isChat = mode === "chat";
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", concern: "" });

    const astrologers = [
        { name: "Acharya Nandini Verma", skills: "Marriage & Relationships · Birth Chart", rating: 4.9, exp: "12 yrs" },
        { name: "Pandit Ramesh Shastri", skills: "Career · Vastu Audit", rating: 4.8, exp: "18 yrs" },
        { name: "Jyotish Kavita Joshi", skills: "Numerology · Name Correction", rating: 4.9, exp: "9 yrs" },
        { name: "Acharya Vikram Tripathi", skills: "Gemstone · Rudraksha Selection", rating: 4.7, exp: "15 yrs" },
    ];

    const onSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <PageHeader
                eyebrow={isChat ? "Consultation · Chat" : "Consultation · Call"}
                title={isChat ? "Chat with an Astrologer" : "Call with an Astrologer"}
                description={
                    isChat
                        ? "Connect with verified Vedic astrologers through secure chat. Share your concerns in writing and receive considered, personalized guidance."
                        : "Speak directly with verified Vedic astrologers over a private call. A voice conversation for questions that deserve a human answer."
                }
            >
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {isChat ? <MessageCircle className="h-4 w-4 text-primary" /> : <Phone className="h-4 w-4 text-primary" />}
                    Live {mode} sessions are coming soon — submit your details below and we'll reach out when bookings open.
                </div>
            </PageHeader>

            <section className="py-8 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Astrologer list */}
                    <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                        {astrologers.map((a) => (
                            <div key={a.name} className="group bg-card p-6 transition-colors hover:bg-secondary">
                                <div className="relative mb-5 aspect-square overflow-hidden border border-border">
                                    <Image src={a.img || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} alt={a.name} fittingType="fill" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
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
                                <p className="mt-3 text-[11px] text-muted-foreground">Exp: {a.exp}</p>
                                <span className="mt-4 block w-full border border-border py-2.5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                    {isChat ? "Chat Soon" : "Call Soon"}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Inquiry form */}
                    <div className="mt-8 sm:mt-12 grid gap-6 lg:grid-cols-2">
                        <div>
                            <h3 className="font-display text-3xl font-semibold text-foreground">
                                Request a {isChat ? "Chat" : "Call"} Session
                            </h3>
                            <p className="mt-4 text-muted-foreground">
                                We're preparing a seamless {mode} experience with our verified astrologers.
                                Share your details and your area of concern — we'll notify you the moment
                                bookings go live. No payment is required to express interest.
                            </p>
                            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                {[
                                    "Verified, experienced Vedic astrologers",
                                    "Private and confidential conversations",
                                    "Guidance in Hindi and English",
                                    "No payment required to request",
                                ].map((t) => (
                                    <li key={t} className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border border-border rounded-xl bg-card p-5 sm:p-8">
                            {submitted ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="h-12 w-12 text-primary" />
                                    <h4 className="mt-4 font-display text-2xl font-semibold text-foreground">Request Received</h4>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Thank you, {form.name || "friend"}. We'll reach out to{" "}
                                        <span className="text-primary">{form.email || "you"}</span> when {mode} bookings open.
                                    </p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", concern: "" }); }}
                                        className="mt-6 border border-border px-5 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                                    >
                                        Submit another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Your name" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="you@example.com" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Area of Concern</label>
                                        <textarea required value={form.concern} onChange={(e) => setForm({ ...form, concern: e.target.value })} rows={4} className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="e.g. career, marriage, health..." />
                                    </div>
                                    <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:glow-copper">
                                        <Send className="h-4 w-4" /> Submit Request
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 text-center text-sm text-muted-foreground">
                        Prefer to explore first?{" "}
                        <Link to="/kundli" className="text-primary underline-offset-4 hover:underline">Generate your free Kundli</Link>
                        {" "}or{" "}
                        <Link to="/horoscope" className="text-primary underline-offset-4 hover:underline">read your horoscope</Link>.
                    </div>
                </div>
            </section>
        </>
    );
}