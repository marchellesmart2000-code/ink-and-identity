"""Write public/sitemap.xml from the catalogue source."""

import re
from pathlib import Path

ROOT = Path(r"d:\Lowveldweb\Inkand identity")
TEXT = (ROOT / "src/lib/catalogue.ts").read_text(encoding="utf-8") + (
    ROOT / "src/lib/catalogue-more.ts"
).read_text(encoding="utf-8")
ORIGIN = ""

categories = re.findall(
    r'slug: "([^"]+)",\n\s+name: "[^"]+",\n\s+description:',
    TEXT,
)
products = re.findall(
    r'slug: "([^"]+)",\n\s+name: "[^"]+",\n\s+(?:featured: true,\n\s+)?shortDescription:',
    TEXT,
)
products += re.findall(r'piece\(\s*\n?\s*"([^"]+)"', TEXT)
products += re.findall(r'\["([a-z0-9-]+)", "[^"]+", "[^"]+\.jpg"\]', TEXT)

static = [
    "/",
    "/services",
    "/shop",
    "/about",
    "/quote",
    "/contact",
    "/privacy",
    "/terms",
]
paths = static + [f"/shop/category/{slug}" for slug in categories] + [
    f"/shop/{slug}" for slug in products
]
seen = []
for path in paths:
    if path not in seen:
        seen.append(path)

body = "\n".join(f"  <url><loc>{ORIGIN}{path}</loc></url>" for path in seen)
xml = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f"{body}\n"
    "</urlset>\n"
)
(ROOT / "public/sitemap.xml").write_text(xml, encoding="utf-8")
print(len(seen), "urls")
