import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_config.dart';
import 'package:mobile_ui/data/local/token_storage.dart';

class DioClient {
  final Dio dio;
  final TokenStorage _tokenStorage;

  DioClient({Dio? dio, TokenStorage? tokenStorage})
      : dio = dio ?? Dio(),
        _tokenStorage = tokenStorage ?? TokenStorage() {
    this.dio.options = BaseOptions(
      baseUrl: AppConfig.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
      sendTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    // Interceptor tự động đính kèm Bearer token cho các request được bảo vệ
    this.dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Bỏ qua các endpoint public (auth)
          final path = options.path;
          if (path.contains('/api/auth/')) {
            return handler.next(options);
          }

          final token = await _tokenStorage.getAccessToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
      ),
    );
  }
}
