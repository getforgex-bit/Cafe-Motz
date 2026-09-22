# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install           # plain install works (Node >= 22.12; see .node-version)
npm run dev           # vite dev server on port 3000
npm run build         # vite production build into ./dist
npm run preview       # preview the production build
npm run lint          # tsc --noEmit (this is the only "lint"; no eslint config in the repo)
npm run cf:dev        # build + wrangler dev (Cloudflare runtime, port 8787)
npm run deploy        # build + wrangler deploy (Cloudflare Workers static assets)
npm run clean         # rm -rf dist .wrangler
```

There is no test suite in this repository (no test runner configured, no `*.test.*`/`*.spec.*` files).

## Architecture

This is a single-page marketing/ordering site for a coffee shop (MOTZ CAFÉ, Motozintla, Chiapas), built with React 19 + Vite 8 + TypeScript, generated from an AI Studio template. There is no backend and no router — everything renders from one `App.tsx` tree.

**State lives entirely in `App.tsx`**, prop-drilled down (no Context, no Redux/Zustand, no React Router):
- `cartItems` (persisted to `localStorage` under `motz_cafe_cart`), `isOrderDrawerOpen`/`selectedProduct` drive the `OrderDrawer` checkout modal
- `reducedMotion` toggles static fallbacks across `Scrollytelling`, `MenuSection`, `OrderStatusWidget`
- Ambient-audio playback state is wired to the `soundscape` singleton (see below)

**There is no real checkout backend.** `OrderDrawer` builds a formatted order summary and deep-links to `wa.me` (WhatsApp) — that's the entire "order submission" mechanism. Don't assume an API exists for orders/cart.

**Content is centralized in `src/data/coffeeData.ts`** (`MENU_ITEMS`, `COMBOS`, `BRAND_INFO`, `CORE_VALUES`) and typed in `src/types.ts`. This is the single source of truth for menu items, prices, hours, and brand copy — update content here, not inline in components.

**Page composition** (`App.tsx`, top to bottom): `Header` → `Scrollytelling` (pinned-scroll cinematic intro) → `Hero` → `StorySection` → `MenuSection` → `CombosSection` → `OrderModesAndLoyalty` → `LocationHours` → `Footer`, plus floating/portal-less widgets rendered outside `<main>`: `OrderStatusWidget` (cart summary), `OrderDrawer` (checkout modal), `AmbientAudio`.

**Two bespoke, heavier-than-usual subsystems**, both self-contained utilities rather than libraries:
- `src/components/Scrollytelling.tsx` + `src/components/SierraScrollVideo.tsx` + `src/utils/cinematicScroll.ts`: a pinned-scroll, multi-scene cinematic intro built on `motion` (`useScroll`/`useTransform`), with video-scrubbing tied to scroll position and a full static fallback when `reducedMotion` is true.
- `src/utils/soundscapeEngine.ts`: a fully procedural Web Audio API music/ambience synthesizer (no audio files) driving the `AmbientAudio` widget.

**Styling is Tailwind v4, CSS-first config** — there is no `tailwind.config.js`; theme tokens are declared via `@theme` in `src/index.css` and wired through the `@tailwindcss/vite` plugin in `vite.config.ts` (no PostCSS pipeline). Components mostly use raw hex via Tailwind arbitrary-value syntax (`bg-[#B85D36]`) rather than the `@theme` tokens — check `src/index.css` for the current token set before assuming component classes reference it.

**Icons**: `lucide-react` only, used consistently across components.

**Images**: menu/hero imagery is hotlinked from `images.unsplash.com` (no local copies). The only local media is under `public/videos/` (Sierra Madre / Sierra Verde mp4/webm + poster jpgs), used by `SierraScrollVideo`.

**Deployment is Cloudflare (Workers static assets or Pages)**: `wrangler.jsonc` serves `./dist` as an assets-only Worker with SPA fallback; `public/_headers` sets security and cache headers (works on both Workers and Pages). There is no Worker script and no server code. Cloudflare caps each static asset at 25 MiB, and `public/videos/sierra-verde-mesa.mp4` is ~23.9 MiB, so keep any new media under that limit. The AI Studio scaffolding (`@google/genai`, `express`, `dotenv`, `tsx`, the Gemini env vars) was removed.

**`vite.config.ts` note** (preserved from the template, do not remove): HMR and file watching are gated on `process.env.DISABLE_HMR` — AI Studio sets this to disable file watching during agent edits to prevent flicker.
