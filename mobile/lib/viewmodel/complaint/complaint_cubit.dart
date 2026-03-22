import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_state.dart';

class ComplaintCubit extends Cubit<ComplaintState> {
  ComplaintCubit() : super(const ComplaintState());

  Future<void> loadComplaints() async {
    emit(state.copyWith(status: ComplaintStatus.loading));
    await Future.delayed(const Duration(milliseconds: 600));
    emit(state.copyWith(status: ComplaintStatus.loaded));
  }

  Future<void> submitComplaint() async {
    emit(state.copyWith(status: ComplaintStatus.submitting));
    await Future.delayed(const Duration(seconds: 2));
    emit(state.copyWith(status: ComplaintStatus.submitted));
  }

  Future<void> refresh() async => loadComplaints();
}
