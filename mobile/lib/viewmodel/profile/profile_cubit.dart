import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/profile/profile_state.dart';

class ProfileCubit extends Cubit<ProfileState> {
  ProfileCubit() : super(const ProfileState());

  Future<void> loadProfile() async {
    emit(state.copyWith(status: ProfileStatus.loading));
    await Future.delayed(const Duration(milliseconds: 500));

    emit(state.copyWith(
      status: ProfileStatus.loaded,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901 234 567',
      role: 'Người dân',
    ));
  }

  Future<void> logout() async {
    emit(const ProfileState());
  }
}
