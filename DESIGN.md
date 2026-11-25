# Castkey design system (v0, landing page)

Direction: editorial and premium, taken from the founder's reference brand kit: a dark, grainy, photographic ground; a light, high-contrast serif; one warm accent, one cool accent and a warm greige neutral. Product UI cards sit on top of it like a clean software layer. Human, calm and trustworthy rather than "AI neon".

## Colour

| Token | Hex | Role |
|---|---|---|
| ink-950 | #0D0C0B | Page ground |
| ink-900 | #151311 | Raised bands |
| ink-850 | #1C1A17 | Cards on dark |
| ink-800 | #262320 | Inputs, hover fills |
| line | rgba(242,239,234,.12) | Hairline borders on dark |
| paper | #F2EFEA | Primary text on dark; light band ground |
| sub | #CFC9C2 | Secondary text on dark (80%) |
| mute | #9A938B | Tertiary text on dark (60%), 6.6:1 on ink-950 |
| greige | #A9A29B | Light card ground (dark text only) |
| coral | #E8774F | Primary accent and primary buttons (ink-950 text, 6.9:1) |
| ice | #B6D1EE | Secondary accent: data, "illustrative" labels, focus ring |

Rules: coral is the action colour, never body text on light grounds. Ice marks anything illustrative or reported. No gradients except the soft light glows in the hero art.

## Type

- Display: Newsreader (opsz), weight 300–400, tight tracking (-0.02em), line-height 1.02–1.08. Headings only.
- Body/UI: Geist 400/500. 16–17px body, 13px minimum for labels.
- Scale: 64/52/36/22/17/15/13.

## Shape and space

- Radius: 18px cards, 12px inputs, 999px buttons and chips. Not everything is rounded the same: the hero art and bands are square-edged.
- Spacing: 4px base; sections 96–128px vertical on desktop, 64px on mobile. Content max 1200px.
- Borders over shadows. One soft shadow for floating product cards.

## Motifs

- The mark: a keyhole that is also a person's silhouette, cut from a rounded tile, with a coral "consent bit". Original artwork; never trace or adapt third-party logos.
- Light orbits around a neutral figure (no real faces).
- Ledger rows, license fields and checklists as the "software layer".

## Motion

One motion: the hero light orbits drift slowly. Demo steps animate their checklists. All off under prefers-reduced-motion.
