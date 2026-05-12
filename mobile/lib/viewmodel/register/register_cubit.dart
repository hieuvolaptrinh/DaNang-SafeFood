import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/auth_models.dart';
import 'package:mobile_ui/data/remote/repository/auth_repository.dart';
import 'package:mobile_ui/viewmodel/register/register_state.dart';

class RegisterCubit extends Cubit<RegisterState> {
  final AuthRepository authRepository;
  Timer? _resendTimer;

  RegisterCubit({required this.authRepository}) : super(const RegisterState());

  void fullNameChanged(String v) => emit(
    state.copyWith(fullName: v, fullNameError: null, errorMessage: null),
  );

  void emailChanged(String v) =>
      emit(state.copyWith(email: v, emailError: null, errorMessage: null));

  void phoneChanged(String v) =>
      emit(state.copyWith(phone: v, phoneError: null, errorMessage: null));

  void businessNameChanged(String v) =>
      emit(state.copyWith(businessName: v, errorMessage: null));

  void otpChanged(String v) =>
      emit(state.copyWith(otp: v, otpError: null, errorMessage: null));

  void passwordChanged(String v) => emit(
    state.copyWith(password: v, passwordError: null, errorMessage: null),
  );

  void confirmPasswordChanged(String v) => emit(
    state.copyWith(
      confirmPassword: v,
      confirmPasswordError: null,
      errorMessage: null,
    ),
  );

  void roleChanged(String v) => emit(state.copyWith(role: v));

  void togglePassword() =>
      emit(state.copyWith(obscurePassword: !state.obscurePassword));

  void toggleConfirmPassword() => emit(
    state.copyWith(obscureConfirmPassword: !state.obscureConfirmPassword),
  );

  Future<void> sendOtp() async {
    if (!_validateInfo()) return;

    emit(state.copyWith(status: RegisterStatus.loading, errorMessage: null));

    try {
      await authRepository.sendRegisterOtp(email: state.email.trim());
      emit(
        state.copyWith(
          status: RegisterStatus.otpSent,
          step: RegisterStep.enterOtp,
          successMessage: 'Mã OTP đã được gửi đến email của bạn',
        ),
      );
      _startResendCooldown();
    } on ApiException catch (error) {
      emit(
        state.copyWith(
          status: RegisterStatus.error,
          errorMessage: error.message,
        ),
      );
    } catch (_) {
      emit(
        state.copyWith(
          status: RegisterStatus.error,
          errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại',
        ),
      );
    }
  }

  Future<void> resendOtp() async {
    if (!state.canResendOtp) return;
    await sendOtp();
  }

  Future<AuthResponse?> verifyRegister() async {
    final otp = state.otp.trim();
    if (otp.isEmpty) {
      emit(state.copyWith(otpError: 'Vui lòng nhập mã OTP'));
      return null;
    }
    if (otp.length != 6) {
      emit(state.copyWith(otpError: 'Mã OTP phải gồm 6 chữ số'));
      return null;
    }

    emit(state.copyWith(status: RegisterStatus.verifying, errorMessage: null));

    try {
      final response = await authRepository.verifyRegister(
        request: RegisterVerifyRequest(
          fullName: state.fullName.trim(),
          email: state.email.trim(),
          phone: state.phone.trim().isEmpty ? null : state.phone.trim(),
          password: state.password,
          otp: otp,
          role: state.role,
          businessName: state.businessName.trim().isEmpty
              ? null
              : state.businessName.trim(),
        ),
      );
      emit(state.copyWith(status: RegisterStatus.success));
      return response;
    } on ApiException catch (error) {
      emit(
        state.copyWith(
          status: RegisterStatus.error,
          errorMessage: error.message,
        ),
      );
      return null;
    } catch (_) {
      emit(
        state.copyWith(
          status: RegisterStatus.error,
          errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại',
        ),
      );
      return null;
    }
  }

  void goBackToInfo() {
    emit(
      state.copyWith(
        step: RegisterStep.enterInfo,
        otp: '',
        otpError: null,
        status: RegisterStatus.initial,
      ),
    );
  }

  bool _validateInfo() {
    String? fullNameError;
    String? emailError;
    String? phoneError;
    String? passwordError;
    String? confirmPasswordError;

    if (state.fullName.trim().isEmpty) {
      fullNameError = 'Vui lòng nhập họ tên';
    }

    final email = state.email.trim();
    if (email.isEmpty) {
      emailError = 'Vui lòng nhập email';
    } else if (!_isValidEmail(email)) {
      emailError = 'Email không hợp lệ';
    }

    final phone = state.phone.trim();
    if (phone.isNotEmpty && !_isValidPhone(phone)) {
      phoneError = 'Số điện thoại không hợp lệ';
    }

    if (state.password.trim().isEmpty) {
      passwordError = 'Vui lòng nhập mật khẩu';
    } else if (state.password.length < 6) {
      passwordError = 'Mật khẩu ít nhất 6 ký tự';
    }

    if (state.confirmPassword != state.password) {
      confirmPasswordError = 'Mật khẩu xác nhận không khớp';
    }

    if (fullNameError != null ||
        emailError != null ||
        phoneError != null ||
        passwordError != null ||
        confirmPasswordError != null) {
      emit(
        state.copyWith(
          fullNameError: fullNameError,
          emailError: emailError,
          phoneError: phoneError,
          passwordError: passwordError,
          confirmPasswordError: confirmPasswordError,
        ),
      );
      return false;
    }
    return true;
  }

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

  bool _isValidPhone(String phone) {
    return RegExp(r'^\d{10}$').hasMatch(phone);
  }

  @override
  Future<void> close() {
    _resendTimer?.cancel();
    return super.close();
  }
}
