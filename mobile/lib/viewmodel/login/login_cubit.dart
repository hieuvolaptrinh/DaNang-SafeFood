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

  /// Lấy vị trí hiện tại của thiết bị (lat,lon) để gửi kèm request login.
  ///
  /// Trả về null nếu user từ chối quyền hoặc thiết bị không bật GPS — backend
  /// vẫn cho phép login bình thường, chỉ là model AI sẽ thiếu feature toạ độ.
  Future<String?> _resolveLocation() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        // Cố gắng yêu cầu user bật location service.
        // openLocationSettings() không block, nên ta vẫn thoát ra với null.
        await Geolocator.openLocationSettings();
        return null;
      }

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.deniedForever) {
        // User chọn "Don't ask again" — mở settings để user có thể bật thủ công.
        await Geolocator.openAppSettings();
        return null;
      }
      if (permission == LocationPermission.denied) {
        return null;
      }

      // 1) Ưu tiên fix nhanh từ cache last-known position để không chặn UI login.
      final lastKnown = await Geolocator.getLastKnownPosition();
      if (lastKnown != null) {
        return _formatPosition(lastKnown);
      }

      // 2) Lấy vị trí hiện tại với độ chính xác cao, kèm timeout phòng treo.
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 6),
        ),
      );
      return _formatPosition(position);
    } catch (_) {
      return null;
    }
  }

  String _formatPosition(Position position) {
    return '${position.latitude.toStringAsFixed(6)},'
        '${position.longitude.toStringAsFixed(6)}';
  }
}
