import 'package:flutter/foundation.dart' show kIsWeb;

class AppConfig {
  /// Web → localhost, Android Emulator → 10.0.2.2
  static String get baseUrl =>
      kIsWeb ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

  static const String apiTest = "https://jsonplaceholder.typicode.com";
}
