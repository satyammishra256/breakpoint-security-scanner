---
name: Breakpoint
colors:
  surface: '#111318'
  surface-dim: '#111318'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#c1c7d0'
  on-secondary: '#2b3138'
  secondary-container: '#41474f'
  on-secondary-container: '#b0b5be'
  tertiary: '#ffc176'
  on-tertiary: '#472a00'
  tertiary-container: '#f1a02b'
  on-tertiary-container: '#613b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#dde3ec'
  secondary-fixed-dim: '#c1c7d0'
  on-secondary-fixed: '#161c23'
  on-secondary-fixed-variant: '#41474f'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb960'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#111318'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The design system is engineered for high-stakes cybersecurity environments, prioritizing clarity, technical authority, and calm under pressure. The aesthetic is a refined **Corporate Modern** style infused with **Restrained Glassmorphism**. It avoids "hacker" tropes in favor of a sophisticated, high-fidelity interface that feels like a precision instrument.

The interface leverages a deep, multi-layered dark mode to create a sense of vast digital space. Emotional responses should center on security, reliability, and cognitive ease. Visual hierarchy is established through luminance and subtle blur effects rather than aggressive color use, ensuring that critical alerts (severity colors) command immediate attention without competing with the chrome of the UI.

## Colors
The palette is rooted in a "Deep Space" philosophy. The primary background uses a near-black navy (#0A0C10), with elevated surfaces using a slightly lighter charcoal (#0D1117). This provides a foundation for the primary accent color—a vibrant but technical Sky Blue (#38BDF8)—which is used sparingly for interactive states and focus indicators.

Functional colors for severity follow industry-standard patterns but are tuned for high legibility against dark backgrounds. Use these only for status indicators, alerts, and data visualization. Borders are kept minimal and low-contrast (#30363D) to define structure without creating visual noise.

## Typography
This design system utilizes **Geist** for its systematic, technical precision and excellent legibility in dark environments. For data-heavy views, such as IP addresses, hash values, and logs, a monospaced variant (Geist Mono) should be used to ensure character alignment and rapid scanning.

Headlines should remain compact and purposeful. Body text primarily uses a light-gray (#9CA3AF) to reduce eye strain, while pure white (#FFFFFF) is reserved for headers and high-emphasis labels. The `label-caps` style is intended for metadata and small section headers to provide structural rhythm without bulk.

## Layout & Spacing
The layout follows a strict **4px baseline grid** to maintain technical rigor. 

- **Desktop:** 12-column fluid grid with 24px gutters. Use fixed-width sidebars (280px) for primary navigation to maximize the viewport for data density.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px margins. 

Spacing between functional groups should be generous (24px - 32px), while spacing between related data points within a group should be tight (8px - 12px). This creates "clusters" of information that are easier for security analysts to process during high-velocity monitoring.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layers** and **Restrained Glassmorphism**. 

1.  **Level 0 (Base):** #0A0C10. Background for the entire application.
2.  **Level 1 (Surface):** #0D1117. Used for cards and secondary sidebars. Features a 1px subtle border (#30363D).
3.  **Level 2 (Interactive):** Elevated components like modals or dropdowns use a semi-transparent background (RGBA 255, 255, 255, 0.03) with a 20px backdrop blur and a thin, 1px highlight on the top edge to simulate a glass sheet catching light.

Shadows are avoided in favor of these luminous borders and blur effects, keeping the UI feeling crisp and "un-muddy" in dark mode.

## Shapes
The shape language is **Soft** and professional. A base radius of 4px (0.25rem) is applied to small components like inputs and buttons. Larger containers like cards use 8px (0.5rem). 

Strictly avoid fully rounded "pill" shapes for buttons to maintain a more structured, enterprise feel. Pill shapes are reserved exclusively for **Severity Badges** to distinguish them clearly from interactive buttons.

## Components

### Buttons
- **Primary:** Solid #38BDF8 with black text for maximum contrast. No gradient.
- **Secondary:** Transparent background with #30363D border and white text.
- **Ghost:** No border, light gray text, turns white on hover.

### Severity Badges
Small, pill-shaped indicators. Use a low-opacity background of the severity color (e.g., 15%) with a solid 1px border and a center dot of the same color. Text should be the solid severity color for accessibility.

### Cards & Metric Displays
Cards feature a subtle gradient from the top-left (#161B22) to bottom-right (#0D1117). Metrics should feature the "Title-md" typography for the label and "Headline-lg" for the value, ensuring the numbers are the focal point.

### Tables
Rows are separated by 1px #30363D lines. No vertical borders. Header rows use `label-caps` typography with a subtle background tint to distinguish them from the data rows. Hover states on rows should use a subtle #161B22 background shift.

### Input Fields
Darker than the surface (#050505) with a 1px #30363D border. Focus state triggers a 1px #38BDF8 border and a subtle outer glow (0px 0px 8px).