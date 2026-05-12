import 'package:mobile_ui/data/remote/model/notification_model.dart';

class DashboardModel {
  final int tongCoSoKinhDoanh;
  final int coSoHoatDong;
  final int phanAnhChuaXuLy;
  final int xuphatChoNop;
  final int thanhTraDangXuLy;

  const DashboardModel({
    required this.tongCoSoKinhDoanh,
    required this.coSoHoatDong,
    required this.phanAnhChuaXuLy,
    required this.xuphatChoNop,
    required this.thanhTraDangXuLy,
  });

  factory DashboardModel.fromJson(Map<String, dynamic> json) {
    return DashboardModel(
      tongCoSoKinhDoanh: (json['tongCoSoKinhDoanh'] as num?)?.toInt() ?? 0,
      coSoHoatDong: (json['coSoHoatDong'] as num?)?.toInt() ?? 0,
      phanAnhChuaXuLy: (json['phanAnhChuaXuLy'] as num?)?.toInt() ?? 0,
      xuphatChoNop: (json['xuphatChoNop'] as num?)?.toInt() ?? 0,
      thanhTraDangXuLy: (json['thanhTraDangXuLy'] as num?)?.toInt() ?? 0,
    );
  }

  factory DashboardModel.empty() {
    return const DashboardModel(
      tongCoSoKinhDoanh: 0,
      coSoHoatDong: 0,
      phanAnhChuaXuLy: 0,
      xuphatChoNop: 0,
      thanhTraDangXuLy: 0,
    );
  }
}

class HomeHighlights {
  final NotificationModel? banner;
  final List<NotificationModel> news;
  final List<NotificationModel> alerts;

  const HomeHighlights({
    required this.banner,
    required this.news,
    required this.alerts,
  });
}
