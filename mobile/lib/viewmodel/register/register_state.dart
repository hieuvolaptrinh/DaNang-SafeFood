import 'package:equatable/equatable.dart';

enum RegisterStatus { initial, loading, otpSent, verifying, success, error }

enum RegisterStep { enterInfo, enterOtp }

class RegisterState extends Equatable {
  final String fullName;
  final String email;
  final String phone;
  final String businessName;
  final String otp;
  final String password;
  final String confirmPassword;
  final String role;
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final RegisterStatus status;
  final RegisterStep step;
  final String? errorMessage;
  final String? successMessage;
  final String? fullNameError;
  final String? emailError;
  final String? phoneError;
  final String? passwordError;
  final String? confirmPasswordError;
  final String? otpError;
  final int resendCooldown;

  const RegisterState({
    this.fullName = '',
    this.email = '',
    this.phone = '',
    this.businessName = '',
    this.otp = '',
    this.password = '',
    this.confirmPassword = '',
    this.role = 'NTD',
    this.obscurePassword = true,
    this.obscureConfirmPassword = true,
    this.status = RegisterStatus.initial,
    this.step = RegisterStep.enterInfo,
    this.errorMessage,
    this.successMessage,
    this.fullNameError,
    this.emailError,
    this.phoneError,
    this.passwordError,
    this.confirmPasswordError,
    this.otpError,
    this.resendCooldown = 0,
  });

  bool get canResendOtp => resendCooldown <= 0;

  RegisterState copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? businessName,
    String? otp,
    String? password,
    String? confirmPassword,
    String? role,
    bool? obscurePassword,
    bool? obscureConfirmPassword,
    RegisterStatus? status,
    RegisterStep? step,
    String? errorMessage,
    String? successMessage,
    String? fullNameError,
    String? emailError,
    String? phoneError,
    String? passwordError,
    String? confirmPasswordError,
    String? otpError,
    int? resendCooldown,
  }) {
    return RegisterState(
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      businessName: businessName ?? this.businessName,
      otp: otp ?? this.otp,
      password: password ?? this.password,
      confirmPassword: confirmPassword ?? this.confirmPassword,
      role: role ?? this.role,
      obscurePassword: obscurePassword ?? this.obscurePassword,
      obscureConfirmPassword:
          obscureConfirmPassword ?? this.obscureConfirmPassword,
      status: status ?? this.status,
      step: step ?? this.step,
      errorMessage: errorMessage,
      successMessage: successMessage,
      fullNameError: fullNameError,
      emailError: emailError,
      phoneError: phoneError,
      passwordError: passwordError,
      confirmPasswordError: confirmPasswordError,
      otpError: otpError,
      resendCooldown: resendCooldown ?? this.resendCooldown,
    );
  }

  @override
  List<Object?> get props => [
    fullName,
    email,
    phone,
    businessName,
    otp,
    password,
    confirmPassword,
    role,
    obscurePassword,
    obscureConfirmPassword,
    status,
    step,
    errorMessage,
    successMessage,
    fullNameError,
    emailError,
    phoneError,
    passwordError,
    confirmPasswordError,
    otpError,
    resendCooldown,
  ];
}
