import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { downloadKundliPdf } from "@/lib/astro-pdf";
import NorthChart from "@/components/astrology/NorthChart";

const rise = (i) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: Math.min(i, 8) * 0.12, duration: 0.6, ease: "easeOut" },
});

const SIGN_NAMES = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

// "2021-04-20" -> "20 Apr 2021"
function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const strengthStyle = (s) =>
    s === "Strong"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
        : s === "Medium"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
            : "border-border bg-secondary text-muted-foreground";

function YogaCard({ y }) {
    return (
        <div className="border border-border bg-background/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="font-display text-lg font-semibold text-foreground">{y.name}</h5>
                <div className="flex items-center gap-2">
                    {y.category && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{y.category}</span>}
                    {y.strength && (
                        <span className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest ${strengthStyle(y.strength)}`}>{y.strength}</span>
                    )}
                </div>
            </div>
            {y.description && <p className="mt-2 text-sm text-muted-foreground">{y.description}</p>}
            {Array.isArray(y.evidence) && y.evidence.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {y.evidence.map((e, i) => (
                        <li key={i}>• {e.message}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function KundliResult({ chart }) {
    const asc = chart.ascendant
        ? `${chart.ascendant}${typeof chart.ascendant_degree === "number" ? ` ${chart.ascendant_degree.toFixed(2)}°` : ""}`
        : null;

    const sade = chart.sade_sati
        ? chart.sade_sati.active
            ? `Active${chart.sade_sati.phase ? ` · ${chart.sade_sati.phase}` : ""}`
            : "Not active"
        : null;

    const details = [
        { k: "Ascendant (Lagna)", v: asc },
        { k: "Moon Sign (Rashi)", v: chart.moon_sign },
        { k: "Sun Sign", v: chart.sun_sign },
        { k: "Birth Nakshatra", v: chart.nakshatra ? `${chart.nakshatra}${chart.nakshatra_pada ? ` · Pada ${chart.nakshatra_pada}` : ""}` : null },
        { k: "Nakshatra Lord", v: chart.nakshatra_lord },
        { k: "Current Mahadasha", v: chart.current_mahadasha },
        { k: "Current Antardasha", v: chart.current_antardasha },
        { k: "Sade Sati", v: sade },
    ].filter((d) => d.v && d.v !== "—");

    // Running dasha periods (largest first)
    const active = Array.isArray(chart.active_periods) ? chart.active_periods.slice(0, 2) : [];

    // Yogas and doshas
    const yogaList = chart.yogas?.yogas || [];
    const activeYogas = yogaList.filter((y) => y.active);
    const doshas = activeYogas.filter((y) => y.type === "dosha");
    const goodYogas = activeYogas.filter((y) => y.type !== "dosha");
    const absentDoshas = yogaList.filter((y) => y.type === "dosha" && !y.active);

    // Planet strength
    const strength = chart.shadbala ? Object.entries(chart.shadbala).filter(([, v]) => v && typeof v.ratio === "number") : [];

    // Ashtakavarga (points per sign, Aries first)
    const sav = chart.ashtakavarga?.sarvashtakavarga;

    // Navamsa (D9)
    const d9 = chart.vargas?.vargas?.D9;
    const d9Houses = d9
        ? (d9.houses || []).map((h) => ({
            sign: h.sign,
            planets: (d9.planets || []).filter((p) => p.house === h.house).map((p) => p.name),
        }))
        : null;

    // Panchang at the moment of birth
    const bp = chart.panchang;
    const birthRows = bp
        ? [
            { k: "Weekday", v: bp.weekday?.name },
            {
                k: "Tithi at birth",
                v: bp.request_time_panchang?.tithi
                    ? `${bp.request_time_panchang.tithi.name}${bp.request_time_panchang.tithi.paksha ? ` (${bp.request_time_panchang.tithi.paksha} Paksha)` : ""}`
                    : null,
            },
            { k: "Nakshatra at birth", v: bp.request_time_panchang?.nakshatra?.name },
            { k: "Yoga at birth", v: bp.request_time_panchang?.yoga?.name },
            { k: "Karana at birth", v: bp.request_time_panchang?.karana?.name },
            { k: "Lunar month", v: bp.lunar_month?.name },
            { k: "Vikram Samvat", v: bp.lunar_month?.vikram_samvat },
        ].filter((r) => r.v)
        : [];

    // Animation order for the sections below the summary grid
    let step = details.length;
    const nextStep = () => step++;

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

            <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {details.map((d, i) => (
                    <motion.div key={d.k} {...rise(i)} className="bg-card p-6">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.k}</div>
                        <div className="mt-2 font-display text-xl font-semibold text-primary">{d.v}</div>
                    </motion.div>
                ))}
            </div>

            {chart.planets && chart.planets.length > 0 && (
                <motion.div {...rise(nextStep())} className="mt-8 overflow-x-auto border border-border">
                    <table className="w-full min-w-[640px] border-collapse bg-card text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                                <th className="px-5 py-3 font-medium">Graha</th>
                                <th className="px-5 py-3 font-medium">Sign</th>
                                <th className="px-5 py-3 font-medium">House</th>
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
                                    <td className="px-5 py-3 text-muted-foreground">{p.house ?? "-"}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{p.degree != null ? `${p.degree}°` : "-"}</td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {p.nakshatra ? `${p.nakshatra}${p.pada ? ` · ${p.pada}` : ""}` : "-"}
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">{p.retrograde ? "Retrograde" : "Direct"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* Dasha: what is running now, then the full Mahadasha list */}
            {(active.length > 0 || (chart.dashas && chart.dashas.length > 0)) && (
                <motion.div {...rise(nextStep())} className="mt-8 border border-border bg-card p-8">
                    <h4 className="font-display text-2xl font-semibold text-foreground">Vimshottari Dasha</h4>

                    {active.length > 0 && (
                        <div className="mt-5 grid gap-6 border border-primary/40 bg-secondary/40 p-6 sm:grid-cols-2">
                            {active.map((p, i) => (
                                <div key={i}>
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                                        {i === 0 ? "Running Mahadasha" : "Running Antardasha"}
                                    </div>
                                    <div className="mt-1 font-display text-2xl font-semibold text-primary">{p.lord}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {fmtDate(p.start)} – {fmtDate(p.end)}
                                    </div>
                                    {typeof p.progress_fraction === "number" && (
                                        <div className="mt-3 h-1.5 w-full bg-border">
                                            <div className="h-full bg-primary" style={{ width: `${Math.round(p.progress_fraction * 100)}%` }} />
                                        </div>
                                    )}
                                    {typeof p.remaining_years === "number" && (
                                        <div className="mt-1 text-[11px] text-muted-foreground">{p.remaining_years.toFixed(1)} years remaining</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {chart.dashas && chart.dashas.length > 0 && (
                        <div className="mt-6 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                            {chart.dashas.map((d, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between border-b border-border/60 py-2 text-sm ${d.current ? "bg-secondary/40 px-2" : ""}`}
                                >
                                    <span className="font-medium text-primary">
                                        {d.lord}
                                        {d.current && (
                                            <span className="ml-2 border border-primary/40 px-1.5 py-0.5 text-[10px] uppercase tracking-widest">Now</span>
                                        )}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {d.start} – {d.end}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Doshas and yogas */}
            {yogaList.length > 0 && (
                <motion.div {...rise(nextStep())} className="mt-8 border border-border bg-card p-8">
                    <h4 className="font-display text-2xl font-semibold text-foreground">Doshas &amp; Yogas</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {chart.yogas?.summary
                            ? `${chart.yogas.summary.active} of ${chart.yogas.summary.total_evaluated} classical combinations are present in your chart.`
                            : "Classical combinations found in your chart."}
                    </p>

                    <div className="mt-6">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">Doshas</div>
                        {doshas.length > 0 ? (
                            <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                {doshas.map((y) => (
                                    <YogaCard key={y.id} y={y} />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-foreground">No dosha found among those checked.</p>
                        )}
                        {absentDoshas.length > 0 && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Not present: {absentDoshas.map((y) => y.name).join(", ")}
                            </p>
                        )}
                    </div>

                    {goodYogas.length > 0 && (
                        <div className="mt-8">
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">Yogas present</div>
                            <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                {goodYogas.map((y) => (
                                    <YogaCard key={y.id} y={y} />
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="mt-6 text-xs text-muted-foreground">
                        These are rule-based classical readings. A consultation can explain how they apply to your life.
                    </p>
                </motion.div>
            )}

            {/* Planet strength */}
            {strength.length > 0 && (
                <motion.div {...rise(nextStep())} className="mt-8 border border-border bg-card p-8">
                    <h4 className="font-display text-2xl font-semibold text-foreground">Planetary Strength (Shadbala)</h4>
                    <p className="mt-2 text-sm text-muted-foreground">A ratio of 1.0 or more means the planet meets its classical minimum strength.</p>
                    <div className="mt-6 space-y-4">
                        {strength.map(([planet, v]) => {
                            const ok = v.ratio >= 1;
                            return (
                                <div key={planet}>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-primary">{planet}</span>
                                        <span className="text-muted-foreground">
                                            {v.shadbala_in_rupas} / {v.minimum_requirements} rupas · ratio {v.ratio.toFixed(2)} ·{" "}
                                            <span className={ok ? "text-emerald-500" : "text-amber-500"}>{ok ? "Strong" : "Needs support"}</span>
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 w-full bg-border">
                                        <div
                                            className={`h-full ${ok ? "bg-primary" : "bg-amber-500"}`}
                                            style={{ width: `${Math.min(100, Math.round((v.ratio / 1.5) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Ashtakavarga */}
            {Array.isArray(sav) && sav.length === 12 && (
                <motion.div {...rise(nextStep())} className="mt-8 border border-border bg-card p-8">
                    <h4 className="font-display text-2xl font-semibold text-foreground">Ashtakavarga (Sarvashtakavarga)</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Points per sign{chart.ashtakavarga?.total_points ? `, ${chart.ashtakavarga.total_points} in total` : ""}. About 28 is average; a sign above 28 is
                        considered favourable.
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4 lg:grid-cols-6">
                        {sav.map((pts, i) => (
                            <div key={SIGN_NAMES[i]} className="bg-card p-4 text-center">
                                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{SIGN_NAMES[i]}</div>
                                <div className={`mt-1 font-display text-2xl font-semibold ${pts >= 28 ? "text-primary" : "text-foreground/70"}`}>{pts}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Navamsa */}
            {d9 && d9Houses && d9Houses.length === 12 && (
                <motion.div {...rise(nextStep())} className="mt-8 border border-border bg-card p-8">
                    <h4 className="font-display text-2xl font-semibold text-foreground">Navamsa Chart (D9)</h4>
                    <p className="mt-2 text-sm text-muted-foreground">The chart of marriage, dharma and the deeper strength of each planet.</p>
                    <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
                        <NorthChart houses={d9Houses} ascendant={d9.ascendant?.sign} />
                        <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border text-sm">
                            <div className="bg-card p-3">
                                <div className="text-xs uppercase tracking-widest text-muted-foreground">Navamsa Lagna</div>
                                <div className="mt-1 font-medium text-primary">{d9.ascendant?.sign}</div>
                            </div>
                            <div className="bg-card p-3" />
                            {(d9.planets || []).map((p) => (
                                <div key={p.name} className="bg-card p-3">
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.name}</div>
                                    <div className="mt-1 font-medium text-foreground">
                                        {p.sign} <span className="text-muted-foreground">· house {p.house}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Panchang at birth */}
            {birthRows.length > 0 && (
                <motion.div {...rise(nextStep())} className="mt-8 border border-border bg-card p-8">
                    <h4 className="font-display text-2xl font-semibold text-foreground">Panchang at Birth</h4>
                    <div className="mt-5 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                        {birthRows.map((r) => (
                            <div key={r.k} className="flex items-center justify-between border-b border-border/60 py-2 text-sm">
                                <span className="text-muted-foreground">{r.k}</span>
                                <span className="font-medium text-foreground">{r.v}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}