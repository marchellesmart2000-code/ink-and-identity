"""Normalize product photos onto a consistent 4:5 canvas for the shop."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "products"
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


def normalize(path: Path) -> tuple[str, tuple[int, int]]:
    image = Image.open(path).convert("RGB")
    cropped = image.crop(content_box(image))
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
    canvas.save(path, quality=90, optimize=True)
    return path.name, canvas.size


def main() -> None:
    paths = sorted(path for path in ROOT.rglob("*.jpg") if path.is_file())
    for path in paths:
        try:
            name, size = normalize(path)
            print(f"ok  {name:40} -> {size[0]}x{size[1]}")
        except Exception as error:
            print(f"err {path.relative_to(ROOT)}: {error}")


if __name__ == "__main__":
    main()
