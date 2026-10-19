// Gemini AI Client for VASTUGRAH
// Add your API keys in .env.local:
// VITE_GEMINI_API_KEY=your-gemini-api-key
// VITE_FREE_ASTRO_API_KEY=your-freeastroapi-key (optional, for exact chart math)

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const freeAstroApiKey = import.meta.env.VITE_FREE_ASTRO_API_KEY;

let genAI = null;

export function getGenAI() {
  if (!genAI && apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * 1. Astrotalk-Style Interactive Chat Engine
 */
export async function askAstrologer(messages, userMessage) {
  const client = getGenAI();
  if (!client) {
    throw new Error(
      "Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file."
    );
  }

  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are VastuGuru, an esteemed, compassionate Vedic Astrologer working for VASTUGRAH. 
Your readings closely mirror premium Astrotalk consultations: deeply empathetic, insightful, practical, and grounded in authentic Jyotish Shastra and Vastu Shastra.

Core Guidelines:
- Address the user with respect ("Namaste", "Dear Seeker").
- Analyze questions using Vedic principles (Lagna, Houses, Dashas, Planetary aspects, Nakshatras).
- Use clear headings, bullet points, and clean formatting.
- Always offer constructive remedies (Mantras, Gemstones, Charity, Vastu adjustments).
- Maintain an encouraging and realistic tone—emphasize that karma and free will work together with cosmic timing.`,
  });

  const chat = model.startChat({
    history: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

/**
 * 2. Helper to fetch exact chart calculations from FreeAstroAPI
 */
async function fetchAccurateAstroData(birthData) {
  if (!freeAstroApiKey) return null;

  try {
    const response = await fetch("https://api.freeastroapi.com/v1/kundli", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": freeAstroApiKey,
      },
      body: JSON.stringify({
        name: birthData.name,
        dob: birthData.date || birthData.dob,
        tob: birthData.time || birthData.tob,
        lat: parseFloat(birthData.lat || birthData.latitude || "28.6139"),
        lon: parseFloat(birthData.lon || birthData.longitude || "77.2090"),
      }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn("FreeAstroAPI call bypassed or failed:", error);
    return null;
  }
}

/**
 * 3. Astrotalk-Quality Kundli Analysis Generator
 */
export async function generateKundliInsights(birthData, calculatedChart = null) {
  const client = getGenAI();
  if (!client) {
    throw new Error("Gemini API key not configured.");
  }

  // Attempt to get exact astronomical math if not directly passed in
  const astroMath = calculatedChart || (await fetchAccurateAstroData(birthData));

  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are VastuGuru, a senior Vedic Astrologer. Generate a deep, personalized, and beautifully formatted Kundli report that rivals Astrotalk's best readings.

User Information:
- Name: ${birthData.name || "Seeker"}
- Date of Birth: ${birthData.date || birthData.dob}
- Time of Birth: ${birthData.time || birthData.tob}
- Place of Birth: ${birthData.place || "India"}

${astroMath
      ? `Calculated Astronomical Data (Use this exact math for 100% accuracy):
${JSON.stringify(astroMath, null, 2)}`
      : `Note: Calculate planetary positions using precise Vedic (Sidereal Lahiri Ayanamsa) principles for the given date, time, and place.`
    }

Structure the output into these distinct Markdown sections:
1. 🌟 **Ascendant (Lagna) & Core Personality**
2. 🪐 **Key Planetary Strengths & House Influences**
3. 💼 **Career, Wealth & Life Purpose**
4. 💖 **Love, Marriage & Relationship Timing**
5. ⏳ **Current Dasha Guidance & Astrotalk-Style Remedies** (Provide actionable Mantras, Gemstones, or Vastu tips)

Tone: Warm, authoritative, uplifting, and deeply spiritual.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * 4. Daily Horoscope Engine
 */
export async function getDailyHoroscope(sign) {
  const client = getGenAI();
  if (!client) {
    return getMockHoroscope(sign);
  }

  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `Provide a detailed Vedic astrology daily horoscope for ${sign} (${getHindiSign(
    sign
  )}) for ${today}. 

Include:
- Overall energy rating (e.g., 8/10)
- Love & Relationships
- Career & Finances
- Health & Wellbeing
- Lucky Color & Lucky Number
- A relevant Sanskrit shloka with English meaning.

Keep it positive, insightful, authentic, and under 300 words. Format with clean Markdown headers and emojis.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Helper: Hindi Sign Mapping
 */
function getHindiSign(sign) {
  const signs = {
    Aries: "Mesha",
    Taurus: "Vrishabha",
    Gemini: "Mithuna",
    Cancer: "Karka",
    Leo: "Simha",
    Virgo: "Kanya",
    Libra: "Tula",
    Scorpio: "Vrishchika",
    Sagittarius: "Dhanu",
    Capricorn: "Makara",
    Aquarius: "Kumbha",
    Pisces: "Meena",
  };
  return signs[sign] || sign;
}

/**
 * Fallback Mock Horoscope (Used when API Key is missing)
 */
function getMockHoroscope(sign) {
  return `**Daily Horoscope for ${sign} — ${new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })}**

🌟 **Overall Energy: 8/10**

The celestial energies are aligning in your favor today. Jupiter's benevolent gaze brings opportunities for wisdom, focus, and spiritual progress.

💕 **Love & Relationships**
Venus graces your relationship house today, encouraging harmony and heartfelt connection. Clear, loving communication brings peace.

💼 **Career & Finance**
Mercury sharpens your intellect. An excellent day for strategic planning, discussions, and executing tasks with precision.

🌿 **Health & Wellbeing**
Your energy is vibrant. Practice morning Pranayama or Surya Namaskar to channel the solar vibrations effectively.

🎯 **Lucky Color:** Saffron | **Lucky Number:** 7

*"Yogas chitta vritti nirodhah"* — Yoga is the stilling of the fluctuations of the mind.

*Note: Add your VITE_GEMINI_API_KEY in .env.local to activate real-time AI-powered daily insights.*`;
}