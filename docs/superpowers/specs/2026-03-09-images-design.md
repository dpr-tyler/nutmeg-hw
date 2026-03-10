# Images & Lightbox Design Spec
**Date:** 2026-03-09

## Overview

Add Unsplash photos to three card-based sections of the Oahu travel guide, with a click-to-zoom lightbox for all images.

## Sections Getting Images

1. **BeachGuide** — 6 beach cards
2. **FoodGuide** — food item cards (all food entries)
3. **TripOverview** — 3 neighborhood cards

The Hero section is intentionally excluded.

## Image Source

Unsplash CDN URLs (no API key required for display). Format:
```
https://images.unsplash.com/photo-{id}?w={width}&h={height}&fit=crop&crop=center
```

Thumbnail size: `80×80` (displayed at `72×72` with `object-fit: cover`, `border-radius: 8px`).
Lightbox size: `1200` wide (full-res, Unsplash will optimize).

## Card Layout

All three section types use the same pattern: **square thumbnail left, text content right**.

```
┌──────────────────────────────────┐
│ [72×72 photo] Name               │
│               Subtitle · Badge   │
│               Description text   │
│               (extra fields)     │
└──────────────────────────────────┘
```

## Lightbox Feature

- Click any thumbnail → full-size image appears in a centered modal overlay
- Overlay: semi-transparent black backdrop (`rgba(0,0,0,0.85)`)
- Image: max `90vw` / `90vh`, centered, `border-radius: 12px`
- Close: click backdrop, press Escape, or click ✕ button
- Animation: fade in/out with Framer Motion (already in project)
- No external lightbox library needed

## Lightbox Component

A single shared `ImageLightbox` component:
- Props: `src` (full URL), `alt`, `isOpen`, `onClose`
- Rendered once at the App level via React portal (or inside each section, whichever is simpler)
- Keyboard: `useEffect` listens for `Escape` key while open

## Unsplash Photo Assignments

### Beaches (6)
| Beach | Unsplash search term |
|---|---|
| Waikiki | waikiki beach hawaii |
| Kailua | kailua beach hawaii |
| Lanikai | lanikai beach hawaii |
| Sandy Beach | sandy beach oahu |
| Sunset Beach | sunset beach north shore |
| Hanauma Bay | hanauma bay hawaii |

### Neighborhoods (3)
| Area | Unsplash search term |
|---|---|
| Waikiki | waikiki honolulu |
| Kailua | kailua town hawaii |
| North Shore | north shore oahu |

### Food (varies by current data in FoodGuide.jsx)
Representative items get food-specific Unsplash photos (shrimp, shave ice, poke, etc.)

## Files to Modify

- `src/components/BeachGuide.jsx` — add thumbnail to each beach card
- `src/components/FoodGuide.jsx` — add thumbnail to each food item card
- `src/components/TripOverview.jsx` — add thumbnail to each neighborhood card
- `src/components/ImageLightbox.jsx` — **new file**, shared lightbox component
- `src/App.jsx` — may need lightbox portal if using app-level state
- `.gitignore` — add `.superpowers/`
