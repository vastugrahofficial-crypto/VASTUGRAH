// Vercel serverless entry for all /api/astrology/* routes
// (chart, panchang, horoscope, health)
import { astrologyApiMiddleware } from '../../server/astroProxy.js';

export default async function handler(req, res) {
  return astrologyApiMiddleware(req, res);
}