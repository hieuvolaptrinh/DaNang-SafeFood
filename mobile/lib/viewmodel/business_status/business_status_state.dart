import 'package:equatable/equatable.dart';

enum BusinessStatusType { initial, loading, loaded, empty, error }

class BusinessStatusData extends Equatable {
  final String title;
  final String licenseNumber;
  final String issueDate;
  final String expiryDate;
  final String status;
  final String statusLabel;

  const BusinessStatusData({
    required this.title,
    required this.licenseNumber,
    required this.issueDate,
    required this.expiryDate,
    required this.status,
    required this.statusLabel,
  });

  @override
  List<Object?> get props => [
        title,
        licenseNumber,
        issueDate,
        expiryDate,
        status,
        statusLabel,
      ];
}

class BusinessStatusState extends Equatable {
  final BusinessStatusType status;
  final List<BusinessStatusData> documents;
  final String? errorMessage;

  const BusinessStatusState({
    this.status = BusinessStatusType.initial,
    this.documents = const [],
    this.errorMessage,
  });

  BusinessStatusState copyWith({
    BusinessStatusType? status,
    List<BusinessStatusData>? documents,
    String? errorMessage,
  }) {
    return BusinessStatusState(
      status: status ?? this.status,
      documents: documents ?? this.documents,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, documents, errorMessage];
}
