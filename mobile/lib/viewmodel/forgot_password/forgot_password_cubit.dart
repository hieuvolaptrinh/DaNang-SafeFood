import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/forgot_password/forgot_password_state.dart';

class ForgotPasswordCubit extends Cubit<ForgotPasswordState> {
  ForgotPasswordCubit() : super(const ForgotPasswordState());

  void emailChanged(String v) => emit(state.copyWith(email: v, emailError: null));

  Future<void> submit() async {
    if (state.email.trim().isEmpty) {
      emit(state.copyWith(emailError: 'Vui lòng nhập email hoặc SĐT'));
      return;
    }

    emit(state.copyWith(status: ForgotPasswordStatus.loading));
    await Future.delayed(const Duration(seconds: 2));
    emit(state.copyWith(status: ForgotPasswordStatus.success));
  }
}
