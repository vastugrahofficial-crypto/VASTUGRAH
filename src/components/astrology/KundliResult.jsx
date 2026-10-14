import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { downloadKundliPdf } from "@/lib/astro-pdf";

const rise = (i) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
});

export default function KundliResult({ chart }) {
    const details = [
        { k: "Ascendant (Lagna)", v: chart.ascendant },
        { k: "Moon Sign (Rashi)", v: chart.moon_sign },
        { k: "Sun Sign", v: chart.sun_sign },
        { k: "Birth Nakshatra", v: chart.nakshatra ? `${chart.nakshatra}${chart.nakshatra_pada ? ` · Pada ${chart.nakshatra_pada}` : ""}` : null },
        { k: "Nakshatra Lord", v: chart.nakshatra_lord },
        { k: "Current Mahadasha", v: chart.current_mahadasha },
    ].filter((d) => d.v);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold text-foreground">Your Celestial Blueprint</h3>
                <button
                    type="button"
                    onClick={() => downloadKundliPdf(chart)}
                    className="inline-flex items-center gap-2 border border-primary px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                    <Download className="h-4 w-4" /> Download PDF
                </button>
            </div>

            <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {details.map((d, i) => (
                    <motion.div key={d.k} {...rise(i)} className="bg-card p-6">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.k}</div>
                        <div className="mt-2 font-display text-xl font-semibold text-primary">{d.v}</div>
                    </motion.div>
                ))}
            </div>

            {chart.planets && chart.planets.length > 0 && (
                <motion.div {...rise(details.length)} className="mt-8 overflow-x-auto border border-border">
                    <table className="w-full min-w-[560px] border-collapse bg-card text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                                <th className="px-5 py-3 font-medium">Graha</th>
                                <th className="px-5 py-3 font-medium">Sign</th>
                                <th className="px-5 py-3 font-medium">Degree</th>
                                <th className="px-5 py-3 font-medium">Nakshatra</th>
                                <th className="px-5 py-3 font-medium">Motion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chart.planets.map((p, i) => (
                                <tr key={i} className="border-b border-border/60 last:border-0">
                                    <td className="px-5 py-3 font-medium text-primary">{p.planet}</td>
                                    <td className="px-5 py-3 text-foreground">{p.sign}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{p.degree != null ? `${p.degree}°` : "-"}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{p.nakshatra || "-"}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{p.retrograde ? "Retrograde" : "Direct"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {chart.dashas && chart.dashas.length > 0 && (
                <motion.div {...rise(details.length + 1)} className="mt-8 border border-border bg-card p-8">
                    <h4 className="font-display text-2xl font-semibold text-foreground">Vimshottari Mahadashas</h4>
                    <div className="mt-5 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                        {chart.dashas.map((d, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-border/60 py-2 text-sm">
                                <span className="font-medium text-primary">{d.lord}</span>
                                <span className="text-muted-foreground">{d.start} – {d.end}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}