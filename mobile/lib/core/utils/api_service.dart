import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile_ui/core/utils/app_exception.dart';

Future<T> handleStandardResponse<T>(http.Response res) async {
  final body = jsonDecode(res.body) as Map<String, dynamic>;

  final int statusCode = body['statusCode'] ?? res.statusCode;

  if (statusCode >= 400) {
    final message = body['message'];
    throw ApiException(statusCode: statusCode, message: message);
  }

  // Thành công => trả về data
  final data = body['data'];

  // vẫn nên check nhẹ tránh cast sai kiểu
  if (data is! T) {
    throw FormatException(
      'Expected data of type $T but got ${data.runtimeType}',
    );
  }
  return data;
}
