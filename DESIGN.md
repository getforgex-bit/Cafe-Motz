---
name: MOTZ CAFÉ
description: La Casa Cafetera — artesanal pulido, frente al Parque Central de Motozintla
colors:
  canvas: "#F9F5F0"
  surface: "#F4ECE1"
  surface-raised: "#FBF7F1"
  ink: "#3D2314"
  ink-secondary: "#6B5644"
  border-hairline: "#EFE7DE"
  terracotta: "#B85D36"
  terracotta-cta: "#A24E2C"
  caramel: "#C08A42"
  botanical: "#3E5A38"
  botanical-deep: "#2F4529"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.25rem, 4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, -apple-system, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.18em"
  micro:
    fontFamily: "Plus Jakarta Sans, system-ui, -apple-system, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    letterSpacing: "0.18em"
  figure:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1
rounded:
  control: "0.5rem"
  banner: "0.75rem"
  card: "1rem"
  pill: "9999px"
spacing:
  section-y: "5rem"
  card-gap: "1.5rem"
  card-padding: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.terracotta}"
  button-specialty:
    backgroundColor: "{colors.terracotta}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 24px"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  chip-inactive:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
---

# Design System: MOTZ CAFÉ

## Overview

**Creative North Star: "La Casa Cafetera"**

MOTZ CAFÉ is the coffee house as extended family kitchen, not a roastery showroom. Its identity comes from two real physical facts about the actual building on Motozintla's Parque Central: a terracotta adobe facade and deep olive-green window and door carpentry. Every accent color in this system traces back to one of those two materials; nothing is an invented brand hue.

The confirmed voice is **artesanal pulido** — polished artisanal. This sits between two rejected poles: it is not a scanned-recipe-card rustic look (no distressed textures, no hand-lettering, no visible "wear"), and it is not a cold, minimal specialty-coffee-brand look either (no stark white, no single-hairline Helvetica restraint). It is the Instagrammable side of tradition — a serif with real editorial weight, generous warm neutrals, and a single confident accent — kept tidy and legible rather than aged.

Components are **soft and welcoming**: state changes (hover, focus, active) read as a gentle deepening of the same hue, never a jarring hue swap or a hard snap. Elevation stays mostly flat; a hairline border does the separating work a shadow would do elsewhere, and shadows appear only as a warm-tinted accent on the few elements that deserve to visually lift (the house-specialty feature row, the featured combo, the loyalty stamp card, the header once scrolled).

**Key Characteristics:**
- Warm, muted neutrals as 60% of every surface — never pure white, never pure black.
- One accent (Canela Serrana / terracotta) carries all conversion and interactive weight; a second accent (Musgo de Adobe / botanical) stays decorative and never touches a CTA.
- Playfair Display for every heading, Plus Jakarta Sans for everything else — no third typeface, no display-weight body text.
- Hairline borders over drop shadows by default; tinted shadows are a deliberate, sparingly-used lift.
- Generous rounding (8-16px) on every interactive surface, full pills on tags/chips/nav toggles — nothing sharp-cornered.

## Colors

The palette reads as a single warm material — roasted wood, adobe clay, linen paper — lit from one direction, with one deliberate cool note (the olive carpentry) kept firmly in the background.

### Primary
- **Canela Serrana** (`#B85D36`): the one conversion color. Every primary CTA's hover/active state, every "order now" affordance, the house-specialty badge and card ring, the active nav-link underline. If something is clickable and important, it eventually shows this color.
- **Canela Tostada** (`#A24E2C`): a deepened variant of Canela Serrana, reserved for button *fills* that carry white text directly (rather than as a hover state on an Ink fill) — guarantees comfortable contrast where the base terracotta would sit right at the WCAG AA edge.

### Neutral
- **Leche Vaporizada** (`#F9F5F0`) — canvas: the page background everywhere. Named for steamed milk, not "off-white."
- **Lino de Parque** (`#F4ECE1`) — surface: card and panel backgrounds, category-tab hover states, badge fills.
- **Crema de Mesa** (`#FBF7F1`) — surface-raised: modals, the order drawer, anything that floats above the base surface.
- **Roble Tostado** (`#3D2314`) — ink: every heading, primary body text, and the default (non-hover) fill for primary buttons and active pills.
- **Roble Claro** (`#6B5644`) — ink-secondary: description copy, metadata, secondary labels.
- **Hilo de Lino** (`#EFE7DE`) — border-hairline: the 1px divider that separates cards, sections, and header from content. The default separation mechanism; see Elevation.

### Named Rules
**The One Accent Rule.** Canela Serrana is the only color allowed on a conversion surface (a button someone taps to move toward ordering). If a new component needs emphasis but isn't driving a purchase or an order action, reach for Musgo de Adobe or Caramelo Quemado instead, never a second shade of terracotta.

## Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** Plus Jakarta Sans (with system-ui fallback)

**Character:** An editorial serif with real historical weight against a clean, warm-geometric sans — the pairing that reads as "family business with a design-literate menu," not "coffee startup" and not "handwritten chalkboard."

### Hierarchy
- **Display** (700, `clamp(2.5rem, 6vw, 4.25rem)`, 1.08 line-height, tight tracking): the hero H1 and the Ubicación colophon headline ("Frente al Parque Central"). Measure capped around 12-14ch.
- **Headline** (700, `clamp(2.25rem, 4vw, 3.5rem)`, 1.1): section titles, always left-aligned, never preceded by an eyebrow.
- **Title** (700, 1.25-2rem): row-level headings: menu item names, combo titles, value words in the manifesto list.
- **Figure** (700 serif, 1.5-3.75rem, line-height 1, `tabular-nums`): prices, fees, altitude, percentages, hours, phone. Numbers are the loudest thing in their column.
- **Body** (400, 0.875-1rem, 1.6-1.75 line-height): descriptions and prose, measure 46-62ch.
- **Label** (700, 0.6875rem, 0.18em tracking, uppercase, Roble Claro): data-sheet headers that sit *beside* the value they describe ("Chico (300ml)", "Altitud promedio", "Horarios de Atención").
- **Micro** (700, 0.625rem, 0.18em tracking, uppercase): the smallest annotations: combo tag / savings, fee notes, caption kickers.

### Named Rules
**The Two-Font Rule.** Every heading and every figure is Playfair Display; body copy, labels, buttons and navigation are Plus Jakarta Sans. No third face. Serif *italic* is allowed only for quotation-like fragments: the tagline, photo captions and the tasting-notes line. It is never used for paragraph-length copy.

**The No-Eyebrow Rule.** Small uppercase labels never sit above a section headline. They label data (a price, a spec, a fee) or name a sub-block inside a section.

## Layout

Container: `max-w-7xl` (80rem) centered, with responsive horizontal padding (`1rem` mobile → `1.5rem` tablet → `2rem` desktop). Sections breathe with `py-20` mobile and `py-28` desktop. Internal blocks separate with `mt-16` to `mt-32`, not with boxes.

**Editorial composition, not card grids.** Each section owns a different layout family, and none repeats "centered title + symmetric grid":
- **Hero:** asymmetric cover (7/5). The image bleeds past the right column. Specialty and altitude are margin notes under the photo.
- **Historia:** staggered triptych (5/4/3 columns with vertical offsets), captions *below* photos. Then a prose-plus-data-sheet spread (7/5, hairline `border-l`), then a manifesto list of values.
- **Menú:** tasting-menu rows. Image, text column, and a margin price sheet divided by a hairline. The house special gets a landscape double-width feature row.
- **Combos:** a menu board on the Lino surface. The popular combo is a raised feature beside the headline, and the rest is a two-column price list with dotted leaders.
- **Modalidades:** a three-column typographic table where the fee is the headline figure. The loyalty stamp card sits beside its copy.
- **Ubicación:** a colophon. A display-size place name with a hairline data sheet for address, hours and phone.

Mobile collapses every layout to a single column. Menu rows keep a small 88px thumbnail beside the text.

## Elevation & Depth

**Flat by default, tinted lift on purpose.** Content sections carry no card containers. Separation is negative space plus 1px `Hilo de Lino` hairlines. Only a few surfaces lift, and each has a reason: the scrolled header, the house-special feature image, the featured combo, the loyalty stamp card (the "physical object" on the page), the order drawer and the floating widgets. Every shadow is tinted with Ink or Terracotta.

### Shadow Vocabulary
- **Ambient** (`0 4px 20px rgba(61,35,20,0.06)`): the header once scrolled.
- **Raised** (`0 8px 24px rgba(61,35,20,0.08)`): the featured combo, and hover on raised surfaces.
- **Lifted specialty** (`0 8px 24px rgba(184,93,54,0.12)`, terracotta-tinted): the house-special feature image, and specialty CTAs at 0.18.
- **Object** (`0 16px 36px rgba(61,35,20,0.12)`): the hero image frame and the loyalty stamp card.

### Named Rules
**The Tinted-Shadow Rule.** No shadow on this site is neutral gray or `rgba(0,0,0,...)`. Every shadow color derives from Ink or Terracotta at low opacity, so elevation reads as "warmth pooling" rather than "object floating in space."

## Shapes

