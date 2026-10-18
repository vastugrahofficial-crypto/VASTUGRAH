import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

const COLS = [
    {
        title: "Explore",
        links: [
            { label: "Home", to: "/" },
            { label: "AI Astrologer", to: "/ai-astrologer" },
            { label: "Reports", to: "/reports" },
            { label: "Panchang", to: "/panchang" },
        ],
    },
    {
        title: "Consult",
        links: [
            { label: "Chat with Astrologer", to: "/consultation/chat" },
            { label: "Call with Astrologer", to: "/consultation/call" },
            { label: "Free Kundli", to: "/kundli" },
            { label: "Daily Horoscope", to: "/horoscope" },
        ],
    },
    {
        title: "Knowledge",
        links: [
            { label: "Know your Rudraksha", to: "/know-your-rudraksha" },
            { label: "Know your Gemstone", to: "/know-your-gemstone" },
        ],
    },
];

const PLANETS = [
    { name: "Surya", glyph: "☉", pos: "Leo 14°" },
    { name: "Chandra", glyph: "☽", pos: "Pisces 02°" },
    { name: "Mangal", glyph: "♂", pos: "Aries 19°" },
    { name: "Budha", glyph: "☿", pos: "Virgo 27°" },
    { name: "Guru", glyph: "♃", pos: "Gemini 08°" },
    { name: "Shukra", glyph: "♀", pos: "Libra 11°" },
    { name: "Shani", glyph: "♄", pos: "Aquarius 23°" },
];

// Social media links — edit the URLs here
const SOCIALS = [
    { label: "Instagram", href: "https://instagram.com/vastugrah", Icon: Instagram },
    { label: "Facebook", href: "https://www.facebook.com/vastugrah", Icon: Facebook },
    { label: "YouTube", href: "https://youtube.com/@vastugrahofficial", Icon: Youtube },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            {/* Planetary chart band */}
            <div className="border-b border-border">
                <div className="mx-auto max-w-7xl px-6 py-10">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-display text-xl tracking-wide text-foreground">
                            Current Grah Alignments
                        </h3>
                        <span className="text-xs tracking-widest text-muted-foreground uppercase">
                            Today's Transit
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4 lg:grid-cols-7">
                        {PLANETS.map((p) => (
                            <div key={p.name} className="bg-card p-5 text-center">
                                <div className="text-3xl text-primary">{p.glyph}</div>
                                <div className="mt-2 text-sm font-medium text-foreground">{p.name}</div>
                                <div className="mt-1 text-xs text-muted-foreground">{p.pos}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <div className="font-display text-3xl font-semibold tracking-[0.2em]">
                            VASTU<span className="text-primary">GRAH</span>
                        </div>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            A digital sanctuary where the ancient precision of Vastu Shastra meets
                            the celestial rhythm of the Grahas. Sacred geometry in motion.
                        </p>
                        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-primary" /> hello@vastugrah.com
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-primary" /> +91 00000 00000
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-primary" /> Varanasi, India
                            </div>
                        </div>
                    </div>
                    {COLS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xs uppercase tracking-[0.25em] text-primary">{col.title}</h4>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.to}>
                                        <Link
                                            to={l.to}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} VASTUGRAH. All celestial rights reserved.
                    </p>
                    <div className="flex items-center gap-1">
                        {SOCIALS.map(({ label, href, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={label}
                                aria-label={`VASTUGRAH on ${label}`}
                                className="rounded-full p-2.5 text-foreground/70 transition-colors hover:text-primary"
                            >
                                <Icon className="h-6 w-6" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}