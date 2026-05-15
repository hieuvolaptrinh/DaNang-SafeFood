import 'package:equatable/equatable.dart';

/// Model chứa thông tin profile người dùng
class ProfileModel extends Equatable {
  final int id;
  final String username;
  final String fullName;
  final String? email;
  final String? phone;
  final List<String> roles;

  const ProfileModel({
    required this.id,
    required this.username,
    required this.fullName,
    this.email,
    this.phone,
    this.roles = const [],
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      id: (json['id'] as num?)?.toInt() ?? 0,
      username: json['username'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      roles: (json['roles'] as List<dynamic>? ?? [])
          .map((e) => e.toString())
          .toList(),
    );
  }

  @override
  List<Object?> get props => [id, username, fullName, email, phone, roles];
}

/// Request cập nhật thông tin cá nhân
class UpdateProfileRequest extends Equatable {
  final String? fullName;
  final String? email;
  final String? phone;

  const UpdateProfileRequest({this.fullName, this.email, this.phone});

  Map<String, dynamic> toJson() {
    return {
      if (fullName != null) 'fullName': fullName,
      if (email != null) 'email': email,
      if (phone != null) 'phone': phone,
    };
  }

  @override
  List<Object?> get props => [fullName, email, phone];
}

/// Request đổi mật khẩu
class ChangePasswordRequest extends Equatable {
  final String currentPassword;
  final String newPassword;

  const ChangePasswordRequest({
    required this.currentPassword,
    required this.newPassword,
  });

  Map<String, dynamic> toJson() {
    return {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    };
  }

  @override
  List<Object?> get props => [currentPassword, newPassword];
}
