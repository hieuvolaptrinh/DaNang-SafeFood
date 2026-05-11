import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/repository/auth_repository.dart';
import 'package:mobile_ui/viewmodel/forgot_password/forgot_password_state.dart';

class ForgotPasswordCubit extends Cubit<ForgotPasswordState> {
  final AuthRepository authRepository;
  Timer? _resendTimer;

  ForgotPasswordCubit({required this.authRepository})
      : super(const ForgotPasswordState());

  // ─── Input handlers ─────────────────────────────────────
  void emailChanged(String v) =>
      emit(state.copyWith(email: v, emailError: null, errorMessage: null));

  void otpChanged(String v) =>
      emit(state.copyWith(otp: v, otpError: null, errorMessage: null));

  void newPasswordChanged(String v) =>
      emit(state.copyWith(newPassword: v, passwordError: null, errorMessage: null));

  void confirmPasswordChanged(String v) =>
      emit(state.copyWith(confirmPassword: v, passwordError: null, errorMessage: null));

  void toggleObscurePassword() =>
      emit(state.copyWith(obscurePassword: !state.obscurePassword));

  void toggleObscureConfirmPassword() =>
      emit(state.copyWith(obscureConfirmPassword: !state.obscureConfirmPassword));

  // ─── Bước 1: Gửi OTP ───────────────────────────────────
  Future<void> sendOtp() async {
    final email = state.email.trim();
    if (email.isEmpty) {
      emit(state.copyWith(emailError: 'Vui lòng nhập email'));
      return;
    }
    if (!_isValidEmail(email)) {
      emit(state.copyWith(emailError: 'Email không hợp lệ'));
      return;
    }

    emit(state.copyWith(status: ForgotPasswordStatus.loading));

    try {
      await authRepository.sendOtp(email: email);
      emit(state.copyWith(
        status: ForgotPasswordStatus.otpSent,
        step: ForgotPasswordStep.enterOtp,
        successMessage: 'Mã OTP đã được gửi đến email của bạn',
      ));
      _startResendCooldown();
    } on ApiException catch (e) {
      emit(state.copyWith(
        status: ForgotPasswordStatus.error,
        errorMessage: e.message,
      ));
    } catch (_) {
      emit(state.copyWith(
        status: ForgotPasswordStatus.error,
        errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại.',
      ));
    }
  }

  // ─── Gửi lại OTP (đợi 30s) ─────────────────────────────
  Future<void> resendOtp() async {
    if (!state.canResendOtp) return;
    await sendOtp();
  }

  // ─── Bước 2 → 3: Chuyển sang nhập mật khẩu mới ─────────
  void proceedToResetPassword() {
    final otp = state.otp.trim();
    if (otp.isEmpty) {
      emit(state.copyWith(otpError: 'Vui lòng nhập mã OTP'));
      return;
    }
    if (otp.length != 6) {
      emit(state.copyWith(otpError: 'Mã OTP phải gồm 6 chữ số'));
      return;
    }
    emit(state.copyWith(
      step: ForgotPasswordStep.resetPassword,
      otpError: null,
    ));
  }

  // ─── Bước 3: Đặt lại mật khẩu ──────────────────────────
  Future<void> resetPassword() async {
    final newPassword = state.newPassword.trim();
    final confirmPassword = state.confirmPassword.trim();

    if (newPassword.isEmpty) {
      emit(state.copyWith(passwordError: 'Vui lòng nhập mật khẩu mới'));
      return;
    }
    if (newPassword.length < 6) {
      emit(state.copyWith(passwordError: 'Mật khẩu phải có ít nhất 6 ký tự'));
      return;
    }
    if (newPassword != confirmPassword) {
      emit(state.copyWith(passwordError: 'Mật khẩu xác nhận không khớp'));
      return;
    }

    emit(state.copyWith(status: ForgotPasswordStatus.verifying));

    try {
      await authRepository.resetPassword(
        email: state.email.trim(),
        otp: state.otp.trim(),
        newPassword: newPassword,
      );
      emit(state.copyWith(
        status: ForgotPasswordStatus.success,
        successMessage: 'Đặt lại mật khẩu thành công!',
      ));
    } on ApiException catch (e) {
      emit(state.copyWith(
        status: ForgotPasswordStatus.error,
        errorMessage: e.message,
      ));
    } catch (_) {
      emit(state.copyWith(
        status: ForgotPasswordStatus.error,
        errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại.',
      ));
    }
  }

  // ─── Quay lại bước trước ────────────────────────────────
  void goBack() {
    switch (state.step) {
      case ForgotPasswordStep.enterOtp:
        emit(state.copyWith(
          step: ForgotPasswordStep.enterEmail,
          otp: '',
          status: ForgotPasswordStatus.initial,
        ));
        break;
      case ForgotPasswordStep.resetPassword:
        emit(state.copyWith(
          step: ForgotPasswordStep.enterOtp,
          newPassword: '',
          confirmPassword: '',
          status: ForgotPasswordStatus.otpSent,
        ));
        break;
      default:
        break;
    }
  }

  // ─── Timer cooldown 30s ─────────────────────────────────
  void _startResendCooldown() {
    _resendTimer?.cancel();
    emit(state.copyWith(resendCooldown: 30));
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final remaining = state.resendCooldown - 1;
      if (remaining <= 0) {
        timer.cancel();
        emit(state.copyWith(resendCooldown: 0));
      } else {
        emit(state.copyWith(resendCooldown: remaining));
      }
    });
  }

  bool _isValidEmail(String email) {
    return RegExp(r'^[\w\-.]+@([\w\-]+\.)+[\w\-]{2,4}$').hasMatch(email);
  }

  @override
  Future<void> close() {
    _resendTimer?.cancel();
    return super.close();
  }
}
