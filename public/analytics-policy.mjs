export const KEY = 'edomb.analytics.v1';
export const MAX_AGE = 183 * 86400000;
export function readChoice(storage, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(KEY));
    if (!value || !['allow', 'deny'].includes(value.choice) || !Number.isSafeInteger(value.time) || value.time > now || now - value.time >= MAX_AGE) return null;
    return value.choice;
  } catch { return null; }
}
export function sanitizeEvent(event, { allowed, origin, referrer, dnt }) {
  if (!allowed || dnt || event?.type !== 'pageview') return null;
  try {
    if (referrer) {
      const from = new URL(referrer);
      const safePath = from.pathname === '/' || (from.origin === origin && ['/index.html', '/sluzba.html', '/konzultace.html', '/soukromi.html'].includes(from.pathname));
      if (from.search || from.hash || from.username || from.password || !safePath || !['http:', 'https:'].includes(from.protocol)) return null;
    }
    const url = new URL(event.url);
    if (url.origin !== origin || !['/', '/index.html', '/sluzba.html', '/konzultace.html', '/soukromi.html'].includes(url.pathname)) return null;
    // Only the documented type and sanitized URL. No custom properties or topics.
    return { type: 'pageview', url: `${origin}${url.pathname === '/index.html' ? '/' : url.pathname}` };
  } catch { return null; }
}
