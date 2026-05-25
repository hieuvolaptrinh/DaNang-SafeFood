import 'package:dio/dio.dart';
import 'package:mobile_ui/core/utils/app_config.dart';

/// Service gọi API AI bên ngoài (ChatAnywhere / OpenAI compatible).
/// Hỗ trợ fallback qua nhiều model khi bị rate-limit (429).
class AiService {
  late final Dio _dio;

  // Danh sách model theo thứ tự ưu tiên
  final List<String> _models = [
    'gpt-3.5-turbo',
    'gpt-4o-mini',
    'deepseek-v3',
  ];

  AiService() {
    _dio = Dio(BaseOptions(
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 60),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
  }

  /// Gọi AI với [prompt]. Tự động fallback sang model khác khi bị 429.
  /// Trả về nội dung text từ AI.
  Future<String> askAI(String prompt) async {
    final apiKey = AppConfig.aiApiKey;
    final apiUrl = AppConfig.aiApiUrl;

    if (apiKey.isEmpty) {
      throw Exception('AI API Key chưa được cấu hình trong .env');
    }

    Exception? lastError;

    for (final model in _models) {
      try {
        final response = await _dio.post(
          apiUrl,
          options: Options(
            headers: {
              'Authorization': 'Bearer $apiKey',
            },
          ),
          data: {
            'model': model,
            'messages': [
              {
                'role': 'system',
                'content':
                    'Bạn là trợ lý AI chuyên tư vấn ẩm thực tại Đà Nẵng. '
                    'Bạn sẽ nhận được danh sách các cơ sở kinh doanh thực phẩm và yêu cầu từ người dùng. '
                    'Hãy phân tích và gợi ý các cơ sở phù hợp nhất dựa trên sở thích của họ. '
                    'Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu. '
                    'Nếu có cơ sở phù hợp, hãy liệt kê tên cơ sở, loại hình kinh doanh, địa chỉ (phường/xã), và trạng thái an toàn thực phẩm. '
                    'Ưu tiên gợi ý cơ sở đang "Hoạt động" và ít vi phạm.',
              },
              {'role': 'user', 'content': prompt},
            ],
          },
        );

        final data = response.data as Map<String, dynamic>;
        final choices = data['choices'] as List<dynamic>?;

        if (choices != null && choices.isNotEmpty) {
          final message = choices[0]['message'] as Map<String, dynamic>;
          return (message['content'] as String).trim();
        }

        throw Exception('AI không trả về kết quả hợp lệ');
      } on DioException catch (e) {
        // 429 Too Many Requests → thử model tiếp theo
        if (e.response?.statusCode == 429) {
          lastError = Exception('Đã hết lượt dùng model $model');
          continue;
        }

        // Các lỗi khác từ API
        final errorData = e.response?.data;
        if (errorData is Map<String, dynamic>) {
          final errorInfo = errorData['error'];
          if (errorInfo is Map<String, dynamic>) {
            final code = errorInfo['code']?.toString() ?? '';
            if (code.contains('429') ||
                code.toLowerCase().contains('too_many_requests')) {
              lastError = Exception('Đã hết lượt dùng model $model');
              continue;
            }
            throw Exception(
                errorInfo['message'] ?? 'Lỗi API AI với model $model');
          }
        }

        throw Exception('Không thể kết nối tới AI: ${e.message}');
      } catch (e) {
        if (e.toString().contains('429') ||
            e.toString().toLowerCase().contains('too_many_requests') ||
            e.toString().toLowerCase().contains('usage limit')) {
          lastError = Exception('Đã hết lượt dùng model ${_models.last}');
          continue;
        }
        rethrow;
      }
    }

    throw lastError ?? Exception('Tất cả các model AI đều không khả dụng.');
  }
}
