import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/account/account_state.dart';

class AccountCubit extends Cubit<AccountState> {
  AccountCubit() : super(const AccountState());

  void togglePushNotifications() {
    emit(state.copyWith(pushNotifications: !state.pushNotifications));
  }

  void toggleEmailNotifications() {
    emit(state.copyWith(emailNotifications: !state.emailNotifications));
  }

  Future<void> changePassword() async {
    emit(state.copyWith(status: AccountStatus.saving));
    await Future.delayed(const Duration(seconds: 1));
    emit(state.copyWith(status: AccountStatus.saved));
  }
}
