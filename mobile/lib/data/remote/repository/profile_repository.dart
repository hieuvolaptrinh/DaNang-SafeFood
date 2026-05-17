import 'package:mobile_ui/data/remote/datasource/profile_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/profile_models.dart';

class ProfileRepository {
  final ProfileRemoteDataSource remoteDataSource;

  ProfileRepository({required this.remoteDataSource});

  /// Lấy thông tin profile
  Future<ProfileModel> getProfile() {
    return remoteDataSource.getProfile();
  }

  /// Cập nhật thông tin cá nhân
  Future<ProfileModel> updateProfile(UpdateProfileRequest request) {
    return remoteDataSource.updateProfile(request);
  }

  /// Đổi mật khẩu
  Future<String> changePassword(ChangePasswordRequest request) {
    return remoteDataSource.changePassword(request);
  }
}
