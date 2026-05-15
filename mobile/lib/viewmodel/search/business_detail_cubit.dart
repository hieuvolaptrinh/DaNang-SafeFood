import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/data/remote/repository/business_repository.dart';
import 'package:mobile_ui/viewmodel/search/business_detail_state.dart';

class BusinessDetailCubit extends Cubit<BusinessDetailState> {
  final BusinessRepository businessRepository;

  BusinessDetailCubit({required this.businessRepository})
      : super(const BusinessDetailState());

  Future<void> loadDetail(String maCoSo) async {
    if (maCoSo.isEmpty) return;

    emit(state.copyWith(status: BusinessDetailStatus.loading));

    try {
      final detail = await businessRepository.getBusinessDetail(maCoSo);
      emit(state.copyWith(
        status: BusinessDetailStatus.loaded,
        detail: detail,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: BusinessDetailStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }
}
