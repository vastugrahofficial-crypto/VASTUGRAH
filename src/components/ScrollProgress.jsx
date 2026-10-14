import React, { useEffect, useState } from "react";

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const activeIndex = Math.min(Math.floor(progress * DIRECTIONS.length), DIRECTIONS.length - 1);

    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2">
            <div className="h-32 w-px bg-border relative overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full bg-primary transition-all duration-150"
                    style={{ height: `${progress * 100}%` }}
                />
            </div>
            <div className="flex flex-col items-center gap-[6px] py-2">
                {DIRECTIONS.map((d, i) => (
                    <span
                        key={d}
                        className={`text-[9px] tracking-widest transition-colors duration-200 ${i === activeIndex ? "text-primary font-semibold" : "text-muted-foreground/40"
                            }`}
                    >
                        {d}
                    </span>
                ))}
            </div>
        </div>
    );
}