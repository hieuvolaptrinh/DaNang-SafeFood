# Layout - Layout Rules

## Overview

Admin dashboard layout needs to be optimized for administrative work: easy navigation, easy to find information, easy to interact. Main structure includes: Sidebar, Header, Content Area.

## Overall Structure

```
┌─────────────────────────────────────────────────────┐
│ Header (fixed top)                                  │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │ Content Area                             │
│ (fixed)  │ (scrollable)                             │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

## 1. Sidebar Navigation

### Dimensions

- **Width open**: 256px (16rem)
- **Width closed**: 64px (4rem)
- **Height**: 100vh (full height)
- **Position**: Fixed left

### Structure

```
┌─────────────────┐
│ Logo + App Name │ ← 64px height
├─────────────────┤
│ Nav Item 1      │
│ Nav Item 2      │
│ Nav Item 3      │
│   Submenu 3.1   │ ← Indent 16px
│   Submenu 3.2   │
│ Nav Item 4      │
│ ...             │
├─────────────────┤
│ User Profile    │ ← Sticky bottom
│ Settings        │
└─────────────────┘
```

### Rules

- Background: `bg-white` with border-right `border-gray-200`
- Nav item height: 40px (2.5rem)
- Padding: `px-3 py-2`
- Active state: `bg-green-50 text-green-700 border-l-4 border-green-600`
- Hover state: `bg-gray-50`
- Icon size: 20px (1.25rem)
- Gap between icon and text: 12px (0.75rem)
- Collapse button: Top right corner of sidebar

### Tailwind Example

```tsx
<aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white">
  <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-4">
    <Logo className="h-8 w-8" />
    <span className="text-lg font-semibold text-gray-900">ATTP Da Nang</span>
  </div>
  <nav className="flex-1 space-y-1 p-3">
    <a
      href="/dashboard"
      className="flex items-center gap-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 border-l-4 border-green-600"
    >
      <LayoutDashboard className="h-5 w-5" />
      <span>Dashboard</span>
    </a>
    <a
      href="/facilities"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <Building className="h-5 w-5" />
      <span>Facilities</span>
    </a>
  </nav>
</aside>
```

## 2. Header (Top Bar)

### Dimensions

- **Height**: 64px (4rem)
- **Position**: Fixed top, left margin = sidebar width
- **Z-index**: 40

### Structure

```
┌────────────────────────────────────────────────────────────┐
│ Breadcrumb | Search | Notification | User Menu             │
└────────────────────────────────────────────────────────────┘
```

### Rules

- Background: `bg-white` with border-bottom `border-gray-200`
- Padding: `px-6 py-3`
- Breadcrumb: Text gray-600, separator "/"
- Search: Width 320px, icon left
- Notification: Red badge if new notifications
- User menu: Avatar + name + dropdown

### Tailwind Example

```tsx
<header className="fixed top-0 left-64 right-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <span>Dashboard</span>
    <span>/</span>
    <span className="text-gray-900">Facilities</span>
  </div>
  <div className="flex items-center gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="h-10 w-80 rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
      />
    </div>
    <button className="relative rounded-lg p-2 hover:bg-gray-100">
      <Bell className="h-5 w-5 text-gray-600" />
      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
    </button>
    <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100">
      <Avatar />
      <span className="text-sm font-medium text-gray-700">Admin</span>
    </button>
  </div>
</header>
```

## 3. Content Area

### Dimensions

- **Margin left**: 256px (sidebar width)
- **Margin top**: 64px (header height)
- **Padding**: 24px (1.5rem) or 32px (2rem)
- **Max width**: No limit (full width) for tables, 1280px for forms

### Rules

- Background: `bg-gray-50` (light background)
- Min height: `calc(100vh - 64px)`
- Spacing between sections: 24px (1.5rem)

## 4. Dashboard Layout

### Grid System

- **Desktop**: 4 columns (grid-cols-4)
- **Tablet**: 2 columns (md:grid-cols-2)
- **Mobile**: 1 column (grid-cols-1)
- **Gap**: 24px (gap-6)

### Stat Card

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Facilities</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">1,234</p>
      </div>
      <div className="rounded-full bg-green-100 p-3">
        <Building className="h-6 w-6 text-green-600" />
      </div>
    </div>
    <p className="mt-4 text-sm text-gray-600">
      <span className="font-medium text-green-600">+12%</span> from last month
    </p>
  </div>
</div>
```

### Chart Section

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900">Monthly Statistics</h3>
  <div className="mt-6 h-80">{/* Chart component */}</div>
</div>
```

## 5. Table View Layout

### Structure

```
┌─────────────────────────────────────────────────────┐
│ Title + Action Buttons                              │
├─────────────────────────────────────────────────────┤
│ Filter + Search                                     │
├─────────────────────────────────────────────────────┤
│ Table (sticky header)                               │
│ ...                                                 │
│ ...                                                 │
├─────────────────────────────────────────────────────┤
│ Pagination                                          │
└─────────────────────────────────────────────────────┘
```

### Rules

- Card wrapper: `rounded-lg border bg-white shadow-sm`
- Header padding: `p-6`
- Table: Full width, no padding
- Pagination: `p-4 border-t`

### Example

```tsx
<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
  <div className="flex items-center justify-between border-b border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-900">Facility List</h2>
    <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
      <Plus className="h-4 w-4" />
      Add New
    </button>
  </div>
  <div className="flex items-center gap-4 border-b border-gray-200 p-4">
    <input type="text" placeholder="Search..." className="..." />
    <select className="...">
      <option>All Status</option>
    </select>
  </div>
  <table className="w-full">{/* Table content */}</table>
  <div className="flex items-center justify-between border-t border-gray-200 p-4">
    <p className="text-sm text-gray-600">Showing 1-10 of 234 results</p>
    <div className="flex gap-2">{/* Pagination buttons */}</div>
  </div>
</div>
```

## 6. Form View Layout

### 2-Column Layout (Desktop)

```tsx
<div className="mx-auto max-w-4xl">
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-gray-900">Add New Facility</h2>
    <form className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Facility Name
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Code
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          rows={3}
        ></textarea>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>
```

## 7. Detail View Layout

### Card-based Layout

```tsx
<div className="space-y-6">
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
    <dl className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <dt className="text-sm font-medium text-gray-600">Facility Name</dt>
        <dd className="mt-1 text-sm text-gray-900">ABC Restaurant</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-600">Code</dt>
        <dd className="mt-1 text-sm text-gray-900">CS-001234</dd>
      </div>
    </dl>
  </div>
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900">Inspection History</h3>
    {/* Timeline or table */}
  </div>
</div>
```

## 8. Responsive Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Small tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

### Responsive Rules

- **Mobile (<768px)**: Sidebar drawer, stacked form, table scroll or card view
- **Tablet (768px-1023px)**: Sidebar collapsed, 1 column form, table scroll
- **Desktop (≥1024px)**: Full layout, sidebar open, 2 column form, full table

## 9. Spacing System

Use Tailwind spacing system (base 4px):

```
0   → 0px
1   → 4px
2   → 8px
3   → 12px
4   → 16px
5   → 20px
6   → 24px
8   → 32px
10  → 40px
12  → 48px
16  → 64px
```

### Application Rules

- **Gap between small elements**: 8px (gap-2)
- **Gap between sections**: 24px (gap-6)
- **Card padding**: 24px (p-6)
- **Button padding**: 8px 16px (px-4 py-2)
- **Margin between page sections**: 32px (space-y-8)

## Conclusion

Layout needs to be optimized for administrative work, doesn't need excessive "creativity". Follow common admin dashboard patterns for user familiarity.
