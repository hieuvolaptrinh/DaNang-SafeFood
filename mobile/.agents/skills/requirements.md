# Requirements Document: Modern UI Design System

## Introduction

Tài liệu này mô tả các yêu cầu cho việc nâng cấp Design System của ứng dụng DaNang Safe Food sang phong cách hiện đại với Soft UI + Material 3. Mục tiêu là tạo ra một hệ thống thiết kế nhất quán, dễ bảo trì, và mang lại trải nghiệm người dùng cao cấp thông qua việc sử dụng depth (độ sâu) với shadow thay vì border, phân cấp màu nền rõ ràng, và các component Material 3 hiện đại.

## Glossary

- **Design_System**: Hệ thống thiết kế bao gồm theme, typography, colors, và reusable components
- **Soft_UI**: Phong cách thiết kế sử dụng shadow nhẹ và gradient để tạo depth thay vì border cứng
- **Material_3**: Phiên bản mới nhất của Material Design từ Google với dynamic color và improved components
- **AppCard**: Component card tái sử dụng để hiển thị nội dung trong container
- **AppTextField**: Component input field tùy chỉnh cho form nhập liệu
- **AppButton**: Component button tùy chỉnh cho các action
- **BentoGrid**: Layout lưới linh hoạt với các ô có kích thước khác nhau (2x2, 2x1, 1x1)
- **CustomBottomSheet**: Bottom sheet tùy chỉnh với bo góc cho map interactions
- **TimelineView**: Component hiển thị timeline với đường line dọc
- **SafetyScoreCard**: Card lớn hiển thị điểm an toàn với circular progress indicator
- **FilterChipGroup**: Nhóm Material 3 FilterChip cho filtering
- **SwipeableListTile**: ListTile có thể vuốt trái/phải để hiện actions
- **Typography_System**: Hệ thống typography với font Inter và letter spacing tùy chỉnh
- **Shadow_System**: Hệ thống shadow với các mức độ elevation khác nhau
- **Surface_Hierarchy**: Phân cấp màu nền để tạo visual hierarchy
- **Citizen_User**: Người dùng là công dân hoặc du khách
- **Business_User**: Người dùng là chủ cơ sở kinh doanh

## Requirements

### Requirement 1: Design Philosophy - Soft UI Implementation

**User Story:** Là một designer, tôi muốn áp dụng triết lý "Clean & Trust" với Soft UI, để tạo ra giao diện hiện đại và dễ nhìn cho người dùng.

#### Acceptance Criteria

1. THE Design_System SHALL use shadow-based depth instead of borders for all components
2. THE Design_System SHALL define a shadow system with at least 3 elevation levels (low: 0.05 opacity, medium: 0.08 opacity, high: 0.12 opacity)
3. THE Design_System SHALL use surface color hierarchy (scaffoldBg, surfaceBg, cardColor) to create visual hierarchy
4. THE Design_System SHALL minimize border usage to only essential cases (dividers, focus states)
5. WHERE borders are required, THE Design_System SHALL use subtle colors with maximum 0.5 width

### Requirement 2: AppCard Component Upgrade

**User Story:** Là một developer, tôi muốn nâng cấp AppCard component sang Soft UI style, để có card đẹp hơn và nhất quán với design system mới.

#### Acceptance Criteria

1. WHEN AppCard is rendered, THE AppCard SHALL remove all border styling
2. WHEN AppCard is rendered, THE AppCard SHALL apply BoxShadow with opacity 0.05, blurRadius 10, and offset (0, 2)
3. THE AppCard SHALL use borderRadius of 16 pixels
4. THE AppCard SHALL maintain backward compatibility with existing padding and margin parameters
5. WHEN AppCard has onTap callback, THE AppCard SHALL apply hover effect with shadow elevation increase
6. FOR ALL AppCard instances, rendering with new shadow SHALL produce visually consistent depth across the app

### Requirement 3: AppTextField Component Upgrade

**User Story:** Là một developer, tôi muốn nâng cấp AppTextField sang shadow-based design, để input fields có vẻ hiện đại và mềm mại hơn.

#### Acceptance Criteria

1. WHEN AppTextField is in default state, THE AppTextField SHALL use filled style with surfaceBg color and no border
2. WHEN AppTextField is in default state, THE AppTextField SHALL apply subtle shadow (opacity 0.03, blurRadius 4)
3. WHEN AppTextField receives focus, THE AppTextField SHALL increase shadow intensity (opacity 0.08, blurRadius 8) and add primary color glow
4. WHEN AppTextField has error, THE AppTextField SHALL show error color glow instead of border
5. THE AppTextField SHALL use borderRadius of 12 pixels
6. THE AppTextField SHALL maintain all existing parameters (label, hint, controller, etc.)

