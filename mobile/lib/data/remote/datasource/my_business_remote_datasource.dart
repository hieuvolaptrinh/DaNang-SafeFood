import 'dart:io';

import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class MyBusinessRemoteDataSource {
  final Dio dio;

  MyBusinessRemoteDataSource({required this.dio});

  /// Upload file (ảnh / pdf) lên Cloudinary qua endpoint backend
  /// Trả về secure_url để lưu vào hồ sơ.
  Future<String> uploadFile(String filePath) async {
    try {
      final file = File(filePath);
      if (!await file.exists()) {
        throw ApiException(
          statusCode: 400,
          message: 'File không tồn tại: $filePath',
        );
      }

      final ext = filePath.toLowerCase().split('.').last;
      final contentType = switch (ext) {
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'bmp' => 'image/bmp',
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' =>
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        _ => 'image/jpeg',
      };

      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          filePath,
          filename: filePath.split(Platform.pathSeparator).last,
          contentType: MediaType.parse(contentType),
        ),
      });

      final res = await dio.post(
        '/api/cloudinary/upload-document',
        data: formData,
      );

      final w = ApiResponseWrapper<String>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as String,
      );
      _ensureSuccess(w);
      return w.data!;
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

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

  /// Lấy danh sách phường xã (dùng để chọn khi tạo cơ sở)
  Future<List<PhuongXaModel>> getPhuongXaList() async {
    try {
      final res = await dio.get('/api/phuong-xa');
      final w = ApiResponseWrapper<List<dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as List<dynamic>,
      );
      _ensureSuccess(w);
      return w.data!
          .map((e) => PhuongXaModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  /// Tạo mới cơ sở kinh doanh.
  Future<MyBusinessModel> createBusiness({
    required String tenCoSo,
    String? soGiayPhep,
    DateTime? ngayHetHanGiayPhep,
    String? maPX,
    String? anhBia,
  }) async {
    try {
      final res = await dio.post(
        '/api/user/my-business',
        data: {
          'tenCoSo': tenCoSo,
          if (soGiayPhep != null && soGiayPhep.isNotEmpty)
            'soGiayPhep': soGiayPhep,
          if (ngayHetHanGiayPhep != null)
            'ngayHetHanGiayPhep': ngayHetHanGiayPhep
                .toIso8601String()
                .substring(0, 10),
          if (maPX != null && maPX.isNotEmpty) 'maPX': maPX,
          if (anhBia != null && anhBia.isNotEmpty) 'anhBia': anhBia,
        },
      );
      final w = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        res.data as Map<String, dynamic>,
        (j) => j as Map<String, dynamic>,
      );
      _ensureSuccess(w);
      return MyBusinessModel.fromJson(w.data!);
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
    String? maLoaiGiayTo,
    DateTime? ngayNop,
    DateTime? ngayCap,
    DateTime? ngayHetHan,
    String? trangThai,
    String? urlFile,
  }) async {
    try {
      final res = await dio.post(
        '/api/user/my-business/ho-so',
        data: {
          'maCoSo': maCoSo,
          if (maLoaiGiayTo != null) 'maLoaiGiayTo': maLoaiGiayTo,
          if (ngayNop != null)
            'ngayNop': ngayNop.toIso8601String().substring(0, 10),
          if (ngayCap != null)
            'ngayCap': ngayCap.toIso8601String().substring(0, 10),
          if (ngayHetHan != null)
            'ngayHetHan': ngayHetHan.toIso8601String().substring(0, 10),
          if (trangThai != null) 'trangThai': trangThai,
          if (urlFile != null) 'urlFile': urlFile,
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
    String? maLoaiGiayTo,
    DateTime? ngayNop,
    DateTime? ngayCap,
    DateTime? ngayHetHan,
    String? trangThai,
    String? urlFile,
  }) async {
    try {
      final res = await dio.put(
        '/api/user/my-business/ho-so/$maHoSo',
        data: {
          'maCoSo': maCoSo,
          if (maLoaiGiayTo != null) 'maLoaiGiayTo': maLoaiGiayTo,
          if (ngayNop != null)
            'ngayNop': ngayNop.toIso8601String().substring(0, 10),
          if (ngayCap != null)
            'ngayCap': ngayCap.toIso8601String().substring(0, 10),
          if (ngayHetHan != null)
            'ngayHetHan': ngayHetHan.toIso8601String().substring(0, 10),
          if (trangThai != null) 'trangThai': trangThai,
          if (urlFile != null) 'urlFile': urlFile,
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
