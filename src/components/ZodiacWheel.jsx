import React from "react";

/**
 * Rashi Chakra — two concentric rings, twelve sections each, with the VASTUGRAH mark at the centre.
 *  - Transparent: no background disc, so it sits directly on the page in light or dark theme.
 *  - Theme-aware: every line uses currentColor, which comes from the site's `text-primary`
 *    (and `text-foreground` on hover). When the theme switches, the wheel switches with it.
 *  - Outer ring: the 12 zodiac signs, drawn as SVG strokes (no emoji, no font glyphs).
 *  - Inner ring: 12 lotus petals, one per section.
 *  - Centre: the logo, drawn in SVG. It stays still while the rings turn in opposite directions.
 */

// Each symbol is drawn on a roughly 16 x 16 grid centred on (0, 0).
const SIGNS = [
  { name: "Aries", paths: ["M0 8 V-3", "M0 -3 C0 -9 -7.5 -9 -7.5 -3.5", "M0 -3 C0 -9 7.5 -9 7.5 -3.5"], circles: [] },
  { name: "Taurus", paths: ["M-7 -8 C-6 -2 6 -2 7 -8"], circles: [[0, 3.5, 4.5]] },
  { name: "Gemini", paths: ["M-7 -7 C-3 -4 3 -4 7 -7", "M-7 7 C-3 4 3 4 7 7", "M-3 -5 V5", "M3 -5 V5"], circles: [] },
  { name: "Cancer", paths: ["M-6.3 -2.5 C-5 -8 3 -8 7 -4", "M6.3 2.5 C5 8 -3 8 -7 4"], circles: [[-4, -2.5, 2.3], [4, 2.5, 2.3]] },
  { name: "Leo", paths: ["M-4.5 0.5 C-4.5 -8 5 -9 5 -3 C5 2 2 4 3 7.5 C3.5 9 6 9 7 7"], circles: [[-4.5, 3, 2.5]] },
  {
    name: "Virgo",
    paths: ["M-7 -6 V6", "M-7 -5 C-5 -8 -2 -7 -2 -3 V6", "M-2 -3 C0 -7 3 -6 3 -2 V2 C3 8 8 8 8 3 C8 0 4 1 2 6"],
    circles: [],
  },
  { name: "Libra", paths: ["M-8 7 H8", "M-8 3 H-3 C-3 -7 3 -7 3 3 H8"], circles: [] },
  {
    name: "Scorpio",
    paths: ["M-7 -6 V5", "M-7 -5 C-5 -8 -2 -7 -2 -3 V5", "M-2 -3 C0 -7 3 -6 3 -3 V4 C3 7 5 7 8 6", "M5.2 3.8 L8.2 6 L5.4 8.6"],
    circles: [],
  },
  { name: "Sagittarius", paths: ["M-7 7 L7 -7", "M1 -7 H7 V-1", "M-6.5 -0.5 L0.5 6.5"], circles: [] },
  {
    name: "Capricorn",
    paths: ["M-8 -6 C-6 -6 -5 -3 -4 1 L-1 -7 C0 -2 1 2 3 4 C5 5.5 7.5 4.5 7.5 2.5 C7.5 0.5 4.5 0.5 4 3 C3.7 5.5 5 7.5 7 7.5"],
    circles: [],
  },
  {
    name: "Aquarius",
    paths: ["M-8 -2 L-5 -5 L-2 -2 L1 -5 L4 -2 L7 -5", "M-8 4 L-5 1 L-2 4 L1 1 L4 4 L7 1"],
    circles: [],
  },
  { name: "Pisces", paths: ["M-7 -8 C-3 -4 -3 4 -7 8", "M7 -8 C3 -4 3 4 7 8", "M-8 0 H8"], circles: [] },
];

const C = 150; // centre of the 300 x 300 canvas

// Radii of the circles that make up the chakra
const R_DISC = 146; // outer edge of the whole wheel
const R_OUT_A = 138; // outer ring: outer edge
const R_OUT_B = 104; // outer ring: inner edge
const R_IN_A = 98; // inner ring: outer edge
const R_IN_B = 62; // inner ring: inner edge
const R_CORE = 56; // centre circle
const R_GLYPH = 121; // where the zodiac symbols sit

const STEPS = Array.from({ length: 12 }, (_, i) => i);
const TICKS = Array.from({ length: 72 }, (_, i) => i);