### Requirement 4: AppButton Component Upgrade

**User Story:** Là một developer, tôi muốn nâng cấp AppButton với Stadium Border cho action buttons, để buttons có vẻ hiện đại và dễ nhận diện hơn.

#### Acceptance Criteria

1. WHEN AppButton is primary button, THE AppButton SHALL use StadiumBorder (fully rounded)
2. WHEN AppButton is outlined button, THE AppButton SHALL use StadiumBorder with shadow instead of border
3. WHEN AppButton is pressed, THE AppButton SHALL apply subtle scale animation (0.98)
4. THE AppButton SHALL apply elevation shadow (opacity 0.15, blurRadius 12) for primary buttons
5. THE AppButton SHALL maintain all existing parameters (text, icon, loading state, etc.)
6. WHEN AppButton has icon, THE AppButton SHALL maintain proper spacing between icon and text

### Requirement 5: Typography System Enhancement

**User Story:** Là một designer, tôi muốn cải thiện typography system với letter spacing tùy chỉnh, để text có vẻ cao cấp và dễ đọc hơn.

#### Acceptance Criteria

1. THE Typography_System SHALL add letterSpacing of -0.5 to displayLarge style
2. THE Typography_System SHALL add letterSpacing of -0.3 to displayMedium style
3. THE Typography_System SHALL add letterSpacing of -0.2 to displaySmall style
4. THE Typography_System SHALL maintain Google Fonts Inter for all text styles
5. THE Typography_System SHALL ensure all existing text styles remain backward compatible
6. FOR ALL typography changes, text rendering SHALL maintain readability across different screen sizes

### Requirement 6: BentoGrid Layout Component

**User Story:** Là một developer, tôi muốn tạo BentoGrid component, để có thể xây dựng home screen với layout lưới linh hoạt.

#### Acceptance Criteria

1. THE BentoGrid SHALL support grid items with sizes: 2x2, 2x1, 1x2, and 1x1
2. THE BentoGrid SHALL automatically arrange items to fill available space efficiently
3. THE BentoGrid SHALL apply consistent spacing (12 pixels) between grid items
4. THE BentoGrid SHALL support responsive layout that adapts to screen width
5. WHEN BentoGrid contains items, THE BentoGrid SHALL render each item with proper shadow elevation
6. THE BentoGrid SHALL accept a list of BentoGridItem widgets with size specifications
7. FOR ALL grid arrangements, items SHALL maintain their aspect ratios and not overlap

### Requirement 7: CustomBottomSheet Component

**User Story:** Là một developer, tôi muốn tạo CustomBottomSheet với bo góc 24.0, để hiển thị thông tin map một cách đẹp mắt.

#### Acceptance Criteria

1. THE CustomBottomSheet SHALL use borderRadius of 24 pixels for top corners
2. THE CustomBottomSheet SHALL support draggable handle for user interaction
3. THE CustomBottomSheet SHALL apply shadow elevation (opacity 0.12, blurRadius 20)
4. THE CustomBottomSheet SHALL support variable height (initial, half, full)
5. WHEN CustomBottomSheet is dragged, THE CustomBottomSheet SHALL animate smoothly between height states
6. THE CustomBottomSheet SHALL use white background color with proper contrast
7. THE CustomBottomSheet SHALL support custom content widget as child

### Requirement 8: TimelineView Component

**User Story:** Là một developer, tôi muốn tạo TimelineView component, để hiển thị lịch sử kiểm định theo dạng timeline.

#### Acceptance Criteria

1. THE TimelineView SHALL render a vertical line connecting timeline items
2. THE TimelineView SHALL display timeline nodes as circles with 12 pixel diameter
3. THE TimelineView SHALL support different node colors based on status (success, warning, error)
4. THE TimelineView SHALL display timestamp and content for each timeline item
5. WHEN TimelineView has multiple items, THE TimelineView SHALL maintain consistent spacing (24 pixels) between items
6. THE TimelineView SHALL use primary color for the connecting line
7. THE TimelineView SHALL support custom widgets as timeline item content

### Requirement 9: SafetyScoreCard Component

**User Story:** Là một Business_User, tôi muốn xem Safety Score Card với circular progress indicator, để nhanh chóng đánh giá tình trạng an toàn của cơ sở.

#### Acceptance Criteria

