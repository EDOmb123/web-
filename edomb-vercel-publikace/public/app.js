import { TOPICS, validateContact } from "./contact.mjs?v=5";

const params = new URLSearchParams(window.location.search);
const requestedTopic = params.get("tema");
const topic = Object.hasOwn(TOPICS, requestedTopic) ? requestedTopic : null;
const legacyEntry = document.body.hasAttribute("data-legacy-entry");
const legacyServiceQuery = document.body.hasAttribute("data-service-overview") && params.has("tema");
if (legacyEntry || legacyServiceQuery) {
  window.location.replace(`index.html${topic ? `?tema=${topic}` : ""}#kontakt`);
} else {
  const form = document.querySelector("#consultation-form");
  if (form) initializeContact(form);
}

function initializeContact(form) {
  const fields = Object.fromEntries(["name", "email", "topic", "message"].map(id => [id, document.getElementById(id)]));
  const button = document.getElementById("form-submit");
  const result = document.getElementById("form-result");
  let pending = false;
  if (topic) fields.topic.value = topic;

  function clearError(id) {
    fields[id].removeAttribute("aria-invalid");
    document.getElementById(`${id}-error`).hidden = true;
  }
  Object.entries(fields).forEach(([id, field]) => field.addEventListener("input", () => {
    clearError(id);
    if (!pending) result.hidden = true;
  }));
  form.addEventListener("submit", event => {
    if (pending) { event.preventDefault(); return; }
    Object.keys(fields).forEach(clearError);
    const validation = validateContact(Object.fromEntries(Object.entries(fields).map(([id, field]) => [id, field.value])));
    if (!validation.ok) {
      event.preventDefault();
      let first;
      for (const [id, message] of Object.entries(validation.errors)) {
        const error = document.getElementById(`${id}-error`);
        error.textContent = message;
        error.hidden = false;
        fields[id].setAttribute("aria-invalid", "true");
        first ??= fields[id];
      }
      result.textContent = "Zkontrolujte označená pole.";
      result.classList.add("is-error");
      result.hidden = false;
      first?.focus();
      return;
    }
    // Do not cancel a valid submit: the browser performs the native HTTPS POST.
    // Formspree owns CAPTCHA, service errors and confirmation; never fake success here.
    pending = true;
    button.disabled = true;
    button.textContent = "Odesílám…";
    form.setAttribute("aria-busy", "true");
    result.textContent = "Přecházíte ke službě Formspree pro dokončení odeslání.";
    result.classList.remove("is-error");
    result.hidden = false;
  });
  window.addEventListener("pageshow", () => {
    // Restore controls after Back, including pages returned from the bfcache.
    pending = false;
    button.disabled = false;
    button.textContent = "Odeslat zprávu";
    form.setAttribute("aria-busy", "false");
    result.hidden = true;
  });
  // Native required/type validation remains available if JS fails or is disabled.
  form.noValidate = true;
}
