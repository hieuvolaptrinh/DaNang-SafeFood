import 'package:equatable/equatable.dart';

enum BusinessMgmtStatus { initial, loading, loaded, error }

class BusinessMgmtState extends Equatable {
  final BusinessMgmtStatus status;
  final String? errorMessage;

  const BusinessMgmtState({
    this.status = BusinessMgmtStatus.initial,
    this.errorMessage,
  });

  BusinessMgmtState copyWith({
    BusinessMgmtStatus? status,
    String? errorMessage,
  }) {
    return BusinessMgmtState(
      status: status ?? this.status,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, errorMessage];
}
