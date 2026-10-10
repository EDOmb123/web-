# edomb.cz — GitHub / Vercel / Formspree U29

Statické HTML, CSS a JavaScript; žádné runtime závislosti, PHP, vlastní mail server ani API klíče. Node 24 se používá pouze pro kontroly/build. Vercel publikuje jen `public/`, nikdy kořen projektu. Design, fotografie a kontakty jsou zachovány.

## Spuštění a kontroly

- `npm run lint` — syntax JS přes `node --check`, nikoli ESLint.
- `npm test` — Node testy, bez skutečných zpráv.
- `npm run build` — kontrola veřejného výstupu a deterministické robots pro Preview/Production.
- `npm run preview` — bezpečný místní náhled http://127.0.0.1:4197. Nahrazuje action lokální testovací stránkou a CSP zakazuje externí POST. Nic neodesílá do Formspree ani e-mailem. Nikdy nepoužívat jako produkční server.
- Typecheck N/A: projekt neobsahuje TypeScript.

## Formulář

Nativní HTTPS POST na `https://formspree.io/f/xdeazgld`. JavaScript pouze vylepšuje českou validaci a blokuje dvojklik během odchodu; bez JS funguje HTML validace i POST. Formspree převezme CAPTCHA, případné chyby/kvótu a potvrzení na své stránce. Web nevytváří vlastní potvrzení doručení. Po návratu tlačítkem Zpět se ovládání obnoví. Nepřidáváme globální deduplikaci ani vlastní serverové rate limiting sliby. Honeypot `_gotcha` doplňuje ochrany Formspree; klientské limity nenahrazují ochrany poskytovatele. Vypnutá analytika formulář neblokuje.

Příjemce musí být v účtu Formspree nastaven a ověřen jako **vaclav.kunc@edofinance.cz**. Veřejný endpoint nepotvrzuje nastavení účtu ani doručení. Před spuštěním zkontrolovat formulář, e-mailovou notifikaci, aktivaci/ověření adresy a bezpečnostní nastavení poskytovatele. Referrer-Policy zůstává no-referrer; nepovolujte omezení závislé na Referer bez samostatného ověření kompatibility. Žádné skutečné testovací zprávy nebyly odeslány.

## GitHub a Vercel

Rozbalte ZIP a nahrajte **jeho obsah**, nikoli ZIP ani obalovou složku, do kořene připravované větve repozitáře. `package.json`, `vercel.json`, `public/`, `scripts/` a `test/` musí být vedle sebe. Nesmažte cizí nesouvisející soubory. Při nahrazení U28 odstraňte jeho staré `api/`, `lib/`, `.env.example` a neaktuální testy; pouhé nahrání nových souborů je nesmaže. Staré WEDOS PHP/web rozložení není výstup této verze.

Vercel: Root Directory prázdná (kořen repozitáře), Framework Other, Node 24, Build `npm run build`, Output `public`. Nenastavujte Root Directory na `public` ani `web`. Resend, Upstash ani serverové Environment Variables nejsou potřeba. Staré secrets pro tuto integraci lze z projektu odstranit a podle potřeby zrušit u poskytovatelů; nikdy je nekopírujte do Gitu.

Komerční použití tohoto webu vyžaduje vhodný Vercel tarif: Hobby je určen pouze osobnímu nekomerčnímu použití. Formspree Free má aktuálně 50 odeslání za měsíc; vyčerpání a antispam mohou odmítnout zprávu. Formspree neobchází pravidla hostingu.

## Analytika a soukromí

Zachována dobrovolná Vercel Web Analytics: zapnout v dashboardu, po autorizaci znovu nasadit. Skript se načte až po opt-in; předvolba183d, odmítnutí/odvolání, DNT/GPC a filtr citlivých URL. Bez obsahu formuláře, vlastních finančních událostí či reklamních pixelů. Měření není předpokladem odesílání a live dashboard zatím nebyl ověřen.

Formulář předává údaje Formspree, které je ukládá a posílá notifikaci do schránky. Šestiměsíční pravidlo pro neúspěšné poptávky vyžaduje správu výmazu kopií ve Formspree i v e-mailech. Před produkcí ověřit příjemce, technického provozovatele pošty, DPA/předávání mimo EHP, logy/zálohy/retence, mediální a profesní podklady. ZIP není právní posudek ani ověření skutečného doručení. Cloud routing, hlavičky, HTTPS, DNS a test přijetí ve schránce vyžadují následnou kontrolu po samostatně schváleném nasazení.

Dokumentace: https://formspree.io/html/
https://help.formspree.io/articles/account-management/account-limits/
https://formspree.io/legal/privacy-policy/
https://vercel.com/docs/plans/hobby
