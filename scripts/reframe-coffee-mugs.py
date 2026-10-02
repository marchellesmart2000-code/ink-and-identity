"""Reframe the wide coffee-mug marketing crops that had bad top extraction.

Only touches the three mug rows called out in review. Keeps the full product
group in frame — no single-mug zoom crops.
"""

from __future__ import annotations

import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "products" / "coffee-mugs"
SOURCE_COMMIT = "a2fe798"
CANVAS = (1000, 1250)
MARGIN = 0.06
INK = 28
MIN_PAD = 20

TARGETS: dict[str, str] = {}


def is_ink(pixel: tuple[int, int, int]) -> bool:
    return pixel[0] <= INK and pixel[1] <= INK and pixel[2] <= INK


def git_source(name: str) -> Image.Image:
    result = subprocess.run(
        ["git", "show", f"{SOURCE_COMMIT}:public/products/coffee-mugs/{name}"],
        capture_output=True,
        check=True,
    )
    return Image.open(BytesIO(result.stdout)).convert("RGB")


def mug_row_box(image: Image.Image) -> tuple[int, int, int, int]:
    """Tight vertical bounds around the mug row; keep the full horizontal group."""
    width, height = image.size
    pixels = image.load()
    min_run = max(80, int(width * 0.12))
    rows: list[tuple[int, int, int]] = []

    for y in range(int(height * 0.05), int(height * 0.92)):
        run = best = 0
        start = best_start = best_end = 0
        for x in range(int(width * 0.02), int(width * 0.98)):
            if not is_ink(pixels[x, y]):
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
        if y < height * 0.35 and (best_end < width * 0.34 or best_start > width * 0.66):
            continue
        rows.append((y, best_start, best_end))

    if not rows:
        raise RuntimeError("No mug row detected")

    left = min(row[1] for row in rows)
    right = max(row[2] for row in rows)
    top = rows[0][0]
    bottom = rows[-1][0]
    pad = MIN_PAD
    return (
        max(0, left - pad),
        max(0, top - pad),
        min(width, right + pad + 1),
        min(height, bottom + pad + 1),
    )


def trim_glitch_top(image: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    left, top, right, bottom = box
    pixels = image.load()
    clean_top = top
    target_width = int((right - left) * 0.45)
    for y in range(top, min(top + 80, bottom)):
        row = [x for x in range(left, right + 1) if not is_ink(pixels[x, y])]
        if len(row) >= target_width:
            clean_top = max(top, y - 6)
            break
        clean_top = y + 1
    return left, clean_top, right, bottom


def trim_reflection(image: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    left, top, right, bottom = box
    pixels = image.load()
    widths: list[tuple[int, int]] = []
    for y in range(top, bottom + 1):
        run = sum(1 for x in range(left, right + 1) if not is_ink(pixels[x, y]))
        widths.append((y, run))

    body_width = sorted(width for _, width in widths[: len(widths) // 2])[len(widths) // 4]
    cutoff = bottom
    for y, row_width in widths:
        if y > top + 40 and row_width > body_width * 1.45:
            cutoff = max(top + 20, y - 8)
            break
    return left, top, right, min(bottom, cutoff)


def normalize(image: Image.Image) -> Image.Image:
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
    offset = ((CANVAS[0] - resized.width) // 2, (CANVAS[1] - resized.height) // 2)
    canvas.paste(resized, offset)
    return canvas


def reframe(name: str) -> Image.Image:
    source = git_source(name)
    box = mug_row_box(source)
    if name == "homosapien-mug.jpg":
        box = trim_glitch_top(source, box)
        box = trim_reflection(source, box)
    return normalize(source.crop(box))


def main() -> None:
    for name, note in TARGETS.items():
        output = reframe(name)
        output.save(ROOT / name, quality=90, optimize=True)
        print(f"ok  {name:24} {note}")


if __name__ == "__main__":
    main()
