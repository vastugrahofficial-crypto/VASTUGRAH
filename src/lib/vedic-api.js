// VASTUGRAH Vedic Astrology & Panchang Engine
// Powered by server-side FreeAstroAPI integration

import { getDailyHoroscope as geminiDailyHoroscope } from './gemini';
import { INDIAN_CITIES } from './cities';

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const TITHIS = [
  "Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami",
  "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami",
  "Shukla Ekadashi", "Shukla Dwadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima",
  "Krishna Pratipada", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami",
  "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami",
  "Krishna Ekadashi", "Krishna Dwadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya"
];

const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti"
];

const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)", "Shakuni", "Chatushpada", "Naga", "Kintughna"];

const RASHIS = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];

// Seeded pseudorandom from date or string
function getHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ---------- Time helpers ----------

// "06:27:14" / "07:58" / "6:27 AM"  ->  minutes after midnight (null if unreadable)
function toMinutes(t) {
  if (!t) return null;
  const m = String(t).match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3] ? m[3].toUpperCase() : null;
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

// minutes after midnight -> "06:27 AM"
function fmt12(mins) {
  const total = ((Math.round(mins) % 1440) + 1440) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const ap = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ap}`;
}

// NOT real data: placeholder values from a date hash. getDailyPanchang no longer uses this.
// If another component still imports it, replace that with getDailyPanchang.
export function getLocalDailyPanchang(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const dayKey = d.toISOString().slice(0, 10);
  const hash = getHash(dayKey);

  const tithiIdx = (hash + d.getDate()) % TITHIS.length;
  const nakshatraIdx = (hash + d.getMonth() * 3 + d.getDate()) % NAKSHATRAS.length;
  const yogaIdx = (hash + d.getDate() * 2) % YOGAS.length;
  const karanaIdx = (hash + d.getDate()) % KARANAS.length;
  const moonSignIdx = (hash + Math.floor(d.getDate() / 2.5)) % RASHIS.length;

  const sunriseHour = 6;
  const sunriseMin = (hash % 18) + 10;
  const sunsetHour = 18;
  const sunsetMin = (hash % 24) + 15;

  const sunrise = `0${sunriseHour}:${sunriseMin < 10 ? '0' + sunriseMin : sunriseMin} AM`;
  const sunset = `0${sunsetHour - 12}:${sunsetMin < 10 ? '0' + sunsetMin : sunsetMin} PM`;

  const rahuStart = ((hash % 6) + 10) % 12 || 10;
  const rahuKaal = `${rahuStart}:30 AM – ${rahuStart + 1}:30 PM`;
  const abhijit = "11:48 AM – 12:36 PM";
  const amritKaal = "02:14 PM – 03:48 PM";
  const brahmaMuhurat = "04:32 AM – 05:20 AM";

  const significances = [
    "A highly auspicious day energized by divine solar vibrations. Ideal for initiating new ventures, meditation, and seeking planetary remedies.",
    "A sacred day ruled by lunar grace. Highly favourable for family rituals, deepening relationships, and gemstone sanctification.",
    "A spiritually potent Tithi. Fosters mental clarity, devotion, and Vastu alignments for home prosperity.",
    "An auspicious alignment blessed by Brihaspati (Jupiter). Perfect for financial decisions, spiritual learning, and charity."
  ];

  return {
    tithi: TITHIS[tithiIdx],
    nakshatra: NAKSHATRAS[nakshatraIdx],
    yoga: YOGAS[yogaIdx],
    karana: KARANAS[karanaIdx],
    moon_sign: RASHIS[moonSignIdx],
    rahu_kaal: rahuKaal,
    abhijit_muhurat: abhijit,
    amrit_kaal: amritKaal,
    brahma_muhurat: brahmaMuhurat,
    significance: significances[hash % significances.length],
    sunrise,
    sunset
  };
}

// ---------- Small cache: the same day and place always give the same answer, so reuse it ----------
// This saves FreeAstroAPI requests and makes repeat visits instant.
function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cacheSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: everything still works, just without the cache
  }
}

// Remove yesterday's (and older) entries for a prefix, keeping only keys that end with today's date
function pruneDaily(prefix, today) {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix) && !k.endsWith(today)) localStorage.removeItem(k);
    }
  } catch {
    // ignore
  }
}

// Today's date in India, as YYYY-MM-DD (the horoscope service works on Indian time)
function istDate() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

// End time like "25:42:19" -> "01:42 AM (next day)"
function fmtEnd(t) {
  const m = toMinutes(t);
  if (m == null) return null;
  return fmt12(m) + (m >= 1440 ? " (next day)" : "");
}

/**
 * Fetch the live Panchang from FreeAstroAPI (through the server proxy).
 * coords (optional): { lat, lng | lon, name, timezone }. Without it, New Delhi is used.
 * Throws if the live Panchang cannot be loaded; it never returns made-up values.
 */
export async function getDailyPanchang(dateStr, coords) {
  const d = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const lng0 = coords ? (coords.lng ?? coords.lon) : null;
  const hasCoords = coords && coords.lat != null && lng0 != null;
  const lat = hasCoords ? Number(coords.lat) : 28.6139;
  const lng = hasCoords ? Number(lng0) : 77.2090;
  const cityName = hasCoords ? (coords.name || "Selected location") : "New Delhi";
  const tz = hasCoords ? (coords.timezone || "Asia/Kolkata") : "Asia/Kolkata";

  const key = `vg_panchang_${year}-${month}-${day}_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const res = await fetch("/api/astrology/panchang", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year, month, day, hour: 12, minute: 0, city: cityName, lat, lng, tz_str: tz }),
  });

  if (!res.ok) throw new Error(`Panchang service returned ${res.status}`);
  const data = await res.json();
  if (!data || !data.tithi) throw new Error("Panchang service returned no data");

  const paksha = data.tithi?.paksha || null;
  const sr = toMinutes(data.sunrise);
  const ss = toMinutes(data.sunset);
  const rahuS = toMinutes(data.rahu_kalam?.start);
  const rahuE = toMinutes(data.rahu_kalam?.end);

  // Worked out from this day's real sunrise and sunset, so they change with the date and place
  let abhijit = "—";
  let brahma = "—";
  if (sr != null && ss != null && ss > sr) {
    const noon = (sr + ss) / 2;
    const half = (ss - sr) / 30; // Abhijit = the middle one of the day's 15 muhurtas
    abhijit = `${fmt12(noon - half)} – ${fmt12(noon + half)}`;
    brahma = `${fmt12(sr - 96)} – ${fmt12(sr - 48)}`; // 96 to 48 minutes before sunrise
  }

  const result = {
    tithi: paksha ? `${data.tithi.name} (${paksha} Paksha)` : (data.tithi.name || "—"),
    tithi_ends: fmtEnd(data.tithi?.ends_at),
    nakshatra: data.nakshatra
      ? `${data.nakshatra.name}${data.nakshatra.pada ? ` (Pada ${data.nakshatra.pada})` : ""}`
      : "—",
    nakshatra_ends: fmtEnd(data.nakshatra?.ends_at),
    yoga: data.yoga?.name || "—",
    yoga_ends: fmtEnd(data.yoga?.ends_at),
    karana: data.karanas?.[0]?.name || "—",
    karana_ends: fmtEnd(data.karanas?.[0]?.ends_at),
    moon_sign: data.request_time_panchang?.moon_sign?.name || "—",
    rahu_kaal: rahuS != null && rahuE != null ? `${fmt12(rahuS)} – ${fmt12(rahuE)}` : "—",
    abhijit_muhurat: abhijit,
    brahma_muhurat: brahma,
    sunrise: sr != null ? fmt12(sr) : "—",
    sunset: ss != null ? fmt12(ss) : "—",
    paksha,
    lunar_month: data.lunar_month?.name || null,
    vikram_samvat: data.lunar_month?.vikram_samvat || null,
    place: cityName,
  };

  cacheSet(key, result);
  return result;
}

