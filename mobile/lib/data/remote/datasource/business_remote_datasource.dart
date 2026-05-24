import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/business_models.dart';
import 'package:mobile_ui/data/remote/model/wrapper_model.dart';

class BusinessRemoteDataSource {
  final Dio dio;

  BusinessRemoteDataSource({required this.dio});

  Future<PagedResponse<BusinessSearchModel>> searchBusinesses({
    String? keyword,
    String? trangThai,
    String? maPX,
    int page = 0,
    int size = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{'page': page, 'size': size};

      if (keyword != null && keyword.isNotEmpty) {
        queryParams['keyword'] = keyword;
      }
      if (trangThai != null && trangThai.isNotEmpty && trangThai != 'Tất cả') {
        queryParams['trangThai'] = trangThai;
      }
      if (maPX != null && maPX.isNotEmpty) {
        queryParams['maPX'] = maPX;
      }

      final response = await dio.get(
        '/api/user/co-so-kinh-doanh/search',
        queryParameters: queryParams,
      );

      final wrapper =
          ApiResponseWrapper<PagedResponse<BusinessSearchModel>>.fromJson(
            response.data as Map<String, dynamic>,
            (json) => PagedResponse.fromJson(
              json as Map<String, dynamic>,
              (item) => BusinessSearchModel.fromJson(item),
            ),
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
        message: 'Có lỗi xảy ra khi tìm kiếm',
        details: error,
      );
    }
  }

  Future<BusinessDetailModel> getBusinessDetail(String maCoSo) async {
    try {
      final response = await dio.get('/api/user/co-so-kinh-doanh/$maCoSo');

      final wrapper = ApiResponseWrapper<BusinessDetailModel>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => BusinessDetailModel.fromJson(json as Map<String, dynamic>),
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
        message: 'Có lỗi xảy ra khi tải chi tiết',
        details: error,
      );
    }
  }

  /// Lấy toàn bộ cơ sở kinh doanh (size lớn) để AI phân tích.
  Future<List<BusinessSearchModel>> fetchAllBusinessesForAI() async {
    try {
      final response = await dio.get(
        '/api/user/co-so-kinh-doanh/search',
        queryParameters: {'page': 0, 'size': 500},
      );

      final wrapper =
          ApiResponseWrapper<PagedResponse<BusinessSearchModel>>.fromJson(
            response.data as Map<String, dynamic>,
            (json) => PagedResponse.fromJson(
              json as Map<String, dynamic>,
              (item) => BusinessSearchModel.fromJson(item),
            ),
          );

      if (!wrapper.isSuccess || wrapper.data == null) {
        throw ApiException(statusCode: wrapper.code, message: wrapper.message);
      }

      return wrapper.data!.content;
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
        message: 'Có lỗi xảy ra khi tải dữ liệu cho AI',
        details: error,
      );
    }
  }
}
