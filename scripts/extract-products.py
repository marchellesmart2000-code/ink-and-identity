"""Crop marketing frames down to the product. Drops the logo, smoke, and contact line."""

from pathlib import Path

from PIL import Image

ASSETS = Path(r"C:\Users\User\.cursor\projects\d-Lowveldweb-Inkand-identity\assets")
OUT = Path(r"d:\Lowveldweb\Inkand identity\public\products")

JOBS = [
    ("key-rings", "photo-keyring", "WA0087"),
    ("key-rings", "bottle-opener-keyring", "WA0091"),
    ("key-rings", "raptors-fitness-keyrings", "WA0088"),
    ("key-rings", "faith-hope-love", "WA0101"),
    ("dog-tags", "bone-tags-vlooi-filla", "WA0096"),
    ("dog-tags", "bone-tags-bailey-bennie", "WA0095"),
    ("dog-tags", "bone-tags-hassie", "WA0098"),
    ("dog-tags", "bone-tags-ava", "WA0100"),
    ("dog-tags", "paw-tag-vlooi", "WA0092"),
    ("dog-tags", "bone-tags-blue", "WA0099"),
    ("dog-tags", "bone-tag-riley", "WA0094"),
    ("dog-tags", "paw-tag-rosie", "WA0093"),
    ("coffee-mugs", "photo-mug", "WA0102"),
    ("coffee-mugs", "secret-mike-mugs", "WA0109"),
    ("coffee-mugs", "kobus-mugs", "WA0108"),
    ("coffee-mugs", "manzelle-mugs", "WA0107"),
    ("coffee-mugs", "juf-anneke-mugs", "WA0106"),
    ("coffee-mugs", "homosapien-mug", "WA0104"),
    ("coffee-mugs", "worthy-bow-mugs", "WA0103"),
    ("coffee-mugs", "apex-wellness-mugs", "WA0110"),
    ("coffee-mugs", "chris-hunt-mugs", "WA0105"),
]


def find_source(code: str) -> Path:
    matches = list(ASSETS.glob(f"*{code}*.jpg"))
    if not matches:
        raise FileNotFoundError(code)
    return matches[0]


def is_ink(pixel: tuple[int, int, int]) -> bool:
    r, g, b = pixel
    return r < 28 and g < 28 and b < 28


def crop(path: Path, dest: Path) -> None:
    image = Image.open(path).convert("RGB")
    width, height = image.size
    pixels = image.load()
    min_x, min_y, max_x, max_y = width, height, 0, 0
    for y in range(height):
        if y > height * 0.72:
            continue
        for x in range(width):
            if y > height * 0.58 and x < width * 0.46:
                continue
            if y < height * 0.42 and x > width * 0.58:
                continue
            if is_ink(pixels[x, y]):
                continue
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)
    if max_x <= min_x or max_y <= min_y:
        raise RuntimeError(f"No product found in {path.name}")
    pad = 28
    box = (
        max(0, min_x - pad),
        max(0, min_y - pad),
        min(width, max_x + pad + 1),
        min(height, max_y + pad + 1),
    )
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.crop(box).save(dest, quality=92, optimize=True)
    print(dest.name, image.crop(box).size)


def main() -> None:
    for folder, name, code in JOBS:
        crop(find_source(code), OUT / folder / f"{name}.jpg")


if __name__ == "__main__":
    main()
