// VASTUGRAH Vedic Astrology & Panchang Engine
// Powered by server-side FreeAstroAPI integration with resilient offline fallback

import { askAstrologer, getDailyHoroscope as geminiDailyHoroscope } from './gemini';
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

const SIGNS_FULL = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

// Seeded pseudorandom from date or string
function getHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Local Panchang computation fallback
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

/**
 * Fetch Live Panchang via server-side FreeAstroAPI proxy with local fallback
 */
export async function getDailyPanchang(dateStr, coords) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const lat = coords?.lat || 28.6139;
    const lng = coords?.lng || coords?.lon || 77.2090;

    const res = await fetch("/api/astrology/panchang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year,
        month,
        day,
        hour: 12,
        minute: 0,
        city: "New Delhi",
        lat,
        lng,
        tz_str: "Asia/Kolkata",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const tithiStr = data.tithi?.paksha
        ? `${data.tithi.name} (${data.tithi.paksha} Paksha)`
        : (data.tithi?.name || "Shukla Pratipada");
      const nakshatraStr = data.nakshatra
        ? `${data.nakshatra.name}${data.nakshatra.pada ? ` (Pada ${data.nakshatra.pada})` : ""}`
        : "Ashwini";
      const moonSign = data.request_time_panchang?.moon_sign?.name
        ? `${data.request_time_panchang.moon_sign.name}`
        : (data.lunar_month?.name || "Mesha (Aries)");

      return {
        tithi: tithiStr,
        nakshatra: nakshatraStr,
        yoga: data.yoga?.name || "Siddhi",
        karana: data.karanas?.[0]?.name || "Bava",
        moon_sign: moonSign,
        rahu_kaal: data.rahu_kalam?.start ? `${data.rahu_kalam.start} – ${data.rahu_kalam.end}` : "10:30 AM – 12:00 PM",
        abhijit_muhurat: "11:48 AM – 12:36 PM",
        amrit_kaal: "02:14 PM – 03:48 PM",
        brahma_muhurat: "04:32 AM – 05:20 AM",
        significance: `Auspicious ${data.tithi?.paksha || "Shukla"} Paksha day under ${data.nakshatra?.name || "favourable"} Nakshatra. Perfect for dharmic activities, home harmony and spiritual focus.`,
        sunrise: data.sunrise || "06:15 AM",
        sunset: data.sunset || "06:30 PM",
      };
    }
  } catch (err) {
    console.warn("[VASTUGRAH] FreeAstroAPI Panchang unavailable, using local calculation:", err);
  }

  return getLocalDailyPanchang(dateStr);
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

/**
 * Fetch Daily Horoscope via server-side FreeAstroAPI proxy
 */
export async function getDailyHoroscope(signName) {
  // 1. Try FreeAstroAPI live server endpoint
  try {
    const res = await fetch(`/api/astrology/horoscope?sign=${encodeURIComponent(signName.toLowerCase())}`);
    if (res.ok) {
      const data = await res.json();
      const interp = data?.data?.interpretation;
      if (interp && interp.summary) {
        return {
          forecast: interp.summary,
          sections: interp.sections || [],
          overall_tone: interp.overall_tone || "supportive",
          lucky_number: (getHash(signName) % 9) + 1,
          lucky_color: HOROSCOPE_DATA[signName]?.lucky_color || "Saffron Gold",
          favourable_direction: HOROSCOPE_DATA[signName]?.favourable_direction || "East",
          remedy: HOROSCOPE_DATA[signName]?.remedy || "Chant Gayatri Mantra daily.",
        };
      }
    }
  } catch (err) {
    console.warn("[VASTUGRAH] FreeAstroAPI horoscope error, trying Gemini/fallback:", err);
  }

  // 2. Fall back to Gemini API if configured
  try {
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      const text = await geminiDailyHoroscope(signName);
      if (text) {
        return {
          forecast: text.replace(/\*\*/g, '').slice(0, 400),
          lucky_number: (getHash(signName) % 9) + 1,
          lucky_color: HOROSCOPE_DATA[signName]?.lucky_color || "Saffron",
          favourable_direction: HOROSCOPE_DATA[signName]?.favourable_direction || "East",
          remedy: HOROSCOPE_DATA[signName]?.remedy || "Chant Gayatri Mantra daily."
        };
      }
    }
  } catch (err) {
    console.warn("Using local horoscope engine", err);
  }

  return HOROSCOPE_DATA[signName] || HOROSCOPE_DATA["Aries"];
}

