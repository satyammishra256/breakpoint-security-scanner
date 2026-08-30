---
name: Engineering Dark
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#1f1f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#e0bfbc'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#a78a87'
  outline-variant: '#58413f'
  surface-tint: '#ffb3ac'
  primary: '#ffb3ac'
  on-primary: '#680007'
  primary-container: '#8b1a1a'
  on-primary-container: '#ff9a91'
  inverse-primary: '#ac322e'
  secondary: '#c8c6c8'
  on-secondary: '#303032'
  secondary-container: '#474649'
  on-secondary-container: '#b7b4b7'
  tertiary: '#c8c6c8'
  on-tertiary: '#303032'
  tertiary-container: '#474749'
  on-tertiary-container: '#b7b5b7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#8a1a1a'
  secondary-fixed: '#e4e2e4'
  secondary-fixed-dim: '#c8c6c8'
  on-secondary-fixed: '#1b1b1d'
  on-secondary-fixed-variant: '#474649'
  tertiary-fixed: '#e4e2e4'
  tertiary-fixed-dim: '#c8c6c8'
  on-tertiary-fixed: '#1b1b1d'
  on-tertiary-fixed-variant: '#474649'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
  graphite-base: '#131315'
  charcoal-surface: '#1B1B1D'
  burgundy-accent: '#8B1A1A'
  off-white-text: '#F0F0F0'
  steel-gray: '#808085'
  border-technical: '#2A2A2E'
  status-critical: '#8B1A1A'
  status-high: '#C45500'
  status-medium: '#B58900'
  status-safe: '#4D6B51'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
spacing:
  unit: 4px
  gutter: 20px
  panel-gap: 1px
  margin-desktop: 32px
  margin-mobile: 16px
---

## Brand & Style

This design system is a high-precision, technical framework designed for expert users in security and infrastructure engineering. It embodies a **Technical Brutalist** aesthetic, characterized by structural rigor, clinical precision, and an intentional lack of organic forms. The brand avoids decorative flourishes in favor of a "control room" philosophy, where every pixel serves a functional purpose.

The visual narrative is built on the concept of **Systemic Integrity**. Depth is conveyed through structural layering and linework rather than shadows. A distinctive "broken path" signature—interrupted dividers and staggered borders—is used to symbolize intervention points within a logical flow. The interface should feel like a piece of sophisticated hardware: heavy, reliable, and strictly disciplined.

## Colors

The color strategy utilizes a "Deep Dark" foundation to minimize eye strain during long periods of technical analysis.

- **Primary:** A muted burgundy (#8B1A1A) used for critical actions, severity indicators, and active states. It represents a serious alert rather than a frantic alarm.
- **Surface Tiers:** The UI is built on a "Graphite" base (#131315). Higher level panels use "Charcoal" (#1B1B1D) to create subtle contrast.
- **Typography:** Warm off-white (#F0F0F0) is used for primary content to ensure high legibility without the jarring contrast of pure white. Secondary metadata utilizes a desaturated steel gray.
- **Semantic Palette:** Status colors (Critical, High, Medium, Safe) are desaturated and earthy, maintaining the system's sophisticated, non-neon atmosphere.

## Typography

Typography functions as a structural grid. **Hanken Grotesk** is used for all narrative content and primary headings, providing a clean, contemporary sans-serif foundation. 

**Geist** is employed as the monospace engine for the design system. It is reserved for technical identifiers, system logs, code snippets, and severity labels. This duality ensures a clear distinction between "Human Content" (Hanken Grotesk) and "System Data" (Geist). All technical labels should be set in Geist to reinforce the engineering aesthetic.

## Layout & Spacing

The layout follows a **Fixed-Panel Grid** model. Rather than floating elements, the interface is constructed of docked cells separated by 1px technical dividers. This mimics physical control panels where space is utilized to maximum density.

- **Grid:** A 12-column system is used for desktop. 
- **Spacing Rhythm:** All dimensions follow a 4px base unit. 
- **Dividers:** The "Broken Path" philosophy is applied to structural dividers—horizontal lines should have intentional gaps (4px-8px) before meeting vertical borders to emphasize the technical construction.
- **Responsiveness:** On mobile, the multi-column panels stack vertically, but the 1px divider is maintained to preserve the segmented architecture.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Technical Outlines** rather than shadows or light effects.

1.  **Level 0 (Foundation):** The primary background (#131315).
2.  **Level 1 (Cells):** Created by 1px borders (#2A2A2E). These are non-elevated and appear as segments of the base.
3.  **Level 2 (Active/Focus):** Overlays or active panels use a slightly lighter surface (#1B1B1D). Focus is indicated by a solid 1px Primary border (#8B1A1A).
4.  **Visual Texture:** Subtle grid patterns (1px dots at 16px intervals) may be used in the background of primary dashboard panels to enhance the engineering feel.

## Shapes

The design system utilizes a **Sharp (0px)** shape language. All panels, buttons, inputs, and badges must have 90-degree corners. This non-organic approach reinforces the precision of the software. 

Circular shapes are strictly limited to status dots and specific toggle indicators to provide a visual contrast against the otherwise rectangular environment.

## Components

### Severity Badges
Rectangular blocks with no border-radius. Use `label-mono` (Geist). Background color matches the status (e.g., Burgundy for Critical), text matches the `off-white-text`.

### Interactive Topology Nodes
Represented as square blocks. Active nodes are outlined in Primary Burgundy. Connections between nodes use the "Broken Path" divider style—lines that stop just short of the node itself.

### Security Control Toggles
A binary switch using a square handle. When "On," the handle is Burgundy; when "Off," it is Steel Gray. No rounded edges.

### Detailed Findings Tables
Tables use 1px solid dividers (#2A2A2E) between rows. Headers are set in uppercase Geist. Every 5th row includes a "Broken Path" divider (a line with a small 4px gap) to aid in visual scanning of large datasets.

### Buttons
- **Primary:** Solid Burgundy block with Off-White text.
- **Secondary:** Transparent background with a 1px Burgundy border. On hover, the border becomes 2px.
- **Technical:** Steel Gray 1px border with labels in Geist.

### Input Fields
Inputs use a "Bracketed Focus" state. Upon focus, the top and bottom borders disappear, while the left and right borders thicken and turn Burgundy, visually "clamping" the active input.