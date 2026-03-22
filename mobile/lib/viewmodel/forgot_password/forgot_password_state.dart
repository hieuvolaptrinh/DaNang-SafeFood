import 'package:equatable/equatable.dart';

enum ForgotPasswordStatus { initial, loading, success, error }

class ForgotPasswordState extends Equatable {
  final String email;
  final ForgotPasswordStatus status;
  final String? emailError;
  final String? errorMessage;

  const ForgotPasswordState({
    this.email = '',
    this.status = ForgotPasswordStatus.initial,
    this.emailError,
    this.errorMessage,
  });

  ForgotPasswordState copyWith({
    String? email,
    ForgotPasswordStatus? status,
    String? emailError,
    String? errorMessage,
  }) {
    return ForgotPasswordState(
      email: email ?? this.email,
      status: status ?? this.status,
      emailError: emailError,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [email, status, emailError, errorMessage];
}
