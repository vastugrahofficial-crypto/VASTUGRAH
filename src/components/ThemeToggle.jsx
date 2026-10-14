import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
    const [dark, setDark] = useState(() => localStorage.getItem("vg-theme") === "dark");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        localStorage.setItem("vg-theme", dark ? "dark" : "light");
    }, [dark]);

    return (
        <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle light and dark theme"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary ${className}`}
        >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
    );
}