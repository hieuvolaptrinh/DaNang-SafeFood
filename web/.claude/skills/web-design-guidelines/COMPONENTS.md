# Components - Quy Tắc Thiết Kế Component

## Tổng quan

Tài liệu này mô tả chi tiết cách thiết kế các component phổ biến trong admin dashboard. Tất cả component đều tuân thủ nguyên tắc: rõ ràng, nhất quán, dễ sử dụng.

## 1. Button

### Primary Button

```tsx
<button className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50">
  <Plus className="h-4 w-4" />
  Thêm mới
</button>
```

**Quy tắc:**

- Background: `bg-green-600`
- Hover: `hover:bg-green-700`
- Text: `text-white font-medium`
- Padding: `px-4 py-2` (height ~40px)
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-sm`
- Focus: `focus:ring-2 focus:ring-green-500/20`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

### Secondary Button

```tsx
<button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
  Hủy
</button>
```

### Danger Button

```tsx
<button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20">
  <Trash2 className="h-4 w-4" />
  Xóa
</button>
```

### Ghost Button

```tsx
<button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
  Xem thêm
</button>
```

### Icon Button

```tsx
<button className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
  <Search className="h-5 w-5" />
</button>
```

### Button Sizes

```tsx
// Small
className = "px-3 py-1.5 text-xs"; // height ~32px

// Medium (default)
className = "px-4 py-2 text-sm"; // height ~40px

// Large
className = "px-6 py-3 text-base"; // height ~48px
```

## 2. Input

### Text Input

```tsx
<div>
  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    Tên cơ sở
  </label>
  <input
    id="name"
    type="text"
    placeholder="Nhập tên cơ sở"
    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
  />
  <p className="mt-1 text-xs text-gray-600">Tên đầy đủ của cơ sở kinh doanh</p>
</div>
```

### Input with Icon

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="Tìm kiếm..."
    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
  />
</div>
```

### Input Error State

```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="mt-1 w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
  />
  <p className="mt-1 text-xs text-red-600">Email không hợp lệ</p>
</div>
```

### Textarea

```tsx
<textarea
  rows={4}
  placeholder="Nhập mô tả..."
  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
></textarea>
```

### Select

```tsx
<select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
  <option>Chọn trạng thái</option>
  <option>Đã duyệt</option>
  <option>Chờ duyệt</option>
  <option>Từ chối</option>
</select>
```

### Checkbox

```tsx
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500/20"
  />
  <span className="text-sm text-gray-700">Tôi đồng ý với điều khoản</span>
</label>
```

### Radio

```tsx
<label className="flex items-center gap-2">
  <input
    type="radio"
    name="status"
    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500/20"
  />
  <span className="text-sm text-gray-700">Đã duyệt</span>
</label>
```

## 3. Table

### Basic Table

```tsx
<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
  <table className="w-full">
    <thead className="border-b border-gray-200 bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
          Tên cơ sở
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
          Địa chỉ
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
          Trạng thái
        </th>
        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
          Thao tác
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 text-sm font-medium text-gray-900">
          Nhà hàng ABC
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">
          123 Đường XYZ, Đà Nẵng
        </td>
        <td className="px-4 py-3">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Đã duyệt
          </span>
        </td>
        <td className="px-4 py-3 text-right text-sm">
          <button className="text-green-600 hover:text-green-700">Xem</button>
          <button className="ml-3 text-gray-600 hover:text-gray-700">
            Sửa
          </button>
          <button className="ml-3 text-red-600 hover:text-red-700">Xóa</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with Checkbox

```tsx
<thead>
  <tr>
    <th className="px-4 py-3">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-green-600"
      />
    </th>
    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
      Tên cơ sở
    </th>
  </tr>
</thead>
```

### Empty Table State

```tsx
<div className="py-12 text-center">
  <FileX className="mx-auto h-12 w-12 text-gray-400" />
  <p className="mt-4 text-base font-medium text-gray-900">Chưa có dữ liệu</p>
  <p className="mt-2 text-sm text-gray-600">
    Bắt đầu bằng cách thêm cơ sở kinh doanh mới
  </p>
  <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
    <Plus className="h-4 w-4" />
    Thêm mới
  </button>
</div>
```

## 4. Badge

### Status Badges

```tsx
// Success
<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
  Đã duyệt
</span>

// Warning
<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
  Chờ duyệt
</span>

// Error
<span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
  Từ chối
</span>

// Info
<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
  Đang xử lý
</span>

// Neutral
<span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
  Nháp
</span>
```

### Badge with Icon

```tsx
<span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
  <CheckCircle className="h-3 w-3" />
  Đã duyệt
</span>
```

### Badge with Dot

```tsx
<span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
  Hoạt động
</span>
```

## 5. Card

### Basic Card

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900">Tiêu đề card</h3>
  <p className="mt-2 text-sm text-gray-600">Nội dung mô tả...</p>
</div>
```

### Stat Card

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Tổng cơ sở</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">1,234</p>
    </div>
    <div className="rounded-full bg-green-100 p-3">
      <Building className="h-6 w-6 text-green-600" />
    </div>
  </div>
  <p className="mt-4 text-sm text-gray-600">
    <span className="font-medium text-green-600">+12%</span> so với tháng trước
  </p>
</div>
```

### Card with Header & Footer

```tsx
<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
  <div className="border-b border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900">Tiêu đề</h3>
  </div>
  <div className="p-6">
    <p className="text-sm text-gray-600">Nội dung...</p>
  </div>
  <div className="border-t border-gray-200 p-4">
    <button className="text-sm font-medium text-green-600 hover:text-green-700">
      Xem thêm
    </button>
  </div>
