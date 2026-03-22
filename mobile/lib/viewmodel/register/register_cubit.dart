import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/register/register_state.dart';

class RegisterCubit extends Cubit<RegisterState> {
  RegisterCubit() : super(const RegisterState());

  void fullNameChanged(String v) => emit(state.copyWith(fullName: v, fullNameError: null));
  void emailChanged(String v) => emit(state.copyWith(email: v, emailError: null));
  void passwordChanged(String v) => emit(state.copyWith(password: v, passwordError: null));
  void confirmPasswordChanged(String v) => emit(state.copyWith(confirmPassword: v, confirmPasswordError: null));
  void roleChanged(String v) => emit(state.copyWith(role: v));

  void togglePassword() => emit(state.copyWith(obscurePassword: !state.obscurePassword));
  void toggleConfirmPassword() => emit(state.copyWith(obscureConfirmPassword: !state.obscureConfirmPassword));

  bool _validate() {
    String? fullNameError, emailError, passwordError, confirmPasswordError;

    if (state.fullName.trim().isEmpty) fullNameError = 'Vui lòng nhập họ tên';
    if (state.email.trim().isEmpty) emailError = 'Vui lòng nhập email hoặc SĐT';
    if (state.password.trim().isEmpty) {
      passwordError = 'Vui lòng nhập mật khẩu';
    } else if (state.password.length < 6) {
      passwordError = 'Mật khẩu ít nhất 6 ký tự';
    }
    if (state.confirmPassword != state.password) {
      confirmPasswordError = 'Mật khẩu xác nhận không khớp';
    }

    if (fullNameError != null || emailError != null || passwordError != null || confirmPasswordError != null) {
      emit(state.copyWith(
        fullNameError: fullNameError,
        emailError: emailError,
        passwordError: passwordError,
        confirmPasswordError: confirmPasswordError,
      ));
      return false;
    }
    return true;
  }

  Future<void> register() async {
    if (!_validate()) return;
    emit(state.copyWith(status: RegisterStatus.loading));
    await Future.delayed(const Duration(seconds: 2));
    emit(state.copyWith(status: RegisterStatus.success));
  }
}