1. THE SafetyScoreCard SHALL display a CircularProgressIndicator with strokeWidth of 8 pixels
2. THE SafetyScoreCard SHALL show score value as percentage in the center of the circle
3. THE SafetyScoreCard SHALL use color coding: green (>80), orange (50-80), red (<50)
4. THE SafetyScoreCard SHALL display score label and last updated timestamp
5. THE SafetyScoreCard SHALL apply card shadow elevation consistent with Design_System
6. WHEN SafetyScoreCard displays score, THE SafetyScoreCard SHALL animate progress from 0 to actual value
7. THE SafetyScoreCard SHALL use borderRadius of 20 pixels for premium look

### Requirement 10: FilterChipGroup Component

**User Story:** Là một Citizen_User, tôi muốn sử dụng filter chips để lọc reports, để dễ dàng tìm thấy thông tin cần thiết.

#### Acceptance Criteria

1. THE FilterChipGroup SHALL use Material 3 FilterChip widgets
2. THE FilterChipGroup SHALL support single-select and multi-select modes
3. WHEN FilterChip is selected, THE FilterChip SHALL show primary color background with white text
4. WHEN FilterChip is unselected, THE FilterChip SHALL show surfaceBg background with shadow
5. THE FilterChipGroup SHALL arrange chips in a horizontal scrollable row
6. THE FilterChipGroup SHALL apply consistent spacing (8 pixels) between chips
7. THE FilterChipGroup SHALL notify parent widget when selection changes via callback

### Requirement 11: SwipeableListTile Component

**User Story:** Là một Business_User, tôi muốn vuốt list items để hiện actions, để quản lý documents một cách nhanh chóng.

#### Acceptance Criteria

1. THE SwipeableListTile SHALL support swipe-right gesture to reveal primary action
2. THE SwipeableListTile SHALL support swipe-left gesture to reveal secondary action
3. WHEN SwipeableListTile is swiped, THE SwipeableListTile SHALL animate smoothly with spring physics
4. THE SwipeableListTile SHALL display action icons and labels behind the tile
5. WHEN SwipeableListTile swipe exceeds threshold, THE SwipeableListTile SHALL trigger the action callback
6. THE SwipeableListTile SHALL auto-dismiss after action is triggered
7. THE SwipeableListTile SHALL use primary color for right-swipe action and accent color for left-swipe action

### Requirement 12: Citizen User Interface - Home Screen

**User Story:** Là một Citizen_User, tôi muốn có home screen với Bento Grid layout, để dễ dàng truy cập các tính năng chính.

#### Acceptance Criteria

1. THE Citizen_Home_Screen SHALL use BentoGrid layout with 4 main sections
2. THE Citizen_Home_Screen SHALL display Map Preview in a 2x2 grid item
3. THE Citizen_Home_Screen SHALL display News section in a 2x1 grid item
4. THE Citizen_Home_Screen SHALL display QR Scanner button in a 1x1 grid item
5. THE Citizen_Home_Screen SHALL display Quick Report button in a 1x1 grid item
6. THE Citizen_Home_Screen SHALL apply generous white space (20 pixels padding) around content
7. THE Citizen_Home_Screen SHALL use shadow elevation consistently across all grid items

### Requirement 13: Citizen User Interface - Map Interface

**User Story:** Là một Citizen_User, tôi muốn xem map với custom markers và bottom sheet, để tìm kiếm thông tin cơ sở kinh doanh.

#### Acceptance Criteria

1. THE Map_Interface SHALL use custom markers with green color for verified businesses
2. THE Map_Interface SHALL use custom markers with orange color for businesses with warnings
3. WHEN Map_Interface marker is tapped, THE Map_Interface SHALL show CustomBottomSheet with business details
4. THE Map_Interface SHALL apply silver/retro map style for visual consistency
5. THE CustomBottomSheet SHALL display business name, address, safety status, and action buttons
6. THE Map_Interface SHALL support zoom and pan gestures
7. THE Map_Interface SHALL cluster markers when zoom level is low

### Requirement 14: Citizen User Interface - Report Flow

**User Story:** Là một Citizen_User, tôi muốn report vi phạm qua 3 bước đơn giản, để nhanh chóng báo cáo vấn đề.

#### Acceptance Criteria

1. THE Report_Flow SHALL consist of exactly 3 steps: Photo Upload, Violation Selection, Confirmation
2. WHEN Report_Flow Step 1 is active, THE Report_Flow SHALL allow photo capture or gallery selection
3. WHEN Report_Flow Step 2 is active, THE Report_Flow SHALL display FilterChipGroup for violation types
4. WHEN Report_Flow Step 3 is active, THE Report_Flow SHALL show summary with AppButton for submission
5. THE Report_Flow SHALL use minimalist design with generous white space
6. THE Report_Flow SHALL display progress indicator showing current step (1/3, 2/3, 3/3)
7. THE Report_Flow SHALL allow navigation back to previous steps