// Local deterministic Kundli calculation fallback
function computeLocalChart({ name, gender, date, time, place }) {
  const hash = getHash(`${name}_${date}_${time}_${place}`);
  const ascIdx = hash % 12;
  const moonIdx = (hash + 3) % 12;
  const sunIdx = (hash + 7) % 12;
  const nakIdx = hash % NAKSHATRAS.length;

  const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  const planets = [
    { planet: "Sun", sign: SIGNS[sunIdx], house: ((sunIdx - ascIdx + 12) % 12) + 1, degree: `${(hash % 28) + 1}° ${(hash % 50)}'` },
    { planet: "Moon", sign: SIGNS[moonIdx], house: ((moonIdx - ascIdx + 12) % 12) + 1, degree: `${((hash + 4) % 28) + 1}° 14'` },
    { planet: "Mars", sign: SIGNS[(hash + 1) % 12], house: (((hash + 1) % 12 - ascIdx + 12) % 12) + 1, degree: `${((hash + 2) % 28) + 1}° 32'` },
    { planet: "Mercury", sign: SIGNS[(sunIdx + 1) % 12], house: (((sunIdx + 1) % 12 - ascIdx + 12) % 12) + 1, degree: `${((hash + 5) % 28) + 1}° 45'` },
    { planet: "Jupiter", sign: SIGNS[(hash + 5) % 12], house: (((hash + 5) % 12 - ascIdx + 12) % 12) + 1, degree: `${((hash + 6) % 28) + 1}° 10'` },
    { planet: "Venus", sign: SIGNS[(sunIdx + 11) % 12], house: (((sunIdx + 11) % 12 - ascIdx + 12) % 12) + 1, degree: `${((hash + 7) % 28) + 1}° 50'` },
    { planet: "Saturn", sign: SIGNS[(hash + 8) % 12], house: (((hash + 8) % 12 - ascIdx + 12) % 12) + 1, degree: `${((hash + 9) % 28) + 1}° 02'` },
    { planet: "Rahu", sign: SIGNS[(hash + 10) % 12], house: (((hash + 10) % 12 - ascIdx + 12) % 12) + 1, degree: `${((hash + 11) % 28) + 1}° 29'` },
    { planet: "Ketu", sign: SIGNS[(hash + 4) % 12], house: (((hash + 4) % 12 - ascIdx + 12) % 12) + 1, degree: `${((hash + 11) % 28) + 1}° 29'` }
  ];

  const dashas = [
    { lord: "Jupiter", start: "2018", end: "2034", current: true },
    { lord: "Saturn", start: "2034", end: "2053", current: false },
    { lord: "Mercury", start: "2053", end: "2070", current: false }
  ];

  return {
    ascendant: SIGNS[ascIdx],
    moon_sign: SIGNS[moonIdx],
    sun_sign: SIGNS[sunIdx],
    nakshatra: NAKSHATRAS[nakIdx],
    nakshatra_pada: (hash % 4) + 1,
    nakshatra_lord: ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"][nakIdx % 9],
    current_mahadasha: "Jupiter (Guru)",
    planets,
    dashas
  };
}

