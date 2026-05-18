# UI Design System: DaNang Safe Food

## Modern, Clean & Information-Dense Interface

## 1. Design Philosophy

### Core Principles

- **Clarity First**: Information hierarchy through typography, spacing, and color
- **Efficient Density**: Maximum useful information without overwhelming users
- **Modern Aesthetics**: Clean lines, subtle shadows, purposeful whitespace
- **Accessibility**: WCAG AA compliant, readable in all conditions

### Visual Language

- **Soft UI with Purpose**: Shadows for depth, minimal borders, focus on content
- **Material 3 Foundation**: Modern color system, dynamic layouts, smooth animations
- **Information Architecture**: Card-based layouts with clear sections and visual grouping

---

## 2. Color System - Enhanced Palette

### Primary Colors

```
Primary Green:    #2E7D32 (Forest Green - Trust, Safety, Growth)
Primary Light:    #66BB6A (Lighter variant for hover states)
Primary Dark:     #1B5E20 (Darker variant for emphasis)
Accent Orange:    #F57C00 (Attention, Warnings, CTAs)
Accent Light:     #FFB74D (Softer accent for backgrounds)
```

### Semantic Colors (WCAG AA Compliant)

```
Success:          #16A34A (Green 600) + Light: #DCFCE7
Warning:          #EA580C (Orange 600) + Light: #FFEDD5
Error:            #DC2626 (Red 600) + Light: #FEE2E2
Info:             #0284C7 (Sky 600) + Light: #E0F2FE
```

### Text Hierarchy

```
Primary Text:     #0F172A (Slate 900) - Headlines, important content
Secondary Text:   #64748B (Slate 500) - Body text, descriptions
Tertiary Text:    #94A3B8 (Slate 400) - Captions, metadata
```

### Surface Layers

```
Scaffold:         #F1F5F9 (Slate 100) - App background
Surface BG:       #F8FAFC (Slate 50) - Section backgrounds
Card:             #FFFFFF (White) - Content cards
Elevated:         #FFFFFF + Shadow - Floating elements
Divider:          #E2E8F0 (Slate 200) - Separators
Overlay:          rgba(0,0,0,0.06) - Modal backgrounds
```

---

## 3. Typography System

### Font Family

**Inter** - Modern, highly readable, optimized for screens

### Type Scale

```
Display Large:    32px / Bold / -0.5 letter-spacing
Display Medium:   28px / Bold / -0.3 letter-spacing
Display Small:    24px / Bold / -0.2 letter-spacing

Headline Large:   22px / SemiBold / -0.1 letter-spacing
Headline Medium:  20px / SemiBold
Headline Small:   18px / SemiBold

Title Large:      18px / SemiBold
Title Medium:     16px / Medium
Title Small:      14px / Medium

Body Large:       16px / Regular / 1.5 line-height
Body Medium:      14px / Regular / 1.5 line-height
Body Small:       12px / Regular / 1.4 line-height

Label Large:      14px / SemiBold
Label Medium:     12px / Medium
Label Small:      10px / Medium
```

### Usage Guidelines

- Headlines: Page titles, section headers
- Titles: Card headers, list items
- Body: Paragraphs, descriptions
- Labels: Buttons, chips, badges

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

---

## 4. Shadow System - Depth Hierarchy

### Shadow Levels

```dart
// Level 1 - Subtle (Cards, Inputs)
BoxShadow(
  color: Colors.black.withOpacity(0.04),
  blurRadius: 8,
  offset: Offset(0, 2),
)

// Level 2 - Medium (Floating buttons, Dropdowns)
BoxShadow(
  color: Colors.black.withOpacity(0.08),
  blurRadius: 16,
  offset: Offset(0, 4),
)

// Level 3 - High (Modals, Bottom sheets)
BoxShadow(
  color: Colors.black.withOpacity(0.12),
  blurRadius: 24,
  offset: Offset(0, 8),
)

// Level 4 - Dramatic (Hero elements)
BoxShadow(
  color: Colors.black.withOpacity(0.16),
  blurRadius: 32,
  offset: Offset(0, 12),
)
```

---

## 5. Spacing System - 4px Base Grid

```
xs:   4px   - Icon padding, tight spacing
sm:   8px   - Chip padding, compact layouts
md:   12px  - Card internal padding
lg:   16px  - Section padding, list item spacing
xl:   20px  - Page margins
2xl:  24px  - Major section gaps
3xl:  32px  - Page header spacing
4xl:  40px  - Hero section spacing
```

---

## 6. Border Radius System

```
xs:   6px   - Small badges, tags
sm:   8px   - Chips, small buttons
md:   12px  - Input fields, medium cards
lg:   16px  - Large cards, containers
xl:   20px  - Hero cards, modals
2xl:  24px  - Bottom sheets, dialogs
full: 9999px - Pills, circular buttons
```

---

