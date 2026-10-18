import React from "react";

const SIGNS = [
  { glyph: "♈", name: "Mesha", en: "Aries" },
  { glyph: "♉", name: "Vrishabha", en: "Taurus" },
  { glyph: "♊", name: "Mithuna", en: "Gemini" },
  { glyph: "♋", name: "Karka", en: "Cancer" },
  { glyph: "♌", name: "Simha", en: "Leo" },
  { glyph: "♍", name: "Kanya", en: "Virgo" },
  { glyph: "♎", name: "Tula", en: "Libra" },
  { glyph: "♏", name: "Vrishchika", en: "Scorpio" },
  { glyph: "♐", name: "Dhanu", en: "Sagittarius" },
  { glyph: "♑", name: "Makara", en: "Capricorn" },
  { glyph: "♒", name: "Kumbha", en: "Aquarius" },
  { glyph: "♓", name: "Meena", en: "Pisces" },
];

export default function ZodiacWheel({ size = 160, className = "" }) {
  const center = 150;
  const outerRadius = 138;
  const signsRadius = 112;
  const innerRadius = 78;
  const coreRadius = 42;

  return (
    <div
      className={`group relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      title="Rashi Chakra · Celestial Zodiac Wheel"
    >
      {/* Ambient dark copper/gold aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-amber-600/10 to-transparent blur-xl transition-opacity duration-700 group-hover:opacity-100 opacity-60" />

      {/* Rotating Sacred Rashi Chakra */}
      <svg
        viewBox="0 0 300 300"
        className="relative h-full w-full mandala-spin transition-all duration-700 [animation-duration:90s] group-hover:[animation-duration:35s]"
      >
        <defs>
          {/* Subtle copper gradient */}
          <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b45309" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#d97706" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.8" />
          </linearGradient>

          {/* Central sun glow */}
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#b45309" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer dark ring background */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="#0c0a09"
          stroke="url(#copperGradient)"
          strokeWidth="1.5"
          className="shadow-2xl"
        />

        {/* Degree tick marks (36 ticks for 360 deg) */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const isMajor = i % 3 === 0;
          const r1 = outerRadius - 1;
          const r2 = outerRadius - (isMajor ? 8 : 4);
          const x1 = center + r1 * Math.cos(angle);
          const y1 = center + r1 * Math.sin(angle);
          const x2 = center + r2 * Math.cos(angle);
          const y2 = center + r2 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMajor ? "#d97706" : "#78350f"}
              strokeWidth={isMajor ? "1.2" : "0.7"}
              opacity={isMajor ? "0.85" : "0.5"}
            />
          );
        })}

        {/* Middle bounding circle for signs ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="url(#copperGradient)"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.6"
        />

        {/* 12 Dividing house rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = center + innerRadius * Math.cos(angle);
          const y1 = center + innerRadius * Math.sin(angle);
          const x2 = center + (outerRadius - 8) * Math.cos(angle);
          const y2 = center + (outerRadius - 8) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#b45309"
              strokeWidth="1"
              opacity="0.45"
            />
          );
        })}

        {/* 12 Zodiac Glyphs */}
        {SIGNS.map((s, i) => {
          // Angle for each sign (offset by 15 deg so it sits in center of house)
          const angle = ((i * 30 + 15) * Math.PI) / 180;
          const x = center + signsRadius * Math.cos(angle);
          const y = center + signsRadius * Math.sin(angle);
          return (
            <g key={s.name}>
              <text
                x={x}
                y={y}
                fill="#f59e0b"
                fontSize="18"
                fontFamily="serif"
                textAnchor="middle"
                dominantBaseline="central"
                className="transition-colors duration-300 select-none group-hover:fill-amber-300"
                style={{
                  filter: "drop-shadow(0 0 3px rgba(245, 158, 11, 0.4))",
                }}
              >
                {s.glyph}
              </text>
            </g>
          );
        })}

        {/* Inner sanctum disc */}
        <circle
          cx={center}
          cy={center}
          r={coreRadius + 8}
          fill="#1c1917"
          stroke="#b45309"
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Central Sun/Bindu Gradient Glow */}
        <circle
          cx={center}
          cy={center}
          r={coreRadius}
          fill="url(#sunCore)"
        />

        {/* Central 8-pointed cosmic star / Surya Yantra */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const rad = 24;
          const x1 = center + rad * Math.cos(angle);
          const y1 = center + rad * Math.sin(angle);
          const x2 = center - rad * Math.cos(angle);
          const y2 = center - rad * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#fbbf24"
              strokeWidth="1.2"
              opacity="0.75"
            />
          );
        })}

        {/* Center Bindu */}
        <circle
          cx={center}
          cy={center}
          r="4.5"
          fill="#fbbf24"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}
