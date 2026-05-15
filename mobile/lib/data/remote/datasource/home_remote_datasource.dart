import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/home_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class HomeRemoteDataSource {
  final Dio dio;

  HomeRemoteDataSource({required this.dio});

  Future<DashboardModel> getDashboard() async {
    try {
      final response = await dio.get('/api/v1/thongke/dashboard');

      final wrapper = ApiResponseWrapper<DashboardModel>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => DashboardModel.fromJson(json as Map<String, dynamic>),
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return wrapper.data!;
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
        message: 'Có lỗi xảy ra khi tải thống kê',
        details: error,
      );
    }
  }
}
