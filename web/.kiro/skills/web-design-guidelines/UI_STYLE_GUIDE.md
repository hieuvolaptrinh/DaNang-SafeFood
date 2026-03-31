# UI Style Guide - Overall Design Philosophy

## Overview

The Da Nang Food Safety Management System is an admin dashboard serving management, monitoring, alerting, and statistical purposes. The interface needs to convey professionalism, trustworthiness, ease of use, and suitability for daily administrative work.

## Core Design Principles

### 1. Clarity First

All information must be presented clearly, readable, and understandable:

- Clear information hierarchy (heading → body → caption)
- Appropriate whitespace between elements
- Don't overuse colors, only use color to emphasize important things
- Labels and placeholders must describe accurately

### 2. Efficiency

Admin users need to work quickly:

- Action buttons always easy to find and click
- Optimized input forms, minimal steps
- Tables with filter, search, sort readily available
- Keyboard shortcuts for frequent operations
- Clear loading states, don't leave users waiting without feedback

### 3. Consistency

The entire system must be consistent:

- Colors: green primary, fixed status colors
- Typography: uniform font size, weight, line-height
- Spacing: use system of 4px, 8px, 12px, 16px, 24px, 32px, 48px
- Components: button, input, card, modal identical across all pages
- Behavior: hover, focus, active states identical

### 4. Trust & Safety

System related to food safety, needs to convey trust:

- Green as primary color → associates with safety, freshness, health
- Clear status colors: success (green), warning (yellow), error (red), info (blue)
- Confirmation dialogs for critical actions (delete, approve, reject)
- Clear error messages with guidance on how to fix

### 5. Minimalism

No unnecessary embellishments:

- Only display necessary information
- Hide rarely used features in menus or dropdowns
- Don't use complex animations, only subtle transitions
- Simple cards, modals, drawers without excessive decoration

## Interface Characteristics

### Visual Style

- **Primary Color**: Green - represents safety, freshness, trust
- **Background**: White (#FFFFFF) or very light green (#F8FBF9)
- **Card Style**: Soft rounded corners (8px), subtle shadow, thin border (1px)
- **Typography**: Modern sans-serif (Inter, Geist Sans), easy to read
- **Iconography**: Lucide icons - simple, clear, consistent

### Layout Pattern

- **Sidebar navigation**: Fixed left, collapsible
- **Top header**: Breadcrumb, search, notification, user menu
- **Content area**: Appropriate padding, max-width for readability
- **Dashboard**: Grid layout with stat cards, charts, tables
- **Table view**: Full width, sticky header, pagination
- **Form view**: 2 column layout (label left, input right) or stacked
- **Detail view**: Card-based, clearly grouped information

### Interaction Pattern

- **Hover**: Subtle background change, not harsh
- **Focus**: Clear ring outline (accessibility)
- **Active**: Slightly darker shade
- **Loading**: Skeleton loader or small spinner
- **Toast notification**: Top right corner, auto-close after 3-5s
- **Modal**: Dark overlay, white modal, focus trap

## Tone & Voice

Admin interface doesn't need to "sell", needs to be clear and supportive:

- **Button text**: "Save", "Cancel", "Delete", "Approve", "Reject" (concise, clear)
- **Error message**: "Please enter facility name", "Invalid email" (polite, instructive)
- **Success message**: "Saved successfully", "Facility approved" (affirmative, positive)
- **Empty state**: "No data yet", "No results found" (neutral, not negative)

## Responsive Behavior

Admin dashboard primarily used on desktop, but still needs to be responsive:

- **Desktop (≥1280px)**: Full layout, sidebar open, table with many columns
- **Tablet (768px - 1279px)**: Sidebar collapsed, table horizontal scroll
- **Mobile (<768px)**: Sidebar drawer, table card view, stacked form

## Accessibility Requirements

- **Contrast ratio**: Minimum 4.5:1 for text, 3:1 for UI elements
- **Keyboard navigation**: Tab, Enter, Escape, Arrow keys
- **Screen reader**: Semantic HTML, ARIA labels when needed
- **Focus visible**: Clear ring outline
- **Touch target**: Minimum 44x44px for mobile

## Don'ts

❌ Don't use overly bright colors or too many colors  
❌ Don't use complex animations or fast movements  
❌ Don't use font sizes too small (<14px for body text)  
❌ Don't place buttons too close together (minimum 8px gap)  
❌ Don't use placeholder as replacement for label  
❌ Don't use icons without text (except common icons like search, close)  
❌ Don't have tables with too many columns without scrolling  
❌ Don't use modals for very long forms (use drawer or full page)

## Do's

✅ Use green for primary actions  
✅ Use appropriate whitespace to separate sections  
✅ Use loading states for all async actions  
✅ Use confirmation dialogs for dangerous actions  
✅ Use toast notifications for quick feedback  
✅ Use skeleton loaders for tables and cards  
✅ Use badges for status and tags  
✅ Use tooltips for icon buttons

## Conclusion

Admin interface design needs to focus on work efficiency, doesn't need to be "beautiful" in a marketing sense. Clear, fast, and trustworthy are the top priorities.
