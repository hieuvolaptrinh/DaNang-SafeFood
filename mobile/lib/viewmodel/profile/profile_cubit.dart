import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/model/profile_models.dart';
import 'package:mobile_ui/data/remote/repository/profile_repository.dart';
import 'package:mobile_ui/data/remote/repository/complaint_repository.dart';
import 'package:mobile_ui/viewmodel/profile/profile_state.dart';

class ProfileCubit extends Cubit<ProfileState> {
  final ProfileRepository profileRepository;
  final ComplaintRepository complaintRepository;

  ProfileCubit({
    required this.profileRepository,
    required this.complaintRepository,
  }) : super(const ProfileState());

  /// Tải thông tin profile từ API
  Future<void> loadProfile() async {
    emit(state.copyWith(status: ProfileStatus.loading));
    try {
      final profile = await profileRepository.getProfile();
      emit(state.copyWith(
        status: ProfileStatus.loaded,
        name: profile.fullName,
        email: profile.email ?? '',
        phone: profile.phone ?? '',
      ));
    } on ApiException catch (e) {
      emit(state.copyWith(
        status: ProfileStatus.error,
        errorMessage: e.message,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: ProfileStatus.error,
        errorMessage: 'Không thể tải thông tin cá nhân',
      ));
    }
  }

  /// Cập nhật thông tin cá nhân
  Future<void> updateProfile({
    String? fullName,
    String? email,
    String? phone,
  }) async {
    emit(state.copyWith(actionStatus: ProfileActionStatus.loading));
    try {
      final profile = await profileRepository.updateProfile(
        UpdateProfileRequest(
          fullName: fullName,
          email: email,
          phone: phone,
        ),
      );
      emit(state.copyWith(
        actionStatus: ProfileActionStatus.success,
        name: profile.fullName,
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        successMessage: 'Cập nhật thông tin thành công',
      ));
    } on ApiException catch (e) {
      emit(state.copyWith(
        actionStatus: ProfileActionStatus.error,
        errorMessage: e.message,
      ));
    } catch (e) {
      emit(state.copyWith(
        actionStatus: ProfileActionStatus.error,
        errorMessage: 'Có lỗi xảy ra khi cập nhật thông tin',
      ));
    }
  }

  /// Đổi mật khẩu
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    emit(state.copyWith(actionStatus: ProfileActionStatus.loading));
    try {
      await profileRepository.changePassword(
        ChangePasswordRequest(
          currentPassword: currentPassword,
          newPassword: newPassword,
        ),
      );
      emit(state.copyWith(
        actionStatus: ProfileActionStatus.success,
        successMessage: 'Đổi mật khẩu thành công',
      ));
    } on ApiException catch (e) {
      emit(state.copyWith(
        actionStatus: ProfileActionStatus.error,
        errorMessage: e.message,
      ));
    } catch (e) {
      emit(state.copyWith(
        actionStatus: ProfileActionStatus.error,
        errorMessage: 'Có lỗi xảy ra khi đổi mật khẩu',
      ));
    }
  }

  /// Tải danh sách phản ánh của tôi
  Future<void> loadMyComplaints() async {
    emit(state.copyWith(complaintsLoading: true));
    try {
      final complaints = await complaintRepository.getMyComplaints();
      emit(state.copyWith(
        myComplaints: complaints,
        complaintsLoading: false,
      ));
    } on ApiException catch (e) {
      emit(state.copyWith(
        complaintsLoading: false,
        errorMessage: e.message,
      ));
    } catch (e) {
      emit(state.copyWith(
        complaintsLoading: false,
        errorMessage: 'Không thể tải danh sách phản ánh',
      ));
    }
  }

  /// Reset action status
  void resetActionStatus() {
    emit(state.copyWith(actionStatus: ProfileActionStatus.idle));
  }

  /// Đăng xuất - reset state
  Future<void> logout() async {
    emit(const ProfileState());
  }
}