export const HOROSCOPE_DATA = {
  Aries: {
    forecast: "Mars activates your house of ambition. Your drive and conviction will open doors in professional endeavors today. In personal matters, patience will be your greatest ally against impulsive reactions.",
    lucky_number: 9,
    lucky_color: "Deep Crimson",
    favourable_direction: "East",
    remedy: "Chant the Gayatri Mantra 11 times at sunrise and offer water to Surya Dev."
  },
  Taurus: {
    forecast: "Venus showers peaceful vibes over your relationships and artistic pursuits. A long-pending financial settlement or family discussion moves smoothly toward resolution today.",
    lucky_number: 6,
    lucky_color: "Ivory White",
    favourable_direction: "South-East",
    remedy: "Feed a white cow with fresh grass or donate dairy products to the needy."
  },
  Gemini: {
    forecast: "Mercury sharpens your analytical acumen and communicative eloquence. It is an optimal day for negotiations, learning, and clearing lingering misunderstandings.",
    lucky_number: 5,
    lucky_color: "Emerald Green",
    favourable_direction: "North",
    remedy: "Water a Tulsi plant with sacred reverence and recite 'Om Budhaya Namaha'."
  },
  Cancer: {
    forecast: "The Moon enhances your intuitive perception today. Listen to your gut feelings regarding financial or family decisions. An unexpected blessing from an elder will bring comfort.",
    lucky_number: 2,
    lucky_color: "Pearl Silver",
    favourable_direction: "North-West",
    remedy: "Offer raw milk and water to Lord Shiva (Abhishekam) on Somvar."
  },
  Leo: {
    forecast: "Surya Dev shines brightly on your 1st house, radiating confidence and natural leadership. People look to you for direction. Maintain humility to transform admiration into lasting respect.",
    lucky_number: 1,
    lucky_color: "Saffron Gold",
    favourable_direction: "East",
    remedy: "Perform Surya Namaskar facing east and wear copper or ruby accessories."
  },
  Virgo: {
    forecast: "Attention to detail serves you exceptionally well today. A meticulous approach clears a complicated roadblock at work. Ensure you nurture your emotional wellness through quiet contemplation.",
    lucky_number: 5,
    lucky_color: "Forest Green",
    favourable_direction: "North",
    remedy: "Feed green fodder to animals and chant the Vishnu Sahasranama."
  },
  Libra: {
    forecast: "Venus brings balance to your partnership sphere. A harmonious collaboration brings unexpected prosperity. Stay true to your moral compass in business dealings.",
    lucky_number: 6,
    lucky_color: "Pastel Blue",
    favourable_direction: "West",
    remedy: "Light a ghee lamp in the Ishanya (North-East) corner of your sanctum."
  },
  Scorpio: {
    forecast: "A wave of transformative willpower surrounds you. Any challenge you confront with courage will turn in your favour. Deep meditative practices yield profound inner clarity.",
    lucky_number: 9,
    lucky_color: "Rust Terracotta",
    favourable_direction: "South",
    remedy: "Recite the Hanuman Chalisa and share sweet jaggery with loved ones."
  },
  Sagittarius: {
    forecast: "Guru's divine grace expands your philosophical horizons. Higher learning, spiritual exploration, or pilgrimage plans receive positive momentum today.",
    lucky_number: 3,
    lucky_color: "Golden Yellow",
    favourable_direction: "North-East",
    remedy: "Apply a chandan or turmeric tilak on your forehead after bathing."
  },
  Capricorn: {
    forecast: "Shani Dev rewards your discipline and patient perseverance. Long-term goals show visible progress. Do not let minor temporary delays discourage your steadfast commitment.",
    lucky_number: 8,
    lucky_color: "Charcoal Slate",
    favourable_direction: "West",
    remedy: "Feed black sesame seeds to birds and maintain selfless service (Seva)."
  },
  Aquarius: {
    forecast: "Innovative thoughts and humanitarian ideals inspire your actions today. Networking with visionary minds brings unexpected breakthroughs in upcoming projects.",
    lucky_number: 4,
    lucky_color: "Electric Indigo",
    favourable_direction: "West",
    remedy: "Light a mustard oil lamp under a Peepal tree in the evening."
  },
  Pisces: {
    forecast: "Deep spiritual serenity guides your steps today. Intuitive dreams or meditation may bring valuable revelations. Financial caution is advised for speculative investments.",
    lucky_number: 7,
    lucky_color: "Seafoam Yellow",
    favourable_direction: "North-East",
    remedy: "Chant 'Om Namo Bhagavate Vasudevaya' 108 times with a Tulsi mala."
  }
};

