import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/auth_models.dart';
import 'package:mobile_ui/data/remote/repository/auth_repository.dart';
import 'package:mobile_ui/viewmodel/login/login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  final AuthRepository authRepository;

  LoginCubit({required this.authRepository}) : super(const LoginState());

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
      emit(
        state.copyWith(emailError: emailError, passwordError: passwordError),
      );
      return false;
    }
    return true;
  }

  /// Trả về AuthResponse nếu login thành công, null nếu thất bại.
  /// AuthCubit sẽ dùng kết quả này để cập nhật session toàn cục.
  Future<AuthResponse?> login() async {
    if (!_validate()) return null;

    emit(state.copyWith(status: LoginStatus.loading, errorMessage: null));

    try {
      final response = await authRepository.login(
        identifier: state.email.trim(),
        password: state.password,
      );
      emit(state.copyWith(status: LoginStatus.success));
      return response;
    } on ApiException catch (error) {
      emit(
        state.copyWith(status: LoginStatus.error, errorMessage: error.message),
      );
      return null;
    } catch (_) {
      emit(
        state.copyWith(
          status: LoginStatus.error,
          errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại',
        ),
      );
      return null;
    }
  }
}

