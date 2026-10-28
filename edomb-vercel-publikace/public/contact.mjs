export const TOPICS = Object.freeze({
  reality: "Reality a bydlení",
  hypoteky: "Hypotéky a refinancování",
  uvery: "Úvěry a refinancování",
  poradenstvi: "Osobní finanční poradenství",
  investice: "Investice a zhodnocení",
  rodina: "Zabezpečení rodiny",
  auta: "Pojištění vozidel a karavanů",
  majetek: "Majetkové pojištění",
  plavidla: "Pojištění plavidel a letadel",
  cestovani: "Cestovní pojištění",
  mazlicci: "Pojištění mazlíčků",
  firmy: "Pro firmy",
  zamestnanci: "Pro zaměstnance"
});

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const stringValue = value => typeof value === "string" ? value : "";

function validEmail(value) {
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length <= 64 && domain.includes(".") && /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(local)
    && domain.split(".").every(label => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label));
}

export function validateContact(raw) {
  const values = {
    name: stringValue(raw.name).trim(),
    email: stringValue(raw.email).trim(),
    topic: stringValue(raw.topic),
    message: stringValue(raw.message).replace(/\r\n?/g, "\n").trim()
  };
  const errors = {};
  if (!values.name) errors.name = "Doplňte prosím své jméno.";
  else if (values.name.length > 120) errors.name = "Jméno může mít nejvýše 120 znaků.";
  else if (/[\u0000-\u001f\u007f]/.test(raw.name)) errors.name = "Odstraňte ze jména neplatné znaky.";
  if (!values.email) errors.email = "Doplňte prosím e-mail.";
  else if (values.email.length > 254 || /[\u0000-\u001f\u007f]/.test(raw.email) || !validEmail(values.email)) errors.email = "Zkontrolujte e-mailovou adresu, například jmeno@example.cz.";
  if (values.topic && !Object.hasOwn(TOPICS, values.topic)) errors.topic = "Vyberte prosím téma z nabídky.";
  if (values.message.length > 2000) errors.message = "Zpráva může mít nejvýše 2 000 znaků.";
  else if (CONTROL_CHARACTERS.test(raw.message)) errors.message = "Odstraňte ze zprávy neplatné znaky.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values };
}