// size:        pixel size of the wheel (ignored in background mode)
// background:  true = a large, faint wheel behind the page content, about 40% of the screen
export default function ZodiacWheel({ size = 160, className = "", background = false }) {
  // 40vmax = 40% of the screen's longer side, never wider than the screen itself
  const dim = background ? "min(40vmax, 100vw)" : size;

  const wheel = (
    <div
      // text-primary supplies the line colour (currentColor) in both light and dark themes
      className={`group relative flex select-none items-center justify-center text-primary ${className}`}
      style={{ width: dim, height: dim }}
      title={background ? undefined : "Rashi Chakra · Celestial Zodiac Wheel"}
    >
      {/* Very soft glow behind the wheel (skipped in background mode to keep it light) */}
      {!background && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent opacity-70 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
      )}

      <svg
        viewBox="0 0 300 300"
        className="relative h-full w-full"
        fill="none"
        stroke="currentColor"
        role="img"
        aria-label="Zodiac wheel with the twelve signs around the VASTUGRAH mark"
      >
        <style>{`
          @keyframes zw-cw  { to { transform: rotate(360deg); } }
          @keyframes zw-ccw { to { transform: rotate(-360deg); } }
          .zw-cw  { transform-origin: ${C}px ${C}px; will-change: transform; animation: zw-cw 90s linear infinite; }
          .zw-ccw { transform-origin: ${C}px ${C}px; will-change: transform; animation: zw-ccw 60s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .zw-cw, .zw-ccw { animation: none; } }
        `}</style>

        {/* Outer edge of the wheel */}
        <circle cx={C} cy={C} r={R_DISC} strokeWidth="1.8" />

        {/* ───────── Outer ring (turns clockwise): the twelve signs ───────── */}
        <g className="zw-cw">
          {/* degree ticks, every 5° (longer every 30°) */}
          {TICKS.map((i) => {
            const major = i % 6 === 0;
            return (
              <line
                key={i}
                x1={C}
                y1={C - R_DISC + 2}
                x2={C}
                y2={C - R_DISC + (major ? 8 : 5)}
                transform={`rotate(${i * 5} ${C} ${C})`}
                strokeWidth={major ? 1.5 : 1}
                opacity={major ? 0.9 : 0.5}
              />
            );
          })}

          <circle cx={C} cy={C} r={R_OUT_A} strokeWidth="1" opacity="0.6" />
          <circle cx={C} cy={C} r={R_OUT_B} strokeWidth="1.6" opacity="0.95" />

          {/* 12 section dividers */}
          {STEPS.map((i) => (
            <line
              key={i}
              x1={C}
              y1={C - R_OUT_A}
              x2={C}
              y2={C - R_OUT_B}
              transform={`rotate(${i * 30} ${C} ${C})`}
              strokeWidth="1.2"
              opacity="0.6"
            />
          ))}

          {/* 12 zodiac symbols, each centred in its own section, tops pointing outward */}
          {SIGNS.map((s, i) => (
            <g key={s.name} transform={`rotate(${-(i * 30 + 15)} ${C} ${C}) translate(${C} ${C - R_GLYPH}) scale(1.45)`}>
              <title>{s.name}</title>
              <g
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary transition-colors duration-300 group-hover:text-foreground"
              >
                {s.paths.map((d) => (
                  <path key={d} d={d} />
                ))}
                {s.circles.map(([cx, cy, r]) => (
                  <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} />
                ))}
              </g>
            </g>
          ))}
        </g>

        {/* ───────── Inner ring (turns the other way): twelve lotus petals ───────── */}
        <g className="zw-ccw">
          <circle cx={C} cy={C} r={R_IN_A} strokeWidth="1.3" strokeDasharray="2 3" opacity="0.75" />
          <circle cx={C} cy={C} r={R_IN_B} strokeWidth="1.6" opacity="0.95" />

          {/* 12 section dividers */}
          {STEPS.map((i) => (
            <line
              key={i}
              x1={C}
              y1={C - R_IN_A}
              x2={C}
              y2={C - R_IN_B}
              transform={`rotate(${i * 30} ${C} ${C})`}
              strokeWidth="1.2"
              opacity="0.6"
            />
          ))}

          {/* petals centred in each section */}
          {STEPS.map((i) => (
            <g key={i} transform={`rotate(${i * 30 + 15} ${C} ${C})`}>
              <path
                d={`M${C} ${C - 69} C${C + 8} ${C - 77} ${C + 8} ${C - 87} ${C} ${C - 94} C${C - 8} ${C - 87} ${C - 8} ${C - 77} ${C} ${C - 69} Z`}
                fill="currentColor"
                fillOpacity="0.14"
                strokeWidth="1.2"
              />
              <line x1={C} y1={C - 72} x2={C} y2={C - 91} strokeWidth="0.9" opacity="0.6" />
            </g>
          ))}
        </g>

        {/* ───────── Centre: the VASTUGRAH mark (stays still) ───────── */}
        <circle cx={C} cy={C} r={R_CORE} fill="currentColor" fillOpacity="0.06" strokeWidth="1.6" />

        {/* ring of 12 small petals around the bindu */}
        {STEPS.map((i) => (
          <path
            key={i}
            d={`M${C} ${C - 40} C${C + 3.5} ${C - 43} ${C + 3.5} ${C - 47} ${C} ${C - 50} C${C - 3.5} ${C - 47} ${C - 3.5} ${C - 43} ${C} ${C - 40} Z`}
            transform={`rotate(${i * 30} ${C} ${C})`}
            strokeWidth="1.1"
          />
        ))}
        <circle cx={C} cy={C} r="35" strokeWidth="1.4" />
        <circle cx={C} cy={C} r="25" strokeWidth="1.1" strokeDasharray="1.5 2.5" opacity="0.85" />
        <circle cx={C} cy={C} r="17" strokeWidth="1.3" />
        <circle cx={C} cy={C} r="9" fill="currentColor" stroke="none" className="animate-pulse" />
      </svg>
    </div>
  );

  if (!background) return wheel;

  // Background mode: sits behind the page content, centred in the first screen, ignores clicks
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 flex h-[100svh] items-center justify-center overflow-hidden opacity-40"
    >
      {wheel}
    </div>
  );
}