// Gemini AI client
// Add your Gemini API key in .env.local:
// VITE_GEMINI_API_KEY=your-gemini-api-key

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;

export function getGenAI() {
  if (!genAI && apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function askAstrologer(messages, userMessage) {
  const client = getGenAI();
  if (!client) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.');
  }

  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `You are VastuGuru, a wise and knowledgeable AI astrologer with deep expertise in:
- Vedic astrology (Jyotish Shastra)
- Vastu Shastra (ancient Indian architecture science)
- Kundli analysis and interpretation
- Planetary transits and their effects
- Nakshatra analysis
- Panchang (Hindu almanac)
- Gemstone recommendations
- Rudraksha beads and their properties
- Remedies and spiritual guidance

Speak with wisdom, compassion, and authority. Use occasional Sanskrit terms with explanations. Keep responses helpful, respectful, and grounded in Vedic tradition. Always emphasize that astrology is guidance, not absolute fate.`,
  });

  const chat = model.startChat({
    history: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

export async function generateKundliInsights(birthData) {
  const client = getGenAI();
  if (!client) {
    throw new Error('Gemini API key not configured.');
  }

  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `As a Vedic astrologer, provide a detailed Kundli analysis for:
- Name: ${birthData.name}
- Date of Birth: ${birthData.date}
- Time of Birth: ${birthData.time}
- Place of Birth: ${birthData.place}

Provide insights on: Lagna (Ascendant), Sun sign, Moon sign, Planetary positions, Career, Relationships, Health, and suitable remedies. Format with clear sections.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function getDailyHoroscope(sign) {
  const client = getGenAI();
  if (!client) {
    // Return mock data when API key not available
    return getMockHoroscope(sign);
  }

  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `Provide a detailed Vedic astrology daily horoscope for ${sign} (${getHindiSign(sign)}) for ${today}. Include: Overall energy (1-10 rating), Love & relationships, Career & finances, Health & wellbeing, Lucky color, Lucky number, and a motivational Sanskrit shloka with meaning. Keep it positive, insightful, and under 300 words.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

function getHindiSign(sign) {
  const signs = {
    Aries: 'Mesha', Taurus: 'Vrishabha', Gemini: 'Mithuna', Cancer: 'Karka',
    Leo: 'Simha', Virgo: 'Kanya', Libra: 'Tula', Scorpio: 'Vrishchika',
    Sagittarius: 'Dhanu', Capricorn: 'Makara', Aquarius: 'Kumbha', Pisces: 'Meena'
  };
  return signs[sign] || sign;
}

function getMockHoroscope(sign) {
  return `**Daily Horoscope for ${sign} — ${new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}**

🌟 **Overall Energy: 7/10**

The celestial energies are aligning in your favor today. Jupiter's benevolent gaze brings opportunities for growth and wisdom.

💕 **Love & Relationships**
Venus graces your relationships today, fostering harmony and deeper connections. Communicate openly with loved ones.

💼 **Career & Finance**
Mercury's influence sharpens your intellect. A good day for negotiations and financial decisions. Trust your analytical mind.

🌿 **Health & Wellbeing**
Your vitality is strong. Engage in morning yoga or pranayama to harness the day's positive energy.

🎯 **Lucky Color:** Saffron | **Lucky Number:** 7

*"Yogas chitta vritti nirodhah"* — Yoga is the cessation of the fluctuations of the mind. Find your center today.

*Note: Add your VITE_GEMINI_API_KEY in .env.local for personalized AI-powered horoscopes.*`;
}
