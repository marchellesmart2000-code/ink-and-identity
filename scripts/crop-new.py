"""Crop the latest sublimation frames down to the product."""

from pathlib import Path

from PIL import Image

ASSETS = Path(r"C:\Users\User\.cursor\projects\d-Lowveldweb-Inkand-identity\assets")
OUT = Path(r"d:\Lowveldweb\Inkand identity\public\products")
BADGE = Path(r"d:\Lowveldweb\Inkand identity\public\brand\lowveld-web-badge.png")

JOBS = [
    ("pillows", "eksteen-family", "WA0168", {"y_max": 0.70, "min_run": 160}),
    ("pillows", "eksteen-dogs", "WA0161", {"y_max": 0.74, "min_run": 140}),
    ("clocks", "family-photo", "WA0166", {"y_max": 0.70, "min_run": 70, "ink": 42}),
    ("can-coolers", "mikayla", "WA0158", {"y_max": 0.74, "min_run": 70}),
    ("can-coolers", "super-aj", "WA0171", {"y_max": 0.70, "min_run": 60, "scrub": 1}),
    ("beer-mugs", "braai-drinking", "WA0169", {"y_max": 0.78, "min_run": 36, "ink": 12, "grow": 36}),
    ("gift-sets", "diana", "WA0165", {"y_max": 0.74, "min_run": 60}),
    ("frosted-glasses", "brandy-collection", "WA0160", {"y_max": 0.74, "min_run": 50}),
    ("dog-tags", "luca-army", "WA0159", {"y_max": 0.70, "min_run": 28, "ink": 22, "grow": 70}),
    ("can-coolers", "raptors", "WA0157", {"y_max": 0.74, "min_run": 40, "ink": 16}),
    ("can-coolers", "ac-fitness-cans", "WA01561", {"y_max": 0.74, "min_run": 40, "ink": 16}),
    ("coffee-mugs", "gideon-mug-coaster", "WA0176", {"y_max": 0.74, "min_run": 60, "scrub": 1}),
    ("coffee-mugs", "chris-adventure-set", "WA0175", {"y_max": 0.72, "x_max": 0.995, "min_run": 40, "ink": 18, "scrub": 1}),
    ("coffee-mugs", "landie-mug-coaster", "WA0177", {"y_max": 0.74, "min_run": 60, "scrub": 1}),
    ("coffee-mugs", "hannie-mug-coaster", "WA0178", {"y_max": 0.74, "min_run": 60, "scrub": 1}),
    ("water-bottles", "merry-pebbles", "WA0127", {"y_max": 0.72, "min_run": 55, "ink": 16, "lid": 0.1}),
    ("water-bottles", "nellie", "WA0128", {"y_max": 0.72, "min_run": 55, "ink": 16, "lid": 0.1}),
    ("water-bottles", "ac-fitness-bottle", "WA0129", {"y_max": 0.72, "min_run": 55, "ink": 16, "lid": 0.1}),
    ("water-bottles", "miano-vintage", "WA0130", {"y_max": 0.72, "min_run": 55, "ink": 16, "lid": 0.1}),
    ("water-bottles", "miano-aircraft", "WA0131", {"y_max": 0.72, "min_run": 55, "ink": 16, "lid": 0.1}),
    ("water-bottles", "mother-trucker", "WA0132", {"y_max": 0.72, "min_run": 55, "ink": 16, "lid": 0.1}),
]


def find_source(code: str) -> Path | None:
    matches = [path for path in ASSETS.glob("*.jpg") if f"-{code}-" in path.name]
    return matches[-1] if matches else None