### Requirement 15: Business User Interface - Professional Dashboard

**User Story:** Là một Business_User, tôi muốn xem professional dashboard với Safety Score Card, để theo dõi tình trạng cơ sở kinh doanh.

#### Acceptance Criteria

1. THE Business_Dashboard SHALL display SafetyScoreCard as the primary component
2. THE Business_Dashboard SHALL display Quick Actions section with 4 action buttons
3. THE Business_Dashboard SHALL use professional color scheme with subtle shadows
4. THE Business_Dashboard SHALL display recent activity timeline below SafetyScoreCard
5. THE Business_Dashboard SHALL apply consistent spacing (16 pixels) between sections
6. THE Business_Dashboard SHALL use shadow elevation to create visual hierarchy
7. THE Business_Dashboard SHALL support pull-to-refresh gesture

### Requirement 16: Business User Interface - Document Management

**User Story:** Là một Business_User, tôi muốn quản lý documents với swipeable list tiles, để dễ dàng thực hiện actions trên documents.

#### Acceptance Criteria

1. THE Document_Management SHALL display documents as SwipeableListTile items
2. THE Document_Management SHALL show status badge with background color (no border) for each document
3. WHEN Document_Management tile is swiped right, THE Document_Management SHALL reveal "View" action
4. WHEN Document_Management tile is swiped left, THE Document_Management SHALL reveal "Delete" action
5. THE Document_Management SHALL support search and filter functionality
6. THE Document_Management SHALL display document icon, name, date, and status
7. THE Document_Management SHALL use shadow elevation for list tiles instead of dividers

### Requirement 17: Business User Interface - Notification Center

**User Story:** Là một Business_User, tôi muốn xem notifications trong timeline style, để theo dõi các thông báo quan trọng.

#### Acceptance Criteria

1. THE Notification_Center SHALL use TimelineView component to display notifications
2. THE Notification_Center SHALL show notification icon, title, description, and timestamp
3. THE Notification_Center SHALL use color-coded timeline nodes based on notification type
4. THE Notification_Center SHALL support mark-as-read functionality
5. WHEN Notification_Center notification is unread, THE Notification_Center SHALL display bold text
6. THE Notification_Center SHALL display divider line between timeline items
7. THE Notification_Center SHALL support pull-to-refresh to fetch new notifications

### Requirement 18: Color Strategy Implementation

**User Story:** Là một designer, tôi muốn implement color strategy rõ ràng, để đảm bảo consistency trong toàn bộ ứng dụng.

#### Acceptance Criteria

