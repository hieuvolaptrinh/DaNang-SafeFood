import 'package:equatable/equatable.dart';

/// Vai trò người dùng trong hệ thống
enum AppRole {
  /// Cơ sở kinh doanh
  cskd,

  /// Người tiêu dùng
  ntd,

  /// Quản trị hệ thống
  admin,

  /// Các quyền khác (Lãnh đạo, Thanh tra, Kiểm định...)
  other,
}

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthState extends Equatable {
  final AuthStatus status;
  final String? accessToken;
  final String? username;
  final int? userId;
  final String? fullName;
  final String? email;
  final String? phone;
  final List<String> roles;

  const AuthState({
    this.status = AuthStatus.unknown,
    this.accessToken,
    this.username,
    this.userId,
    this.fullName,
    this.email,
    this.phone,
    this.roles = const [],
  });

  /// Kiểm tra user có phải Cơ sở kinh doanh không
  bool get isCSKD => roles.contains('ROLE_CSKD');

  /// Kiểm tra user có phải Người tiêu dùng không
  bool get isNTD => roles.contains('ROLE_NTD');

  /// Kiểm tra user có phải Admin không
  bool get isAdmin => roles.contains('ROLE_QTH');

  /// Lấy AppRole chính (ưu tiên theo thứ tự)
  AppRole get primaryRole {
    if (isAdmin) return AppRole.admin;
    if (isCSKD) return AppRole.cskd;
    if (isNTD) return AppRole.ntd;
    return AppRole.other;
  }

  bool get isAuthenticated => status == AuthStatus.authenticated;

  AuthState copyWith({
    AuthStatus? status,
    String? accessToken,
    String? username,
    int? userId,
    String? fullName,
    String? email,
    String? phone,
    List<String>? roles,
  }) {
    return AuthState(
      status: status ?? this.status,
      accessToken: accessToken ?? this.accessToken,
      username: username ?? this.username,
      userId: userId ?? this.userId,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      roles: roles ?? this.roles,
    );
  }

  @override
  List<Object?> get props => [
        status,
        accessToken,
        username,
        userId,
        fullName,
        email,
        phone,
        roles,
      ];
}