## 7. Core Components - Enhanced Designs

### 7.1 AppCard - Information Dense

```dart
Container(
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: AppTheme.cardColor,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.04),
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  ),
)
```

**Features:**

- No borders, shadow-only depth
- 16px padding for content breathing room
- Tap: Scale to 0.98 with haptic feedback
- Hover: Increase shadow slightly

### 7.2 StatCard - Dashboard Metrics

```dart
Container(
  padding: EdgeInsets.all(20),
  decoration: BoxDecoration(
    gradient: LinearGradient(...),
    borderRadius: BorderRadius.circular(20),
    boxShadow: [Level 2 shadow],
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Icon(size: 32, color: white.withOpacity(0.9)),
      SizedBox(height: 16),
      Text(value, style: Display Medium, color: white),
      SizedBox(height: 4),
      Text(label, style: Body Small, color: white.withOpacity(0.8)),
    ],
  ),
)
```

**Usage:** Dashboard overview, key metrics, quick stats

### 7.3 InfoRow - Key-Value Pairs

```dart
Row(
  children: [
    Container(
      padding: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Icon(icon, size: 18, color: primary),
    ),
    SizedBox(width: 12),
    Text(label, style: Body Medium, color: textSecondary),
    Spacer(),
    Text(value, style: Body Medium SemiBold, color: textPrimary),
  ],
)
```

**Usage:** Detail pages, settings, profile info

### 7.4 SectionHeader - Content Organization

```dart
Row(
  children: [
    Container(
      width: 4,
      height: 20,
      decoration: BoxDecoration(
        color: primary,
        borderRadius: BorderRadius.circular(2),
      ),
    ),
    SizedBox(width: 12),
    Text(title, style: Headline Small),
    Spacer(),
    if (actionText != null)
      Text(actionText, style: Label Medium, color: textSecondary),
  ],
)
```

**Usage:** Separate content sections, visual hierarchy

### 7.5 StatusBadge - Enhanced States

```dart
Container(
  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
  decoration: BoxDecoration(
    color: statusColor.withOpacity(0.12),
    borderRadius: BorderRadius.circular(8),
    border: Border.all(
      color: statusColor.withOpacity(0.3),
      width: 1,
    ),
  ),
  child: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Container(
        width: 6,
        height: 6,
        decoration: BoxDecoration(
          color: statusColor,
          shape: BoxShape.circle,
        ),
      ),
      SizedBox(width: 6),
      Text(
        label,
        style: Label Small SemiBold,
        color: statusColor,
      ),
    ],
  ),
)
```

**States:**

- Safe: Green with dot indicator
- Warning: Orange with dot indicator
- Error: Red with dot indicator
- Processing: Gray with animated dot

### 7.6 SearchBar - Modern Input

```dart
TextField(
  decoration: InputDecoration(
    hintText: 'Tìm kiếm...',
    prefixIcon: Icon(Icons.search_rounded),
    filled: true,
    fillColor: surfaceBg,
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide(color: primary, width: 2),
    ),
  ),
)
```

**Features:**

- No border default state
- Filled background for depth
- Focus: Primary color border + shadow glow
- Clear button appears when text entered

### 7.7 FilterChip - Multi-Select

```dart
Container(
  padding: EdgeInsets.symmetric(horizontal: 14, vertical: 8),
  decoration: BoxDecoration(
    color: selected ? primary.withOpacity(0.12) : surfaceBg,
    borderRadius: BorderRadius.circular(20),
    border: Border.all(
      color: selected ? primary : dividerColor,
      width: 1.5,
    ),
  ),
  child: Text(
    label,
    style: Label Medium,
    color: selected ? primary : textSecondary,
  ),
)
```

**Usage:** Filters, categories, tags

### 7.8 ActionButton - Primary CTA

```dart
ElevatedButton(
  style: ElevatedButton.styleFrom(
    backgroundColor: primary,
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    elevation: 0,
    shadowColor: Colors.transparent,
  ),
  child: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(icon, size: 18),
      SizedBox(width: 8),
      Text(label, style: Label Large),
    ],
  ),
)
```

**States:**

- Default: Solid primary color
- Hover: Slightly lighter
- Pressed: Scale 0.96 + haptic
- Disabled: 40% opacity

---

## 8. Layout Patterns

### 8.1 List Item - Information Dense

```
┌─────────────────────────────────────┐
│ [Icon]  Title                [Badge]│
│         Subtitle                    │
│         Meta info • Timestamp       │
│                                     │
│ ─────────────────────────────────  │
│                                     │
│ [Action 1]  [Action 2]  [Action 3] │
└─────────────────────────────────────┘
```

**Spacing:** 16px padding, 12px between elements

### 8.2 Detail Page Header

