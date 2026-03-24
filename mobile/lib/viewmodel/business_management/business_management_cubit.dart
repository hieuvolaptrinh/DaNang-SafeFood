import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

class BusinessManagementCubit extends Cubit<BusinessMgmtState> {
  BusinessManagementCubit() : super(const BusinessMgmtState());

  Future<void> loadData() async {
    emit(state.copyWith(status: BusinessMgmtStatus.loading));
    await Future.delayed(const Duration(milliseconds: 600));
    emit(state.copyWith(status: BusinessMgmtStatus.loaded));
  }

  Future<void> refresh() async => loadData();
}
