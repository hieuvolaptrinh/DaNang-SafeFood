import 'package:equatable/equatable.dart';

enum ProfileStatus { initial, loading, loaded, error }

class ProfileState extends Equatable {
  final ProfileStatus status;
  final String name;
  final String email;
  final String phone;
  final String role;

  const ProfileState({
    this.status = ProfileStatus.initial,
    this.name = '',
    this.email = '',
    this.phone = '',
    this.role = '',
  });

  ProfileState copyWith({
    ProfileStatus? status,
    String? name,
    String? email,
    String? phone,
    String? role,
  }) {
    return ProfileState(
      status: status ?? this.status,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
    );
  }

  @override
  List<Object?> get props => [status, name, email, phone, role];
}
