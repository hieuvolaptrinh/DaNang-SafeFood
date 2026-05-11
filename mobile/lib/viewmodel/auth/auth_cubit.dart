import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:mobile_ui/data/local/token_storage.dart';
import 'package:mobile_ui/data/remote/model/auth_models.dart';
import 'package:mobile_ui/viewmodel/auth/auth_state.dart';

/// AuthCubit — quản lý trạng thái xác thực toàn cục.
///
/// Bao bọc ngoài cùng MaterialApp, giữ session user.
/// Sử dụng jwt_decoder để decode accessToken lấy thông tin user & roles.
///
/// Cách dùng trong UI:
///   final authState = context.read<AuthCubit>().state;
///   if (authState.isCSKD) { /* hiển thị giao diện CSKD */ }
///   if (authState.isNTD)  { /* hiển thị giao diện NTD */ }
class AuthCubit extends Cubit<AuthState> {
  final TokenStorage tokenStorage;

  AuthCubit({required this.tokenStorage}) : super(const AuthState());

  /// Gọi khi app khởi động — kiểm tra token đã lưu trong SharedPreferences.
  /// Nếu token còn hạn → authenticated, hết hạn → unauthenticated.
  Future<void> checkAuthStatus() async {
    final accessToken = await tokenStorage.getAccessToken();

    if (accessToken == null || accessToken.isEmpty) {
      emit(const AuthState(status: AuthStatus.unauthenticated));
      return;
    }

    // Kiểm tra token hết hạn chưa
    if (JwtDecoder.isExpired(accessToken)) {
      await tokenStorage.clearTokens();
      emit(const AuthState(status: AuthStatus.unauthenticated));
      return;
    }

    // Token còn hạn → decode lấy thông tin
    _emitFromToken(accessToken);
  }

  /// Gọi sau khi LoginCubit login thành công.
  /// Đọc thông tin user trực tiếp từ AuthResponse thay vì decode JWT
  /// để tránh lỗi khi JWT không chứa đủ claims.
  void onLoginSuccess(AuthResponse response) {
    final user = response.user;
    emit(AuthState(
      status: AuthStatus.authenticated,
      accessToken: response.accessToken,
      username: user.username,
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      roles: user.role,
    ));
  }

  /// Đăng xuất — xóa token và reset state
  Future<void> logout() async {
    await tokenStorage.clearTokens();
    emit(const AuthState(status: AuthStatus.unauthenticated));
  }

  /// Decode JWT accessToken và emit state mới với thông tin user
  void _emitFromToken(String accessToken) {
    try {
      final payload = JwtDecoder.decode(accessToken);

      final roles = (payload['roles'] as List<dynamic>? ?? [])
          .map((e) => e.toString())
          .toList();

      emit(AuthState(
        status: AuthStatus.authenticated,
        accessToken: accessToken,
        username: payload['sub'] as String?,
        userId: (payload['userId'] as num?)?.toInt(),
        fullName: payload['fullName'] as String?,
        email: payload['email'] as String?,
        phone: payload['phone'] as String?,
        roles: roles,
      ));
    } catch (_) {
      emit(const AuthState(status: AuthStatus.unauthenticated));
    }
  }
}
