import { KEY, readChoice, sanitizeEvent } from './analytics-policy.mjs';
const panel = document.getElementById('analytics-panel');
const toggle = document.querySelector('.analytics-toggle');
const status = document.getElementById('analytics-status');
const allow = document.querySelector('[data-analytics="allow"]');
const deny = document.querySelector('[data-analytics="deny"]');
let loaded = false;
let storageBlocked = false;
const dnt = () => navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
const choice = () => { try { return readChoice(localStorage); } catch { return null; } };
function beforeSend(event) {
  return sanitizeEvent(event, { allowed: !storageBlocked && choice() === 'allow', origin: location.origin, referrer: document.referrer, dnt: dnt() });
}
function activate() {
  if (storageBlocked || loaded || choice() !== 'allow' || dnt()) return;
  // Official plain HTML integration. Register filter BEFORE downloading provider code.
  window.va = window.va || function (...args) { (window.vaq = window.vaq || []).push(args); };
  window.va('beforeSend', beforeSend);
  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  script.referrerPolicy = 'no-referrer';
  document.head.append(script);
  loaded = true;
}
function render(open = false, message = '') {
  const current = choice();
  panel.hidden = !open && current !== null;
  toggle.hidden = false;
  toggle.setAttribute('aria-expanded', String(!panel.hidden));
  status.textContent = message || (dnt() ? 'Analytika je vypnutá podle nastavení soukromí vašeho prohlížeče.' : current === 'allow' ? 'Analytika je povolená.' : 'Analytika je vypnutá.');
  allow.disabled = dnt();
  deny.textContent = current === 'allow' ? 'Vypnout analytiku' : 'Bez analytiky';
}
function save(value) {
  let stored = false;
  try { localStorage.setItem(KEY, JSON.stringify({ choice: value, time: Date.now() })); stored = choice() === value; } catch { /* fail closed */ }
  storageBlocked = !stored;
  if (!stored) {
    // Clear any previous consent if storage refused a write; force current-document filter off.
    window.va?.('beforeSend', () => null);
    render(true, 'Volbu nelze uložit. Analytika zůstává vypnutá.');
    return;
  }
  window.va?.('beforeSend', beforeSend);
  render(false);
  toggle.focus();
  activate();
}
if (panel && toggle) {
  render(); activate();
  allow.addEventListener('click', () => save('allow'));
  deny.addEventListener('click', () => save('deny'));
  toggle.addEventListener('click', () => render(panel.hidden));
  window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) { render(); activate(); } });
  // Every beforeSend re-reads storage, so revocation/expiry blocks already-loaded tracking.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
}
