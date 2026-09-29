"""Crop coasters, the mousepad, and the bar mat down to the product."""

import math
from pathlib import Path

from PIL import Image

ASSETS = Path(r"C:\Users\User\.cursor\projects\d-Lowveldweb-Inkand-identity\assets")
OUT = Path(r"d:\Lowveldweb\Inkand identity\public\products")

JOBS = [
    ("coasters", "ac-fitness", "WA0134", False, {}),
    ("coasters", "brother-alone", "WA0136", True, {}),
    ("coasters", "drinks-are-on-me", "WA0135", True, {}),
    ("coasters", "old-but-cool-dad", "WA0137", True, {}),
    ("coasters", "braver-stronger-loved", "WA0138", True, {}),
    ("coasters", "always-my-mom", "WA0139", True, {}),
    ("coasters", "colour-girl", "WA0140", True, {}),
    ("coasters", "brother-in-law", "WA0142", True, {}),
    ("coasters", "judz", "WA0143", True, {}),
    ("coasters", "tristan", "WA0145", True, {}),
    ("coasters", "vacation", "WA0141", True, {}),
    ("coasters", "family", "WA0147", True, {}),
    ("coasters", "ouma-girlfriend", "WA0146", True, {}),
    ("coasters", "luhan-all-blacks", "WA0148", True, {}),
    ("coasters", "luhan-twane", "WA0150", True, {}),
    ("coasters", "w-monogram", "WA0149", True, {}),
    ("coasters", "apex-wellness", "WA0152", False, {"ink": 18, "y_max": 0.78}),
    ("coasters", "she-is-worthy", "WA0155", True, {"y_max": 0.58}),
    ("coasters", "chris", "WA0154", True, {"x_min": 0.22, "y_max": 0.70, "min_run": 160}),
    ("coasters", "manzelle-kobus", "WA0151", False, {}),
    ("mousepads", "sunset-couple", "WA0153", False, {"y_max": 0.68, "x_max": 0.86, "min_run": 180}),
    ("bar-mats", "photo-collage", "WA0133", False, {"y_max": 0.68, "min_run": 240}),
]


def find_source(code: str) -> Path:
    matches = [path for path in ASSETS.glob("*.jpg") if f"-{code}-" in path.name]
    if not matches:
        raise FileNotFoundError(code)
    return matches[-1]


def crop_runs(
    path: Path,
    dest: Path,
    y_max: float = 0.74,
    x_min: float = 0.06,
    x_max: float = 0.96,
    min_run: int = 110,
    ink: int = 26,
) -> None:
    image = Image.open(path).convert("RGB")
    width, height = image.size
    pixels = image.load()
    rows: list[tuple[int, int, int]] = []
    x0, x1 = int(width * x_min), int(width * x_max)
    for y in range(int(height * 0.05), int(height * y_max)):
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
        if best >= min_run:
            rows.append((y, best_start, best_end))
    if not rows:
        raise RuntimeError(path.name)
    pad = 10
    box = (
        max(0, min(row[1] for row in rows) - pad),
        max(0, rows[0][0] - pad),
        min(width, max(row[2] for row in rows) + pad + 1),
        min(height, rows[-1][0] + pad + 1),
    )
    dest.parent.mkdir(parents=True, exist_ok=True)
    cropped = image.crop(box)
    cropped.save(dest, quality=92, optimize=True)
    print(dest.name, cropped.size)


def _unused_solid_points(
    image: Image.Image,
    y_max: float = 0.74,
    x_min: float = 0.05,
    x_max: float = 0.95,
    ink: int = 28,
) -> list[tuple[int, int]]:
    width, height = image.size
    pixels = image.load()
    step = 4
    raw: list[tuple[int, int]] = []
    y1 = int(height * y_max)
    x0 = int(width * x_min)
    x1 = int(width * x_max)
    for y in range(int(height * 0.05), y1, step):
        if y > height * 0.6 and False:
            continue
        for x in range(x0, x1, step):
            if y > height * 0.6 and x < width * 0.38:
                continue
            r, g, b = pixels[x, y]
            if r < ink and g < ink and b < ink:
                continue
            raw.append((x, y))
    raw_set = set(raw)
    solid: list[tuple[int, int]] = []
    for x, y in raw:
        near = 0
        for dy in range(-step * 3, step * 4, step):
            for dx in range(-step * 3, step * 4, step):
                if (x + dx, y + dy) in raw_set:
                    near += 1
        if near >= 28:
            solid.append((x, y))
    return solid or raw


def save_box(image: Image.Image, box: tuple[int, int, int, int], dest: Path, circle: bool) -> None:
    width, height = image.size
    left, top, right, bottom = box
    left, top = max(0, left), max(0, top)
    right, bottom = min(width, right), min(height, bottom)
    cropped = image.crop((left, top, right, bottom)).convert("RGB")
    if circle:
        pixels = cropped.load()
        cw, ch = cropped.size
        cx, cy = cw / 2, ch / 2
        radius = min(cw, ch) / 2 - 2
        for y in range(ch):
            for x in range(cw):
                if (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2:
                    pixels[x, y] = (0, 0, 0)
    dest.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(dest, quality=92, optimize=True)
    print(dest.name, cropped.size)


def crop_circle(path: Path, dest: Path, **options: float) -> None:
    image = Image.open(path).convert("RGB")
    points = solid_points(image, **options)
    if len(points) < 20:
        raise RuntimeError(path.name)
    cx = sum(point[0] for point in points) / len(points)
    cy = sum(point[1] for point in points) / len(points)
    dists = sorted(math.hypot(x - cx, y - cy) for x, y in points)
    radius = dists[int(len(dists) * 0.98)] + 10
    box = (int(cx - radius), int(cy - radius), int(cx + radius), int(cy + radius))
    save_box(image, box, dest, circle=True)


def crop_rect(path: Path, dest: Path, **options: float) -> None:
    image = Image.open(path).convert("RGB")
    points = solid_points(image, **options)
    if len(points) < 20:
        raise RuntimeError(path.name)
    pad = 14
    box = (
        min(point[0] for point in points) - pad,
        min(point[1] for point in points) - pad,
        max(point[0] for point in points) + pad,
        max(point[1] for point in points) + pad,
    )
    save_box(image, box, dest, circle=False)


def main() -> None:
    for folder, name, code, _circle, options in JOBS:
        crop_runs(find_source(code), OUT / folder / f"{name}.jpg", **options)


if __name__ == "__main__":
    main()
