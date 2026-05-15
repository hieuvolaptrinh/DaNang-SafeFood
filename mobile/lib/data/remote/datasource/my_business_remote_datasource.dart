import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class MyBusinessRemoteDataSource {
  final Dio dio;

  MyBusinessRemoteDataSource({required this.dio});

  Future<List<MyBusinessModel>> getMyBusinesses() async {
    try {
      final res = await dio.get('/api/user/my-business');
      final w = ApiResponseWrapper<List<dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as List<dynamic>,
      );
      _ensureSuccess(w);
      return w.data!
          .map((e) => MyBusinessModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  Future<List<HoSoDangKiModel>> getMyHoSoList() async {
    try {
      final res = await dio.get('/api/user/my-business/ho-so');
      final w = ApiResponseWrapper<List<dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as List<dynamic>,
      );
      _ensureSuccess(w);
      return w.data!
          .map((e) => HoSoDangKiModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  Future<List<HoSoDangKiModel>> getHoSoByCoSo(String maCoSo) async {
    try {
      final res = await dio.get('/api/user/my-business/$maCoSo/ho-so');
      final w = ApiResponseWrapper<List<dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as List<dynamic>,
      );
      _ensureSuccess(w);
      return w.data!
          .map((e) => HoSoDangKiModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  Future<HoSoDangKiModel> createHoSo({
    required String maCoSo,
    DateTime? ngayNop,
    String? trangThai,
  }) async {
    try {
      final res = await dio.post(
        '/api/user/my-business/ho-so',
        data: {
          'maCoSo': maCoSo,
          if (ngayNop != null)
            'ngayNop': ngayNop.toIso8601String().substring(0, 10),
          if (trangThai != null) 'trangThai': trangThai,
        },
      );
      final w = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as Map<String, dynamic>,
      );
      _ensureSuccess(w);
      return HoSoDangKiModel.fromJson(w.data!);
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  Future<HoSoDangKiModel> updateHoSo({
    required String maHoSo,
    required String maCoSo,
    DateTime? ngayNop,
    String? trangThai,
  }) async {
    try {
      final res = await dio.put(
        '/api/user/my-business/ho-so/$maHoSo',
        data: {
          'maCoSo': maCoSo,
          if (ngayNop != null)
            'ngayNop': ngayNop.toIso8601String().substring(0, 10),
          if (trangThai != null) 'trangThai': trangThai,
        },
      );
      final w = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as Map<String, dynamic>,
      );
      _ensureSuccess(w);
      return HoSoDangKiModel.fromJson(w.data!);
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  Future<void> deleteHoSo(String maHoSo) async {
    try {
      final res = await dio.delete('/api/user/my-business/ho-so/$maHoSo');
      final w = ApiResponseWrapper<Object?>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j,
      );
      _ensureSuccess(w);
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  void _ensureSuccess(ApiResponseWrapper w) {
    if (!w.isSuccess) {
      throw ApiException(statusCode: w.code, message: w.message);
    }
  }

  ApiException _toException(DioException error) {
    final res = error.response;
    if (res?.data is Map<String, dynamic>) {
      final w = ApiResponseWrapper<Object?>.fromJson(
        res!.data as Map<String, dynamic>,
        (j) => j,
      );
      return ApiException(statusCode: w.code, message: w.message);
    }
    return ApiException(
      statusCode: res?.statusCode ?? 500,
      message: 'Không thể kết nối tới máy chủ',
      details: error.message,
    );
  }
}
