# Motion & Accessibility - Animation & Khả Năng Tiếp Cận

## Tổng quan

Admin dashboard cần animation nhẹ nhàng, tinh tế, không làm phân tán sự chú ý. Accessibility là ưu tiên hàng đầu để đảm bảo mọi người đều có thể sử dụng hệ thống.

## Motion - Animation

### Nguyên tắc chung

- **Subtle (Tinh tế)**: Animation nhẹ, không quá nổi bật
- **Fast (Nhanh)**: Duration ngắn (150-300ms), không để người dùng chờ
- **Purposeful (Có mục đích)**: Chỉ dùng animation khi cần thiết
- **Consistent (Nhất quán)**: Dùng cùng timing và easing trong toàn hệ thống

### Timing & Easing

```css
/* Tailwind default */
transition-none     /* 0ms */
transition-all      /* 150ms */
transition          /* 150ms */
transition-colors   /* 150ms */
transition-opacity  /* 150ms */
transition-shadow   /* 150ms */
transition-transform /* 150ms */

/* Duration */
duration-75   /* 75ms - Very fast */
duration-100  /* 100ms - Fast */
duration-150  /* 150ms - Default */
duration-200  /* 200ms - Medium */
duration-300  /* 300ms - Slow */
duration-500  /* 500ms - Very slow (ít dùng) */

/* Easing */
ease-linear     /* linear */
ease-in         /* cubic-bezier(0.4, 0, 1, 1) */
ease-out        /* cubic-bezier(0, 0, 0.2, 1) */
ease-in-out     /* cubic-bezier(0.4, 0, 0.2, 1) - Default */
```

### Quy tắc áp dụng

| Element          | Transition             | Duration | Easing      |
| ---------------- | ---------------------- | -------- | ----------- |
| Button hover     | `transition-colors`    | 150ms    | ease-in-out |
| Link hover       | `transition-colors`    | 150ms    | ease-in-out |
| Card hover       | `transition-shadow`    | 200ms    | ease-out    |
| Modal open/close | `transition-opacity`   | 200ms    | ease-in-out |
| Drawer slide     | `transition-transform` | 300ms    | ease-out    |
| Dropdown         | `transition-all`       | 150ms    | ease-out    |
| Toast            | `transition-all`       | 200ms    | ease-in-out |
| Tooltip          | `transition-opacity`   | 100ms    | ease-in     |

## Practical Examples

### Button Hover

```tsx
<button className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors duration-150 hover:bg-green-700">
  Lưu
</button>
```

### Card Hover

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
  {/* Content */}
</div>
```

### Link Hover

```tsx
<a
  href="#"
  className="text-green-600 transition-colors duration-150 hover:text-green-700 hover:underline"
>
  Xem thêm
</a>
```

### Modal Fade In

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-opacity duration-200">
  <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl transition-all duration-200">
    {/* Modal content */}
  </div>
</div>
```

### Drawer Slide In

```tsx
<div className="fixed inset-0 z-50 flex justify-end bg-gray-900/50 backdrop-blur-sm">
  <div className="h-full w-full max-w-md translate-x-0 transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out">
    {/* Drawer content */}
  </div>
</div>
```

### Dropdown

```tsx
<div className="absolute mt-2 w-48 origin-top-right scale-100 transform rounded-lg border border-gray-200 bg-white opacity-100 shadow-md transition-all duration-150 ease-out">
  {/* Dropdown items */}
</div>
```

### Toast Notification

```tsx
<div className="pointer-events-auto translate-x-0 transform opacity-100 transition-all duration-200 ease-in-out">
  {/* Toast content */}
</div>
```

### Loading Spinner

```tsx
<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
```

### Skeleton Loader

```tsx
<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
```

### Accordion Expand

```tsx
<div className="overflow-hidden transition-all duration-300 ease-in-out">
  {/* Accordion content */}
</div>
```

## Reduced Motion

