import 'package:equatable/equatable.dart';

enum AccountStatus { initial, loading, loaded, saving, saved, error }

class AccountState extends Equatable {
  final AccountStatus status;
  final bool pushNotifications;
  final bool emailNotifications;

  const AccountState({
    this.status = AccountStatus.initial,
    this.pushNotifications = true,
    this.emailNotifications = false,
  });

  AccountState copyWith({
    AccountStatus? status,
    bool? pushNotifications,
    bool? emailNotifications,
  }) {
    return AccountState(
      status: status ?? this.status,
      pushNotifications: pushNotifications ?? this.pushNotifications,
      emailNotifications: emailNotifications ?? this.emailNotifications,
    );
  }

  @override
  List<Object?> get props => [status, pushNotifications, emailNotifications];
}
