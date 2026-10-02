"""Restore three-view mug rows from the original catalogue strips.

Use this when WA marketing sources are unavailable. Keeps all three mugs in
frame on a 4:5 canvas — no background removal or single-mug zoom.
"""

from __future__ import annotations

import importlib.util
import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "products" / "coffee-mugs"
SOURCE_COMMIT = "a2fe798"

spec = importlib.util.spec_from_file_location(
    "crop_incoming_products",
    Path(__file__).resolve().parent / "crop-incoming-products.py",
)
crop = importlib.util.module_from_spec(spec)
spec.loader.exec_module(crop)

TARGETS = {
    "juf-anneke-mugs.jpg": "Teacher mugs, three views",
    "manzelle-mugs.jpg": "Leopard print mugs, three views",
}


def git_source(name: str) -> Image.Image:
    result = subprocess.run(
        ["git", "show", f"{SOURCE_COMMIT}:public/products/coffee-mugs/{name}"],
        capture_output=True,
        check=True,
    )
    return Image.open(BytesIO(result.stdout)).convert("RGB")


def main() -> None:
    for name, note in TARGETS.items():
        source = git_source(name)
        output = crop.normalize(source)
        output.save(ROOT / name, quality=90, optimize=True)
        print(f"ok  {name:24} {note}  source {source.size} -> {crop.CANVAS}")


if __name__ == "__main__":
    main()
