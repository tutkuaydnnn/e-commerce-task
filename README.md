# Tuen Creations — Web Catalog Interface

A lightweight e-commerce catalog interface, built as **Task 2** of the course
*“Fundamentals of Designing Web Catalogs.”*

Single-file application: **pure HTML + Tailwind (CDN) + vanilla JS**, self-contained in `index.html`.

## Concept

**Tuen Creations** is a handcrafted home & living studio selling mugs, jar candles and decor accents.

- 🗂️ **3-category taxonomy** — Drinkware & Tableware · Candles & Home Fragrance · Incense & Decor Accents
- 🔍 **Search + working filters** — multi-select categories, contextual facets
  (cup capacity in ml, jar volume & burn time, decor size in cm), max-price slider,
  active filter chips, sorting
- 📄 **Complete object detail view** (SPA, same page) — spec table, dimensions, care, availability,
  custom-inscription box, multi-photo gallery with thumbnail swap, breadcrumbs,
  “Studio Verified Original” badge, Add to Cart / Order Now
- 🛒 **Header icons like a real shop** — favorites, cart with quantity controls, profile
- 💾 Cart & favorites persist in `localStorage`
- ♿ Accessible markup — semantic landmarks, visible focus states, skip link

## Files

| File | Purpose |
|---|---|
| `index.html` | Whole application: listing + product detail view + cart/favorites logic |
| `products.json` | Product data (7 products) — also embedded as a snapshot inside `index.html` |
| `img/` | Product photos & logo |

## Run

Open `index.html` directly in a browser, or serve the folder.

**Live:** https://tuen-creations.vercel.app

