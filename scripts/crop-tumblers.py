"""Crop skinny-tumbler marketing frames down to the product."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "incoming"
OUT = ROOT / "public" / "products" / "skinny-tumblers"

# Drop WA source files into assets/incoming/ before running.
JOBS: list[tuple[str, str, str, dict[str, float | int]]] = [
    ("brother", "brother", "WA0114", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("charmaine-family", "charmaine-family", "WA0115", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("charmaine-baby", "charmaine-baby", "WA0116", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("snethemba", "snethemba", "WA0117", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("girlfriend-birthday", "girlfriend-birthday", "WA0118", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("judz", "judz", "WA0119", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("carel", "carel", "WA0120", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("to-my-sister", "to-my-sister", "WA0121", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("luca-van-den-berg", "luca-van-den-berg", "WA0122", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("mom", "mom", "WA0123", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("dad-legend", "dad-legend", "WA0124", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("pj-klipdrift", "pj-klipdrift", "WA0125", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
    ("milandri", "milandri", "WA0126", {"y_max": 0.72, "min_run": 55, "ink": 16, "grow": 24}),
]


def find_source(code: str, stem: str) -> Path | None:
    explicit = ASSETS / f"{stem}-source.jpg"
    if explicit.exists():
        return explicit
    matches = sorted(ASSETS.glob("*.jpg"), key=lambda path: path.stat().st_mtime)
    for path in matches:
        if f"-{code}-" in path.name or path.name.startswith(code):
            return path
    return None


def crop_runs(path: Path, dest: Path, **options: float | int) -> None:
    image = Image.open(path).convert("RGB")
    width, height = image.size
    pixels = image.load()
    y_max = float(options.get("y_max", 0.72))
    x_min = float(options.get("x_min", 0.03))
    x_max = float(options.get("x_max", 0.97))
    min_run = int(options.get("min_run", 55))
    ink = int(options.get("ink", 16))
    grow = int(options.get("grow", 24))
    rows: list[tuple[int, int, int]] = []
    x0, x1 = int(width * x_min), int(width * x_max)
    y1 = int(height * y_max)
    for y in range(int(height * 0.04), y1):
        run = best = 0
        start = best_start = best_end = 0
        for x in range(x0, x1):
            r, g, b = pixels[x, y]
            if r >= ink or g >= ink or b >= ink:
                if run == 0:
                    start = x
                run += 1
                if run > best:
                    best = run
                    best_start = start
                    best_end = x
            else:
                run = 0
        if best < min_run:
            continue
        rows.append((y, best_start, best_end))
    if not rows:
        raise RuntimeError(f"No product rows found in {path.name}")
    left = min(row[1] for row in rows)
    right = max(row[2] for row in rows)
    top = rows[0][0]
    bottom = rows[-1][0]
    if grow:
        left, top, right, bottom = expand(pixels, width, height, left, top, right, bottom, y1, ink, grow)
    pad = 12
    box = (
        max(0, left - pad),
        max(0, top - pad),
        min(width, right + pad + 1),
        min(height, bottom + pad + 1),
    )
    cropped = image.crop(box)
    if cropped.height < 250:
        raise RuntimeError(f"Crop for {path.name} is too short ({cropped.height}px) — check the source frame.")
    dest.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(dest, quality=90, optimize=True)
    print(dest.name, cropped.size)


def expand(pixels, width, height, left, top, right, bottom, y1, ink, grow):
    for _ in range(grow):
        changed = False
        if left > 1:
            for y in range(top, bottom):
                r, g, b = pixels[left - 1, y]
                if r >= ink or g >= ink or b >= ink:
                    left -= 1
                    changed = True
                    break
        if right < width - 2:
            for y in range(top, min(bottom, y1)):
                r, g, b = pixels[right + 1, y]
                if r >= ink or g >= ink or b >= ink:
                    right += 1
                    changed = True
                    break
        if top > int(height * 0.03):
            for x in range(left, right):
                r, g, b = pixels[x, top - 1]
                if r >= ink or g >= ink or b >= ink:
                    top -= 1
                    changed = True
                    break
        if bottom < y1 - 1:
            for x in range(left, right):
                r, g, b = pixels[x, bottom + 1]
                if r >= ink or g >= ink or b >= ink:
                    bottom += 1
                    changed = True
                    break
        if not changed:
            break
    return left, top, right, bottom


def main() -> None:
    if not ASSETS.exists():
        ASSETS.mkdir(parents=True, exist_ok=True)
        print(f"Created {ASSETS}. Drop WA source JPGs there and run again.")
        return
    for _name, file_stem, code, options in JOBS:
        source = find_source(code, file_stem)
        if source is None:
            print("missing", code, f"(drop {file_stem}-source.jpg or *-{code}-*.jpg in assets/incoming/)")
            continue
        crop_runs(source, OUT / f"{file_stem}.jpg", **options)


if __name__ == "__main__":
    main()
