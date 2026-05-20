import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8080';

    final host = dotenv.env['API_HOST'] ?? '';
    if (host.isNotEmpty) {
      return '$host';
    }

    // Mặc định: Android emulator
    return 'http://10.0.2.2:8080';
  }

  // static String get baseUrl {
  //   // ip lấy qua wifi
  //   return 'http://10.46.80.97:8080';
  // }
}
