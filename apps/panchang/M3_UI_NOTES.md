# Material 3 UI Refactor — Notes

## Token Choices

### Color System
| Token | Dark Theme | Light Theme | Purpose |
|-------|-----------|-------------|---------|
| `--md-sys-color-primary` | `#FF9933` (saffron) | `#D86B00` | Main brand color |
| `--md-sys-color-on-surface-variant` | `#C4BBB2` | `#52443B` | **NEW**: Secondary text (replaces all opacity hacks) |
| `--md-sys-color-surface-tint` | `#FF9933` | `#D86B00` | **NEW**: Elevation overlays |
| `--md-custom-timeline-good` | `var(--md-sys-color-tertiary)` | same | Auspicious segments |
| `--md-custom-timeline-bad` | `var(--md-sys-color-error)` | same | Inauspicious segments |
| `--md-custom-timeline-rahu` | `#7B1FA2` / `#9C27B0` | purple | Rahu Kaam (custom token, only exception to hex-free rule) |

### State Layers
```css
.m3-state::after {
    content:""; position:absolute; inset:0; border-radius:inherit;
    background: currentColor; opacity:0; pointer-events:none;
}
.m3-state:hover::after   { opacity: var(--md-sys-state-hover-opacity);   /* 0.08 */ }
.m3-state:active::after  { opacity: var(--md-sys-state-pressed-opacity); /* 0.12 */ }
.m3-state:focus-visible::after { opacity: var(--md-sys-state-focus-opacity); /* 0.12 */ }
```
Uses `currentColor` so it adapts to whatever `color` the parent element has.

## Accessibility Improvements

| Feature | Before | After |
|---------|--------|-------|
| HTML structure | `<!-- ...existing code... -->` placeholder | Full `<main>` with 6 `<section>` landmarks |
| Warning banner | Color-only status | Icon (`error`) + text label + `role="alert"` |
| Calendar | Click-only | Arrow keys + Enter + Esc + focus roving |
| Modals | No keyboard support | Esc close + focus trap |
| Timeline | No ARIA | `aria-label` on each segment with time range + type |
| Touch targets | Close btn 40px, chip 32px | Close btn 48px, chip 36px |
| Details expand | No ARIA | `aria-expanded` + `aria-controls` |
| Tabs | No ARIA | `role="tab"` + `aria-selected` toggling |

## What Was Removed/Replaced

| Removed | Replaced With |
|---------|---------------|
| `opacity: 0.6-0.8` (~15 instances) | `color: var(--md-sys-color-on-surface-variant)` |
| `#4CAF50`, `#F44336`, `#9C27B0`, `#9E9E9E` in timeline | `--md-custom-timeline-good/bad/rahu/neutral` tokens |
| `#D32F2F`, `#FF9800`, `#FF8A80` in warning banner | `--md-sys-color-error*` tokens |
| `rgba(0,0,0,0.06)` in icon-btn hover | `.m3-state` state layer system |
| `rgba(255,153,51,0.08)` in expand-btn hover | `.m3-state` state layer system |
| `font-weight: 600` standalone | Embedded in `--md-sys-typescale-*` shorthand |
| `border-radius: 8px` literal | `var(--md-sys-shape-corner-small)` |
| `style="display:flex; gap:8px"` inline in header | `.header-actions` CSS class |
| `border: 1px solid ... + elevation` on cards | Tonal container fill only (surface-container) |
| `border-radius: 9999px` on outlined buttons | `var(--md-sys-shape-corner-extra-large)` (28px) for buttons, `corner-full` only for chips |
