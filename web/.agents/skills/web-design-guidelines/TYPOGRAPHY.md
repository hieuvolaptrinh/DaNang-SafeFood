# Typography - Font Rules

## Font Family

### Primary Font: Inter or Geist Sans

```css
font-family:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

**Why Inter/Geist Sans:**

- Modern sans-serif, easy to read on screen
- Good support for Vietnamese characters
- Multiple weights available (400, 500, 600, 700)
- Popular in admin dashboards

### Fallback Fonts

If not using Inter/Geist Sans, use system fonts:

```css
font-family:
  -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue",
  Arial, sans-serif;
```

### Monospace Font (for code, ID, numbers)

```css
font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
```

## Font Size Scale

Using Tailwind font size system:

| Class       | Size            | Line Height    | Usage                             |
| ----------- | --------------- | -------------- | --------------------------------- |
| `text-xs`   | 12px (0.75rem)  | 16px (1rem)    | Caption, helper text, badge       |
| `text-sm`   | 14px (0.875rem) | 20px (1.25rem) | Body text, table cell, form label |
| `text-base` | 16px (1rem)     | 24px (1.5rem)  | Primary body text, paragraph      |
| `text-lg`   | 18px (1.125rem) | 28px (1.75rem) | Card title, section heading       |
| `text-xl`   | 20px (1.25rem)  | 28px (1.75rem) | Page subtitle, modal title        |
| `text-2xl`  | 24px (1.5rem)   | 32px (2rem)    | Page title, dashboard heading     |
| `text-3xl`  | 30px (1.875rem) | 36px (2.25rem) | Stat number, hero number          |
| `text-4xl`  | 36px (2.25rem)  | 40px (2.5rem)  | Large stat, hero heading          |

## Font Weight

| Class           | Weight | Usage                                      |
| --------------- | ------ | ------------------------------------------ |
| `font-normal`   | 400    | Body text, paragraph, description          |
| `font-medium`   | 500    | Label, button text, nav item, table header |
| `font-semibold` | 600    | Heading, card title, page title            |
| `font-bold`     | 700    | Stat number, emphasis (rarely used)        |

## Typography Hierarchy

### 1. Page Title (H1)

```tsx
<h1 className="text-2xl font-semibold text-gray-900">Facility Management</h1>
```

- Size: `text-2xl` (24px)
- Weight: `font-semibold` (600)
- Color: `text-gray-900`
- Line height: Default (32px)

### 2. Section Heading (H2)

```tsx
<h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
```

- Size: `text-xl` (20px)
- Weight: `font-semibold` (600)
- Color: `text-gray-900`

### 3. Card Title (H3)

```tsx
<h3 className="text-lg font-semibold text-gray-900">Monthly Statistics</h3>
```

- Size: `text-lg` (18px)
- Weight: `font-semibold` (600)
- Color: `text-gray-900`

### 4. Subsection Heading (H4)

```tsx
<h4 className="text-base font-medium text-gray-900">Contact Address</h4>
```

- Size: `text-base` (16px)
- Weight: `font-medium` (500)
- Color: `text-gray-900`

### 5. Body Text

```tsx
<p className="text-sm text-gray-700">
  This is detailed description about the facility...
