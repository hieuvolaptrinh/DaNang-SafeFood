import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/repository/notification_repository.dart';
import 'package:mobile_ui/viewmodel/notification/notification_state.dart';

class NotificationCubit extends Cubit<NotificationState> {
  final NotificationRepository repository;

  NotificationCubit({
    required this.repository,
  }) : super(const NotificationState());

  /// Load cả cộng đồng và cá nhân
  Future<void> loadAll() async {
    await Future.wait([
      loadCommunityNotifications(),
      loadPersonalNotifications(),
    ]);
  }

  /// Load thông báo cộng đồng
  Future<void> loadCommunityNotifications() async {
    emit(state.copyWith(communityStatus: NotificationStatus.loading));
    try {
      final data = await repository.getCommunityNotifications();
      emit(state.copyWith(
        communityStatus:
            data.isEmpty ? NotificationStatus.empty : NotificationStatus.loaded,
        communityNotifications: data,
      ));
    } on ApiException catch (e) {
      emit(state.copyWith(
        communityStatus: NotificationStatus.error,
        errorMessage: e.message,
      ));
    } catch (_) {
      emit(state.copyWith(
        communityStatus: NotificationStatus.error,
        errorMessage: 'Không thể tải thông báo cộng đồng',
      ));
    }
  }

  /// Load thông báo cá nhân (token xác định user)
  Future<void> loadPersonalNotifications() async {
    emit(state.copyWith(personalStatus: NotificationStatus.loading));
    try {
      final data = await repository.getPersonalNotifications();
      emit(state.copyWith(
        personalStatus:
            data.isEmpty ? NotificationStatus.empty : NotificationStatus.loaded,
        personalNotifications: data,
      ));
    } on ApiException catch (e) {
      emit(state.copyWith(
        personalStatus: NotificationStatus.error,
        errorMessage: e.message,
      ));
    } catch (_) {
      emit(state.copyWith(
        personalStatus: NotificationStatus.error,
        errorMessage: 'Không thể tải thông báo cá nhân',
      ));
    }
  }

  /// Chuyển tab
  void switchTab(NotificationTab tab) {
    emit(state.copyWith(activeTab: tab, selectedCategory: 'Tất cả'));
  }

  /// Lọc theo loại thông báo
  void filterByCategory(String category) {
    emit(state.copyWith(selectedCategory: category));
  }

  /// Refresh tab hiện tại
  Future<void> refresh() async {
    if (state.activeTab == NotificationTab.community) {
      await loadCommunityNotifications();
    } else {
      await loadPersonalNotifications();
    }
  }
}
