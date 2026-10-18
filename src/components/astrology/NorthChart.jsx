import React from "react";

/**
 * North Indian (diamond) birth chart, styled after the Astrotalk reference.
 *
 * Layout rules (fixed in a North Indian chart):
 *  - House 1 is always the top diamond; houses then run COUNTER-CLOCKWISE.
 *  - The small number in each house is the SIGN number (1 = Aries ... 12 = Pisces).
 *  - Planets sit inside the house they occupy, shown as short names with degrees.
 *
 * Props:
 *  houses      [{ sign: "Libra", planets: ["Moon", "Jupiter"] }, ...]  (12 items, house 1 first)
 *  ascendant   "Libra"
 *  planets     optional full planet list from the API, used only to look up degree / retrograde
 *  ascDegree   optional number, e.g. 12.77
 */

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const SHORT = {
    sun: "Su", moon: "Mo", mars: "Ma", mercury: "Me", jupiter: "Ju", venus: "Ve",
    saturn: "Sa", rahu: "Ra", ketu: "Ke", uranus: "Ur", neptune: "Ne", pluto: "Pl",
};

const COLORS = {
    Su: "#f28c0f", Mo: "#1f2270", Ma: "#d6204a", Me: "#2a8a3a", Ju: "#8a7a05", Ve: "#ff5fa8",
    Sa: "#111111", Ra: "#3d4a5c", Ke: "#7a3f12", Ur: "#4a86b8", Ne: "#0f8a8a", Pl: "#7a1450",
    Asc: "#5b1fa6",
};

// Geometry on a 400 x 400 canvas: square from 10 to 390, centre at 200.
// Inner crossing points of the diagonals with the diamond: 105 / 295.
const HOUSES = [
    //  cx,  cy   (planet block centre)   nx,  ny   (sign number position)
    { cx: 200, cy: 112, nx: 200, ny: 192 }, // 1  top diamond
    { cx: 105, cy: 46, nx: 105, ny: 92 },   // 2  top-left triangle
    { cx: 46, cy: 105, nx: 92, ny: 108 },   // 3  left-top triangle
    { cx: 112, cy: 200, nx: 188, ny: 204 }, // 4  left diamond
    { cx: 46, cy: 295, nx: 92, ny: 298 },   // 5  left-bottom triangle
    { cx: 105, cy: 354, nx: 105, ny: 316 }, // 6  bottom-left triangle
    { cx: 200, cy: 288, nx: 200, ny: 216 }, // 7  bottom diamond
    { cx: 295, cy: 354, nx: 295, ny: 316 }, // 8  bottom-right triangle
    { cx: 354, cy: 295, nx: 308, ny: 298 }, // 9  right-bottom triangle
    { cx: 288, cy: 200, nx: 212, ny: 204 }, // 10 right diamond
    { cx: 354, cy: 105, nx: 308, ny: 108 }, // 11 right-top triangle
    { cx: 295, cy: 46, nx: 295, ny: 92 },   // 12 top-right triangle
];

function signNumber(name) {
    const i = SIGNS.findIndex((s) => new RegExp(s, "i").test(name || ""));
    return i >= 0 ? i + 1 : null;
}

function readDegree(p) {
    if (!p) return null;
    const raw = p.degree ?? p.degrees ?? p.deg ?? p.sign_degree ?? p.longitude;
    const n = typeof raw === "string" ? parseFloat(raw) : raw;
    if (typeof n !== "number" || Number.isNaN(n)) return null;
    return n % 30; // degree inside the sign
}

function readRetro(p) {
    return !!(p && (p.retrograde || p.is_retrograde || p.isRetro || p.retro));
}

export default function NorthChart({ houses = [], ascendant = "", planets = [], ascDegree = null }) {
    const lookup = {};
    planets.forEach((p) => {
        if (p && p.planet) lookup[String(p.planet).toLowerCase()] = p;
    });

    // Build the label list for each house
    const cells = HOUSES.map((_, i) => {
        const h = houses[i] || { sign: "", planets: [] };
        const items = (h.planets || []).map((name) => {
            const key = String(name).toLowerCase();
            const short = SHORT[key] || String(name).slice(0, 2);
            const info = lookup[key];
            const deg = readDegree(info);
            return {
                short,
                text: `${short}${deg !== null ? `-${deg.toFixed(2)}°` : ""}${readRetro(info) ? " ℞" : ""}`,
                color: COLORS[short] || "#333",
            };
        });
        if (i === 0) {
            items.push({
                short: "Asc",
                text: `Asc${typeof ascDegree === "number" ? `-${ascDegree.toFixed(2)}°` : ""}`,
                color: COLORS.Asc,
            });
        }
        return { number: signNumber(h.sign), items };
    });

    const line = "#8f8a24";
    const LH = 15; // line height between planets

    return (
        <svg
            viewBox="0 0 400 400"
            className="mx-auto block w-full max-w-[520px]"
            role="img"
            aria-label={`North Indian birth chart, ascendant ${ascendant || ""}`}
        >
            <defs>
                <radialGradient id="kundliBg" cx="50%" cy="50%" r="75%">
                    <stop offset="0%" stopColor="#f6f0cf" />
                    <stop offset="100%" stopColor="#fdfbec" />
                </radialGradient>
            </defs>

            {/* Frame: double gold border on a cream ground */}
            <rect x="2" y="2" width="396" height="396" fill="url(#kundliBg)" stroke={line} strokeWidth="2.5" />
            <rect x="10" y="10" width="380" height="380" fill="none" stroke={line} strokeWidth="1.6" />

            {/* Diagonals and inner diamond */}
            <line x1="10" y1="10" x2="390" y2="390" stroke={line} strokeWidth="1.6" />
            <line x1="390" y1="10" x2="10" y2="390" stroke={line} strokeWidth="1.6" />
            <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke={line} strokeWidth="1.6" />

            {/* Corner studs */}
            {[[10, 10], [390, 10], [10, 390], [390, 390]].map(([x, y]) => (
                <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" transform={`rotate(45 ${x} ${y})`} fill="#fdfbec" stroke={line} strokeWidth="1.4" />
            ))}

            {/* Houses */}
            {HOUSES.map((pos, i) => {
                const cell = cells[i];
                const startY = pos.cy - ((cell.items.length - 1) * LH) / 2;
                return (
                    <g key={i}>
                        {cell.number && (
                            <text
                                x={pos.nx}
                                y={pos.ny}
                                fill="#6b6410"
                                fontSize="14"
                                fontWeight="700"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontFamily="Georgia, 'Times New Roman', serif"
                            >
                                {cell.number}
                            </text>
                        )}
                        {cell.items.map((it, j) => (
                            <text
                                key={j}
                                x={pos.cx}
                                y={startY + j * LH}
                                fill={it.color}
                                fontSize="13"
                                fontWeight="700"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontFamily="Georgia, 'Times New Roman', serif"
                            >
                                {it.text}
                            </text>
                        ))}
                    </g>
                );
            })}
        </svg>
    );
}