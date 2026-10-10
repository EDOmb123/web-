import { KEY, readChoice, isProductionPage, sanitizeEvent } from './analytics-policy.mjs?v=30';
// One initializer and provider script per document, including duplicate imports.
if (!window.__edombAnalyticsInitialized) {
  window.__edombAnalyticsInitialized = true;
  initializeAnalytics();
}
function initializeAnalytics() {
  const toggle = document.getElementById('analytics-optout');
  const status = document.getElementById('analytics-status');
  const environment = document.querySelector('meta[name="deployment-environment"]')?.content;
  let loaded = false;
  let storageBlocked = false;
  const dnt = () => navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const choice = () => { try { return readChoice(localStorage); } catch { return 'blocked'; } };
  const eligible = () => isProductionPage(location.href, environment) && !document.body.hasAttribute('data-legacy-entry')
    && !(document.body.hasAttribute('data-service-overview') && new URL(location.href).searchParams.has('tema'));
  const allowed = () => !storageBlocked && ['auto', 'allow'].includes(choice()) && !dnt() && eligible();
  function beforeSend(event) {
    return sanitizeEvent(event, { allowed: allowed(), origin: location.origin, referrer: document.referrer, dnt: dnt() });
  }
  function activate() {
    if (loaded || !beforeSend({ type: 'pageview', url: location.href })) return;
    // Official plain HTML queue. Register the redaction/opt-out hook before provider code.
    window.va = window.va || function (...args) { (window.vaq = window.vaq || []).push(args); };
    window.va('beforeSend', beforeSend);
    const script = document.createElement('script');
    script.src = '/_vercel/insights/script.js';
    script.defer = true;
    script.referrerPolicy = 'no-referrer';
    // No manual pageview call: the provider handles the one initial view.
    script.addEventListener('error', () => { /* Analytics failure never affects the form. */ });
    loaded = true;
    document.head.append(script);
  }
  function render(message = '') {
    if (!toggle || !status) return;
    const current = choice();
    toggle.hidden = false;
    toggle.disabled = dnt();
    toggle.textContent = current === 'deny' || current === 'blocked' || storageBlocked
      ? 'Znovu zapnout analytiku' : 'Vypnout analytiku v tomto prohlížeči';
    status.textContent = message || (dnt()
      ? 'Analytika je vypnutá podle nastavení vašeho prohlížeče.'
      : current === 'blocked' || storageBlocked
        ? 'Nastavení nelze bezpečně přečíst nebo uložit. Analytika zůstává vypnutá.'
        : current === 'deny'
          ? 'Analytika je v tomto prohlížeči vypnutá.'
          : !eligible()
            ? 'V tomto náhledu se návštěvnost neměří.'
            : 'Základní měření návštěvnosti je zapnuté.');
  }
  function save(value) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice: value, time: Date.now() }));
      storageBlocked = choice() !== value;
    } catch { storageBlocked = true; }
    render(storageBlocked ? 'Volbu nelze uložit. Analytika je pro tuto otevřenou stránku vypnutá.' : '');
    activate();
  }
  toggle?.addEventListener('click', () => {
    if (dnt()) return;
    save(choice() === 'deny' || choice() === 'blocked' || storageBlocked ? 'allow' : 'deny');
  });
  window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) { render(); activate(); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { render(); activate(); } });
  // Every event rechecks the current refusal and browser signals, even after load.
  render();
  activate();
}
