import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  // static String get baseUrl {
  //   if (kIsWeb) return 'http://localhost:8080';

  //   final host = dotenv.env['API_HOST'] ?? '';
  //   if (host.isNotEmpty) {
  //     return '$host';
  //   }

  //   // Mặc định: Android emulator
  //   return 'http://10.0.2.2:8080';
  // }

  static String get baseUrl {
    // ip lấy qua wifi
    return 'http://192.168.1.13:8080';
  }

  // ── AI API Config ──
  static String get aiApiKey =>
      dotenv.env['AI_API_KEY'] ?? '';

  static String get aiApiUrl =>
      dotenv.env['AI_API_URL'] ??
      'https://api.chatanywhere.tech/v1/chat/completions';
}