</p>
```

- Size: `text-sm` (14px)
- Weight: `font-normal` (400)
- Color: `text-gray-700`
- Line height: 20px

### 6. Small Text / Caption

```tsx
<p className="text-xs text-gray-600">Last updated: 10/01/2024</p>
```

- Size: `text-xs` (12px)
- Weight: `font-normal` (400)
- Color: `text-gray-600`

### 7. Label (Form, Table)

```tsx
<label className="text-sm font-medium text-gray-700">Facility Name</label>
```

- Size: `text-sm` (14px)
- Weight: `font-medium` (500)
- Color: `text-gray-700`

### 8. Stat Number

```tsx
<p className="text-3xl font-semibold text-gray-900">1,234</p>
```

- Size: `text-3xl` (30px)
- Weight: `font-semibold` (600)
- Color: `text-gray-900`

## Text Color Palette

### Primary Text Colors

```tsx
text - gray - 900; // Heading, title, primary text (darkest)
text - gray - 800; // Important body text
text - gray - 700; // Regular body text
text - gray - 600; // Secondary text, caption
text - gray - 500; // Placeholder, disabled text
text - gray - 400; // Muted text, helper text
```

### Semantic Text Colors

```tsx
text - green - 700; // Success text, active nav
text - green - 600; // Link, primary action text
text - red - 700; // Error text
text - red - 600; // Danger action text
text - yellow - 700; // Warning text
text - blue - 700; // Info text
```

## Line Height

Tailwind defaults are good, but can override:

```tsx
leading - none; // 1 (100%)
leading - tight; // 1.25 (125%)
leading - snug; // 1.375 (137.5%)
leading - normal; // 1.5 (150%) - Default for body text
leading - relaxed; // 1.625 (162.5%)
leading - loose; // 2 (200%)
```

**Rules:**

- Heading: `leading-tight` or default
- Body text: `leading-normal` (1.5)
- Caption: `leading-snug`

## Letter Spacing

Default doesn't need adjustment, but can use:

```tsx
tracking - tight; // -0.025em (for large headings)
tracking - normal; // 0em (default)
tracking - wide; // 0.025em (for uppercase text)
```

## Text Alignment

```tsx
text - left; // Default for most text
text - center; // For empty state, modal title
text - right; // For numbers, prices
```

## Text Decoration

```tsx
underline; // Link hover
no - underline; // Link default
line - through; // Deleted, deprecated
```

## Text Transform

```tsx
uppercase; // Button text, badge (rarely used)
lowercase; // Email, username
capitalize; // Name, title
```

**Note:** Avoid using `uppercase` for Vietnamese text with diacritics, may cause display issues.

## Practical Examples

### Dashboard Stat Card

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6">
  <p className="text-sm font-medium text-gray-600">Total Facilities</p>
  <p className="mt-2 text-3xl font-semibold text-gray-900">1,234</p>
  <p className="mt-2 text-xs text-gray-600">
    <span className="font-medium text-green-600">+12%</span> from last month
  </p>
</div>
```

### Table Header & Cell

```tsx
<thead>
  <tr>
    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
      Facility Name
    </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td className="px-4 py-3 text-sm text-gray-900">
      ABC Restaurant
    </td>
  </tr>
</tbody>
```

### Form Label & Input

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700">
    Facility Name
  </label>
  <input
    type="text"
    placeholder="Enter facility name"
    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
  />
  <p className="mt-1 text-xs text-gray-600">Full name of the facility</p>
</div>
```

### Button Text

```tsx
<button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
  Save Changes
</button>
<button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
  Cancel
</button>
```

### Badge

```tsx
<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
  Approved
</span>
```

### Alert / Notification

```tsx
<div className="rounded-lg border border-green-200 bg-green-50 p-4">
  <p className="text-sm font-medium text-green-800">Success</p>
  <p className="mt-1 text-sm text-green-700">
    Facility information saved successfully
  </p>
</div>
```

### Empty State

```tsx
<div className="py-12 text-center">
  <p className="text-base font-medium text-gray-900">No data yet</p>
  <p className="mt-2 text-sm text-gray-600">Start by adding a new facility</p>
</div>
```

## Accessibility

### Contrast Ratio

- **Normal text (< 18px)**: Minimum 4.5:1
- **Large text (≥ 18px)**: Minimum 3:1

**Check:**

- `text-gray-900` on `bg-white`: ✅ 21:1
- `text-gray-700` on `bg-white`: ✅ 4.5:1
- `text-gray-600` on `bg-white`: ✅ 4.5:1
- `text-gray-500` on `bg-white`: ⚠️ 3.9:1 (only for large text or secondary)

### Font Size Minimum

- **Body text**: Minimum 14px (`text-sm`)
- **Caption**: Minimum 12px (`text-xs`)
- **Don't use**: < 12px

## Don'ts

❌ Don't use too many font weights in one text block  
❌ Don't use font size < 12px  
❌ Don't use `text-gray-400` or lighter for body text  
❌ Don't use `uppercase` for Vietnamese text with diacritics  
❌ Don't use too many text colors on one page  
❌ Don't use italic for Vietnamese (hard to read)  
❌ Don't use too tight line-height for body text

## Do's

✅ Use `text-sm` (14px) for most body text  
✅ Use `font-medium` for labels, buttons, nav  
✅ Use `font-semibold` for headings  
✅ Use `text-gray-900` for headings, `text-gray-700` for body  
✅ Use `leading-normal` (1.5) for body text  
✅ Check contrast ratio before deploying  
✅ Test with real Vietnamese content

## Conclusion

Typography needs to be clear, readable, and consistent. Don't need excessive "creativity", following common rules is sufficient.