Rounding is generous and consistent by role, using Tailwind's own default radius scale:
- **Control** (buttons, inputs, quick-add icon buttons, focus outline): `0.5rem` (8px).
- **Banner** (drawer sub-panels, inline notices): `0.75rem` (12px).
- **Frame** (every photo, the featured combo, the stamp card, the order drawer): `1rem` (16px).
- **Pill** (badges, tags, header toggles): fully rounded.

Nothing on the page is sharp-cornered.

## Components

### Buttons
- **Shape:** Control radius (8px), min height 44px, 16-24px horizontal padding. Hover lifts `-translate-y-0.5` (disabled under reduced motion), `duration-200 ease-out`.
- **Primary** ("Explorar Menú", "Personalizar", "Hacer Pedido / WhatsApp"): Roble Tostado fill, white text, hovers to Canela Serrana.
- **Specialty** (house special, popular combo, cart, footer WhatsApp): Canela Tostada `#A24E2C` fill with white text (AA-safe). It hovers to Roble Tostado.
- **Secondary** ("Pedir a Domicilio", "Abrir en Google Maps", regular "Pedir Combo"): Crema de Mesa fill, Ink text, hairline border. It hovers to Lino de Parque, or fills to Ink.
- **Icon-only** (quick-add): 44px square, Crema de Mesa with a hairline border, turning Canela Serrana with a white icon on hover.

### Tabs (menu categories)
Text tabs on a hairline baseline (`role="tablist"`). The active tab gets an Ink label, a Canela icon and a 2px Canela underline. An inactive tab has a Roble Claro label and a transparent underline. There are no pills or filled backgrounds.

### Badges / Tags
- **Badges** ("Favorito de la Casa", "Más Vendido"): pill next to the item name, never overlaid on a photo. The house special uses a Canela Tostada fill with white text; other items use a Lino fill with Ink text.
- **Tasting notes:** not chips. A single line with a "Notas" micro-label followed by the notes in serif italic, comma-separated.

### Price sheet (signature component)
A margin column beside each menu row, separated by a hairline `border-l` on desktop. Each size is a Label (`Chico (300ml)`) over a Figure (`$45 MXN`), then the prep time with a clock icon, then the actions. Prices never sit in a card corner.

### Margin note
A small annotation block under a photo or beside a figure: a Micro kicker, a serif Title, and one line of metadata or a link. The hero's house specialty is a margin note (a real `<button>`), and the altitude sits beside it as a Figure.

### Inputs / Fields
- **Style:** Crema de Mesa fill, Hilo de Lino border, Control radius, compact padding (`0.625rem`), Canela caret.
- **Label:** a Roble Claro label sits directly above the field, `0.75rem`, semibold.
- **Focus:** the border shifts to Canela Serrana. The global `:focus-visible` outline is 2px Canela, offset 3px.

### Navigation
- Fixed header, 90% opacity at rest. Once the page scrolls past 40px (driven by `motion` `useScroll`, not a scroll listener), it gains a solid Leche Vaporizada background, a hairline and the Ambient shadow. It always stays on one line: secondary labels collapse to icons below `xl`.
- Links: Roble Claro text that darkens to Ink on hover, with an animated Canela underline.
- Mobile: the same actions collapse into a slide-down drawer.

## Do's and Don'ts

### Do:
- **Do** keep Canela Serrana (terracotta) as the only conversion color — every "order," "pedir," or WhatsApp CTA either starts in it or hovers into it.
- **Do** use hairline borders (`Hilo de Lino`, 1px) as the default card/section separator; reach for a shadow only when something should visually lift.
- **Do** tint every shadow with Ink or Terracotta at low opacity (see The Tinted-Shadow Rule) — never a neutral-gray or pure-black shadow.
- **Do** pair Playfair Display headings with Plus Jakarta Sans body copy on every new screen; see The Two-Font Rule.
- **Do** use the existing radius scale (8 / 12 / 16px, full pills) — nothing sharp-cornered, nothing rounder than a pill.

### Don't:
- **Don't** use Musgo de Adobe (botanical green) on a conversion surface — it's confirmed decorative-only (badges, secondary panels), never a button a visitor taps to order.
- **Don't** introduce a third typeface or use Playfair Display for body-length copy.
- **Don't** add new one-off secondary-text hexes; use `ink-secondary` (`#6B5644`). The pre-migration tones `#725C4D`, `#50443F` and `#8C7667` have been removed from components.
- **Don't** wrap content in white cards with shadows, put icons in colored circles, overlay pills on photos, or put an eyebrow above a section headline.
- **Don't** present the contact details, address, or loyalty barcode in `BRAND_INFO` as verified real-world facts — per PRODUCT.md, these are illustrative placeholders for a concept project.
