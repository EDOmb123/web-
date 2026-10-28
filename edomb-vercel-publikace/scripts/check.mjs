import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
async function walk(dir) { const paths=[]; for (const entry of await readdir(dir, {withFileTypes:true})) { const path=`${dir}/${entry.name}`; if(entry.isDirectory()) paths.push(...await walk(path)); else if(/\.(m?js)$/.test(path)) paths.push(path); } return paths; }
for (const file of await walk('.')) { const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'}); if(result.status) { process.stderr.write(result.stderr); process.exit(1); } }
console.log('JavaScript syntax checks passed.');
