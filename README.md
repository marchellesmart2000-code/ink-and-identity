# Ink & Identity

A production-ready website for **Ink & Identity**, a South African custom-printing, branded-merchandise, personalised-gifting and creative product studio associated with White River / Witrivier and the wider Mpumalanga region.

This is a premium catalogue and quote-request platform. It is not a fabricated checkout. The data model is ready for payments later without rewriting products.

The public site is an editorial boutique experience. The studio CMS lives at `/admin`.

> This project is for the **local South African Ink & Identity brand only**. It is not related to the international “Ink & Identity Promos” business, its domain, or any United States contact details.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS plus a token/CSS layer
- Framer Motion
- Convex (database, file storage, server functions, auth)
- Vercel (hosting and environment variables)
- GitHub as the source repository

## Local setup

```bash
npm install
cp .env.example .env.local
npx convex dev
```

In a second terminal:

```bash
npm run dev
```

The app runs at `http://localhost:5173`. Convex prints `VITE_CONVEX_URL` — paste it into `.env.local`.

Also set:

```
VITE_SITE_URL=http://localhost:5173
SITE_URL=http://localhost:5173
```

`SITE_URL` is a **Convex dashboard** environment variable (used for Auth and the sitemap HTTP action). `VITE_SITE_URL` is a Vite variable for canonical URLs in the browser.

## Convex Auth keys

From the project root:

```bash
npx @convex-dev/auth
```

This writes `JWT_PRIVATE_KEY`, `JWKS` and `CONVEX_SITE_URL` into the Convex deployment. Never put these in Vite. Never commit them.

## First-admin bootstrap

There is **no public registration**. Staff accounts are created only by:

1. A one-time bootstrap action, or
2. An existing administrator.

In the Convex dashboard, set `ADMIN_BOOTSTRAP_TOKEN` to a long random secret.

When no admin exists, open `/admin/login`, choose **First-admin bootstrap**, and submit:

- your name
- email
- password (12+ characters)
- the bootstrap token

After the first admin exists, bootstrap is refused. Create further `admin` or `editor` users from **Studio → Users**.

- **Admin** manages settings and users.
- **Editor** manages products, services, portfolio, campaigns, journal, social, testimonials and quote requests.

Permissions are enforced in Convex functions, not only in the UI.

## Seed data

Sample services, categories, collections, products, portfolio studies and journal articles are marked `sampleContent: true`. They do **not** include fake testimonials, client logos, reviews, or permanent prices.

In the Convex dashboard set `SEED_SECRET`, then either:

- call the `seed:run` action with that token, or
- sign in as admin and use **Apply sample content** on the dashboard.

Seed is additive: it will not overwrite existing slugs.

## Private file uploads

- Studio images (products, portfolio, social) use Convex storage and public URLs only after staff upload them.
- Customer artwork on `/quote` is stored privately, linked on `quoteFiles`, and is **never** returned by public queries. Staff can open files from the quote inbox.
- Allowed artwork: JPEG, PNG, WebP, SVG, PDF (and AI/EPS MIME types), 10MB each, 5 files.
- Do not store images as base64.

## Environment variables

See `.env.example`. Convex-only secrets:

| Name | Purpose |
| --- | --- |
| `JWT_PRIVATE_KEY` / `JWKS` | Convex Auth |
| `CONVEX_SITE_URL` | Auth HTTP routes |
| `SITE_URL` | Canonical origin for sitemap |
| `ADMIN_BOOTSTRAP_TOKEN` | One-time first admin |
| `SEED_SECRET` | Optional seed action |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Optional quote-inbox email |

If Resend is not configured, new quotes still land in the admin inbox and are logged on the server.

## GitHub and Vercel

1. Create a GitHub repository and push this project (do not commit `.env.local`).
2. Import the repo in Vercel.
3. Set `VITE_CONVEX_URL` and `VITE_SITE_URL` in Vercel.
4. Add the same Convex production deployment used by `npx convex deploy`.
5. Framework preset: Vite. `vercel.json` already rewrites routes to `index.html`.

Production Convex:

```bash
npx convex deploy
```

Point a custom domain when the owner has one. Until then, do not invent a domain in public copy.

Dynamic sitemap: `https://YOUR_DEPLOYMENT.convex.site/sitemap.xml` (set `SITE_URL` first). A static starter sitemap also lives in `public/sitemap.xml`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
```

## Content verification checklist (owner)

Complete this before a public launch. Nothing below should be published until it is confirmed.

- [ ] Brand name, tagline and logo
- [ ] Owner name (Tiané Eksteen is stored unpublished until explicitly approved)
- [ ] Phone, WhatsApp, email, street address, opening hours
- [ ] Service areas: White River / Witrivier, Nelspruit / Mbombela, Barberton, surrounding Mpumalanga — **only publish what is true**
- [ ] Instagram @inkand.identity and Facebook URL
- [ ] Map / directions URL
- [ ] Hero video (commercially licensed or owner footage) and poster still
- [ ] Product photography with alt text (placeholders are not real studio/client photos)
- [ ] Portfolio photography and permission to show it
- [ ] Remove or replace all `sampleContent` records
- [ ] Prices: show, hide, or “request a quote” — never invent a price
- [ ] Lead times, minimums, printing methods, suppliers
- [ ] Testimonials only if real and approved
- [ ] Campaign dates and terms (expired campaigns must not show)
- [ ] Privacy and terms copy
- [ ] Default SEO title and description
- [ ] Afrikaans navigation labels if you want them live
- [ ] Notification email for new quotes
- [ ] Confirm this is not the unrelated US “Ink & Identity Promos” business

## Design notes

- Display type: Cormorant Garamond. UI type: Outfit.
- Colour: ink, charcoal, graphite, ivory, paper, blush, taupe, champagne gold.
- Motion respects `prefers-reduced-motion` via Framer Motion `MotionConfig`.
- Hero video is muted, `playsInline`, poster-first, and skipped when reduced motion is requested.
- WhatsApp links use the public number from settings (not a secret).

## What this is not

- Not a checkout or payment app (yet)
- Not a scrape of Instagram/Facebook
- Not a hard-coded catalogue as the source of truth
- Not a second database or Express server
