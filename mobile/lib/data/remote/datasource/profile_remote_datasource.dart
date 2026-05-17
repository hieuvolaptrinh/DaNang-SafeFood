import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/profile_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class ProfileRemoteDataSource {
  final Dio dio;

  ProfileRemoteDataSource({required this.dio});

  /// Lấy thông tin profile người dùng hiện tại
  Future<ProfileModel> getProfile() async {
    try {
      final response = await dio.get('/api/profile/me');

      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return ProfileModel.fromJson(wrapper.data!);
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
        message: 'Có lỗi xảy ra khi tải thông tin cá nhân',
        details: error,
      );
    }
  }

  /// Cập nhật thông tin cá nhân
  Future<ProfileModel> updateProfile(UpdateProfileRequest request) async {
    try {
      final response = await dio.put(
        '/api/profile/me',
        data: request.toJson(),
      );

      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return ProfileModel.fromJson(wrapper.data!);
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
        message: 'Có lỗi xảy ra khi cập nhật thông tin',
        details: error,
      );
    }
  }

  /// Đổi mật khẩu
  Future<String> changePassword(ChangePasswordRequest request) async {
    try {
      final response = await dio.put(
        '/api/profile/change-password',
        data: request.toJson(),
      );

      final wrapper = ApiResponseWrapper<Object?>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json,
      );

      if (!wrapper.isSuccess) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return wrapper.message;
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
        message: 'Có lỗi xảy ra khi đổi mật khẩu',
        details: error,
      );
    }
  }
}
