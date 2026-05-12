class AuthRequest {
  final String identifier;
  final String password;

  const AuthRequest({required this.identifier, required this.password});

  Map<String, dynamic> toJson() {
    return {'identifier': identifier, 'password': password};
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

  const AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['accessToken'] as String? ?? '',
      refreshToken: json['refreshToken'] as String? ?? '',
      user: UserInfo.fromJson(json['user'] as Map<String, dynamic>? ?? {}),
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
