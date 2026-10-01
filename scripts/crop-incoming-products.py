"""Crop WA marketing frames dropped in assets/incoming/ down to the product."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

INCOMING = Path(__file__).resolve().parents[1] / "assets" / "incoming"
ROOT = Path(__file__).resolve().parents[1] / "public" / "products"
CANVAS = (1000, 1250)
MARGIN = 0.06
INK = 28
MIN_PAD = 24


def is_ink(pixel: tuple[int, int, int]) -> bool:
    return pixel[0] <= INK and pixel[1] <= INK and pixel[2] <= INK


def crop_runs(image: Image.Image, **options: float | int) -> Image.Image:
    width, height = image.size
    pixels = image.load()
    y_max = float(options.get("y_max", 0.72))
    x_min = float(options.get("x_min", 0.03))
    x_max = float(options.get("x_max", 0.97))
    min_run = int(options.get("min_run", 80))
    ink = int(options.get("ink", 26))
    lid = float(options.get("lid", 0))
    pad = int(options.get("pad", 16))
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
        raise RuntimeError("No product row detected")
    left = min(row[1] for row in rows)
    right = max(row[2] for row in rows)
    top = rows[0][0]
    bottom = rows[-1][0]
    if lid:
        top = max(int(height * 0.04), top - int((bottom - top) * lid))
    return image.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(width, right + pad + 1),
            min(height, bottom + pad + 1),
        )
    )


def normalize(image: Image.Image, *, y_offset: int = 0) -> Image.Image:
    width, height = image.size
    pixels = image.load()
    min_x, min_y, max_x, max_y = width, height, 0, 0
    for y in range(height):
        for x in range(width):
            if is_ink(pixels[x, y]):
                continue
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)
    pad = max(MIN_PAD, int(max(width, height) * 0.04))
    cropped = image.crop(
        (
            max(0, min_x - pad),
            max(0, min_y - pad),
            min(width, max_x + pad + 1),
            min(height, max_y + pad + 1),
        )
    )
    canvas = Image.new("RGB", CANVAS, (0, 0, 0))
    max_w = int(CANVAS[0] * (1 - MARGIN * 2))
    max_h = int(CANVAS[1] * (1 - MARGIN * 2))
    scale = min(max_w / cropped.width, max_h / cropped.height)
    resized = cropped.resize(
        (max(1, int(cropped.width * scale)), max(1, int(cropped.height * scale))),
        Image.Resampling.LANCZOS,
    )
    offset = (
        (CANVAS[0] - resized.width) // 2,
        max(0, (CANVAS[1] - resized.height) // 2 - y_offset),
    )
    canvas.paste(resized, offset)
    return canvas


JOBS = [
    {
        "source": "worthy-bow-mugs-source.jpg",
        "dest": ROOT / "coffee-mugs" / "worthy-bow-mugs.jpg",
        "crop": lambda image: crop_runs(image, y_max=0.68, min_run=100, pad=20),
    },
    {
        "source": "homosapien-mug-source.jpg",
        "dest": ROOT / "coffee-mugs" / "homosapien-mug.jpg",
        "crop": lambda image: image.crop((334, 35, 861, 640)),
        "normalize": {"y_offset": 48},
    },
    {
        "source": "ac-fitness-bottle-source.jpg",
        "dest": ROOT / "water-bottles" / "ac-fitness-bottle.jpg",
        "crop": lambda image: image.crop((175, 255, 785, 795)),
    },
]


def main() -> None:
    for job in JOBS:
        source_path = INCOMING / job["source"]
        if not source_path.exists():
            raise FileNotFoundError(source_path)
        image = Image.open(source_path).convert("RGB")
        cropped = job["crop"](image)
        output = normalize(cropped, **job.get("normalize", {}))
        job["dest"].parent.mkdir(parents=True, exist_ok=True)
        output.save(job["dest"], quality=90, optimize=True)
        print(f"ok  {job['dest'].relative_to(ROOT.parents[1])}  crop {cropped.size}")


if __name__ == "__main__":
    main()
