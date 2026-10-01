# Product source photos

Drop the original WhatsApp marketing JPGs here (for example `WhatsApp Image 2026-...-WA0114-.jpg`), then run:

```bash
python3 scripts/crop-tumblers.py
python3 scripts/normalize-product-images.py
```

The Brother tumbler photo is currently broken because only the lid strip was saved. It needs its original WA source frame re-cropped with the script above.
