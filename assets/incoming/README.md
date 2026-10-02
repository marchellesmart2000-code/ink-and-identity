# Product source photos

Drop the original WhatsApp marketing JPGs here, then run the matching crop script.

```bash
python3 scripts/crop-incoming-products.py
python3 scripts/crop-tumblers.py
python3 scripts/restore-wide-mug-strips.py   # fallback when mug WA sources are missing
python3 scripts/normalize-product-images.py
```

## Saved sources

- `worthy-bow-mugs-source.jpg` — She is Worthy frosted mugs
- `homosapien-mug-source.jpg` — World's Best Homosapien mug
- `ac-fitness-bottle-source.jpg` — AC Fitness bottle trio
- `juf-anneke-mugs-source.jpg` — Teacher mugs (WA0106)
- `manzelle-mugs-source.jpg` — Leopard print mugs (WA0107)
- `brother-source.jpg` — Brother tumbler (WA0114)
