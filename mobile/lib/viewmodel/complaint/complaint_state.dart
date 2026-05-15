import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';

enum ComplaintStatus { initial, loading, loaded, submitting, submitted, error }

class ComplaintState extends Equatable {
  final ComplaintStatus status;
  final String? errorMessage;
  final List<ComplaintSummary> complaints;
  final List<ComplaintType> types;
  final ComplaintSummary? selectedComplaint;

  const ComplaintState({
    this.status = ComplaintStatus.initial,
    this.errorMessage,
    this.complaints = const [],
    this.types = const [],
    this.selectedComplaint,
  });

  ComplaintState copyWith({
    ComplaintStatus? status,
    String? errorMessage,
    List<ComplaintSummary>? complaints,
    List<ComplaintType>? types,
    ComplaintSummary? selectedComplaint,
  }) {
    return ComplaintState(
      status: status ?? this.status,
      errorMessage: errorMessage,
      complaints: complaints ?? this.complaints,
      types: types ?? this.types,
      selectedComplaint: selectedComplaint ?? this.selectedComplaint,
    );
  }

  @override
  List<Object?> get props => [
    status,
    errorMessage,
    complaints,
    types,
    selectedComplaint,
  ];
}
