# Design — Discord Linktree

Live Discord profile card + link list, fed by Lanyard (WebSocket with REST fallback).

## Mood
Nocturnal, gothic, quiet. Near-black void, film grain, a soft bloom pulled from the status color behind the avatar. Ornamental touches (𓆩♡𓆪) used sparingly.

## Color
- `--void` #070708 — page background
- `--ink` #ededeb — primary text
- `--ash` #8a8a8f — secondary text
- `--line` rgba(255,255,255,0.08) — hairlines/borders
- `--glass` rgba(255,255,255,0.035) — card fill
- Status accents: online #3ba55d, idle #faa81a, dnd #ed4245, offline #747f8d — the active one drives `--accent` and the backdrop glow.

## Typography
- Display: **Instrument Serif** (italic for the display name)
- Body/UI: **Poppins** 300/400/500
- Meta labels: **JetBrains Mono** 10–11px, uppercase, tracked +0.18em

## Layout
Single centered column, max-width 440px. Order: avatar (with decoration + status ring) → name/username/guild tag → custom status → activities (game, rich presence, spotify) → links → footer.
Spacing on 4px scale; cards 14px radius, 1px hairline borders, no heavy shadows.

## Motion
One staggered fade-up on load (60ms steps). Links nudge right on hover with accent underline. Status dot breathes slowly. Respect prefers-reduced-motion.
