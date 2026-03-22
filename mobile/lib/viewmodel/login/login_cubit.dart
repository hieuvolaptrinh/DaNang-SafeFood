import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/login/login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  LoginCubit() : super(const LoginState());

  void emailChanged(String value) {
    emit(state.copyWith(email: value, emailError: null));
  }

  void passwordChanged(String value) {
    emit(state.copyWith(password: value, passwordError: null));
  }

  void togglePasswordVisibility() {
    emit(state.copyWith(obscurePassword: !state.obscurePassword));
  }

  bool _validate() {
    String? emailError;
    String? passwordError;

    if (state.email.trim().isEmpty) {
      emailError = 'Vui lòng nhập email hoặc số điện thoại';
    }
    if (state.password.trim().isEmpty) {
      passwordError = 'Vui lòng nhập mật khẩu';
    } else if (state.password.length < 6) {
      passwordError = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (emailError != null || passwordError != null) {
      emit(state.copyWith(emailError: emailError, passwordError: passwordError));
      return false;
    }
    return true;
  }

  Future<void> login() async {
    if (!_validate()) return;

    emit(state.copyWith(status: LoginStatus.loading));

    // Mock API call
    await Future.delayed(const Duration(seconds: 2));

    // Simulate success
    emit(state.copyWith(status: LoginStatus.success));
  }
}
