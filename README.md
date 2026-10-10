# edomb.cz — GitHub / Vercel / Formspree U30

Statické HTML, CSS a JavaScript; žádné runtime závislosti, PHP, vlastní mail server ani API klíče. Node 24 se používá pouze pro kontroly/build. Vercel publikuje jen `public/`, nikdy kořen projektu. Design, fotografie a kontakty jsou zachovány.

## Spuštění a kontroly

- `npm run lint` — syntax JS přes `node --check`, nikoli ESLint.
- `npm test` — Node testy, bez skutečných zpráv.
- `npm run build` — kontrola veřejného výstupu a deterministické robots pro Preview/Production.
- `npm run preview` — bezpečný místní náhled http://127.0.0.1:4198. Nahrazuje action lokální testovací stránkou a CSP zakazuje externí POST. Nic neodesílá do Formspree ani e-mailem. Nikdy nepoužívat jako produkční server.
- Typecheck N/A: projekt neobsahuje TypeScript.

## Formulář

Nativní HTTPS POST na `https://formspree.io/f/xdeazgld`. JavaScript pouze vylepšuje českou validaci a blokuje dvojklik během odchodu; bez JS funguje HTML validace i POST. Formspree převezme CAPTCHA, případné chyby/kvótu a potvrzení na své stránce. Web nevytváří vlastní potvrzení doručení. Po návratu tlačítkem Zpět se ovládání obnoví. Nepřidáváme globální deduplikaci ani vlastní serverové rate limiting sliby. Honeypot `_gotcha` doplňuje ochrany Formspree; klientské limity nenahrazují ochrany poskytovatele. Vypnutá analytika formulář neblokuje.

Příjemce musí být v účtu Formspree nastaven a ověřen jako **vaclav.kunc@edofinance.cz**. Veřejný endpoint nepotvrzuje nastavení účtu ani doručení. Před spuštěním zkontrolovat formulář, e-mailovou notifikaci, aktivaci/ověření adresy a bezpečnostní nastavení poskytovatele. Referrer-Policy zůstává no-referrer; nepovolujte omezení závislé na Referer bez samostatného ověření kompatibility. Žádné skutečné testovací zprávy nebyly odeslány.

## GitHub a Vercel

Rozbalte ZIP a nahrajte **jeho obsah**, nikoli ZIP ani obalovou složku, do kořene připravované větve repozitáře. `package.json`, `vercel.json`, `public/`, `scripts/` a `test/` musí být vedle sebe. Nesmažte cizí nesouvisející soubory. Při nahrazení U28 odstraňte jeho staré `api/`, `lib/`, `.env.example` a neaktuální testy; pouhé nahrání nových souborů je nesmaže. Staré WEDOS PHP/web rozložení není výstup této verze.

Vercel: Root Directory prázdná (kořen repozitáře), Framework Other, Node 24, Build `npm run build`, Output `public`. Nenastavujte Root Directory na `public` ani `web`. Resend, Upstash ani serverové Environment Variables nejsou potřeba. Staré secrets pro tuto integraci lze z projektu odstranit a podle potřeby zrušit u poskytovatelů; nikdy je nekopírujte do Gitu.

Komerční použití tohoto webu vyžaduje vhodný Vercel tarif: Hobby je určen pouze osobnímu nekomerčnímu použití. Formspree Free má aktuálně 50 odeslání za měsíc; vyčerpání a antispam mohou odmítnout zprávu. Formspree neobchází pravidla hostingu.

## Vercel Web Analytics bez povolovacího panelu

Automatické základní pageviews pouze na https://www.edomb.cz v produkčním buildu. Zachován plain HTML přístup, žádný Next.js/React a žádné nové dependencies. Oficiální fronta window.va s beforeSend se registruje před načtením /_vercel/insights/script.js; tato cesta je stále podporovaná dle Vercel quickstart vedle nové unique-path. Měření selže nezávisle na formuláři.

