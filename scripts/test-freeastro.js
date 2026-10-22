import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.FREE_ASTRO_API_KEY;

if (!apiKey) {
  console.error("❌ FREE_ASTRO_API_KEY is not defined in environment or .env");
  process.exit(1);
}

console.log("🔑 Using FREE_ASTRO_API_KEY:", `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`);
console.log("ℹ️  This script makes 5 requests, so it uses 5 of your daily allowance.");

// ───────────────────────────────────────────────────────────────────────────
// ACCURACY CHECK: put the birth details of a chart you trust (for example one from Astrotalk)
// here, run the script, and compare the "Lagna" line and the planet table below with that chart.
// ───────────────────────────────────────────────────────────────────────────
const BIRTH = {
  year: 1995,
  month: 10,
  day: 15,
  hour: 8,
  minute: 30,
  city: "New Delhi",
  lat: 28.6139,
  lng: 77.2090,
  tz_str: "Asia/Kolkata",
};
const SETTINGS = { ayanamsha: "lahiri", house_system: "whole_sign", node_type: "mean" };

const BASE = "https://api.freeastroapi.com";

// Calls the API, prints how much allowance is left, and returns the JSON
async function call(label, url, init) {
  const res = await fetch(url, init);
  const limits = [...res.headers.entries()]
    .filter(([k]) => k.toLowerCase().startsWith("x-ratelimit"))
    .map(([k, v]) => `${k}=${v}`)
    .join("   ");
  console.log(`   allowance -> ${limits || "(no x-ratelimit headers returned)"}`);
  const data = await res.json();
  if (!res.ok) throw new Error(`${label} failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

const post = (body) => ({
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": apiKey },
  body: JSON.stringify(body),
});

async function testVedicChart() {
  console.log("\n--- 1. Vedic Chart (POST /api/v2/vedic/chart) ---");
  const data = await call("Vedic Chart", `${BASE}/api/v2/vedic/chart`, post({ ...BIRTH, ...SETTINGS }));
  const asc = data.ascendant;
  if (asc) {
    const inSign = typeof asc.degree === "number" ? (asc.degree % 30).toFixed(2) : "?";
    console.log(`✅ Lagna: ${asc.sign} ${inSign}°  (${asc.nakshatra?.name}, pada ${asc.nakshatra?.pada})`);
  }
  console.log("✅ Planets (compare these with your trusted chart):");
  for (const p of data.planets || []) {
    const deg = p.degree_in_sign != null ? p.degree_in_sign.toFixed(2) : "?";
    console.log(`   ${p.name.padEnd(8)} ${p.sign.padEnd(12)} ${String(deg).padStart(5)}°  house ${p.house}${p.is_retrograde ? "  (R)" : ""}`);
  }
  return data;
}

async function testVedicDasha() {
  console.log("\n--- 2. Vimshottari Dasha (POST /api/v2/vedic/dasha) ---");
  const data = await call("Vedic Dasha", `${BASE}/api/v2/vedic/dasha`, post({
    ...BIRTH,
    ayanamsha: SETTINGS.ayanamsha,
    levels: 1,
    reference_date: new Date().toISOString().slice(0, 10),
  }));
  const active = data.active_periods || [];
  console.log("✅ Running now:", active.map((p) => `${p.lord} (${p.start} → ${p.end})`).join("  >  ") || "not returned");
  console.log("✅ Mahadasha periods in timeline:", data.timeline?.length ?? "not returned");
  return data;
}

async function testVedicPanchang() {
  console.log("\n--- 3. Panchang (POST /api/v2/vedic/panchang) ---");
  const now = new Date();
  const data = await call("Panchang", `${BASE}/api/v2/vedic/panchang`, post({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: 12,
    minute: 0,
    city: BIRTH.city,
    lat: BIRTH.lat,
    lng: BIRTH.lng,
    tz_str: BIRTH.tz_str,
    ayanamsha: SETTINGS.ayanamsha,
  }));
  console.log("✅ Tithi:", data.tithi?.name, `(${data.tithi?.paksha})`, "ends", data.tithi?.ends_at);
  console.log("✅ Nakshatra:", data.nakshatra?.name, `Pada ${data.nakshatra?.pada}`, "ends", data.nakshatra?.ends_at);
  console.log("✅ Yoga:", data.yoga?.name, "| Karanas:", (data.karanas || []).map((k) => k.name).join(", "));
  console.log("✅ Lunar month:", data.lunar_month?.name, "| Vikram Samvat:", data.lunar_month?.vikram_samvat);
  console.log("✅ Sunrise/Sunset:", data.sunrise, "/", data.sunset);
  console.log("✅ Rahu Kaal:", data.rahu_kalam?.start, "-", data.rahu_kalam?.end);
  return data;
}

async function testDailySign() {
  console.log("\n--- 4. Daily Sign Horoscope (GET /api/v2/vedic/horoscope/daily/sign) ---");
  const url = `${BASE}/api/v2/vedic/horoscope/daily/sign?sign=aries&tz_str=Asia/Kolkata&include_interpretation=true`;
  const data = await call("Daily sign", url, { method: "GET", headers: { "x-api-key": apiKey } });
  console.log("✅ Sign:", data.data?.sign_label, `(${data.data?.rashi_label})`);
  console.log("✅ Overall tone:", data.data?.interpretation?.overall_tone);
  console.log("✅ Sections:", (data.data?.interpretation?.sections || []).map((s) => s.key).join(", "));
  console.log("✅ Summary snippet:", data.data?.interpretation?.summary?.slice(0, 100) + "...");
  return data;
}

// The all-in-one endpoint: one request for the chart, dasha, yogas, Panchang, strength and divisional charts
async function testCalculate() {
  console.log("\n--- 5. Full Calculate (POST /api/v2/vedic/calculate) ---");
  const data = await call("Calculate", `${BASE}/api/v2/vedic/calculate`, post({
    ...BIRTH,
    ...SETTINGS,
    vargas: [1, 9, 10],
    include_yogas: true,
    include_panchang: true,
    include_shadbala: true,
    include_ashtakavarga: true,
    dasha_levels: 2,
    reference_date: new Date().toISOString().slice(0, 10),
  }));
  console.log("✅ Components returned:", data.metadata?.included_components?.join(", ") || Object.keys(data).join(", "));
  console.log("✅ Yogas present:", data.yogas?.summary?.active, "of", data.yogas?.summary?.total_evaluated);
  console.log("✅ Divisional charts:", Object.keys(data.vargas?.vargas || {}).join(", "));
  console.log("✅ Shadbala planets:", Object.keys(data.shadbala || {}).length);
  console.log("✅ Ashtakavarga total points:", data.ashtakavarga?.total_points);
  console.log("✅ Running dasha:", (data.vimshottari_dasha?.active_periods || []).map((p) => p.lord).join(" > "));
  return data;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAll() {
  try {
    await testVedicChart();
    await delay(1200);
    await testVedicDasha();
    await delay(1200);
    await testVedicPanchang();
    await delay(1200);
    await testDailySign();
    await delay(1200);
    await testCalculate();
    console.log("\n✨ ALL FreeAstroAPI endpoint tests PASSED with 200 OK!");
    console.log("   Compare the 'allowance' lines above: if chart + dasha each used 1 request and calculate used 1,");
    console.log("   switching the server to calculate halves the cost of every Kundli.");
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

runAll();