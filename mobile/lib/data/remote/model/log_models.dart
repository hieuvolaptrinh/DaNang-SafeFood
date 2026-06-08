/// Một bản ghi lịch sử đăng nhập trả về từ backend.
///
/// `isAbnormal` được AI service gắn cờ. Nếu null thì coi là không xác định.
class LoginLog {
  final String maLog;
  final String ip;
  final DateTime? time;
  final String? location;
  final String? device;
  final bool? isAbnormal;

  const LoginLog({
    required this.maLog,
    required this.ip,
    required this.time,
    required this.location,
    required this.device,
    required this.isAbnormal,
  });

  bool get abnormal => isAbnormal == true;

  factory LoginLog.fromJson(Map<String, dynamic> json) {
    return LoginLog(
      maLog: json['maLog'] as String? ?? '',
      ip: json['ip'] as String? ?? '',
      time: _parseDate(json['time']),
      location: json['location'] as String?,
      device: json['device'] as String?,
      isAbnormal: json['isAbnormal'] as bool?,
    );
  }

  static DateTime? _parseDate(Object? raw) {
    if (raw is String && raw.isNotEmpty) {
      return DateTime.tryParse(raw);
    }
    return null;
  }
}
