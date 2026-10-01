"""Reframe AC Fitness product photos that were clipped in the WA marketing crops."""

from __future__ import annotations

import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "products"
SOURCE_COMMIT = "a2fe798"
CANVAS = (1000, 1250)
MARGIN = 0.06
INK = 28
MIN_PAD = 24


def is_ink(pixel: tuple[int, int, int]) -> bool:
    return pixel[0] <= INK and pixel[1] <= INK and pixel[2] <= INK


def content_box(image: Image.Image) -> tuple[int, int, int, int]:
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
    if max_x <= min_x or max_y <= min_y:
        raise RuntimeError("No product pixels found")
    pad = max(MIN_PAD, int(max(width, height) * 0.04))
    return (
        max(0, min_x - pad),
        max(0, min_y - pad),
        min(width, max_x + pad + 1),
        min(height, max_y + pad + 1),
    )

# Original WA crops include a partial product on the left. Reframe to fully visible items.
REFRAMES = {
    "can-coolers/ac-fitness-cans.jpg": {
        "crop": (300, 0, 530, 592),
        "note": "Centre can only; partial left/right cans from WA crop removed.",
    },
}


def git_source(relative: str) -> Image.Image:
    result = subprocess.run(
        ["git", "show", f"{SOURCE_COMMIT}:public/products/{relative}"],
        capture_output=True,
        check=True,
    )
    return Image.open(BytesIO(result.stdout)).convert("RGB")


def normalize(image: Image.Image, *, pad_left: int = 0) -> Image.Image:
    cropped = image.crop(content_box(image))
    if cropped.height < 250:
        raise RuntimeError(f"Content too short ({cropped.height}px)")

    canvas = Image.new("RGB", CANVAS, (0, 0, 0))
    max_w = int(CANVAS[0] * (1 - MARGIN * 2))
    max_h = int(CANVAS[1] * (1 - MARGIN * 2))
    scale = min(max_w / cropped.width, max_h / cropped.height)
    resized = cropped.resize(
        (max(1, int(cropped.width * scale)), max(1, int(cropped.height * scale))),
        Image.Resampling.LANCZOS,
    )
    offset_x = (CANVAS[0] - resized.width) // 2 + pad_left
    offset_y = (CANVAS[1] - resized.height) // 2
    canvas.paste(resized, (offset_x, offset_y))
    return canvas


def main() -> None:
    for relative, options in REFRAMES.items():
        source = git_source(relative)
        left, top, right, bottom = options["crop"]
        reframed = source.crop((left, top, right, bottom))
        output = normalize(reframed, pad_left=int(options.get("pad_left", 0)))
        dest = ROOT / relative
        output.save(dest, quality=90, optimize=True)
        print(f"ok  {relative:40} {options['note']}")


if __name__ == "__main__":
    main()
