import React, { useState, useRef, useEffect } from "react";
import { askAstrologer } from "@/lib/gemini";
import { Send, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "What does my kundli say about my career?",
  "When is a favourable period for marriage?",
  "Which gemstone suits my chart?",
  "Suggest a remedy for a peaceful mind",
];

// Rich local Vedic answers for when Gemini API key is absent or offline
function generateLocalVedicReply(userMessage, persona, kundli) {
  const msg = (userMessage || "").toLowerCase();
  const name = kundli?.name || "Seeker";
  const rashi = kundli?.moon_sign || "your Moon sign";
  const asc = kundli?.ascendant || "your Lagna";

  if (msg.includes("career") || msg.includes("job") || msg.includes("business") || msg.includes("work")) {
    return `Namaste ${name}. Looking at ${asc} Lagna, the 10th house of profession is energized by favourable planetary aspects. Currently, diligent perseverance is favoured over abrupt job switches.

Planetary Insight:
• 10th House: Governs authority, status, and vocational accomplishment.
• Actionable Advice: The coming 6 to 8 months indicate steady growth. Strengthen your Mercury and Jupiter energies through focused communication and ethical commitments.
• Daily Remedy: Recite the Gayatri Mantra 11 times every morning facing East.`;
  }

  if (msg.includes("marriage") || msg.includes("relationship") || msg.includes("love") || msg.includes("partner")) {
    return `Namaste ${name}. In Vedic astrology, the 7th house and Venus (Shukra Dev) govern marital happiness and soulful partnerships. For ${rashi}, transit influences advise emotional clarity and mutual respect.

Spiritual Reading:
• Favourable Period: The upcoming Jupiter transit brings auspicious opportunities for meaningful alignment and matrimony.
• Harmonizing Advice: Cultivate transparent dialogue. Avoid making major decisions during Rahu Kaal.
• Vedic Remedy: Light a pure cow ghee diya in the Ishanya (North-East) corner on Friday evenings and chant 'Om Shukraya Namaha'.`;
  }

  if (msg.includes("gemstone") || msg.includes("stone") || msg.includes("ratna") || msg.includes("ring")) {
    return `Namaste ${name}. According to Brihat Parashara Hora Shastra, a gemstone must only strengthen benefic planets (Trikona lords: 1st, 5th, or 9th houses), never malefic dusthana lords.

Astrological Recommendation:
• Primary Suggestion: For ${asc} Lagna, Yellow Sapphire (Pukhraj) or Natural Pearl (Moti) harmonizes mental serenity and divine wisdom.
• Metal: Set in Panchdhatu or Gold/Silver after energizing on an auspicious Shukla Paksha morning.
• Caution: Always ensure the gemstone is 100% natural and untreated with a proper Vedic consecration (Prana Pratishtha).`;
  }

  if (msg.includes("remedy") || msg.includes("peace") || msg.includes("stress") || msg.includes("mind") || msg.includes("health")) {
    return `Namaste ${name}. When the lunar energies (Chandra) need grounding, Vedic scriptures recommend soothing ritual therapies (Upayas).

Effective Vedic Remedies:
1. Om Namah Shivaya: Japa of 108 chants using a 5-Mukhi Rudraksha mala each morning.
2. Water Offering: Offer fresh water to Surya Dev in a copper vessel at dawn.
3. Seva (Charity): Feed green grass to cows or birds on Wednesdays.
4. Vastu Balance: Keep the North-East zone of your sanctuary tidy, clutter-free, and well-ventilated.`;
  }

  if (msg.includes("rudraksha") || msg.includes("bead")) {
    return `Namaste ${name}. Rudraksha represents the tears of Lord Shiva, radiating bio-magnetic vibrations that balance blood pressure, chakras, and negative planetary influences.

Bead Guidance:
• 5-Mukhi Rudraksha: Ideal for general wellness, peace, and spiritual focus.
• 7-Mukhi Rudraksha: Blessed by Goddess Mahalakshmi, recommended for financial prosperity.
• Activation: Wash in raw milk and Ganga jal, apply sandalwood paste, and wear on a Monday morning with Shiva mantra chanting.`;
  }

  return `Namaste ${name}. As ${persona}, I observe the celestial transit of the Grahas relative to your chart (${asc} Lagna, ${rashi}).

The planetary currents emphasize conscious action (Purushartha) combined with cosmic timing. Whatever aspiration you nurture with devotion, Jupiter's expansive sight is supporting your journey.

Feel free to ask about your career, marriage timing, gemstone selection, Vastu corrections, or daily Vedic remedies.`;
}

export default function AstrologyChat({ personaName = "Vedic Acharya", kundli = null, autoReading = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Identifies which chart the chat is about. The kundli object is rebuilt on every render
  // of the parent, so we compare this stable string instead of the object itself.
  const kundliKey = kundli
    ? [kundli.name, kundli.date_of_birth, kundli.time_of_birth, kundli.place_of_birth, kundli.ascendant].join("|")
    : "";
  const lastKeyRef = useRef(null);
  // Bumped whenever a new chart arrives, so replies for an older chart can be discarded
  const reqRef = useRef(0);

  // Auto-generate a reading once for each new chart (not on every re-render)
  useEffect(() => {
    if (!kundli || !autoReading) return;
    if (lastKeyRef.current === kundliKey) return;
    lastKeyRef.current = kundliKey;

    const reqId = ++reqRef.current;
    setMessages([]);
    setError(null);

    (async () => {
      setSending(true);
      let reply;
      try {
        if (import.meta.env.VITE_GEMINI_API_KEY) {
          reply = await askAstrologer(
            [],
            `Provide a welcoming initial Vedic Kundli analysis for ${kundli.name}, Ascendant: ${kundli.ascendant}, Moon Sign: ${kundli.moon_sign}, Nakshatra: ${kundli.nakshatra}. Keep it inspiring and under 150 words.`
          );
        } else {
          reply = generateLocalVedicReply("greeting", personaName, kundli);
        }
      } catch {
        reply = generateLocalVedicReply("greeting", personaName, kundli);
      }
      // A newer chart replaced this one while we were waiting — drop this reply
      if (reqId !== reqRef.current) return;
      setMessages([{ role: "assistant", content: reply }]);
      setSending(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kundliKey, autoReading]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    const reqId = reqRef.current;
    const history = messages.slice(-10); // earlier messages only; the new one is passed separately
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setSending(true);

    let reply;
    try {
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        reply = await askAstrologer(history, content);
      } else {
        // High-quality local Vedic response engine
        await new Promise((resolve) => setTimeout(resolve, 600));
        reply = generateLocalVedicReply(content, personaName, kundli);
      }
    } catch {
      // Fallback gracefully to local knowledge
      reply = generateLocalVedicReply(content, personaName, kundli);
    }
    // The chart changed while waiting; the new reading owns the chat now
    if (reqId !== reqRef.current) return;
    setMessages([...next, { role: "assistant", content: reply }]);
    setSending(false);
  };

  return (
    <div className="flex flex-col border border-border bg-background">
      <div ref={scrollRef} className="h-[380px] space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && !sending && (
          <div className="pt-10 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">
              Namaste. Ask me anything about astrology — kundli, planets, gemstones, vastu or remedies.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              I answer astrology &amp; spiritual questions only.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground"
                }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
              </span>
              Consulting the celestial Grahas…
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            disabled={sending}
            className="border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      {error && <div className="border-t border-border px-5 py-2 text-xs text-destructive">{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex border-t border-border"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your stars, planets, gemstones…"
          className="flex-1 bg-transparent px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-primary px-6 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}