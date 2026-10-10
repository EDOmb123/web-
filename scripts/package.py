#!/usr/bin/env python3
"""Reproducible source ZIP. Run from this standalone project or its parent."""
from pathlib import Path
import hashlib, json, zipfile, argparse
root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', default='finance-web-github-u30.zip')
parser.add_argument('--manifest', default='vercel-manifest.json')
args = parser.parse_args()
allowed_roots = {'public', 'scripts', 'test'}
allowed_files = {'package.json', 'vercel.json', 'README.md', '.gitignore'}
files = sorted(p for p in root.rglob('*') if p.is_file() and (p.relative_to(root).parts[0] in allowed_roots or p.relative_to(root).as_posix() in allowed_files))
for p in files:
    assert not p.is_symlink()
    assert p.name != '.env' and p.suffix not in {'.php', '.zip'}
records = [{'path':p.relative_to(root).as_posix(), 'bytes':p.stat().st_size, 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]
with zipfile.ZipFile(args.output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for p in files:
        info=zipfile.ZipInfo(p.relative_to(root).as_posix(), date_time=(2026,10,10,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        info.external_attr=0o100644 << 16
        z.writestr(info,p.read_bytes())
with zipfile.ZipFile(args.output) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(files)
    for record in records:
        assert hashlib.sha256(z.read(record['path'])).hexdigest() == record['sha256']
result={'files':records,'zip':{'name':Path(args.output).name,'bytes':Path(args.output).stat().st_size,'sha256':hashlib.sha256(Path(args.output).read_bytes()).hexdigest()},'zip_crc':'PASS'}
Path(args.manifest).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'files':len(records),'zip':result['zip'],'crc':'PASS'}))
