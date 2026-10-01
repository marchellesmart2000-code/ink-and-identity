# Product source photos

Drop the original WhatsApp marketing JPGs here, then run the matching crop script.

```bash
python3 scripts/crop-incoming-products.py
python3 scripts/crop-tumblers.py
python3 scripts/normalize-product-images.py
```

Saved sources:

- `worthy-bow-mugs-source.jpg` — She is Worthy frosted mugs
- `homosapien-mug-source.jpg` — World's Best Homosapien mug
- `ac-fitness-bottle-source.jpg` — AC Fitness bottle trio

The Brother tumbler photo is currently broken because only the lid strip was saved. It needs its original WA source frame re-cropped with `crop-tumblers.py`.
