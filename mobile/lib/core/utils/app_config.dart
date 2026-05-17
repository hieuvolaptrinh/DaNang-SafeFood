import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  /// Đọc API_HOST từ file .env (runtime)
  /// File .env nằm ở thư mục mobile/.env
  ///
  /// Ví dụ nội dung .env:
  ///   API_HOST=10.46.80.129
  ///
  /// Đổi mạng → sửa IP trong .env → chạy lại app.
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8080';

    final host = dotenv.env['API_HOST'] ?? '';
    if (host.isNotEmpty) {
      return 'http://$host:8080';
    }

    // Mặc định: Android emulator
    return 'http://10.0.2.2:8080';
  }

  static const String apiTest = "https://jsonplaceholder.typicode.com";
}