```
┌─────────────────────────────────────┐
│ [Hero Image with Gradient Overlay] │
│                                     │
│ Title                               │
│ [Badge] [Badge]                     │
└─────────────────────────────────────┘
│                                     │
│ Section 1: Key Info                │
│ ┌─────────────────────────────┐   │
│ │ [Icon] Label      Value     │   │
│ │ [Icon] Label      Value     │   │
│ └─────────────────────────────┘   │
│                                     │
│ Section 2: Details                 │
│ ┌─────────────────────────────┐   │
│ │ Content...                  │   │
│ └─────────────────────────────┘   │
```

### 8.3 Dashboard Grid

```
┌──────────┬──────────┐
│  Stat 1  │  Stat 2  │
├──────────┼──────────┤
│  Stat 3  │  Stat 4  │
└──────────┴──────────┘

[Section Header]
┌─────────────────────┐
│ List Item 1         │
├─────────────────────┤
│ List Item 2         │
├─────────────────────┤
│ List Item 3         │
└─────────────────────┘
```

---

## 9. Animation Guidelines

### Timing Functions

```
Fast:     150ms - Micro-interactions (hover, tap)
Normal:   250ms - Standard transitions (page, modal)
Slow:     400ms - Complex animations (hero, reveal)
```

### Curves

```
Standard:     Curves.easeInOut
Decelerate:   Curves.easeOut (entering)
Accelerate:   Curves.easeIn (exiting)
Emphasized:   Curves.easeInOutCubic (hero)
```

### Common Animations

- **Fade In:** Opacity 0 → 1, 250ms
- **Scale In:** Scale 0.9 → 1, 250ms + Fade
- **Slide Up:** TranslateY 20 → 0, 300ms
- **Ripple:** Material ripple effect on tap

---

## 10. Responsive Breakpoints

```
Mobile S:   320px - 374px
Mobile M:   375px - 424px
Mobile L:   425px - 767px
Tablet:     768px - 1023px
Desktop:    1024px+
```

### Adaptive Spacing

```
Mobile:     16px page margins
Tablet:     24px page margins
Desktop:    32px page margins
```

---

## 11. Accessibility Standards

### Touch Targets

- Minimum: 44x44 dp
- Recommended: 48x48 dp
- Spacing between: 8dp minimum

### Color Contrast (WCAG AA)

- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Text Scaling

- Support dynamic type sizes
- Test at 200% scale
- Maintain layout integrity

---

## 12. Page-Specific Designs

### Search Results Page

**Layout:**

- Search bar sticky at top
- Filter chips horizontal scroll
- Results list with images (80x80)
- Load more on scroll
- Empty state with illustration

**Information Density:**

- Business name (2 lines max)
- Location + Business type
- Status badge + Violation count
- Thumbnail image

### Business Detail Page

**Layout:**

- Hero image (220px height)
- Floating back button
- Title overlay on image
- Tabbed sections or scrollable
- Action buttons at bottom

**Sections:**

1. Overview (badges, key info)
2. Certificates (expandable cards)
3. Licenses (expandable cards)
4. Violations (if any)
5. Contact info

### Dashboard Page

**Layout:**

- Welcome header with user name
- 2x2 stat grid
- Quick actions (4 buttons)
- Recent activity timeline
- Notifications preview

**Information:**

- Total businesses
- Active certificates
- Pending inspections
- Recent violations

---

## 13. Implementation Checklist

### Phase 1: Foundation

- [ ] Update AppTheme with new colors
- [ ] Implement shadow system
- [ ] Create spacing constants
- [ ] Update typography scale

### Phase 2: Core Components

- [ ] Enhanced AppCard
- [ ] StatCard for metrics
- [ ] InfoRow component
- [ ] SectionHeader component
- [ ] StatusBadge variants
- [ ] Modern SearchBar
- [ ] FilterChip component
- [ ] ActionButton styles

### Phase 3: Page Updates

- [ ] Search results page
- [ ] Business detail page
- [ ] Dashboard page
- [ ] Profile page
- [ ] Settings page

### Phase 4: Polish

- [ ] Add animations
- [ ] Test accessibility
- [ ] Responsive testing
- [ ] Performance optimization

---

## 14. Design Tokens (For Reference)

```dart
class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
  static const double xxxl = 32;
}

class AppRadius {
  static const double xs = 6;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
  static const double full = 9999;
}

class AppShadow {
  static List<BoxShadow> level1 = [
    BoxShadow(
      color: Colors.black.withOpacity(0.04),
      blurRadius: 8,
      offset: Offset(0, 2),
    ),
  ];

  static List<BoxShadow> level2 = [
    BoxShadow(
      color: Colors.black.withOpacity(0.08),
      blurRadius: 16,
      offset: Offset(0, 4),
    ),
  ];

  static List<BoxShadow> level3 = [
    BoxShadow(
      color: Colors.black.withOpacity(0.12),
      blurRadius: 24,
      offset: Offset(0, 8),
    ),
  ];
}
```

---

**End of Design System Documentation**
