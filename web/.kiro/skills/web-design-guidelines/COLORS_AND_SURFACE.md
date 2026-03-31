# Colors & Surface - Quy Tắc Màu Sắc & Bề Mặt

## Triết lý màu sắc

Hệ thống dùng màu xanh lá (green) làm chủ đạo để thể hiện sự an toàn, tươi mới, tin cậy - phù hợp với chủ đề an toàn vệ sinh thực phẩm. Màu sắc cần tinh tế, không gắt, dễ nhìn lâu.

## Primary Color - Green (Xanh lá)

### Green Scale

```tsx
green-50:  #F0FDF4  // Background nhẹ, hover state
green-100: #DCFCE7  // Badge background, alert background
green-200: #BBF7D0  // Border nhẹ
green-300: #86EFAC  // Disabled state
green-400: #4ADE80  // Hover state
green-500: #22C55E  // Default green
green-600: #16A34A  // Primary button, active state, link
green-700: #15803D  // Primary button hover, text emphasis
green-800: #166534  // Dark text
green-900: #14532D  // Very dark text
```

### Sử dụng Green

```tsx
// Primary button
bg-green-600 hover:bg-green-700 text-white

// Active nav item
bg-green-50 text-green-700 border-l-4 border-green-600

// Link
text-green-600 hover:text-green-700 hover:underline

// Badge success
bg-green-100 text-green-700

// Alert success
bg-green-50 border-green-200 text-green-800

// Icon primary
text-green-600

// Focus ring
focus:ring-2 focus:ring-green-500/20 focus:border-green-500
```

## Neutral Colors - Gray

### Gray Scale

```tsx
gray-50:  #F9FAFB  // Background nhẹ, hover state
gray-100: #F3F4F6  // Card background alt, disabled background
gray-200: #E5E7EB  // Border, divider
gray-300: #D1D5DB  // Border hover, input border
gray-400: #9CA3AF  // Placeholder, icon muted
gray-500: #6B7280  // Secondary text, icon
gray-600: #4B5563  // Body text secondary
gray-700: #374151  // Body text primary
gray-800: #1F2937  // Heading secondary
gray-900: #111827  // Heading primary, text emphasis
```

### Sử dụng Gray

```tsx
// Page background
bg-gray-50

// Card background
bg-white

// Border
border-gray-200

// Text heading
text-gray-900

// Text body
text-gray-700

// Text secondary
text-gray-600

// Placeholder
placeholder:text-gray-400

// Disabled
bg-gray-100 text-gray-400 cursor-not-allowed
```

## Semantic Colors

### Success (Green)

```tsx
// Background
bg-green-50

// Border
border-green-200

// Text
text-green-700

// Icon
text-green-600

// Badge
bg-green-100 text-green-700
```

### Warning (Yellow/Amber)

```tsx
yellow-50:  #FEFCE8
yellow-100: #FEF9C3
yellow-600: #CA8A04
yellow-700: #A16207

// Alert warning
bg-yellow-50 border-yellow-200 text-yellow-800

// Badge warning
bg-yellow-100 text-yellow-700

// Icon warning
text-yellow-600
```

### Error (Red)

```tsx
red-50:  #FEF2F2
red-100: #FEE2E2
red-600: #DC2626
red-700: #B91C1C

// Alert error
bg-red-50 border-red-200 text-red-800

// Badge error
bg-red-100 text-red-700

// Button danger
bg-red-600 hover:bg-red-700 text-white

// Error text
text-red-600

// Input error
border-red-300 focus:border-red-500 focus:ring-red-500/20
```

### Info (Blue)

```tsx
blue-50:  #EFF6FF
blue-100: #DBEAFE
blue-600: #2563EB
blue-700: #1D4ED8

// Alert info
bg-blue-50 border-blue-200 text-blue-800

// Badge info
bg-blue-100 text-blue-700

// Icon info
text-blue-600
```

## Background & Surface

### Page Background

```tsx
// Main background
bg - gray - 50;

// Alternative (nếu muốn nhẹ hơn)
bg - white;

// Alternative green tint (rất nhẹ)
bg - green - 50 / 30;
```

### Card / Surface

```tsx
// Card default
bg-white border border-gray-200 rounded-lg shadow-sm

// Card hover (nếu clickable)
hover:shadow-md transition-shadow

// Card active/selected
border-green-500 ring-2 ring-green-500/20

// Card disabled
bg-gray-50 opacity-60
```

### Modal / Drawer

```tsx
// Overlay
bg-gray-900/50 backdrop-blur-sm

// Modal content
bg-white rounded-lg shadow-xl

// Drawer
bg-white border-l border-gray-200 shadow-2xl
```

## Border & Divider

### Border

```tsx
// Default border
border border-gray-200

// Hover border
hover:border-gray-300

// Focus border
focus:border-green-500

// Active border
border-green-600

// Error border
border-red-300
```

### Divider

```tsx
// Horizontal divider
border-t border-gray-200

// Vertical divider
border-l border-gray-200

// Thicker divider
border-t-2 border-gray-300
```

## Shadow

### Shadow Scale

```tsx
shadow-sm   // Card, button
shadow      // Card hover
shadow-md   // Dropdown, popover
shadow-lg   // Modal
shadow-xl   // Drawer
shadow-2xl  // Large modal
```

### Sử dụng Shadow

```tsx
// Card
shadow-sm

// Button
shadow-sm hover:shadow

// Dropdown
shadow-md

// Modal
shadow-xl

// Floating action button
shadow-lg hover:shadow-xl
```

## Opacity

```tsx
opacity - 0; // Hidden
opacity - 50; // Disabled, overlay
opacity - 60; // Muted
opacity - 75; // Semi-transparent
opacity - 100; // Full
```

