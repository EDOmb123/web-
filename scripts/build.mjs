import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Vercel serves only public/. Source and tests are never static output.
for (const name of await readdir(`${root}/public`)) {
  if (/\.(php|md|json|map|zip)$/.test(name) || name.startsWith('.')) throw new Error(`Unexpected public file: ${name}`);
}
const preview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');
// Always rewrite both modes: a reused workspace must not retain a prior preview's noindex.
for (const name of await readdir(`${root}/public`)) if (name.endsWith('.html')) {
  const path = `${root}/public/${name}`;
  const robots = preview ? 'noindex,nofollow' : name === 'index.html' ? 'index,follow' : 'noindex,follow';
  await writeFile(path, (await readFile(path, 'utf8')).replace(/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${robots}">`));
}
await writeFile(`${root}/public/robots.txt`, preview
  ? 'User-agent: *\nDisallow: /\n'
  : 'User-agent: *\nAllow: /\n\nSitemap: https://edomb.cz/sitemap.xml\n');
console.log('Static output verified; native Formspree form needs no serverless function.');
