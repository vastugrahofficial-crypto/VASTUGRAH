// Server-side FreeAstroAPI Integration Proxy
// Keeps FREE_ASTRO_API_KEY strictly on the server

const FREE_ASTRO_BASE = "https://api.freeastroapi.com";

// In-memory cache for rate-limiting protection & quick repeated requests
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

function getCache(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.time < CACHE_TTL_MS) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { time: Date.now(), data });
}

// Helper to safely parse incoming JSON request body from Node stream
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // Guard against overly large payloads (1MB max)
      if (body.length > 1e6) {
        req.socket.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

// Send standard JSON response
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

// Safe wrapper around FreeAstroAPI fetch with rate limit retry
async function fetchFreeAstro(endpoint, options = {}, retries = 2) {
  const apiKey = process.env.FREE_ASTRO_API_KEY;
  if (!apiKey) {
    throw new Error("FREE_ASTRO_API_KEY is not configured in backend environment (.env)");
  }

  const url = `${FREE_ASTRO_BASE}${endpoint}`;
  const headers = {
    "x-api-key": apiKey,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 429 && retries > 0) {
    const errData = await response.json().catch(() => ({}));
    const waitMs = errData.retry_after_ms ? errData.retry_after_ms + 100 : 1200;
    console.warn(`[FreeAstroAPI] Rate limit hit. Backing off for ${waitMs}ms before retry...`);
    await new Promise((r) => setTimeout(r, waitMs));
    return fetchFreeAstro(endpoint, options, retries - 1);
  }

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.error || data?.detail || response.statusText;
    const err = new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * Main astrology API middleware handler
 * Mountable directly in Vite server middleware or Connect/Express apps
 */
export async function astrologyApiMiddleware(req, res, next) {
  // Only intercept /api/astrology routes
  if (!req.url.startsWith("/api/astrology")) {
    return next ? next() : null;
  }

  // Parse path and query
  const parsedUrl = new URL(req.url, "http://localhost");
  const pathname = parsedUrl.pathname.replace(/^\/api\/astrology/, "") || "/";
  const searchParams = parsedUrl.searchParams;

  try {
    // 1. Health check
    if (pathname === "/health" || pathname === "/") {
      const hasKey = Boolean(process.env.FREE_ASTRO_API_KEY);
      return sendJson(res, 200, {
        status: "ok",
        provider: "FreeAstroAPI",
        configured: hasKey,
        key_preview: hasKey ? `${process.env.FREE_ASTRO_API_KEY.slice(0, 6)}...` : null,
      });
    }

    // 2. Vedic Kundli Chart calculation
    if (pathname === "/chart" && req.method === "POST") {
      const body = await parseBody(req);
      const {
        year,
        month,
        day,
        hour = 12,
        minute = 0,
        city = "New Delhi",
        lat = 28.6139,
        lng = 77.2090,
        tz_str = "Asia/Kolkata",
        ayanamsha = "lahiri",
        house_system = "whole_sign",
        node_type = "mean",
      } = body;

      const cacheKey = `chart_${year}_${month}_${day}_${hour}_${minute}_${lat}_${lng}_${ayanamsha}`;
      const cached = getCache(cacheKey);
      if (cached) {
        return sendJson(res, 200, cached);
      }

      const chartPayload = {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
        city,
        lat: Number(lat),
        lng: Number(lng),
        tz_str,
        ayanamsha,
        house_system,
        node_type,
      };

      const chartData = await fetchFreeAstro("/api/v2/vedic/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chartPayload),
      });

      // Optionally fetch Vimshottari Mahadasha
      let dashaData = null;
      try {
        // Small delay to respect 1 req/sec rate limit on free tier if sequential
        await new Promise((r) => setTimeout(r, 1100));
        dashaData = await fetchFreeAstro("/api/v2/vedic/dasha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...chartPayload,
            levels: 1,
            reference_date: new Date().toISOString().slice(0, 10),
          }),
        });
      } catch (dashaErr) {
        console.warn("[FreeAstroAPI] Dasha fetch non-fatal warning:", dashaErr.message);
      }

      const result = {
        chart: chartData,
        dasha: dashaData,
      };

      setCache(cacheKey, result);
      return sendJson(res, 200, result);
    }

    // 3. Vedic Panchang
    if (pathname === "/panchang" && (req.method === "POST" || req.method === "GET")) {
      let params = {};
      if (req.method === "POST") {
        params = await parseBody(req);
      } else {
        const dateStr = searchParams.get("date") || new Date().toISOString().slice(0, 10);
        const [y, m, d] = dateStr.split("-").map(Number);
        params = {
          year: y,
          month: m,
          day: d,
          hour: 12,
          minute: 0,
          lat: Number(searchParams.get("lat")) || 28.6139,
          lng: Number(searchParams.get("lng")) || 77.2090,
          city: searchParams.get("city") || "New Delhi",
          tz_str: searchParams.get("tz_str") || "Asia/Kolkata",
        };
      }

      const cacheKey = `panchang_${params.year}_${params.month}_${params.day}_${params.lat}_${params.lng}`;
      const cached = getCache(cacheKey);
      if (cached) {
        return sendJson(res, 200, cached);
      }

      const panchangData = await fetchFreeAstro("/api/v2/vedic/panchang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(params.year),
          month: Number(params.month),
          day: Number(params.day),
          hour: Number(params.hour ?? 12),
          minute: Number(params.minute ?? 0),
          city: params.city || "New Delhi",
          lat: Number(params.lat ?? 28.6139),
          lng: Number(params.lng ?? 77.2090),
          tz_str: params.tz_str || "Asia/Kolkata",
          ayanamsha: "lahiri",
        }),
      });

      setCache(cacheKey, panchangData);
      return sendJson(res, 200, panchangData);
    }

    // 4. Daily Horoscope (Vedic Rashifal by Moon-sign)
    if (pathname === "/horoscope" && req.method === "GET") {
      const sign = (searchParams.get("sign") || "aries").toLowerCase();
      const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);
      const lang = searchParams.get("lang") || "en";

      const cacheKey = `horo_${sign}_${date}_${lang}`;
      const cached = getCache(cacheKey);
      if (cached) {
        return sendJson(res, 200, cached);
      }

      const queryParams = new URLSearchParams({
        sign,
        target_date: date,
        tz_str: "Asia/Kolkata",
        include_interpretation: "true",
        lang,
      });

      const horoData = await fetchFreeAstro(
        `/api/v2/vedic/horoscope/daily/sign?${queryParams.toString()}`,
        { method: "GET" }
      );

      setCache(cacheKey, horoData);
      return sendJson(res, 200, horoData);
    }

    // Route not found
    return sendJson(res, 404, { error: `Astrology endpoint ${pathname} not found` });
  } catch (err) {
    console.error("[Astrology API Error]:", err);
    return sendJson(res, err.status || 500, {
      error: err.message || "Internal Astrology Server Error",
      detail: err.data || null,
    });
  }
}

export default astrologyApiMiddleware;
