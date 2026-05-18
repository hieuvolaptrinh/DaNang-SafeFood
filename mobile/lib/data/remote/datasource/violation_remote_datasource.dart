import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/violation_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

/// Datasource cho luồng xử phạt + thanh toán PayOS
class ViolationRemoteDataSource {
  final Dio dio;

  ViolationRemoteDataSource({required this.dio});

  /// GET /api/user/vi-pham — danh sách vi phạm của CSKD đăng nhập
  Future<List<ViolationModel>> getMyViolations() async {
    try {
      final res = await dio.get('/api/user/vi-pham');
      final wrapper = ApiResponseWrapper<List<dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (json) => json as List<dynamic>,
      );
      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }
      return wrapper.data!
          .map((e) => ViolationModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  /// GET /api/user/vi-pham/{maViPham} — chi tiết 1 vi phạm
  Future<ViolationModel> getViolationDetail(String maViPham) async {
    try {
      final res = await dio.get('/api/user/vi-pham/$maViPham');
      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );
      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }
      return ViolationModel.fromJson(wrapper.data!);
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  /// POST /api/user/khac-phuc/payment — tạo link thanh toán PayOS
  Future<PaymentModel> createPayment({
    required String maViPham,
    String? description,
  }) async {
    try {
      final res = await dio.post(
        '/api/user/khac-phuc/payment',
        data: {
          'maViPham': maViPham,
          if (description != null) 'description': description,
        },
      );
      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );
      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }
      return PaymentModel.fromJson(wrapper.data!);
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  /// GET /api/user/khac-phuc/payment/{orderCode}
  Future<PaymentModel> getPayment(int orderCode) async {
    try {
      final res = await dio.get('/api/user/khac-phuc/payment/$orderCode');
      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );
      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }
      return PaymentModel.fromJson(wrapper.data!);
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  /// POST /api/user/khac-phuc/payment/{orderCode}/sync
  /// Mobile gọi để buộc BE đồng bộ trạng thái với PayOS (nếu webhook chưa về).
  Future<PaymentModel> syncPayment(int orderCode) async {
    try {
      final res = await dio.post('/api/user/khac-phuc/payment/$orderCode/sync');
      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );
      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }
      return PaymentModel.fromJson(wrapper.data!);
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  ApiException _toException(DioException error) {
    final res = error.response;
    if (res?.data is Map<String, dynamic>) {
      final wrapper = ApiResponseWrapper<Object?>.fromJson(
        res!.data as Map<String, dynamic>,
        (j) => j,
      );
      return ApiException(statusCode: wrapper.code, message: wrapper.message);
    }
    return ApiException(
      statusCode: res?.statusCode ?? 500,
      message: 'Không thể kết nối máy chủ',
      details: error.message,
    );
  }
}
