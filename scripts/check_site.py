"""Check standalone resource links, export integrity and GitHub file sizes.

Uses only Python standard library; no original research repository is required.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        self.urls.extend(v for k, v in attrs if k in ('src', 'href') and v)


def main():
    errors = []
    for name in ('index.html', 'style.css', 'app.js', '.nojekyll', 'asset-manifest.json'):
        if not (ROOT / name).is_file():
            errors.append('Missing required file: ' + name)
    for page in ROOT.rglob('*.html'):
        if '.git' in page.relative_to(ROOT).parts:
            continue
        refs = References()
        refs.feed(page.read_text(encoding='utf-8'))
        for url in refs.urls:
            parsed = urlsplit(url)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            path = unquote(parsed.path)
            if path.startswith('/'):
                errors.append(f'{page.relative_to(ROOT)}: root-relative URL bypasses project prefix: {url}')
                continue
            target = (page.parent / path).resolve()
            if not target.is_relative_to(ROOT) or not target.is_file():
                errors.append(f'{page.relative_to(ROOT)}: missing/outside-project reference: {url}')
    manifest = ROOT / 'asset-manifest.json'
    entries = json.loads(manifest.read_text(encoding='utf-8'))['files'] if manifest.is_file() else []
    for entry in entries:
        path = (ROOT / entry['path']).resolve()
        if not path.is_relative_to(ROOT) or not path.is_file():
            errors.append('Missing manifest resource: ' + entry['path'])
            continue
        if path.stat().st_size != entry['bytes']:
            errors.append('Resource size changed: ' + entry['path'])
        if hashlib.sha256(path.read_bytes()).hexdigest() != entry['sha256']:
            errors.append('Resource SHA-256 changed: ' + entry['path'])
    script = ROOT / 'app.js'
    if script.is_file():
        for name in re.findall(r"file:\s*['\"]([^'\"]+)['\"]", script.read_text(encoding='utf-8')):
            if not (ROOT / 'demos' / name).is_file():
                errors.append('Missing interactive demo: ' + name)
    files = [p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.relative_to(ROOT).parts]
    for path in files:
        if path.stat().st_size > 100 * 1024**2:
            errors.append(f'Exceeds ordinary GitHub file size limit: {path.relative_to(ROOT)}')
    if errors:
        print('\n'.join('ERROR: ' + item for item in errors))
        return 1
    largest = max(files, key=lambda p: p.stat().st_size)
    print(f'PASS: local HTML/demo paths; {len(entries)} export sizes and SHA-256 hashes.')
    print(f'Site: {sum(p.stat().st_size for p in files)/1024**2:.1f} MiB; '
          f'largest: {largest.relative_to(ROOT)} ({largest.stat().st_size/1024**2:.1f} MiB).')
    return 0


if __name__ == '__main__':
    sys.exit(main())
