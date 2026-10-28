export const KEY = 'edomb.analytics.v1';
export const PATHS = Object.freeze(['/', '/index.html', '/sluzba.html', '/soukromi.html']);
export function readChoice(storage) {
  try {
    const raw = storage.getItem(KEY);
    if (raw === null) return 'auto';
    const value = JSON.parse(raw);
    // A previous refusal must survive migration, including the old 183-day expiry.
    if (value?.choice === 'deny') return 'deny';
    if (value?.choice === 'allow' && Number.isSafeInteger(value.time) && value.time >= 0 && value.time <= Date.now()) return 'allow';
    return 'blocked';
  } catch { return 'blocked'; }
}
export function isProductionPage(url, environment) {
  try {
    const parsed = new URL(url);
    return environment === 'production' && parsed.origin === 'https://www.edomb.cz' && PATHS.includes(parsed.pathname);
  } catch { return false; }
}
export function sanitizeEvent(event, { allowed, origin, referrer, dnt }) {
  if (!allowed || dnt || event?.type !== 'pageview') return null;
  try {
    if (referrer) {
      const from = new URL(referrer);
      const safePath = from.pathname === '/' || (from.origin === origin && PATHS.includes(from.pathname));
      if (from.search || from.hash || from.username || from.password || !safePath || !['http:', 'https:'].includes(from.protocol)) return null;
    }
    const url = new URL(event.url);
    if (url.origin !== origin || url.username || url.password || !PATHS.includes(url.pathname)) return null;
    return { type: 'pageview', url: `${origin}${url.pathname === '/index.html' ? '/' : url.pathname}` };
  } catch { return null; }
}
