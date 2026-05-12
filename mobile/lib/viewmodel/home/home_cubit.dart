import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/home_models.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';
import 'package:mobile_ui/data/remote/repository/home_repository.dart';
import 'package:mobile_ui/viewmodel/home/home_state.dart';

class HomeCubit extends Cubit<HomeState> {
  final HomeRepository homeRepository;

  HomeCubit({required this.homeRepository}) : super(const HomeState());

  Future<void> loadData() async {
    emit(state.copyWith(status: HomeStatus.loading, errorMessage: null));

    DashboardModel dashboard = DashboardModel.empty();
    List<NotificationModel> notifications = [];
    ApiException? dashboardError;
    ApiException? notificationError;

    try {
      dashboard = await homeRepository.getDashboard();
    } on ApiException catch (error) {
      dashboardError = error;
    } catch (_) {
      dashboardError = ApiException(
        statusCode: 500,
        message: 'Có lỗi xảy ra khi tải thống kê',
      );
    }

    try {
      notifications = await homeRepository.getCommunityNotifications();
    } on ApiException catch (error) {
      notificationError = error;
    } catch (_) {
      notificationError = ApiException(
        statusCode: 500,
        message: 'Có lỗi xảy ra khi tải thông báo',
      );
    }

    if (dashboardError != null && notificationError != null) {
      emit(
        state.copyWith(
          status: HomeStatus.error,
          errorMessage: notificationError.message,
        ),
      );
      return;
    }

    final highlights = _buildHighlights(notifications);

    emit(
      state.copyWith(
        status: HomeStatus.loaded,
        errorMessage: null,
        inspectedPlaces: dashboard.coSoHoatDong,
        recentViolations: dashboard.xuphatChoNop,
        newComplaints: dashboard.phanAnhChuaXuLy,
        banner: highlights.banner,
        news: highlights.news,
        alerts: highlights.alerts,
      ),
    );
  }

  Future<void> refresh() async {
    await loadData();
  }

  HomeHighlights _buildHighlights(List<NotificationModel> notifications) {
    if (notifications.isEmpty) {
      return const HomeHighlights(banner: null, news: [], alerts: []);
    }

    bool isAlert(NotificationModel item) {
      final type = (item.loaiThongBao ?? '').toLowerCase();
      return type.contains('khẩn') ||
          type.contains('canh bao') ||
          type.contains('cảnh báo');
    }

    final alerts = notifications.where(isAlert).take(3).toList();
    final news = notifications.where((item) => !isAlert(item)).take(3).toList();

    NotificationModel? banner;
    if (alerts.isNotEmpty) {
      banner = alerts.first;
    } else {
      banner = notifications.first;
    }

    return HomeHighlights(banner: banner, news: news, alerts: alerts);
  }
}
