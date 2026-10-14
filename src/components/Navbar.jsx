import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import {
    Calendar,
    Sparkles,
    Diamond,
    Search,
    User,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";

const QUICK_ACCESS = [
    { label: "Panchang", to: "/panchang", icon: Calendar },
    { label: "Free Kundli", to: "/kundli", icon: Sparkles },
    { label: "Horoscope", to: "/horoscope", icon: Diamond },
];

const NAV = [
    { label: "Home", to: "/" },
    { label: "AI Astrologer", to: "/ai-astrologer" },
    {
        label: "Consult with Astrologer",
        children: [
            { label: "Chat with Astrologer", to: "/consultation/chat" },
            { label: "Call with Astrologer", to: "/consultation/call" },
        ],
    },
    { label: "Reports", to: "/reports" },
    { label: "Know your Rudraksha", to: "/know-your-rudraksha" },
    { label: "Know your Gemstone", to: "/know-your-gemstone" },
];

function Logo() {
    return (
        <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0">
                <svg viewBox="0 0 44 44" className="h-full w-full mandala-spin-slow">
                    <circle cx="22" cy="22" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.5" />
                    <circle cx="22" cy="22" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.4" />
                    {Array.from({ length: 12 }).map((_, i) => {
                        const a = (i / 12) * Math.PI * 2;
                        return (
                            <line
                                key={i}
                                x1={22 + 14 * Math.cos(a)}
                                y1={22 + 14 * Math.sin(a)}
                                x2={22 + 20 * Math.cos(a)}
                                y2={22 + 20 * Math.sin(a)}
                                stroke="hsl(var(--primary))"
                                strokeWidth="0.5"
                                opacity="0.6"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-primary glow-copper" />
                </div>
            </div>
            <div className="leading-none">
                <div className="font-display text-xl sm:text-2xl font-semibold tracking-[0.2em] text-foreground">
                    VASTU<span className="text-primary">GRAH</span>
                </div>
                <div className="mt-1 hidden text-[9px] tracking-[0.35em] text-muted-foreground uppercase sm:block">
                    Sacred Geometry in Motion
                </div>
            </div>
        </Link>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [consultOpen, setConsultOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
            {/* Quick access top bar */}
            <div className="hidden md:block border-b border-border/40">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
                    <div className="flex items-center gap-6">
                        {QUICK_ACCESS.map(({ label, to, icon: Icon }) => (
                            <Link
                                key={label}
                                to={to}
                                className="group flex items-center gap-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Icon className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                                {label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-5">
                        <ThemeToggle />
                        <button className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
                            <Search className="h-3.5 w-3.5" />
                            Search
                        </button>
                        <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90">
                            <User className="h-3.5 w-3.5" />
                            Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Main bar — hamburger left (mobile, AstroTalk-style), logo centred */}
            <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 py-4">
                <div className="flex flex-1 items-center">
                    <button
                        className="lg:hidden -ml-2 p-2 text-foreground"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
                <Logo />
                <div className="flex flex-1 items-center justify-end">
                    <nav className="hidden lg:flex items-center gap-8">
                        {NAV.map((item) =>
                            item.children ? (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => setConsultOpen(true)}
                                    onMouseLeave={() => setConsultOpen(false)}
                                >
                                    <button className="flex items-center gap-1 text-sm tracking-wide text-foreground/80 transition-colors hover:text-primary">
                                        {item.label}
                                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${consultOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {consultOpen && (
                                        <div className="absolute left-0 top-full pt-3 w-64">
                                            <div className="border border-border bg-popover p-2 shadow-xl">
                                                {item.children.map((c) => (
                                                    <Link
                                                        key={c.to}
                                                        to={c.to}
                                                        className="block px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                                                    >
                                                        {c.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    key={item.label}
                                    to={item.to}
                                    end={item.to === "/"}
                                    className={({ isActive }) =>
                                        `text-sm tracking-wide transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/80"
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            )
                        )}
                    </nav>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
            </AnimatePresence>
        </header>
    );
}