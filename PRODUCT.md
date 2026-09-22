# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two equally-weighted groups, neither dominant: (1) people at or near the physical café on the Parque Central in Motozintla de Mendoza, Chiapas, browsing the menu before or during a visit, and (2) people ordering remotely for pickup or delivery via WhatsApp. The product must serve both equally well.

## Product Purpose

A single-page marketing and informal-ordering site for MOTZ CAFÉ, a coffee shop concept. It presents the menu, combos, and brand story, and lets a visitor assemble an order and hand it off to WhatsApp for fulfillment (dine-in, pickup, or delivery). There is no real backend, payment processing, or order-management system — WhatsApp is the entire "order submission" mechanism.

## Positioning

Location and family tradition: MOTZ CAFÉ's honest differentiator is being the traditional, family-rooted coffee shop right on the Parque Central of Motozintla, not a claim about superior sourcing or scale. High-altitude Sierra Madre coffee (1,450 msnm) is real flavor context already reflected in menu copy, but the confirmed positioning claim is place and tradition, not provenance exclusivity.

## Operating Context

The site models three order-fulfillment paths — dine-in, pickup, and home delivery ("a domicilio") — each with its own fee/flow surfaced in the order drawer. There is no POS or kitchen-facing system. A VIP loyalty concept (stamp-card style, keyed to a barcode) and a tip calculator are part of the modeled experience.

## Capabilities and Constraints

- No real backend: cart state is client-only (`localStorage`), and "checkout" is a formatted WhatsApp deep link, not a payment or order-management integration.
- MOTZ CAFÉ is a concept/prototype project, not a currently operating business. Contact details, address, phone number, and the loyalty barcode in `src/data/coffeeData.ts` (`BRAND_INFO`) are illustrative placeholders, not confirmed operating facts — do not present them as real business information to a visitor, and do not extend them (e.g. don't invent staff, additional locations, or operating history).
- Menu items, combo pricing, and descriptions in `MENU_ITEMS`/`COMBOS` are the confirmed content model to build against, independent of the business's operating status.
- Institutional affiliation ("Tecnológico Nacional de México, Campus Frontera Comalapa, Unidad Motozintla") appears in brand data as project provenance — not a claim the public-facing product should foreground.

## Brand Commitments

- Name: MOTZ CAFÉ. Tagline: "El sabor de nuestra tierra."
- Location identity is binding, not a placeholder: frente al Parque Central, Motozintla de Mendoza, Chiapas.
- Existing voice: warm, family/tradition-forward, proud of Sierra de Chiapas origin without over-claiming scale or exclusivity.

## Evidence on Hand

- A shipped visual implementation and a complete menu/brand content model in `src/data/coffeeData.ts` — real enough to build against.
- No testimonials, press, case studies, or operational metrics exist; none should be fabricated for future work.
- Contact/address/loyalty-barcode fields are placeholders (see Capabilities and Constraints) — future work must not cite them to a visitor as verified facts.

## Product Principles

1. Serve dine-in and remote (pickup/delivery) visitors equally — neither is the site's "default" user.
2. Lead with place and tradition (the Parque Central location, family roots), not with sourcing or scale claims.
3. Keep the WhatsApp handoff as the single, honest description of "ordering" — never imply a payment or order-tracking capability the product doesn't have.
4. Treat contact/business details as illustrative until the user confirms them as real; don't let future work quietly promote placeholders into apparent facts.

## Accessibility & Inclusion

WCAG AA (AAA where practical) text contrast is a standing requirement established when the color system was built, not just a visual nicety.