// Convert FreeAstroAPI response to VASTUGRAH standard chart format
function mapFreeAstroChart(chart, dashaData, form) {
  const asc = chart.ascendant;
  const planets = chart.planets || [];

  const moonPlanet = planets.find((p) => p.name?.toLowerCase() === "moon");
  const sunPlanet = planets.find((p) => p.name?.toLowerCase() === "sun");

  const mappedPlanets = planets.map((p) => ({
    planet: p.name,
    sign: p.sign,
    house: p.house,
    degree: p.degree_in_sign != null ? p.degree_in_sign.toFixed(2) : p.absolute_degree?.toFixed(2),
    nakshatra: p.nakshatra,
    retrograde: Boolean(p.is_retrograde),
  }));

  let dashas = [];
  if (dashaData?.dasha_timeline && Array.isArray(dashaData.dasha_timeline)) {
    dashas = dashaData.dasha_timeline.map((d) => ({
      lord: d.lord || d.planet || "Graha",
      start: String(d.start_date || d.start || "").slice(0, 4),
      end: String(d.end_date || d.end || "").slice(0, 4),
      current: Boolean(d.is_active || d.current),
    }));
  } else if (dashaData?.mahadashas && Array.isArray(dashaData.mahadashas)) {
    dashas = dashaData.mahadashas.map((d) => ({
      lord: d.lord || d.planet || "Graha",
      start: String(d.start_year || d.start || "").slice(0, 4),
      end: String(d.end_year || d.end || "").slice(0, 4),
      current: Boolean(d.current),
    }));
  } else {
    dashas = [
      { lord: moonPlanet?.nakshatra_lord || "Jupiter", start: "2018", end: "2034", current: true },
      { lord: "Saturn", start: "2034", end: "2053", current: false },
      { lord: "Mercury", start: "2053", end: "2070", current: false },
    ];
  }

  const activeDasha = dashas.find((d) => d.current) || dashas[0];
  const currentMahadasha = activeDasha ? `${activeDasha.lord}` : (moonPlanet?.nakshatra_lord || "Jupiter");

  return {
    ascendant: asc?.sign || "Aries",
    moon_sign: moonPlanet?.sign || "Taurus",
    sun_sign: sunPlanet?.sign || "Leo",
    nakshatra: moonPlanet?.nakshatra || asc?.nakshatra?.name || "Ashwini",
    nakshatra_pada: moonPlanet?.pada || asc?.nakshatra?.pada || 1,
    nakshatra_lord: moonPlanet?.nakshatra_lord || asc?.nakshatra?.lord || "Mars",
    current_mahadasha: currentMahadasha,
    planets: mappedPlanets,
    dashas,
    sade_sati: chart.sade_sati,
  };
}

/**
 * Compute Vedic Kundli Chart via server-side FreeAstroAPI proxy
 */
export async function computeChart({ name, gender, date, time, place }) {
  try {
    const [year, month, day] = (date || "1995-01-01").split("-").map(Number);
    const [hour, minute] = (time || "12:00").split(":").map(Number);

    const matchedCity = INDIAN_CITIES.find(
      (c) =>
        c.name.toLowerCase() === (place || "").toLowerCase() ||
        (place || "").toLowerCase().includes(c.name.toLowerCase())
    );

    const payload = {
      year,
      month,
      day,
      hour: hour || 12,
      minute: minute || 0,
      city: matchedCity?.name || place || "New Delhi",
      lat: matchedCity?.lat || 28.6139,
      lng: matchedCity?.lon || 77.2090,
      tz_str: matchedCity?.timezone || "Asia/Kolkata",
      ayanamsha: "lahiri",
      house_system: "whole_sign",
      node_type: "mean",
    };

    const res = await fetch("/api/astrology/chart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.chart) {
        return mapFreeAstroChart(data.chart, data.dasha, { name, gender, date, time, place });
      }
    }
  } catch (err) {
    console.warn("[VASTUGRAH] FreeAstroAPI chart error, using local fallback:", err);
  }

  return computeLocalChart({ name, gender, date, time, place });
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
