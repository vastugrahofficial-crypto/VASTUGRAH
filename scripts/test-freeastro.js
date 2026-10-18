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

async function testVedicChart() {
  console.log("\n--- 1. Testing Vedic Chart API (POST /api/v2/vedic/chart) ---");
  const payload = {
    year: 1995,
    month: 10,
    day: 15,
    hour: 8,
    minute: 30,
    city: "New Delhi",
    lat: 28.6139,
    lng: 77.2090,
    tz_str: "Asia/Kolkata",
    ayanamsha: "lahiri",
    house_system: "whole_sign",
    node_type: "mean",
  };

  const res = await fetch("https://api.freeastroapi.com/api/v2/vedic/chart", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Vedic Chart failed: ${JSON.stringify(data)}`);
  console.log("✅ Ascendant:", data.ascendant?.sign, `(${data.ascendant?.nakshatra?.name})`);
  console.log("✅ Grahas count:", data.planets?.length);
  return data;
}

async function testVedicDasha() {
  console.log("\n--- 2. Testing Vimshottari Dasha API (POST /api/v2/vedic/dasha) ---");
  const payload = {
    year: 1995,
    month: 10,
    day: 15,
    hour: 8,
    minute: 30,
    city: "New Delhi",
    lat: 28.6139,
    lng: 77.2090,
    tz_str: "Asia/Kolkata",
    ayanamsha: "lahiri",
    levels: 1,
    reference_date: new Date().toISOString().slice(0, 10),
  };

  const res = await fetch("https://api.freeastroapi.com/api/v2/vedic/dasha", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Vedic Dasha failed: ${JSON.stringify(data)}`);
  console.log("✅ Active stack:", data.active_stack || data.active_dasha || "Received");
  console.log("✅ Major dasha periods count:", data.dasha_timeline?.length || data.mahadashas?.length || Object.keys(data).length);
  return data;
}

async function testVedicPanchang() {
  console.log("\n--- 3. Testing Panchang API (POST /api/v2/vedic/panchang) ---");
  const now = new Date();
  const payload = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: 12,
    minute: 0,
    city: "New Delhi",
    lat: 28.6139,
    lng: 77.2090,
    tz_str: "Asia/Kolkata",
    ayanamsha: "lahiri",
  };

  const res = await fetch("https://api.freeastroapi.com/api/v2/vedic/panchang", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Panchang failed: ${JSON.stringify(data)}`);
  console.log("✅ Tithi:", data.tithi?.name, `(${data.tithi?.paksha})`);
  console.log("✅ Nakshatra:", data.nakshatra?.name, `Pada ${data.nakshatra?.pada}`);
  console.log("✅ Sunrise/Sunset:", data.sunrise, "/", data.sunset);
  console.log("✅ Rahu Kaal:", data.rahu_kalam?.start, "-", data.rahu_kalam?.end);
  return data;
}

async function testDailySign() {
  console.log("\n--- 4. Testing Daily Sign Horoscope API (GET /api/v2/vedic/horoscope/daily/sign) ---");
  const url = "https://api.freeastroapi.com/api/v2/vedic/horoscope/daily/sign?sign=aries&tz_str=Asia/Kolkata&include_interpretation=true";

  const res = await fetch(url, {
    method: "GET",
    headers: { "x-api-key": apiKey },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Daily sign failed: ${JSON.stringify(data)}`);
  console.log("✅ Sign:", data.data?.sign_label, `(${data.data?.rashi_label})`);
  console.log("✅ Overall tone:", data.data?.interpretation?.overall_tone);
  console.log("✅ Summary snippet:", data.data?.interpretation?.summary?.slice(0, 100) + "...");
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
    console.log("\n✨ ALL FreeAstroAPI endpoint tests PASSED with 200 OK!");
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

runAll();