Před zveřejněním otevřete cílový Vercel projekt → Analytics → Enable. Potom je potřeba nový autorizovaný deployment tohoto balíčku. Ověřte skript HTTP200, jednu událost návštěvy a data v dashboardu. Při přípravě U30 starý veřejný analytics endpoint vracel404; nový kód zatím není nasazen a live měření ani dashboard nejsou ověřené. Nepřidávejte zároveň druhý analytics snippet nebo React Analytics komponentu: zdvojila by měření.

Panel v patičkách byl odstraněn. Vypnutí/znovuzapnutí je pouze na soukromi.html#analytika. Předchozí odmítnutí respektujeme i po staré183denní expiraci. Volba zůstává do změny či smazání úložiště; při chybě čtení/zápisu se měření zablokuje. DNT/GPC nelze přebít tlačítkem. Odmítnutí zastaví také události již načteného skriptu, včetně ostatních karet se sdíleným úložištěm. Neodstraňuje dřívější souhrnné údaje. V local/Preview/unknown URL se provider vůbec nenačítá. Žádné formfields/custom events/Meta pixel/Speed Insights. URL se čistí od query/hash a citlivé referrery blokují měření ještě před načtením skriptu.

Automatický režim je majitelem požadovaná technická volba, nikoli závěr o automatickém právním souladu jen proto, že analytika nemá cookies. Správce musí před spuštěním posoudit a doložit účel, nezbytnost a vyvážení oprávněného zájmu, informační povinnost, dodavatelské vztahy, přenosy a retenci. Podle výsledku posouzení musí skutečný provoz i privacy text upravit. Měření zachytí jen návštěvy, kterým nebrání optout, prohlížeč nebo blokátory, nikoli zaručeně všechny návštěvníky.

## SEO a předání

Primární adresa je https://www.edomb.cz/ — read-only kontrola10.10.2026 potvrdila přesměrování edomb.cz308 na www. Canonical, OG, robots a sitemap tuto adresu sjednocují. Sitemap obsahuje jen indexovatelnou homepage: https://www.edomb.cz/sitemap.xml. Sekundární/legacy stránky mají noindex,follow; Preview build noindex,nofollow a robotsDisallow. 404 nemá canonicalhomepage ani cizí OG URL. Existující týmová fotografie doplňuje social metadata, lokální firemní údaje nebyly domýšleny. Instagram je prostý odkaz na @edo_mb.official, bez vloženého feedu či sledovacích skriptů.

Po schváleném nasazení ověřte HTTPS, přesměrování, HTTP404, metadata a sitemap. Vlastník může ověřit web v Google Search Console a ručně odeslat https://www.edomb.cz/sitemap.xml. Tento ZIP nevytváří Search Console účet ani DNSověření; nezaručuje indexaci, čas zařazení či pozice. WebSite/LocalBusiness schema není nutné pro tuto cílenou opravu; nebyly přidány neověřené review/rating/oblastpůsobnosti.

Formulář předává údaje Formspree, které je ukládá a posílá notifikaci do schránky. Šestiměsíční pravidlo pro neúspěšné poptávky vyžaduje správu výmazu kopií ve Formspree i v e-mailech. Před produkcí ověřit příjemce, technického provozovatele pošty, DPA/předávání mimo EHP, logy/zálohy/retence, mediální a profesní podklady. ZIP není právní posudek ani ověření skutečného doručení. Cloud routing, hlavičky, HTTPS, DNS a test přijetí ve schránce vyžadují následnou kontrolu po samostatně schváleném nasazení.

Dokumentace: https://formspree.io/html/
https://help.formspree.io/articles/account-management/account-limits/
https://formspree.io/legal/privacy-policy/
https://vercel.com/docs/plans/hobby
https://vercel.com/docs/analytics/quickstart
https://vercel.com/docs/analytics/redacting-sensitive-data
https://vercel.com/docs/analytics/privacy-policy
