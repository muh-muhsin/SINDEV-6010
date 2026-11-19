# Sindev Technologies — Design

Global digital services, based in Abuja. Web only. Cream editorial layout inspired by the supplied reference: centered hero, angled visual panels, spacious service columns and curved charcoal footer. No copied reference text, subscription pricing, fake projects or portraits.

## Brand & Colors

One token set, consumed per platform:

- **Web & desktop**: CSS variables in `packages/web/src/web/styles.css` (desktop loads the web UI).
- **Mobile**: `Colors.light` / `Colors.dark` in `packages/mobile/constants/theme.ts`, read via `useColors()`; `userInterfaceStyle: "automatic"` follows the system light/dark setting.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| primary | #B5523B | unused | Buttons |
| background | #F6F1EA | unused | Page |
| card | #FFFFFF | unused | Surfaces |
| foreground | #2B2622 | unused | Text |
| mutedForeground | #6B5E55 | unused | Secondary text |
| border | #D8CCBB | unused | Decorative dividers |
| destructive | #A3262B | unused | Errors |

## Typography

Bricolage Grotesque 700 display, Inter 400 body, JetBrains Mono 500 short labels. H1 61px desktop/40px mobile; H2 39px/30px. Body 16px/1.6. Light mode only. Layout max 1160px, 24px gutters, 96px section spacing (56px mobile). Accent text #A8482F only on suitably contrasting backgrounds. Controls need stronger boundaries than decorative borders.

## Pages & Screens

List each page/screen, its route file, and what it shows. Example:

- **Web — Home** (`packages/web/src/web/pages/index.tsx`) — what the user sees first.
- **Mobile — Home** (`packages/mobile/app/(tabs)/index.tsx`) — main tab.
- Add web pages under `src/web/pages/` (+ route in `app.tsx`); mobile tabs under `app/(tabs)/`, stack/modal screens under `app/`.

## Key User Flows

1. Browse services → quote form → open a prefilled mailto addressed to mmuhsin045@gmail.com. No automatic sending or delivery claim. Public contact stays info@sindev.tech.
2. Owner mmuhsin045@gmail.com manages future projects through protected CMS. Only published projects appear publicly. Team: Muhammad Muhsin CEO, Abdullahi Kudu Director of Projects. Legal/controller name supplied: Sindev Technologies.

## Architecture

- **API**: typed oRPC client (`lib/api.ts` in each package) → the backend in `@template/web`. Query/mutation hooks live in `queries/` (one file per feature); pages/screens call them with `@tanstack/react-query`.
- **State/sync**: TanStack Query with optimistic updates for instant-feel interactions.
- **Auth / payments / uploads**: see `skills/app/references/` when those features are needed.
