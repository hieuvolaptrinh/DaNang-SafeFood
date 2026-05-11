import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';

enum NotificationStatus { initial, loading, loaded, empty, error }

/// Tab hiển thị: Cộng đồng hoặc Cá nhân
enum NotificationTab { community, personal }

class NotificationState extends Equatable {
  final NotificationStatus communityStatus;
  final NotificationStatus personalStatus;
  final List<NotificationModel> communityNotifications;
  final List<NotificationModel> personalNotifications;
  final NotificationTab activeTab;
  final String selectedCategory;
  final String? errorMessage;

  const NotificationState({
    this.communityStatus = NotificationStatus.initial,
    this.personalStatus = NotificationStatus.initial,
    this.communityNotifications = const [],
    this.personalNotifications = const [],
    this.activeTab = NotificationTab.community,
    this.selectedCategory = 'Tất cả',
    this.errorMessage,
  });

  /// Lấy notifications của tab đang active, đã filter theo category
  List<NotificationModel> get filteredNotifications {
    final source = activeTab == NotificationTab.community
        ? communityNotifications
        : personalNotifications;

    if (selectedCategory == 'Tất cả') return source;
    return source
        .where((n) => n.loaiThongBao == selectedCategory)
        .toList();
  }

  /// Status của tab đang active
  NotificationStatus get activeStatus =>
      activeTab == NotificationTab.community
          ? communityStatus
          : personalStatus;

  NotificationState copyWith({
    NotificationStatus? communityStatus,
    NotificationStatus? personalStatus,
    List<NotificationModel>? communityNotifications,
    List<NotificationModel>? personalNotifications,
    NotificationTab? activeTab,
    String? selectedCategory,
    String? errorMessage,
  }) {
    return NotificationState(
      communityStatus: communityStatus ?? this.communityStatus,
      personalStatus: personalStatus ?? this.personalStatus,
      communityNotifications:
          communityNotifications ?? this.communityNotifications,
      personalNotifications:
          personalNotifications ?? this.personalNotifications,
      activeTab: activeTab ?? this.activeTab,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [
        communityStatus,
        personalStatus,
        communityNotifications,
        personalNotifications,
        activeTab,
        selectedCategory,
        errorMessage,
      ];
}
