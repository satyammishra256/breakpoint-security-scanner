---
name: Breakpoint Redacted
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
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
  secondary: '#c7c6cb'
  on-secondary: '#2f3034'
  secondary-container: '#46464b'
  on-secondary-container: '#b5b4ba'
  tertiary: '#96ccf8'
  on-tertiary: '#00344f'
  tertiary-container: '#004c71'
  on-tertiary-container: '#86bce7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#8a1a1a'
  secondary-fixed: '#e3e2e7'
  secondary-fixed-dim: '#c7c6cb'
  on-secondary-fixed: '#1a1b1f'
  on-secondary-fixed-variant: '#46464b'
  tertiary-fixed: '#cae6ff'
  tertiary-fixed-dim: '#96ccf8'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#004b70'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
  text-primary: '#F0F0F0'
  status-critical: '#8B1A1A'
  status-high: '#C45500'
  status-medium: '#B58900'
  status-safe: '#4D6B51'
  border-muted: '#2A2A2E'
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
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
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

The design system is a sophisticated, technical framework engineered for precision environments and high-stakes engineering software. It shifts away from the saturated tropes of cybersecurity into a **Technical Brutalist** aesthetic that emphasizes structural integrity and calm authority. The brand personality is clinical, disciplined, and intentionally restrained.

The visual narrative is defined by a "control room" philosophy—minimalist but dense with information. A unique visual signature, the **'Broken Path'**, is integrated into the UI through interrupted dividers, split borders, and staggered lines, symbolizing the 'breakpoint' concept where logic meets intervention. There are no glows, no blurs, and no unnecessary ornamentation; depth is achieved through layering and precise linework rather than shadows or light.

## Colors

The palette is anchored in a warm, deep graphite (#121214) that serves as the foundation for all surfaces. This near-black tone reduces ocular fatigue while providing a heavy, "material" feel to the interface. 

The primary accent is a muted burgundy (#8B1A1A), used strategically for critical interactions, active states, and primary actions. It is a restrained crimson, not a vibrant red, conveying a sense of serious intent rather than alarm. Typography utilizes a soft ivory (#F0F0F0) to maintain high contrast without the harshness of pure white, while metadata and secondary content use a muted steel gray (#808085). Status colors are desaturated and earthy, ensuring they provide information without breaking the sophisticated technical atmosphere.

## Typography

Typography is used as a structural element. **Hanken Grotesk** provides a sharp, contemporary sans-serif feel for all headings and body copy, ensuring high legibility in the dark interface. It is chosen for its neutral but precise character.

**JetBrains Mono** is reserved for technical identifiers, system events, and data values. This monospace font reinforces the engineering-grade aesthetic. Headlines should be bold and purposeful, while secondary labels are set in uppercase monospace to create a clear visual distinction between human-readable content and machine-generated data.

## Layout & Spacing

The layout is governed by a **Fixed-Panel Grid** system. Rather than floating elements, the UI is constructed of docked panels separated by 1px technical dividers. This creates a "monolithic" feel where every element has a dedicated place in the system architecture.

- **Desktop:** A 12-column fixed grid focused on information density. Margins are consistent at 32px to allow the technical linework to breathe.
- **Tablets/Mobile:** Panels reflow into a single-column stack, maintaining the 1px divider between sections to preserve the "segmented" aesthetic.

Spacing units are strictly based on a 4px rhythm. Internal padding within panels should be generous (16px - 24px), while the gap between structural panels is minimized to 1px dividers to emphasize the interconnected nature of the system.

## Elevation & Depth

In this design system, depth is purely structural and avoids the use of shadows or blurs. Hierarchy is established through **Tonal Tiers** and **Dividers**:

1.  **Level 0 (Background):** The base warm-black surface.
2.  **Level 1 (Panels):** Defined by 1px borders (#2A2A2E). Panels do not "float"; they are contiguous or separated by narrow gutters.
3.  **Level 2 (Overlays):** Modals and dropdowns use a slightly lighter surface (#1A1A1C) and a solid 1px border in the Primary Accent color (#8B1A1A) to denote temporary focus.

The **'Broken Path'** signature is applied to dividers: a horizontal line may stop 8px before a vertical intersection, or a border might have a 4px "break" in the center, creating a technical, diagrammatic feel.

## Shapes

The shape language is **Sharp (0px)**. To maintain the engineering and control room aesthetic, all buttons, panels, inputs, and tags must have perfectly square corners. This non-organic geometry reinforces the systematic, technical nature of the software. Circles are only permitted for status dots and specific toggle indicators to ensure they stand out against the strictly rectangular environment.

## Components

### Buttons
- **Primary:** Solid Burgundy (#8B1A1A) with soft ivory text. Perfectly square. No gradients or shadows.
- **Secondary:** Outlined with 1px Burgundy border. On hover, the border thickens to 2px.
- **Technical/Ghost:** Outlined with 1px Steel Gray. Labels are always in `label-mono` typography.

### Input Fields
Inputs are slightly darker than the panel surface with a 1px border on all sides. The focus state removes the top and bottom borders and thickens the left/right borders in the Primary Accent color, creating a "bracketed" focus effect.

### The 'Broken Path' Divider
A custom horizontal divider component. Instead of a solid line, it consists of a 60% solid segment, a 4px gap, and a 40% solid segment. This is used to separate high-level sections in the layout.

### Technical Lists
List items are separated by a 1px dotted divider. Technical IDs (IP addresses, UUIDs) are always displayed in `label-mono` with a slightly dimmed opacity until hovered.

### Cards & Panels
Cards are referred to as "Cells." They have no rounded corners and no shadows. Each cell is defined by a 1px border. If a cell is "Active," its top-left corner features a small 4x4px Burgundy square as a status indicator.

### Status Indicators
Small square blocks (not dots). Status is conveyed by color only. For critical states, the square block may blink or pulse slowly, but without any glowing neon effect—simply a change in opacity.