def crop_runs(path: Path, dest: Path, **options: float) -> None:
    image = Image.open(path).convert("RGB")
    width, height = image.size
    pixels = image.load()
    y_max = float(options.get("y_max", 0.72))
    x_min = float(options.get("x_min", 0.03))
    x_max = float(options.get("x_max", 0.97))
    min_run = int(options.get("min_run", 80))
    ink = int(options.get("ink", 26))
    grow = int(options.get("grow", 18))
    lid = float(options.get("lid", 0))
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
        if y < height * 0.38 and (best_end < width * 0.32 or best_start > width * 0.68):
            continue
        if y > height * 0.62 and best_end < width * 0.38:
            continue
        rows.append((y, best_start, best_end))
    if not rows:
        raise RuntimeError(path.name)
    left = min(row[1] for row in rows)
    right = max(row[2] for row in rows)
    top = rows[0][0]
    bottom = rows[-1][0]
    if grow:
        left, top, right, bottom = expand(pixels, width, height, left, top, right, bottom, y1, ink, grow)
    if lid:
        top = max(int(height * 0.04), top - int((bottom - top) * lid))
    pad = 12
    box = (
        max(0, left - pad),
        max(0, top - pad),
        min(width, right + pad + 1),
        min(height, bottom + pad + 1),
    )
    dest.parent.mkdir(parents=True, exist_ok=True)
    cropped = image.crop(box)
    cropped.save(dest, quality=84, optimize=True)
    print(dest.name, cropped.size)


def expand(pixels, width, height, left, top, right, bottom, y1, ink, grow):
    for _ in range(grow):
        changed = False
        if left > 1:
            for y in range(top, bottom):
                if y > height * 0.58 and left < width * 0.28:
                    continue
                r, g, b = pixels[left - 1, y]
                if r >= ink or g >= ink or b >= ink:
                    left -= 1
                    changed = True
                    break
        if right < width - 2 and right < width * 0.96:
            for y in range(top, min(bottom, y1)):
                r, g, b = pixels[right + 1, y]
                if y < height * 0.32 and right > width * 0.68:
                    continue
                if r >= ink or g >= ink or b >= ink:
                    right += 1
                    changed = True
                    break
        if top > int(height * 0.03):
            for x in range(left, right):
                if top < height * 0.32 and x > width * 0.68:
                    continue
                r, g, b = pixels[x, top - 1]
                if r >= ink or g >= ink or b >= ink:
                    top -= 1
                    changed = True
                    break
        if bottom < y1 - 1:
            for x in range(left, right):
                if bottom > height * 0.58 and x < width * 0.30:
                    continue
                r, g, b = pixels[x, bottom + 1]
                if r >= ink or g >= ink or b >= ink:
                    bottom += 1
                    changed = True
                    break
        if not changed:
            break
    return left, top, right, bottom


def erase_floating(image: Image.Image) -> None:
    width, height = image.size
    pixels = image.load()
    for x in range(int(width * 0.55), width):
        for y in range(int(height * 0.42)):
            r, g, b = pixels[x, y]
            if r < 30 and g < 30 and b < 30:
                continue
            below = 0
            for dy in range(10, 70, 6):
                if y + dy >= height:
                    break
                rr, gg, bb = pixels[x, y + dy]
                if rr >= 30 or gg >= 30 or bb >= 30:
                    below += 1
            if below < 4:
                pixels[x, y] = (0, 0, 0)
    for x in range(int(width * 0.32)):
        for y in range(int(height * 0.78), height):
            r, g, b = pixels[x, y]
            if r < 30 and g < 30 and b < 30:
                continue
            above = 0
            for dy in range(10, 50, 6):
                if y - dy < 0:
                    break
                rr, gg, bb = pixels[x, y - dy]
                if rr >= 30 or gg >= 30 or bb >= 30:
                    above += 1
            if above < 3:
                pixels[x, y] = (0, 0, 0)


def pad_badge() -> None:
    if not BADGE.exists():
        return
    image = Image.open(BADGE).convert("RGBA")
    background = image.getpixel((min(8, image.width - 1), 4))
    pad = 28
    canvas = Image.new("RGBA", (image.width + pad, image.height), background)
    canvas.paste(image, (pad, 0))
    canvas.save(BADGE)
    print("badge", canvas.size)


def main() -> None:
    for folder, name, code, options in JOBS:
        source = find_source(code)
        if source is None:
            print("missing", code)
            continue
        crop_runs(source, OUT / folder / f"{name}.jpg", **options)


if __name__ == "__main__":
    main()
