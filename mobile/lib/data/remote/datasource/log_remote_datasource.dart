import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/log_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class LogRemoteDataSource {
  final Dio dio;

  LogRemoteDataSource({required this.dio});

  /// Lấy lịch sử đăng nhập của người dùng hiện tại.
  Future<List<LoginLog>> getMyLoginHistory() async {
    try {
      final response = await dio.get('/api/log/me');

      final wrapper = ApiResponseWrapper<List<dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => (json as List<dynamic>?) ?? const [],
      );

      if (!wrapper.isSuccess) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      final raw = wrapper.data ?? const [];
      return raw
          .whereType<Map<String, dynamic>>()
          .map(LoginLog.fromJson)
          .toList();
    } on DioException catch (error) {
      final response = error.response;
      if (response?.data is Map<String, dynamic>) {
        final data = response!.data as Map<String, dynamic>;
        final wrapper = ApiResponseWrapper<Object?>.fromJson(
          data,
          (json) => json,
        );
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
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
        message: 'Không thể tải lịch sử đăng nhập',
        details: error,
      );
    }
  }
}