Tôn trọng người dùng có `prefers-reduced-motion`:

```tsx
<button className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors duration-150 hover:bg-green-700 motion-reduce:transition-none">
  Lưu
</button>
```

Hoặc trong CSS:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility

### 1. Keyboard Navigation

#### Focus Visible

Luôn có focus ring rõ ràng:

```tsx
<button className="rounded-lg bg-green-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2">
  Lưu
</button>

<input className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20" />

<a href="#" className="text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2">
  Link
</a>
```

#### Tab Order

Đảm bảo tab order hợp lý:

```tsx
<form>
  <input tabIndex={1} />
  <input tabIndex={2} />
  <button tabIndex={3}>Submit</button>
</form>
```

#### Skip to Content

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:text-white"
>
  Bỏ qua đến nội dung chính
</a>
```

### 2. Screen Reader Support

#### Semantic HTML

```tsx
// ✅ Good
<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

<main>
  <h1>Quản lý cơ sở</h1>
  <section>
    <h2>Danh sách</h2>
  </section>
</main>

// ❌ Bad
<div>
  <div><a href="/dashboard">Dashboard</a></div>
</div>
```

#### ARIA Labels

```tsx
// Button chỉ có icon
<button aria-label="Đóng" className="...">
  <X className="h-5 w-5" />
</button>

// Search input
<input
  type="search"
  aria-label="Tìm kiếm cơ sở"
  placeholder="Tìm kiếm..."
/>

// Loading state
<div role="status" aria-live="polite">
  <span className="sr-only">Đang tải...</span>
  <Spinner />
</div>

// Alert
<div role="alert" aria-live="assertive">
  Đã lưu thành công
</div>
```

#### ARIA Expanded

```tsx
<button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={() => setIsOpen(!isOpen)}
>
  Menu
</button>
<div id="dropdown-menu" hidden={!isOpen}>
  {/* Dropdown items */}
</div>
```

#### ARIA Selected

```tsx
<div role="tablist">
  <button role="tab" aria-selected={activeTab === "info"}>
    Thông tin
  </button>
  <button role="tab" aria-selected={activeTab === "history"}>
    Lịch sử
  </button>
</div>
```

### 3. Color Contrast

#### Minimum Contrast Ratios

- **Normal text (< 18px)**: 4.5:1
- **Large text (≥ 18px)**: 3:1
- **UI components**: 3:1

#### Kiểm tra Contrast

```tsx
// ✅ Good - text-gray-900 on bg-white (21:1)
<p className="text-gray-900">Text</p>

// ✅ Good - text-gray-700 on bg-white (4.5:1)
<p className="text-gray-700">Text</p>

// ⚠️ Caution - text-gray-500 on bg-white (3.9:1)
// Chỉ dùng cho large text hoặc secondary
<p className="text-gray-500 text-lg">Text</p>

// ❌ Bad - text-gray-400 on bg-white (2.8:1)
// Không dùng cho body text
<p className="text-gray-400">Text</p>
```

#### Không chỉ dựa vào màu

```tsx
// ❌ Bad - chỉ dùng màu
<span className="text-red-600">Lỗi</span>

// ✅ Good - dùng màu + icon + text
<span className="flex items-center gap-1 text-red-600">
  <XCircle className="h-4 w-4" />
  Lỗi: Email không hợp lệ
</span>
```

### 4. Touch Targets

Minimum touch target: 44x44px (iOS) hoặc 48x48px (Android)

```tsx
// ✅ Good - 44x44px
<button className="inline-flex h-11 w-11 items-center justify-center rounded-lg">
  <Search className="h-5 w-5" />
</button>

// ❌ Bad - quá nhỏ
<button className="inline-flex h-6 w-6 items-center justify-center">
  <Search className="h-4 w-4" />
</button>
```

### 5. Form Accessibility

#### Label & Input Association

```tsx
// ✅ Good
<label htmlFor="name" className="block text-sm font-medium text-gray-700">
  Tên cơ sở
