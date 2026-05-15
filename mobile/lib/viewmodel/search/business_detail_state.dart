import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/business_models.dart';

enum BusinessDetailStatus { initial, loading, loaded, error }

class BusinessDetailState extends Equatable {
  final BusinessDetailStatus status;
  final BusinessDetailModel? detail;
  final String? errorMessage;

  const BusinessDetailState({
    this.status = BusinessDetailStatus.initial,
    this.detail,
    this.errorMessage,
  });

  BusinessDetailState copyWith({
    BusinessDetailStatus? status,
    BusinessDetailModel? detail,
    String? errorMessage,
  }) {
    return BusinessDetailState(
      status: status ?? this.status,
      detail: detail ?? this.detail,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, detail, errorMessage];
}
