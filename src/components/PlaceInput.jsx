import React, { useEffect, useMemo, useRef, useState } from "react";
import { CITIES } from "@/lib/cities";

export default function PlaceInput({ value, onChange, disabled, required }) {
    const [query, setQuery] = useState(value || "");
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => setQuery(value || ""), [value]);

    useEffect(() => {
        const onDoc = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const suggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        const seen = new Set();
        const out = [];
        for (const pass of [0, 1]) {
            for (const c of CITIES) {
                const label = `${c.name}, ${c.state}`;
                if (seen.has(label)) continue;
                const n = c.name.toLowerCase();
                const match = pass === 0 ? n.startsWith(q) : n.includes(q);
                if (match) {
                    seen.add(label);
                    out.push(label);
                    if (out.length >= 8) break;
                }
            }
            if (out.length >= 8) break;
        }
        return out;
    }, [query]);

    const select = (label) => {
        onChange(label);
        setQuery(label);
        setOpen(false);
    };

    return (
        <div ref={wrapRef} className="relative">
            <input
                required={required}
                disabled={disabled}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && open && suggestions.length > 0 && query.trim().toLowerCase() !== suggestions[0].toLowerCase()) {
                        e.preventDefault();
                        select(suggestions[0]);
                    }
                    if (e.key === "Escape") setOpen(false);
                }}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                placeholder="City, State — type to search"
                autoComplete="off"
            />
            {open && !disabled && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 max-h-56 overflow-y-auto border border-border bg-popover shadow-xl">
                    {suggestions.map((s) => (
                        <button
                            type="button"
                            key={s}
                            tabIndex={-1}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                select(s);
                            }}
                            className="block w-full px-4 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}