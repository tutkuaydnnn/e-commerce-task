# Tuen Creations — Web Catalog Interface

A lightweight wireframe-style e-commerce catalog interface, built as Task 2 of the course
*“Fundamentals of Designing Web Catalogs.”*

**Pure HTML + CSS + JavaScript — no frameworks, no build step.**

## Concept

**Tuen Creations** is a handcrafted home & living studio selling mugs, jars candles and decor accents.
The interface focuses on information hierarchy and logical navigation over decoration:

- 🗂️ **3-category taxonomy** — Drinkware & Tableware · Candles & Home Fragrance · Incense & Decor Accents
- 🔍 **Search + working filters** — multi-select categories, per-category contextual facets
  (cup capacity in ml, jar volume & burn time, decor size in cm), personalization, max-price slider,
  active filter chips, sorting
- 📄 **Complete object detail page** — spec table, dimensions, care, availability, custom-inscription box,
  multi-photo gallery with thumbnail swap, breadcrumb
- 🛒 **Header icons like a real shop** — favorites, cart (with quantity controls + localStorage persistence) and profile
- ♿ **Accessible wireframe** — WCAG AA contrast (dusty-rose theme), visible focus states, skip-link,
  semantic landmarks, larger form controls and touch targets

## Files

| File | Purpose |
|---|---|
| `index.html` | Catalog listing — filters, sort, search, chips, product cards |
| `detail.html` | Object detail page — loads product via `?id=` URL parameter |
| `filtered-mugs.html` | Static wireframe screen: filtered result state |
| `style.css` | Dusty-rose accessible theme (all components) |
| `products.js` | Shared product data + category labels |
| `store.js` | Cart/favorites/profile icons + `localStorage` logic |
| `img/` | Product photos & logo |

## Run

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```