</div>
```

## 6. Modal

### Basic Modal

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
  <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
      <button className="text-gray-400 hover:text-gray-600">
        <X className="h-5 w-5" />
      </button>
    </div>
    <p className="mt-4 text-sm text-gray-600">
      Bạn có chắc chắn muốn xóa cơ sở này? Hành động này không thể hoàn tác.
    </p>
    <div className="mt-6 flex justify-end gap-3">
      <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
        Hủy
      </button>
      <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
        Xóa
      </button>
    </div>
  </div>
</div>
```

## 7. Drawer

### Side Drawer

```tsx
<div className="fixed inset-0 z-50 flex justify-end bg-gray-900/50 backdrop-blur-sm">
  <div className="h-full w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white shadow-2xl">
    <div className="flex items-center justify-between border-b border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900">Chi tiết cơ sở</h3>
      <button className="text-gray-400 hover:text-gray-600">
        <X className="h-5 w-5" />
      </button>
    </div>
    <div className="p-6">{/* Content */}</div>
  </div>
</div>
```

## 8. Alert

### Alert Variants

```tsx
// Success
<div className="rounded-lg border border-green-200 bg-green-50 p-4">
  <div className="flex items-start gap-3">
    <CheckCircle className="h-5 w-5 text-green-600" />
    <div className="flex-1">
      <p className="text-sm font-medium text-green-800">Thành công</p>
      <p className="mt-1 text-sm text-green-700">Đã lưu thông tin cơ sở</p>
    </div>
    <button className="text-green-600 hover:text-green-700">
      <X className="h-4 w-4" />
    </button>
  </div>
</div>

// Error
<div className="rounded-lg border border-red-200 bg-red-50 p-4">
  <div className="flex items-start gap-3">
    <XCircle className="h-5 w-5 text-red-600" />
    <div className="flex-1">
      <p className="text-sm font-medium text-red-800">Lỗi</p>
      <p className="mt-1 text-sm text-red-700">Không thể lưu thông tin</p>
    </div>
  </div>
</div>

// Warning
<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
  <div className="flex items-start gap-3">
    <AlertTriangle className="h-5 w-5 text-yellow-600" />
    <div className="flex-1">
      <p className="text-sm font-medium text-yellow-800">Cảnh báo</p>
      <p className="mt-1 text-sm text-yellow-700">Cơ sở này sắp hết hạn giấy phép</p>
    </div>
  </div>
</div>

// Info
<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
  <div className="flex items-start gap-3">
    <Info className="h-5 w-5 text-blue-600" />
    <div className="flex-1">
      <p className="text-sm font-medium text-blue-800">Thông tin</p>
      <p className="mt-1 text-sm text-blue-700">Hệ thống sẽ bảo trì vào 2h sáng</p>
    </div>
  </div>
</div>
```

## 9. Toast Notification

```tsx
<div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2">
  <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-green-200 bg-white p-4 shadow-lg">
    <CheckCircle className="h-5 w-5 text-green-600" />
    <p className="text-sm font-medium text-gray-900">Đã lưu thành công</p>
    <button className="ml-4 text-gray-400 hover:text-gray-600">
      <X className="h-4 w-4" />
    </button>
  </div>
</div>
```

## 10. Tabs

```tsx
<div>
  <div className="border-b border-gray-200">
    <nav className="flex gap-6">
      <button className="border-b-2 border-green-600 px-1 py-3 text-sm font-medium text-green-600">
        Thông tin
      </button>
      <button className="border-b-2 border-transparent px-1 py-3 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900">
        Lịch sử
      </button>
      <button className="border-b-2 border-transparent px-1 py-3 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900">
        Tài liệu
      </button>
    </nav>
  </div>
  <div className="mt-6">{/* Tab content */}</div>
</div>
```

## 11. Pagination

```tsx
<div className="flex items-center justify-between border-t border-gray-200 p-4">
  <p className="text-sm text-gray-600">Hiển thị 1-10 trong 234 kết quả</p>
  <div className="flex gap-2">
    <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
      <ChevronLeft className="h-4 w-4" />
    </button>
    <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
      1
    </button>
    <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
      2
    </button>
    <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
      3
    </button>
    <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
</div>
```

## 12. Dropdown Menu

```tsx
<div className="relative">
  <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
    Thao tác
    <ChevronDown className="h-4 w-4" />
  </button>
  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-md">
    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
      <Eye className="h-4 w-4" />
      Xem chi tiết
    </button>
    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
      <Edit className="h-4 w-4" />
      Chỉnh sửa
    </button>
    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
      <Trash2 className="h-4 w-4" />
      Xóa
    </button>
  </div>
</div>
```

## 13. Breadcrumb

```tsx
<nav className="flex items-center gap-2 text-sm text-gray-600">
  <a href="/dashboard" className="hover:text-gray-900">
    Dashboard
  </a>
  <ChevronRight className="h-4 w-4" />
  <a href="/facilities" className="hover:text-gray-900">
    Cơ sở kinh doanh
  </a>
  <ChevronRight className="h-4 w-4" />
  <span className="text-gray-900">Chi tiết</span>
</nav>
```

## 14. Loading States

### Spinner

```tsx
<div className="flex items-center justify-center">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
</div>
```

### Skeleton Loader

```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
  <div className="h-4 w-5/6 rounded bg-gray-200"></div>
</div>
```

## Kết luận

Tất cả component đều tuân thủ design system: màu xanh lá chủ đạo, border radius 8px, shadow nhẹ, focus ring rõ ràng. Sử dụng shadcn/ui để implement nhanh hơn.
