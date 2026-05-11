import 'package:mobile_ui/data/remote/datasource/notification_datasource.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';

class NotificationRepository {
  final NotificationRemoteDataSource remoteDataSource;

  NotificationRepository({required this.remoteDataSource});

  /// Lấy thông báo cộng đồng
  Future<List<NotificationModel>> getCommunityNotifications() {
    return remoteDataSource.getCommunityNotifications();
  }

  /// Lấy thông báo cá nhân (token xác định user)
  Future<List<NotificationModel>> getPersonalNotifications() {
    return remoteDataSource.getPersonalNotifications();
  }
}
