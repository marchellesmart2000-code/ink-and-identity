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

## Still needed (original WA marketing frames)

Drop these files here to replace the old extracted strips:

| File name | WA code | Product |
|-----------|---------|---------|
| `juf-anneke-mugs-source.jpg` | WA0106 | Teacher mugs |
| `manzelle-mugs-source.jpg` | WA0107 | Leopard print mugs |
| `*-WA0114-*.jpg` or `brother-source.jpg` | WA0114 | Brother tumbler |

The Brother tumbler currently shows a placeholder because the saved crop only contained the lid strip (158px tall) and cannot be repaired without the original frame.