1. THE Design_System SHALL use Primary Green (#2E7D32) for success states, verified status, and main CTAs
2. THE Design_System SHALL use Accent Orange (#F57C00) for reports, warnings, and map highlights
3. THE Design_System SHALL use surfaceBg (#F5F5F5) as background color for screens
4. THE Design_System SHALL use cardColor (white) for elevated content
5. THE Design_System SHALL define semantic colors for success, warning, error, and info states
6. THE Design_System SHALL ensure all colors meet WCAG AA contrast requirements
7. FOR ALL color combinations, contrast ratio SHALL be at least 4.5:1 for normal text and 3:1 for large text

### Requirement 19: Shadow System Definition

**User Story:** Là một developer, tôi muốn có shadow system được định nghĩa rõ ràng, để áp dụng consistent shadows trong toàn bộ app.

#### Acceptance Criteria

1. THE Shadow_System SHALL define elevation level 1: opacity 0.05, blurRadius 10, offset (0, 2)
2. THE Shadow_System SHALL define elevation level 2: opacity 0.08, blurRadius 16, offset (0, 4)
3. THE Shadow_System SHALL define elevation level 3: opacity 0.12, blurRadius 24, offset (0, 8)
4. THE Shadow_System SHALL provide utility methods to apply shadows to widgets
5. THE Shadow_System SHALL support custom shadow colors for special cases (primary glow, error glow)
6. THE Shadow_System SHALL ensure shadows are subtle and not overwhelming
7. FOR ALL shadow applications, visual depth SHALL be perceivable but not distracting

### Requirement 20: Responsive Design Support

**User Story:** Là một developer, tôi muốn đảm bảo design system responsive, để ứng dụng hoạt động tốt trên mọi kích thước màn hình mobile.

#### Acceptance Criteria

1. THE Design_System SHALL support screen widths from 320px to 428px (mobile range)
2. THE Design_System SHALL use relative sizing (MediaQuery) for spacing and dimensions
3. WHEN Design_System components are rendered on small screens, THE Design_System SHALL adjust padding and font sizes appropriately
4. THE Design_System SHALL ensure touch targets are at least 44x44 pixels
5. THE Design_System SHALL test layouts on iPhone SE (small), iPhone 14 (medium), and iPhone 14 Pro Max (large)
6. THE Design_System SHALL maintain visual hierarchy across all screen sizes
7. FOR ALL responsive layouts, content SHALL remain readable and accessible without horizontal scrolling

### Requirement 21: Documentation Deliverables

**User Story:** Là một developer, tôi muốn có documentation đầy đủ, để dễ dàng sử dụng và maintain design system.

#### Acceptance Criteria

1. THE Design_System SHALL provide DESIGN_SYSTEM_GUIDE.md with component specifications
2. THE Design_System SHALL provide UI_PLANNING_FOR_USERS.md with citizen user interface guidelines
3. THE Design_System SHALL provide UI_PLANNING_FOR_BUSINESS.md with business user interface guidelines
4. THE DESIGN_SYSTEM_GUIDE.md SHALL include code examples for all components
5. THE DESIGN_SYSTEM_GUIDE.md SHALL include visual examples (ASCII art or descriptions) for shadow levels
6. THE UI_PLANNING documents SHALL include screen layouts and component usage guidelines
7. THE documentation SHALL include migration guide from old components to new components

### Requirement 22: Backward Compatibility

**User Story:** Là một developer, tôi muốn đảm bảo backward compatibility, để không phá vỡ code hiện tại khi nâng cấp components.

#### Acceptance Criteria

1. THE Design_System SHALL maintain all existing component parameters and APIs
2. THE Design_System SHALL provide deprecation warnings for old styling approaches
3. WHEN Design_System components are upgraded, THE Design_System SHALL not break existing screens
4. THE Design_System SHALL support gradual migration with both old and new styles coexisting
5. THE Design_System SHALL provide migration utilities or scripts where applicable
6. THE Design_System SHALL document breaking changes (if any) clearly
7. FOR ALL component upgrades, existing functionality SHALL remain intact

### Requirement 23: Performance Optimization

**User Story:** Là một developer, tôi muốn đảm bảo design system không ảnh hưởng performance, để ứng dụng vẫn mượt mà.

#### Acceptance Criteria

1. THE Design_System SHALL ensure shadow rendering does not cause frame drops
2. THE Design_System SHALL use const constructors where possible for components
3. THE Design_System SHALL avoid unnecessary rebuilds with proper widget keys
4. WHEN Design_System components are rendered, THE Design_System SHALL maintain 60fps on mid-range devices
5. THE Design_System SHALL optimize image assets and use appropriate formats
6. THE Design_System SHALL lazy-load heavy components when appropriate
7. FOR ALL animations, frame rate SHALL remain above 55fps during transitions

### Requirement 24: Accessibility Compliance

**User Story:** Là một user với visual impairment, tôi muốn ứng dụng accessible, để có thể sử dụng app với screen reader.

#### Acceptance Criteria

1. THE Design_System SHALL provide semantic labels for all interactive components
2. THE Design_System SHALL ensure all text meets minimum contrast requirements (WCAG AA)
3. THE Design_System SHALL support dynamic text sizing
4. THE Design_System SHALL provide focus indicators for keyboard navigation
5. THE Design_System SHALL ensure all interactive elements have minimum 44x44 touch targets
6. THE Design_System SHALL provide alternative text for all icons and images
7. THE Design_System SHALL test with TalkBack (Android) and VoiceOver (iOS) screen readers

### Requirement 25: Theme Configuration

**User Story:** Là một developer, tôi muốn cấu hình theme dễ dàng, để có thể customize design system cho các use cases khác nhau.

#### Acceptance Criteria

1. THE Design_System SHALL centralize all theme values in AppTheme class
2. THE Design_System SHALL support theme extensions for custom properties
3. THE Design_System SHALL provide shadow theme data with elevation levels
4. THE Design_System SHALL allow override of default values through theme parameters
5. THE Design_System SHALL ensure theme changes propagate to all components automatically
6. THE Design_System SHALL provide theme preview utilities for development
7. FOR ALL theme configurations, changes SHALL be reflected immediately without app restart
