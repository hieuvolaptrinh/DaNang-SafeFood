import 'dart:io';
import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class ComplaintRemoteDataSource {
  final Dio dio;

  ComplaintRemoteDataSource({required this.dio});

  /// Lấy danh sách phản ánh của người dùng hiện tại
  Future<List<ComplaintSummary>> getMyComplaints() async {
    try {
      final response = await dio.get('/api/user/phan-anh');

      final wrapper = ApiResponseWrapper<List<dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as List<dynamic>,
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return wrapper.data!
          .map(
            (item) => ComplaintSummary.fromJson(item as Map<String, dynamic>),
          )
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
        message: 'Có lỗi xảy ra khi tải danh sách phản ánh',
        details: error,
      );
    }
  }

  /// Lấy chi tiết phản ánh theo ID
  Future<ComplaintSummary> getComplaintDetail(String id) async {
    try {
      final response = await dio.get('/api/user/phan-anh/$id');

      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return ComplaintSummary.fromJson(wrapper.data!);
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
        message: 'Có lỗi xảy ra khi tải chi tiết phản ánh',
        details: error,
      );
    }
  }

  /// Lấy danh sách loại phản ánh
  Future<List<ComplaintType>> getComplaintTypes() async {
    try {
      final response = await dio.get('/api/user/phan-anh/loai');

      final wrapper = ApiResponseWrapper<List<dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as List<dynamic>,
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return wrapper.data!
          .map((item) => ComplaintType.fromJson(item as Map<String, dynamic>))
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
        message: 'Có lỗi xảy ra khi tải loại phản ánh',
        details: error,
      );
    }
  }

  /// Tạo phản ánh mới
  Future<ComplaintSummary> createComplaint(
    ComplaintCreateRequest request,
  ) async {
    try {
      final response = await dio.post(
        '/api/user/phan-anh',
        data: request.toJson(),
      );

      final wrapper = ApiResponseWrapper<Map<String, dynamic>>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as Map<String, dynamic>,
      );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return ComplaintSummary.fromJson(wrapper.data!);
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
        message: 'Có lỗi xảy ra khi tạo phản ánh',
        details: error,
      );
    }
  }

  /// Upload ảnh lên Cloudinary
  Future<String> uploadImage(String filePath) async {
    return _uploadFileInternal(filePath);
  }

  /// Upload file (ảnh, video, tài liệu) lên Cloudinary
  Future<String> uploadFile(String filePath) async {
    return _uploadFileInternal(filePath);
  }

  Future<String> _uploadFileInternal(String filePath) async {
    try {
      final file = File(filePath);
      if (!await file.exists()) {
        throw ApiException(
          statusCode: 400,
          message: 'File không tồn tại: $filePath',
        );
      }

      // Xác định content type dựa trên extension
      final extension = filePath.toLowerCase().split('.').last;
      String contentType;
      switch (extension) {
        case 'png':
          contentType = 'image/png';
          break;
        case 'gif':
          contentType = 'image/gif';
          break;
        case 'webp':
          contentType = 'image/webp';
          break;
        case 'bmp':
          contentType = 'image/bmp';
          break;
        case 'mp4':
          contentType = 'video/mp4';
          break;
        case 'mov':
          contentType = 'video/quicktime';
          break;
        case 'avi':
          contentType = 'video/x-msvideo';
          break;
        case 'mkv':
          contentType = 'video/x-matroska';
          break;
        case 'wmv':
          contentType = 'video/x-ms-wmv';
          break;
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'doc':
          contentType = 'application/msword';
          break;
        case 'docx':
          contentType =
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        default:
          contentType = 'image/jpeg';
      }

      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          filePath,
          filename: filePath.split('/').last,
          contentType: MediaType.parse(contentType),
        ),
      });

      final response = await dio.post(
        '/api/cloudinary/upload-optimized',
        data: formData,
      );

      final wrapper = ApiResponseWrapper<String>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => json as String,
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
        message: 'Có lỗi xảy ra khi upload tệp',
        details: error,
      );
    }
  }
}
