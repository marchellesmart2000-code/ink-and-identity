"""Reframe coffee mug photos so mugs fill the shop canvas instead of thin strips."""

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

# Mug+coaster set photos are already tall enough — only reframe the wide mug rows.
SKIP = {
    "chris-adventure-set.jpg",
    "gideon-mug-coaster.jpg",
    "hannie-mug-coaster.jpg",
    "landie-mug-coaster.jpg",
}

# Prefer a specific third of wide marketing crops (0=left, 1=centre, 2=right).
PREFERRED_THIRD: dict[str, int] = {
    "worthy-bow-mugs.jpg": 2,  # "She is Worthy" text
    "juf-anneke-mugs.jpg": 0,  # "Juf Anneke" name
    "kobus-mugs.jpg": 1,
    "manzelle-mugs.jpg": 1,
    "secret-mike-mugs.jpg": 1,
    "apex-wellness-mugs.jpg": 1,
    "chris-hunt-mugs.jpg": 1,
}


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
    """Find the main horizontal mug band, ignoring noisy top rows and reflections."""
    width, height = image.size
    pixels = image.load()
    min_run = max(80, int(width * 0.12))
    rows: list[tuple[int, int, int]] = []

    for y in range(int(height * 0.05), int(height * 0.92)):
        run = best = 0
        start = best_start = best_end = 0
        for x in range(int(width * 0.02), int(width * 0.98)):
            pixel = pixels[x, y]
            if not is_ink(pixel):
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
        # Ignore isolated logo / smoke rows near the top corners.
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


def trim_reflection(image: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Drop the mirror reflection under a mug on glossy black."""
    left, top, right, bottom = box
    pixels = image.load()
    widths: list[tuple[int, int]] = []
    for y in range(top, bottom + 1):
        run = 0
        for x in range(left, right + 1):
            if not is_ink(pixels[x, y]):
                run += 1
        widths.append((y, run))

    if len(widths) < 8:
        return box

    body_width = sorted(width for _, width in widths[: len(widths) // 2])[
        len(widths) // 4
    ]
    cutoff = bottom
    for y, row_width in widths:
        if y > top + 40 and row_width > body_width * 1.45:
            cutoff = max(top + 20, y - 8)
            break

    return left, top, right, min(bottom, cutoff)


def trim_glitch_top(image: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Drop corrupted scan-line noise above the mug (homosapien source)."""
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


def trim_horizontal_padding(
    image: Image.Image, box: tuple[int, int, int, int]
) -> tuple[int, int, int, int]:
    """Remove dead black columns inside a mug crop."""
    left, top, right, bottom = box
    pixels = image.load()
    active: list[int] = []
    y0 = top + (bottom - top) // 6
    y1 = bottom - (bottom - top) // 8
    for x in range(left, right + 1):
        count = sum(1 for y in range(y0, y1 + 1) if not is_ink(pixels[x, y]))
        if count > (y1 - y0 + 1) * 0.08:
            active.append(x)
    if not active:
        return box
    pad = 10
    return (
        max(0, active[0] - pad),
        top,
        min(image.size[0], active[-1] + pad + 1),
        bottom,
    )


def pick_single_mug(image: Image.Image, box: tuple[int, int, int, int], third: int) -> tuple[int, int, int, int]:
    left, top, right, bottom = box
    crop_w = right - left
    crop_h = bottom - top
    if crop_w / max(crop_h, 1) < 1.55:
        return box

    third_w = crop_w // 3
    idx = max(0, min(2, third))
    mug_left = left + idx * third_w
    mug_right = mug_left + third_w if idx < 2 else right
    return mug_left, top, mug_right, bottom


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
    if cropped.height < 180:
        raise RuntimeError(f"Content too short ({cropped.height}px)")

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
        left, top, right, bottom = box
        box = (left, top, right, min(bottom, 238))
    third = PREFERRED_THIRD.get(name, 1)
    box = pick_single_mug(source, box, third)
    if name != "homosapien-mug.jpg":
        box = trim_reflection(source, box)
    box = trim_horizontal_padding(source, box)
    return normalize(source.crop(box))


def main() -> None:
    for path in sorted(ROOT.glob("*.jpg")):
        if path.name in SKIP:
            print(f"skip {path.name}")
            continue
        try:
            output = reframe(path.name)
            output.save(path, quality=90, optimize=True)
            print(f"ok  {path.name}")
        except Exception as error:
            print(f"err {path.name}: {error}")


if __name__ == "__main__":
    main()
