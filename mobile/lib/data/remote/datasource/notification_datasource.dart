import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class NotificationRemoteDataSource {
  final Dio dio;

  NotificationRemoteDataSource({required this.dio});

  /// Lấy thông báo cộng đồng (ai cũng xem được)
  Future<List<NotificationModel>> getCommunityNotifications() async {
    return _fetchNotifications('/api/thong-bao/cong-dong');
  }

  /// Lấy thông báo cá nhân (dùng token xác định người dùng)
  Future<List<NotificationModel>> getPersonalNotifications() async {
    return _fetchNotifications('/api/thong-bao/ca-nhan');
  }

  Future<List<NotificationModel>> _fetchNotifications(String path) async {
    try {
      final response = await dio.get(path);

      final wrapper = ApiResponseWrapper<List<dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as List<dynamic>,
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(
          statusCode: wrapper.code,
          message: wrapper.message,
        );
      }

      return wrapper.data!
          .map((item) =>
              NotificationModel.fromJson(item as Map<String, dynamic>))
          .toList();
    } on DioException catch (error) {
      final response = error.response;
      if (response?.data is Map<String, dynamic>) {
        final data = response!.data as Map<String, dynamic>;
        final wrapper = ApiResponseWrapper<Object?>.fromJson(
          data,
          (json) => json,
        );
        throw ApiException(
          statusCode: wrapper.code,
          message: wrapper.message,
        );
      }
      throw ApiException(
        statusCode: response?.statusCode ?? 500,
        message: 'Không thể kết nối tới máy chủ',
        details: error.message,
      );
    } catch (error) {
      if (error is ApiException) rethrow;
      throw ApiException(
        statusCode: 500,
        message: 'Có lỗi xảy ra khi tải thông báo',
        details: error,
      );
    }
  }
}
