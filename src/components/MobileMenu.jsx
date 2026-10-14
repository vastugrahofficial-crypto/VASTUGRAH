import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const GROUPS = [
    {
        label: "Free Tools",
        items: [
            { label: "Daily Panchang", to: "/panchang" },
            { label: "Free Kundli", to: "/kundli" },
            { label: "Daily Horoscope", to: "/horoscope" },
            { label: "AI Astrologer", to: "/ai-astrologer" },
        ],
    },
    {
        label: "Consult with Astrologer",
        items: [
            { label: "Chat with Astrologer", to: "/consultation/chat" },
            { label: "Call with Astrologer", to: "/consultation/call" },
        ],
    },
    {
        label: "Knowledge & More",
        items: [
            { label: "Reports", to: "/reports" },
            { label: "Know your Rudraksha", to: "/know-your-rudraksha" },
            { label: "Know your Gemstone", to: "/know-your-gemstone" },
        ],
    },
];

export default function MobileMenu({ onClose }) {
    const [openLabel, setOpenLabel] = useState(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="border-t border-border bg-background lg:hidden"
        >
            <div className="px-4 py-3">
                <Link
                    to="/"
                    onClick={onClose}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                    Home
                </Link>
                <div className="my-2 h-px bg-border" />
                {GROUPS.map((g) => {
                    const open = openLabel === g.label;
                    return (
                        <div key={g.label} className="border-b border-border/60 last:border-0">
                            <button
                                type="button"
                                onClick={() => setOpenLabel(open ? null : g.label)}
                                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground"
                            >
                                {g.label}
                                <ChevronDown
                                    className={`h-4 w-4 text-primary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                                />
                            </button>
                            <AnimatePresence initial={false}>
                                {open && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-2">
                                            {g.items.map((it) => (
                                                <Link
                                                    key={it.to}
                                                    to={it.to}
                                                    onClick={onClose}
                                                    className="block rounded-lg px-6 py-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                                                >
                                                    {it.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
                <div className="mt-3 flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <span className="text-sm text-foreground">Theme</span>
                    <ThemeToggle />
                </div>
            </div>
        </motion.div>
    );
}