import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';

enum BusinessMgmtStatus { initial, loading, loaded, error }

class BusinessMgmtState extends Equatable {
  final BusinessMgmtStatus status;
  final List<MyBusinessModel> businesses;
  final List<HoSoDangKiModel> hoSoList;

  /// Cơ sở đang được chọn để xem hồ sơ (null = xem tất cả)
  final String? selectedCoSoId;

  final String? errorMessage;

  // Action states
  final bool isMutating;
  final String? mutateError;
  final String? mutateMessage;

  const BusinessMgmtState({
    this.status = BusinessMgmtStatus.initial,
    this.businesses = const [],
    this.hoSoList = const [],
    this.selectedCoSoId,
    this.errorMessage,
    this.isMutating = false,
    this.mutateError,
    this.mutateMessage,
  });

  BusinessMgmtState copyWith({
    BusinessMgmtStatus? status,
    List<MyBusinessModel>? businesses,
    List<HoSoDangKiModel>? hoSoList,
    String? selectedCoSoId,
    String? errorMessage,
    bool? isMutating,
    String? mutateError,
    String? mutateMessage,
    bool clearSelectedCoSo = false,
  }) {
    return BusinessMgmtState(
      status: status ?? this.status,
      businesses: businesses ?? this.businesses,
      hoSoList: hoSoList ?? this.hoSoList,
      selectedCoSoId: clearSelectedCoSo
          ? null
          : selectedCoSoId ?? this.selectedCoSoId,
      errorMessage: errorMessage,
      isMutating: isMutating ?? this.isMutating,
      mutateError: mutateError,
      mutateMessage: mutateMessage,
    );
  }

  @override
  List<Object?> get props => [
    status,
    businesses,
    hoSoList,
    selectedCoSoId,
    errorMessage,
    isMutating,
    mutateError,
    mutateMessage,
  ];
}
