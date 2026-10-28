// Local fixture ONLY: neither Redis nor mail provider is contacted.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const port=Number(process.env.PREVIEW_PORT || 4211), root=resolve('public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.xml':'application/xml','.txt':'text/plain'};
const conf=JSON.parse(await readFile('vercel.json','utf8'));
http.createServer(async(req,res)=>{
 const url=new URL(req.url,`http://127.0.0.1:${port}`);
 for(const h of conf.headers[0].headers)res.setHeader(h.key,h.value.replace('form-action https://formspree.io', "form-action 'self'"));
 if(url.pathname==='/__form-fixture' && req.method==='POST') {
  // Consume locally without persistence, forwarding or outputting submitted data.
  for await (const chunk of req) { void chunk; }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.end('<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Místní test formuláře</title><h1>Místní test formuláře</h1><p>Testovací POST byl přijat pouze na tomto počítači. Žádný e-mail nebyl odeslán; skutečné potvrzení a CAPTCHA Formspree nejsou simulovány.</p><a href="/#kontakt">Zpět ke kontaktu</a></html>'); return;
 }
 if(req.method!=='GET' && req.method!=='HEAD' && url.pathname!=='/_vercel/insights/view'){res.writeHead(405);res.end();return;}
 if(url.pathname==='/_vercel/insights/script.js') {
  // Reproduce documented beforeSend contract; visible logs contain only sanitized payloads.
  res.setHeader('Content-Type','text/javascript');res.end(`(()=>{let hook=e=>e;const q=window.vaq||[];window.va=(cmd,fn)=>{if(cmd==='beforeSend')hook=fn};q.forEach(args=>window.va(...args));window.__analyticsFixture={emit:(url=location.href)=>{const event=hook({type:'pageview',url});if(event)fetch('/_vercel/insights/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event)});return event}};window.__analyticsFixture.emit()})();`);return;
 }
 if(url.pathname==='/_vercel/insights/view'){res.writeHead(204);res.end();return;}
 const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
 let data,status=200;
 try {if(!path.startsWith(root+'/'))throw Error();data=await readFile(path);}catch{data=await readFile(root+'/404.html');status=404;}
 if((status===404||extname(path)==='.html')) data=Buffer.from(data.toString().replaceAll('form-action https://formspree.io', "form-action 'self'").replace('action="https://formspree.io/f/xdeazgld"', 'action="/__form-fixture"').replace(/<body\b[^>]*>/i, '$&<p role="note" class="wrap">Místní testovací náhled — formulář neposílá skutečné e-maily a návštěvnost se neměří.</p>'));
 res.setHeader('Content-Type',types[extname(status===404?'404.html':path)]||'application/octet-stream');res.writeHead(status);res.end(data);
}).listen(port,'127.0.0.1',()=>console.log(`LOCAL FIXTURE ONLY http://127.0.0.1:${port}; no real emails/analytics/Formspree`));
