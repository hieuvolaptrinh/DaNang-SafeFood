import 'package:equatable/equatable.dart';

enum ComplaintStatus { initial, loading, loaded, submitting, submitted, error }

class ComplaintState extends Equatable {
  final ComplaintStatus status;
  final String? errorMessage;

  const ComplaintState({
    this.status = ComplaintStatus.initial,
    this.errorMessage,
  });

  ComplaintState copyWith({
    ComplaintStatus? status,
    String? errorMessage,
  }) {
    return ComplaintState(
      status: status ?? this.status,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, errorMessage];
}
