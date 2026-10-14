import React from "react";

export default function PageHeader({ eyebrow, title, description, children }) {
    return (
        <section className="relative overflow-hidden border-b border-border">
            <div className="absolute inset-0 grid-lines opacity-20" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
                {eyebrow && (
                    <span className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</span>
                )}
                <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                )}
                {children && <div className="mt-8">{children}</div>}
            </div>
        </section>
    );
}