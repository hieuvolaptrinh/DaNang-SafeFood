import 'package:mobile_ui/data/remote/datasource/home_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/notification_datasource.dart';
import 'package:mobile_ui/data/remote/model/home_models.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';

class HomeRepository {
  final HomeRemoteDataSource homeRemoteDataSource;
  final NotificationRemoteDataSource notificationRemoteDataSource;

  HomeRepository({
    required this.homeRemoteDataSource,
    required this.notificationRemoteDataSource,
  });

  Future<DashboardModel> getDashboard() {
    return homeRemoteDataSource.getDashboard();
  }

  Future<List<NotificationModel>> getCommunityNotifications() {
    return notificationRemoteDataSource.getCommunityNotifications();
  }
}
