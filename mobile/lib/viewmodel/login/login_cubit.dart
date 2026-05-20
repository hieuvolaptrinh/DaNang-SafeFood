import 'dart:io';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:geolocator/geolocator.dart';
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
      final device = _resolveDeviceLabel();
      final location = await _resolveLocation();
      final response = await authRepository.login(
        identifier: state.email.trim(),
        password: state.password,
        location: location,
        device: device,
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

  String _resolveDeviceLabel() {
    try {
      final os = Platform.operatingSystem;
      final version = Platform.operatingSystemVersion;
      return '$os $version'.trim();
    } catch (_) {
      return 'unknown';
    }
  }

  Future<String?> _resolveLocation() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return null;

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        return null;
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.low,
      );

      return '${position.latitude.toStringAsFixed(6)},'
          '${position.longitude.toStringAsFixed(6)}';
    } catch (_) {
      return null;
    }
  }
}
