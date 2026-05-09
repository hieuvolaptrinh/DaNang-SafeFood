import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/auth_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSource({required this.dio});

  Future<AuthResponse> login(AuthRequest request) async {
    try {
      final response = await dio.post(
        '/api/auth/login',
        data: request.toJson(),
      );

      final wrapper = ApiResponseWrapper<AuthResponse>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => AuthResponse.fromJson(json as Map<String, dynamic>),
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(
          statusCode: wrapper.code,
          message: wrapper.message,
          details: wrapper.data,
        );
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
        throw ApiException(
          statusCode: wrapper.code,
          message: wrapper.message,
          details: wrapper.data,
        );
      }
      throw ApiException(
        statusCode: response?.statusCode ?? 500,
        message: 'Không thể kết nối tới máy chủ',
        details: error.message,
      );
    } catch (error) {
      throw ApiException(
        statusCode: 500,
        message: 'Có lỗi xảy ra. Vui lòng thử lại',
        details: error,
      );
    }
  }
}
