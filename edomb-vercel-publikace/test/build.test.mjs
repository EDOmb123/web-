import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run = promisify(execFile);
test('build deterministically restores robots in preview→production and production→preview orders', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const dir = await mkdtemp(`${tmpdir()}/edomb-build-`);
  try {
    await cp(`${root}/public`, `${dir}/public`, { recursive: true });
    await cp(`${root}/scripts`, `${dir}/scripts`, { recursive: true });
    for (const mode of ['preview', 'production', 'production', 'preview', 'production']) {
      await run(process.execPath, ['scripts/build.mjs'], { cwd: dir, env: { ...process.env, VERCEL_ENV: mode } });
      for (const name of await readdir(`${dir}/public`)) if (name.endsWith('.html')) {
        const html = await readFile(`${dir}/public/${name}`, 'utf8');
        const expected = mode === 'preview' ? 'noindex,nofollow' : name === 'index.html' ? 'index,follow' : 'noindex,follow';
        assert.equal(html.match(/<meta name="robots" content="([^"]*)">/)[1], expected, `${mode}: ${name}`);
        assert.equal(html.match(/<meta name="deployment-environment" content="([^"]*)">/)[1], mode === 'preview' ? 'preview' : 'production');
      }
      const robots = await readFile(`${dir}/public/robots.txt`, 'utf8');
      assert.equal(robots, mode === 'preview' ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n\nSitemap: https://www.edomb.cz/sitemap.xml\n');
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