// Cut AI text at the end of a sentence instead of in the middle of a word
function trimToSentence(text, max = 600) {
  const clean = String(text).replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const last = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return last > 200 ? cut.slice(0, last + 1) : cut;
}

/**
 * Daily horoscope for one sign.
 *  1. Live forecast from FreeAstroAPI (cached for the day, so a sign costs one request per day per browser)
 *  2. If that fails, an AI-written forecast from Gemini, marked source: "ai"
 *  3. If both fail, it throws, and the page shows its error message. It never shows a made-up forecast.
 * lucky_number, lucky_color, favourable_direction and remedy are fixed traditional suggestions, not API data.
 */
export async function getDailyHoroscope(signName) {
  const today = istDate();
  const key = `vg_horo_${signName.toLowerCase()}_${today}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const fixed = HOROSCOPE_DATA[signName] || {};
  const extras = {
    lucky_number: (getHash(`${signName}${today}`) % 9) + 1,
    lucky_color: fixed.lucky_color || "Saffron Gold",
    favourable_direction: fixed.favourable_direction || "East",
    remedy: fixed.remedy || "Chant the Gayatri Mantra daily.",
  };

  let result = null;

  // 1. FreeAstroAPI
  try {
    const res = await fetch(`/api/astrology/horoscope?sign=${encodeURIComponent(signName.toLowerCase())}`);
    if (res.ok) {
      const data = await res.json();
      const interp = data?.data?.interpretation;
      if (interp && interp.summary) {
        result = {
          forecast: interp.summary,
          sections: interp.sections || [],
          overall_tone: interp.overall_tone || "supportive",
          source: "freeastroapi",
          ...extras,
        };
      }
    }
  } catch (err) {
    console.warn("[VASTUGRAH] FreeAstroAPI horoscope error, trying Gemini:", err);
  }

  // 2. Gemini (AI-written, labelled as such)
  if (!result && import.meta.env.VITE_GEMINI_API_KEY) {
    try {
      const text = await geminiDailyHoroscope(signName);
      if (text) result = { forecast: trimToSentence(text), source: "ai", ...extras };
    } catch (err) {
      console.warn("[VASTUGRAH] Gemini horoscope error:", err);
    }
  }

  if (!result) throw new Error("Daily horoscope is unavailable right now");

  // Cache only the live forecast; an AI fallback should not hide the real one for the rest of the day
  if (result.source === "freeastroapi") {
    pruneDaily("vg_horo_", today);
    cacheSet(key, result);
  }
  return result;
}

// Convert the FreeAstroAPI response into VASTUGRAH's chart format.
//   chart      : the D1 chart  (ascendant, planets, houses, sade_sati)
//   dashaData  : the Vimshottari dasha payload  (timeline, active_periods, ...)
//   extras     : the full response, so yogas / vargas / panchang / shadbala / ashtakavarga
//                are passed along as soon as the server sends them
function mapFreeAstroChart(chart, dashaData, extras = {}) {
  const asc = chart.ascendant;
  const planets = chart.planets || [];

  if (!asc?.sign || !planets.length) {
    throw new Error("The chart service returned incomplete data");
  }

  const moonPlanet = planets.find((p) => p.name?.toLowerCase() === "moon");
  const sunPlanet = planets.find((p) => p.name?.toLowerCase() === "sun");

  const mappedPlanets = planets.map((p) => ({
    planet: p.name,
    sign: p.sign,
    house: p.house,
    degree: p.degree_in_sign != null ? p.degree_in_sign.toFixed(2) : p.absolute_degree?.toFixed(2),
    nakshatra: p.nakshatra,
    pada: p.pada,
    nakshatra_lord: p.nakshatra_lord,
    retrograde: Boolean(p.is_retrograde),
  }));

  // ----- Dasha: real periods only, never invented ones -----
  const today = new Date().toISOString().slice(0, 10);
  const rawTimeline = dashaData?.timeline || dashaData?.dasha_timeline || dashaData?.mahadashas || [];

  const dashas = rawTimeline.map((d) => {
    const s = String(d.start || d.start_date || d.start_year || "");
    const e = String(d.end || d.end_date || d.end_year || "");
    const hasDates = s.length >= 10 && e.length >= 10;
    const isCurrent = d.is_active ?? d.current ?? (hasDates ? s.slice(0, 10) <= today && today < e.slice(0, 10) : false);
    return {
      lord: d.lord || d.planet || "Graha",
      start: s.slice(0, 4),
      end: e.slice(0, 4),
      start_date: s.slice(0, 10),
      end_date: e.slice(0, 10),
      current: Boolean(isCurrent),
    };
  });

  // The API lists the running periods from the largest down: [Mahadasha, next level, ...]
  const active = Array.isArray(dashaData?.active_periods) ? dashaData.active_periods : [];
  const activeMaha = active[0] || null;
  const activeSub = active[1] || null;
  const fallbackMaha = dashas.find((d) => d.current);

  return {
    ascendant: asc.sign,
    ascendant_degree: typeof asc.degree === "number" ? asc.degree % 30 : undefined,
    moon_sign: moonPlanet?.sign || "—",
    sun_sign: sunPlanet?.sign || "—",
    nakshatra: moonPlanet?.nakshatra || asc?.nakshatra?.name || "—",
    nakshatra_pada: moonPlanet?.pada || asc?.nakshatra?.pada || 1,
    nakshatra_lord: moonPlanet?.nakshatra_lord || asc?.nakshatra?.lord || "—",
    current_mahadasha: activeMaha?.lord || fallbackMaha?.lord || "—",
    current_antardasha: activeSub?.lord || null,
    active_periods: active,
    planets: mappedPlanets,
    dashas,
    sade_sati: chart.sade_sati,
    // Extra data, present when the server uses the all-in-one endpoint
    vargas: extras.vargas || null,
    yogas: extras.yogas || null,
    panchang: extras.panchang || null,
    shadbala: extras.shadbala || null,
    ashtakavarga: extras.ashtakavarga
      ? {
          sarvashtakavarga: extras.ashtakavarga.sarvashtakavarga,
          bhinnashtakavarga: extras.ashtakavarga.bhinnashtakavarga,
          total_points: extras.ashtakavarga.total_points,
        }
      : null,
  };
}

/**
 * Compute Vedic Kundli Chart via server-side FreeAstroAPI proxy.
 * Throws if the chart cannot be calculated, so the page can show an error
 * instead of a made-up chart.
 */
export async function computeChart({ name, gender, date, time, place }) {
  if (!date) throw new Error("Birth date is required");

  const [year, month, day] = date.split("-").map(Number);
  const parts = (time || "12:00").split(":").map(Number);
  // 0 is a real hour (midnight births), so check for a number instead of using ||
  const hour = Number.isFinite(parts[0]) ? parts[0] : 12;
  const minute = Number.isFinite(parts[1]) ? parts[1] : 0;

  const matchedCity = INDIAN_CITIES.find(
    (c) =>
      c.name.toLowerCase() === (place || "").toLowerCase() ||
      (place || "").toLowerCase().includes(c.name.toLowerCase())
  );

  const payload = {
    year,
    month,
    day,
    hour,
    minute,
    city: matchedCity?.name || place || "New Delhi",
    ayanamsha: "lahiri",
    house_system: "whole_sign",
    node_type: "mean",
  };

  // Send coordinates only when the place is known. Otherwise the service looks the city up by name,
  // instead of silently using Delhi's coordinates for everyone (the ascendant depends on location).
  if (matchedCity) {
    payload.lat = matchedCity.lat;
    payload.lng = matchedCity.lon;
    payload.tz_str = matchedCity.timezone || "Asia/Kolkata";
  }

  const res = await fetch("/api/astrology/chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Chart service returned ${res.status}`);
  }

  const data = await res.json();
  if (!data.chart) {
    throw new Error("Chart service returned no chart");
  }

  return mapFreeAstroChart(data.chart, data.dasha || data.vimshottari_dasha, data);
}

// Local birth profile storage
const PROFILE_KEY = "vastugrah_birth_profile";

export const BirthProfileService = {
  get: () => {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  save: (profile) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not save birth profile", e);
    }
    return profile;
  }
};