## Practical Examples

### Primary Button

```tsx
<button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20">
  Lưu
</button>
```

### Secondary Button

```tsx
<button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
  Hủy
</button>
```

### Danger Button

```tsx
<button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20">
  Xóa
</button>
```

### Ghost Button

```tsx
<button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
  Xem thêm
</button>
```

### Input Default

```tsx
<input
  type="text"
  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
/>
```

### Input Error

```tsx
<input
  type="text"
  className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
/>
<p className="mt-1 text-xs text-red-600">Vui lòng nhập tên cơ sở</p>
```

### Card

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900">Tiêu đề</h3>
  <p className="mt-2 text-sm text-gray-600">Nội dung...</p>
</div>
```

### Badge Success

```tsx
<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
  Đã duyệt
</span>
```

### Badge Warning

```tsx
<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
  Chờ duyệt
</span>
```

### Badge Error

```tsx
<span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
  Từ chối
</span>
```

### Badge Info

```tsx
<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
  Đang xử lý
</span>
```

### Alert Success

```tsx
<div className="rounded-lg border border-green-200 bg-green-50 p-4">
  <div className="flex items-start gap-3">
    <CheckCircle className="h-5 w-5 text-green-600" />
    <div>
      <p className="text-sm font-medium text-green-800">Thành công</p>
      <p className="mt-1 text-sm text-green-700">Đã lưu thông tin cơ sở</p>
    </div>
  </div>
</div>
```

### Alert Error

```tsx
<div className="rounded-lg border border-red-200 bg-red-50 p-4">
  <div className="flex items-start gap-3">
    <XCircle className="h-5 w-5 text-red-600" />
    <div>
      <p className="text-sm font-medium text-red-800">Lỗi</p>
      <p className="mt-1 text-sm text-red-700">Không thể lưu thông tin</p>
    </div>
  </div>
</div>
```

### Alert Warning

```tsx
<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
  <div className="flex items-start gap-3">
    <AlertTriangle className="h-5 w-5 text-yellow-600" />
    <div>
      <p className="text-sm font-medium text-yellow-800">Cảnh báo</p>
      <p className="mt-1 text-sm text-yellow-700">
        Cơ sở này sắp hết hạn giấy phép
      </p>
    </div>
  </div>
</div>
```

### Alert Info

```tsx
<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
  <div className="flex items-start gap-3">
    <Info className="h-5 w-5 text-blue-600" />
    <div>
      <p className="text-sm font-medium text-blue-800">Thông tin</p>
      <p className="mt-1 text-sm text-blue-700">
        Hệ thống sẽ bảo trì vào 2h sáng
      </p>
    </div>
  </div>
</div>
```

### Table Row Hover

```tsx
<tr className="border-b border-gray-200 hover:bg-gray-50">
  <td className="px-4 py-3 text-sm text-gray-900">...</td>
</tr>
```

### Table Row Selected

```tsx
<tr className="border-b border-gray-200 bg-green-50">
  <td className="px-4 py-3 text-sm text-gray-900">...</td>
</tr>
```

### Sidebar Active Nav

```tsx
<a
  href="/dashboard"
  className="flex items-center gap-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 border-l-4 border-green-600"
>
  <LayoutDashboard className="h-5 w-5" />
  <span>Dashboard</span>
</a>
```

### Sidebar Inactive Nav

```tsx
<a
  href="/facilities"
  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
>
  <Building className="h-5 w-5" />
  <span>Cơ sở kinh doanh</span>
</a>
```

## Dark Mode (Optional)

Nếu cần dark mode trong tương lai, chuẩn bị sẵn:

```tsx
// Background
dark:bg-gray-900

// Card
dark:bg-gray-800 dark:border-gray-700

// Text
dark:text-gray-100

// Border
dark:border-gray-700
```

**Lưu ý:** Admin dashboard thường không cần dark mode, ưu tiên light mode.

## Accessibility

### Contrast Ratio

Kiểm tra contrast ratio cho text và background:

- **Normal text**: Tối thiểu 4.5:1
- **Large text**: Tối thiểu 3:1
- **UI components**: Tối thiểu 3:1

**Kiểm tra:**

- `text-gray-900` trên `bg-white`: ✅ 21:1
- `text-gray-700` trên `bg-white`: ✅ 4.5:1
- `text-green-700` trên `bg-green-50`: ✅ 7.2:1
- `text-red-700` trên `bg-red-50`: ✅ 7.5:1

### Focus State

Luôn có focus ring rõ ràng:

```tsx
focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
```

## Don'ts (Tránh)

❌ Không dùng quá nhiều màu trong 1 trang  
❌ Không dùng màu quá sặc sỡ, quá gắt  
❌ Không dùng gradient phức tạp  
❌ Không dùng shadow quá đậm  
❌ Không dùng màu không đủ contrast  
❌ Không dùng màu semantic sai mục đích (vd: dùng red cho success)  
❌ Không dùng opacity quá thấp cho text quan trọng

## Do's (Nên)

✅ Dùng green cho primary action, success  
✅ Dùng gray làm màu chủ đạo cho text, border  
✅ Dùng màu semantic đúng mục đích  
✅ Dùng shadow nhẹ cho card, button  
✅ Kiểm tra contrast ratio trước khi deploy  
✅ Dùng focus ring rõ ràng cho accessibility  
✅ Dùng màu nhất quán trong toàn hệ thống

## Kết luận

Màu sắc cần tinh tế, nhất quán, phục vụ mục đích. Green chủ đạo thể hiện sự an toàn, tin cậy. Gray cho text và border. Màu semantic rõ ràng cho trạng thái.
