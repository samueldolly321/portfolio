---
name: Midnight Mint Editorial
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#bacac4'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#85948f'
  outline-variant: '#3b4a45'
  surface-tint: '#32dec0'
  primary: '#5efdde'
  on-primary: '#00382e'
  primary-container: '#36e0c2'
  on-primary-container: '#005f51'
  inverse-primary: '#006b5b'
  secondary: '#bdc7db'
  on-secondary: '#273140'
  secondary-container: '#404a5a'
  on-secondary-container: '#afb9cc'
  tertiary: '#dbe5fa'
  on-tertiary: '#273140'
  tertiary-container: '#bfc9dd'
  on-tertiary-container: '#4a5465'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#5cfbdc'
  primary-fixed-dim: '#32dec0'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#005144'
  secondary-fixed: '#d9e3f7'
  secondary-fixed-dim: '#bdc7db'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3e4757'
  tertiary-fixed: '#d9e3f7'
  tertiary-fixed-dim: '#bdc7db'
  on-tertiary-fixed: '#121c2b'
  on-tertiary-fixed-variant: '#3d4758'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 120px
    fontWeight: '800'
    lineHeight: '0.9'
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 80px
    fontWeight: '800'
    lineHeight: '0.9'
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0em
  technical-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  stat-value:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '800'
    lineHeight: '0.9'
    letterSpacing: -0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 32px
  margin-mobile: 24px
  margin-desktop: 80px
  section-gap: 160px
---

## Brand & Style
The design system embodies a "Tech-Architect" aesthetic, blending the precision of engineering with high-end editorial layouts. The visual identity is defined by a sophisticated dark-mode atmosphere, punctuated by high-energy accents. It targets a professional, tech-savvy audience that values both innovation and meticulous craftsmanship.

The design style is **Minimalist-Bold**:
- **Editorial Composition:** Heavy focus on asymmetric, left-aligned layouts with significant negative space.
- **Aggressive Typography:** Large-scale headlines serve as primary graphic elements.
- **Premium Dark Palette:** Deep oceanic tones provide a backdrop for sharp, high-contrast interactive elements.
- **Precision:** Clean lines and monospaced accents provide an organized, systematic feel.

## Colors
The palette is centered around the "Midnight Mint" concept, utilizing a high-contrast relationship between deep voids and vibrant signals.

- **Primary (Signature Mint):** #36E0C2. Used for calls to action, active states, and critical branding highlights.
- **Secondary (Midnight Blue):** #07111F. The primary background color, providing a deep, immersive environment.
- **Tertiary (Surface):** #1A2433. Used for cards, containers, and section layering to create subtle depth.
- **Neutral (Snow):** #F8FAFC. Used exclusively for body text and high-legibility UI labels to maintain contrast against the dark background.

## Typography
Typography is the cornerstone of this design system. 

- **Headlines:** Space Grotesk is used with extreme tight tracking and leading for a "wall of text" impact. Large display sizes should be used for section transitions.
- **Body:** Inter provides a clean, neutral balance to the expressive headlines. Use "Medium" weight for UI elements and "Regular" for long-form reading.
- **Mono:** JetBrains Mono is used for data, metadata, and technical specs. It should always appear in uppercase for labels or as-is for code snippets.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop and a **Fluid** model on mobile.

- **Desktop (1440px+):** 12-column grid, 80px side margins, 32px gutters. All primary content is left-aligned to the first column.
- **Tablet (768px - 1439px):** 8-column grid, 40px side margins.
- **Mobile (<767px):** 4-column fluid grid, 24px side margins.
- **Vertical Rhythm:** Sections are separated by a massive "section-gap" (160px) to reinforce the editorial feel. Components use an 8px base unit (8, 16, 24, 48, 64) for padding and internal margins.

## Elevation & Depth
In this dark, editorial context, depth is achieved through **Tonal Layering** rather than traditional shadows.

- **Level 0 (Background):** Midnight Blue (#07111F). The base for all primary content.
- **Level 1 (Containers):** Surface Blue (#1A2433). Used for cards or grouped items. No shadow, just a subtle tonal shift.
- **Interactive States:** Use a thin 1px border of Signature Mint (#36E0C2) or a low-opacity Mint glow (blur: 20px, opacity: 10%) for elements that are active or hovered.
- **Overlays:** Use the background color with 80% opacity and a 16px backdrop blur for navigation bars or modals.

## Shapes
The design system uses **Soft** geometry (0.25rem / 4px) to maintain a precise, architectural feel without appearing overly aggressive.

- **Primary Buttons:** 4px radius.
- **Cards/Containers:** 8px (rounded-lg) for larger surface areas.
- **Badges/Tags:** 2px or sharp corners to emphasize the technical "stat" aesthetic.
- **Images:** Should maintain sharp or slightly softened 4px corners to match the UI.

## Components
- **Buttons:**
  - *Primary:* Solid Signature Mint background with Midnight Blue text (Inter Bold). 4px radius.
  - *Secondary:* Ghost style. 1px Signature Mint border, Mint text.
- **Technical Badges:** JetBrains Mono text, uppercase. Background is Surface Blue with a 1px border. Used for skills, categories, or status.
- **Input Fields:** Dark background (#07111F), 1px border in Surface Blue. On focus, the border transitions to Signature Mint.
- **Project Cards:** Large-scale imagery with Headline-MD titles. Metadata (date/type) should be in JetBrains Mono.
- **Lists:** Clean dividers using 1px Surface Blue lines. Indent text slightly to the right of the divider to maintain the left-aligned architectural grid.