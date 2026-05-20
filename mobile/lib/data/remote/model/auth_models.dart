import 'package:mobile_ui/data/remote/model/log_models.dart';

class AuthRequest {
  final String identifier;
  final String password;
  final String? location;
  final String? device;

  const AuthRequest({
    required this.identifier,
    required this.password,
    this.location,
    this.device,
  });

  Map<String, dynamic> toJson() {
    return {
      'identifier': identifier,
      'password': password,
      if (location != null && location!.isNotEmpty) 'location': location,
      if (device != null && device!.isNotEmpty) 'device': device,
    };
  }
}

class RegisterVerifyRequest {
  final String fullName;
  final String email;
  final String? phone;
  final String password;
  final String otp;
  final String role;
  final String? businessName;

  const RegisterVerifyRequest({
    required this.fullName,
    required this.email,
    this.phone,
    required this.password,
    required this.otp,
    required this.role,
    this.businessName,
  });

  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'password': password,
      'otp': otp,
      'role': role,
      'businessName': businessName,
    };
  }
}

class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final UserInfo user;
  final LoginLog? loginLog;

  const AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
    this.loginLog,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['accessToken'] as String? ?? '',
      refreshToken: json['refreshToken'] as String? ?? '',
      user: UserInfo.fromJson(json['user'] as Map<String, dynamic>? ?? {}),
      loginLog: json['loginLog'] is Map<String, dynamic>
          ? LoginLog.fromJson(json['loginLog'] as Map<String, dynamic>)
          : null,
    );
  }
}

class UserInfo {
  final int id;
  final String username;
  final String fullName;
  final String? email;
  final String? phone;
  final List<String> role;
  final bool enabled;

  const UserInfo({
    required this.id,
    required this.username,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.role,
    required this.enabled,
  });

  factory UserInfo.fromJson(Map<String, dynamic> json) {
    return UserInfo(
      id: (json['id'] as num?)?.toInt() ?? 0,
      username: json['username'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      role: (json['role'] as List<dynamic>? ?? [])
          .map((item) => item.toString())
          .toList(),
      enabled: json['enabled'] as bool? ?? false,
    );
  }
}
