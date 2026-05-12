import 'package:equatable/equatable.dart';

enum ForgotPasswordStatus { initial, loading, otpSent, verifying, success, error }

/// Bước hiện tại trong flow quên mật khẩu
enum ForgotPasswordStep { enterEmail, enterOtp, resetPassword }

class ForgotPasswordState extends Equatable {
  final String email;
  final String otp;
  final String newPassword;
  final String confirmPassword;
  final ForgotPasswordStatus status;
  final ForgotPasswordStep step;
  final String? emailError;
  final String? otpError;
  final String? passwordError;
  final String? errorMessage;
  final String? successMessage;

  /// Countdown giây còn lại trước khi cho phép gửi lại OTP
  final int resendCooldown;

  /// Ẩn/hiện mật khẩu
  final bool obscurePassword;
  final bool obscureConfirmPassword;

  const ForgotPasswordState({
    this.email = '',
    this.otp = '',
    this.newPassword = '',
    this.confirmPassword = '',
    this.status = ForgotPasswordStatus.initial,
    this.step = ForgotPasswordStep.enterEmail,
    this.emailError,
    this.otpError,
    this.passwordError,
    this.errorMessage,
    this.successMessage,
    this.resendCooldown = 0,
    this.obscurePassword = true,
    this.obscureConfirmPassword = true,
  });

  bool get canResendOtp => resendCooldown <= 0;

  ForgotPasswordState copyWith({
    String? email,
    String? otp,
    String? newPassword,
    String? confirmPassword,
    ForgotPasswordStatus? status,
    ForgotPasswordStep? step,
    String? emailError,
    String? otpError,
    String? passwordError,
    String? errorMessage,
    String? successMessage,
    int? resendCooldown,
    bool? obscurePassword,
    bool? obscureConfirmPassword,
  }) {
    return ForgotPasswordState(
      email: email ?? this.email,
      otp: otp ?? this.otp,
      newPassword: newPassword ?? this.newPassword,
      confirmPassword: confirmPassword ?? this.confirmPassword,
      status: status ?? this.status,
      step: step ?? this.step,
      emailError: emailError,
      otpError: otpError,
      passwordError: passwordError,
      errorMessage: errorMessage,
      successMessage: successMessage,
      resendCooldown: resendCooldown ?? this.resendCooldown,
      obscurePassword: obscurePassword ?? this.obscurePassword,
      obscureConfirmPassword: obscureConfirmPassword ?? this.obscureConfirmPassword,
    );
  }

  @override
  List<Object?> get props => [
        email,
        otp,
        newPassword,
        confirmPassword,
        status,
        step,
        emailError,
        otpError,
        passwordError,
        errorMessage,
        successMessage,
        resendCooldown,
        obscurePassword,
        obscureConfirmPassword,
      ];
}
