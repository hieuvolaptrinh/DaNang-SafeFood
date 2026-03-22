import 'package:equatable/equatable.dart';

enum RegisterStatus { initial, loading, success, error }

class RegisterState extends Equatable {
  final String fullName;
  final String email;
  final String password;
  final String confirmPassword;
  final String role;
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final RegisterStatus status;
  final String? errorMessage;
  final String? fullNameError;
  final String? emailError;
  final String? passwordError;
  final String? confirmPasswordError;

  const RegisterState({
    this.fullName = '',
    this.email = '',
    this.password = '',
    this.confirmPassword = '',
    this.role = 'citizen',
    this.obscurePassword = true,
    this.obscureConfirmPassword = true,
    this.status = RegisterStatus.initial,
    this.errorMessage,
    this.fullNameError,
    this.emailError,
    this.passwordError,
    this.confirmPasswordError,
  });

  RegisterState copyWith({
    String? fullName,
    String? email,
    String? password,
    String? confirmPassword,
    String? role,
    bool? obscurePassword,
    bool? obscureConfirmPassword,
    RegisterStatus? status,
    String? errorMessage,
    String? fullNameError,
    String? emailError,
    String? passwordError,
    String? confirmPasswordError,
  }) {
    return RegisterState(
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      password: password ?? this.password,
      confirmPassword: confirmPassword ?? this.confirmPassword,
      role: role ?? this.role,
      obscurePassword: obscurePassword ?? this.obscurePassword,
      obscureConfirmPassword:
          obscureConfirmPassword ?? this.obscureConfirmPassword,
      status: status ?? this.status,
      errorMessage: errorMessage,
      fullNameError: fullNameError,
      emailError: emailError,
      passwordError: passwordError,
      confirmPasswordError: confirmPasswordError,
    );
  }

  @override
  List<Object?> get props => [
        fullName, email, password, confirmPassword, role,
        obscurePassword, obscureConfirmPassword, status,
        errorMessage, fullNameError, emailError,
        passwordError, confirmPasswordError,
      ];
}
