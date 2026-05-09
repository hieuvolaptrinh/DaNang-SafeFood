`# UI Design Plan: DaNang Safe Food (Soft UI + Material 3)

## 1. Muc tieu thiet ke

- Xay dung giao dien hien dai, dep mat, de tin tuong.
- Uu tien Soft UI: do sau qua shadow, han che border.
- Dong bo theo Material 3: mau sac, typography, motion, accessibility.

## 2. Huong dan tong quan giao dien

- Nen chinh: surfaceBg #F5F5F5.
- Noi dung noi bat: cardColor (white) voi shadow nhe.
- Hieu ung do sau: shadow system 3 cap do (low/medium/high).
- Bo goc thong nhat: 12-20px tuy component.

## 3. He thong mau sac

- Primary Green #2E7D32: CTA, trang thai an toan, thanh cong.
- Accent Orange #F57C00: canh bao, report, diem nhan tren map.
- Semantic colors: success, warning, error, info theo WCAG AA.
- Tuong phan dam bao ty le 4.5:1 (text thuong) va 3:1 (text lon).

## 4. Typography

- Font Inter toan bo he thong.
- Letter spacing:
  - displayLarge: -0.5
  - displayMedium: -0.3
  - displaySmall: -0.2
- Text ro rang, uu tien readability tren man hinh nho.

## 5. Component phai co

### 5.1 AppCard (Soft UI)

- Khong dung border.
- Shadow level 1 (0.05, blur 10, offset 0,2).
- Border radius 16.
- Hover/tap: tang shadow nhe.

### 5.2 AppTextField

- Filled style, khong border.
- Shadow nhe default (0.03, blur 4).
- Focus: shadow + glow primary.
- Error: glow error, khong border.
- Border radius 12.

### 5.3 AppButton

- Primary: StadiumBorder, shadow level cao hon (0.15, blur 12).
- Outlined: StadiumBorder + shadow nhe, khong border cung.
- Pressed: scale 0.98.

### 5.4 BentoGrid

- Grid item 2x2, 2x1, 1x2, 1x1.
- Gap 12px, responsive theo width.
- Moi item co shadow consistent.

### 5.5 CustomBottomSheet

- Bo goc top 24px.
- Draggable handle.
- Shadow level 3 (0.12, blur 20).
- Ho tro 3 muc cao do: initial, half, full.

### 5.6 TimelineView

- Line doc ben trai, node tron 12px.
- Node mau theo status.
- Spacing giua item 24px.

### 5.7 SafetyScoreCard

- Card lon, radius 20.
- Circular progress stroke 8.
- Mau theo nguong diem (green/orange/red).
- Animate 0 -> gia tri.

### 5.8 FilterChipGroup

- Material 3 FilterChip.
- Single va multi select.
- Selected: primary + text trang.
- Unselected: surfaceBg + shadow nhe.

### 5.9 SwipeableListTile

- Swipe phai/trai de hien action.
- Action co icon + label.
- Spring animation, auto dismiss sau action.

## 6. UI theo user type

### 6.1 Citizen Home

- BentoGrid 4 o chinh:
  - 2x2: Map preview.
  - 2x1: News/Canh bao.
  - 1x1: QR scanner.
  - 1x1: Quick report.
- Padding tong 20px.

### 6.2 Citizen Map

- Marker xanh cho co so an toan, cam cho canh bao.
- Bottom sheet khi tap marker.
- Map style silver/retro.

### 6.3 Citizen Report Flow

- 3 buoc: Photo, Violation, Confirm.
- Step indicator ro rang.
- Nhieu white space, giam ap luc user.

### 6.4 Business Dashboard

- SafetyScoreCard la component chinh.
- Quick actions 4 nut.
- Timeline hoat dong gan day.

### 6.5 Business Document Management

- Danh sach SwipeableListTile.
- Badge nen nhat (khong border).
- Swipe phai: View, swipe trai: Delete.

### 6.6 Business Notification Center

- TimelineView.
- Node mau theo loai thong bao.
- Unread: text bold.

## 7. Responsive

- Ho tro width 320-428px.
- Padding, font size dieu chinh theo MediaQuery.
- Touch target >= 44x44.

## 8. Accessibility

- Semantic labels cho interactive components.
- Contrast dat WCAG AA.
- Ho tro dynamic text size.
- Focus indicator ro rang.

## 9. Ghi chu thuc thi

- Chi mo ta thiet ke, chua implement.
- Se map vao AppTheme va component system sau.
