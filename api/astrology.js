// Vercel serverless entry for all /api/astrology/* routes
// (chart, panchang, horoscope, health) via the rewrite in vercel.json
import { astrologyApiMiddleware } from '../server/astroProxy.js';

export default async function handler(req, res) {
  // After a rewrite, Vercel may pass the original sub-path as ?path=chart.
  // Rebuild the original URL so astroProxy.js sees /api/astrology/chart.
  const u = new URL(req.url, 'http://localhost');
  const sub = u.searchParams.get('path');
  if (sub !== null) {
    u.searchParams.delete('path');
    const qs = u.searchParams.toString();
    req.url = `/api/astrology/${sub}${qs ? `?${qs}` : ''}`;
  }
  return astrologyApiMiddleware(req, res);
}