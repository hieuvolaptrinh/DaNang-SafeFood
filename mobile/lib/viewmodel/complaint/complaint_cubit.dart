import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';
import 'package:mobile_ui/data/remote/repository/complaint_repository.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_state.dart';

class ComplaintCubit extends Cubit<ComplaintState> {
  final ComplaintRepository repository;

  ComplaintCubit({required this.repository}) : super(const ComplaintState());

  Future<void> loadComplaints() async {
    emit(state.copyWith(status: ComplaintStatus.loading, errorMessage: null));
    try {
      final complaints = await repository.getMyComplaints();
      emit(
        state.copyWith(status: ComplaintStatus.loaded, complaints: complaints),
      );
    } catch (error) {
      emit(
        state.copyWith(
          status: ComplaintStatus.error,
          errorMessage: error.toString(),
        ),
      );
    }
  }

  Future<void> loadTypes() async {
    try {
      final types = await repository.getComplaintTypes();
      emit(state.copyWith(types: types));
    } catch (_) {
      // Keep previous types on failure.
    }
  }

  Future<ComplaintSummary?> loadDetail(String id) async {
    try {
      final detail = await repository.getComplaintDetail(id);
      emit(state.copyWith(selectedComplaint: detail));
      return detail;
    } catch (error) {
      emit(
        state.copyWith(
          status: ComplaintStatus.error,
          errorMessage: error.toString(),
        ),
      );
      return null;
    }
  }

  Future<ComplaintSummary?> submitComplaint({
    required ComplaintCreateRequest request,
    List<String> filePaths = const [],
  }) async {
    emit(
      state.copyWith(status: ComplaintStatus.submitting, errorMessage: null),
    );
    try {
      final fileUrls = <String>[];
      for (final path in filePaths) {
        final url = await repository.uploadImage(path);
        fileUrls.add(url);
      }

      final payload = ComplaintCreateRequest(
        title: request.title,
        content: request.content,
        typeId: request.typeId,
        businessId: request.businessId,
        location: request.location,
        fileUrls: fileUrls,
      );

      final result = await repository.createComplaint(payload);
      emit(state.copyWith(status: ComplaintStatus.submitted));
      await loadComplaints();
      return result;
    } catch (error) {
      emit(
        state.copyWith(
          status: ComplaintStatus.error,
          errorMessage: error.toString(),
        ),
      );
      return null;
    }
  }

  Future<void> refresh() async => loadComplaints();
}