</label>
<input id="name" type="text" />

// ❌ Bad - không có label
<input type="text" placeholder="Tên cơ sở" />
```

#### Required Fields

```tsx
<label htmlFor="email" className="block text-sm font-medium text-gray-700">
  Email <span className="text-red-600">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
/>
```

#### Error Messages

```tsx
<label htmlFor="email" className="block text-sm font-medium text-gray-700">
  Email
</label>
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
  className={hasError ? "border-red-300" : "border-gray-300"}
/>
{hasError && (
  <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
    Email không hợp lệ
  </p>
)}
```

### 6. Modal & Drawer Accessibility

#### Focus Trap

```tsx
// Khi modal mở, focus vào modal
// Khi modal đóng, focus trở lại element đã mở modal
useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
  }
}, [isOpen]);
```

#### Escape to Close

```tsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener("keydown", handleEscape);
  }

  return () => {
    document.removeEventListener("keydown", handleEscape);
  };
}, [isOpen, onClose]);
```

#### ARIA Modal

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h3 id="modal-title">Xác nhận xóa</h3>
  <p id="modal-description">Bạn có chắc chắn muốn xóa?</p>
</div>
```

### 7. Table Accessibility

```tsx
<table>
  <caption className="sr-only">Danh sách cơ sở kinh doanh</caption>
  <thead>
    <tr>
      <th scope="col">Tên cơ sở</th>
      <th scope="col">Địa chỉ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Nhà hàng ABC</td>
      <td>123 Đường XYZ</td>
    </tr>
  </tbody>
</table>
```

### 8. Loading States

```tsx
// Loading spinner
<div role="status" aria-live="polite">
  <span className="sr-only">Đang tải dữ liệu...</span>
  <Spinner />
</div>

// Skeleton loader
<div role="status" aria-live="polite" aria-busy="true">
  <span className="sr-only">Đang tải...</span>
  <div className="animate-pulse space-y-4">
    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
  </div>
</div>
```

### 9. Notification & Toast

```tsx
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  className="rounded-lg border border-green-200 bg-white p-4 shadow-lg"
>
  <div className="flex items-center gap-3">
    <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
    <p className="text-sm font-medium text-gray-900">Đã lưu thành công</p>
  </div>
</div>
```

## Testing Checklist

### Keyboard Navigation

- [ ] Tab qua tất cả interactive elements
- [ ] Enter/Space để activate button
- [ ] Escape để đóng modal/dropdown
- [ ] Arrow keys để navigate trong menu/tabs

### Screen Reader

- [ ] Tất cả images có alt text
- [ ] Tất cả buttons có accessible name
- [ ] Heading hierarchy đúng (h1 → h2 → h3)
- [ ] Form inputs có label
- [ ] Error messages được announce

### Color & Contrast

- [ ] Text contrast ≥ 4.5:1
- [ ] UI components contrast ≥ 3:1
- [ ] Không chỉ dựa vào màu để truyền đạt thông tin

### Touch & Click

- [ ] Touch targets ≥ 44x44px
- [ ] Buttons có hover/focus/active states
- [ ] Links có underline hoặc visual indicator

### Responsive

- [ ] Zoom 200% vẫn sử dụng được
- [ ] Mobile viewport vẫn đầy đủ chức năng
- [ ] Không có horizontal scroll

## Tools

### Testing Tools

- **axe DevTools**: Chrome extension để kiểm tra accessibility
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Chrome DevTools audit
- **Screen Reader**: NVDA (Windows), VoiceOver (Mac), TalkBack (Android)

### Color Contrast Checkers

- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Coolors Contrast Checker**: https://coolors.co/contrast-checker

## Kết luận

Animation nhẹ nhàng, accessibility là ưu tiên. Tuân thủ WCAG 2.1 Level AA. Test với keyboard, screen reader, và contrast checker trước khi deploy.
