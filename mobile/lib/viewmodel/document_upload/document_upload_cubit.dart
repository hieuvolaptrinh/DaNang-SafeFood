import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_ui/data/remote/repository/my_business_repository.dart';
import 'package:mobile_ui/viewmodel/document_upload/document_upload_state.dart';

/// Cubit cho trang "Bổ sung giấy tờ" của 1 cơ sở kinh doanh đã có.
class DocumentUploadCubit extends Cubit<DocumentUploadState> {
  final MyBusinessRepository repository;

  DocumentUploadCubit({required this.repository})
    : super(DocumentUploadState.initial());

  /// Tải danh sách CSKD đang sở hữu để chọn nộp hồ sơ.
  /// Nếu [preSelectMaCoSo] được truyền vào thì tự chọn luôn cơ sở đó.
  Future<void> loadInitial({String? preSelectMaCoSo}) async {
    emit(state.copyWith(status: DocumentUploadStatus.loadingBusinesses));
    try {
      final list = await repository.getMyBusinesses();

      // Chọn cơ sở: theo param hoặc cái đầu tiên
      String? selected = preSelectMaCoSo;
      if (selected == null && list.isNotEmpty) {
        selected = list.first.maCoSo;
      }

      emit(
        state.copyWith(
          status: DocumentUploadStatus.ready,
          businesses: list,
          selectedMaCoSo: selected,
        ),
      );

      if (selected != null) {
        await _loadExistingDocs(selected);
      }
    } catch (e) {
      emit(
        state.copyWith(
          status: DocumentUploadStatus.error,
          errorMessage: e.toString(),
        ),
      );
    }
  }

  Future<void> selectCoSo(String maCoSo) async {
    if (state.selectedMaCoSo == maCoSo) return;

    // Reset slots khi đổi cơ sở
    final fresh = DocumentUploadState.initial();
    emit(
      state.copyWith(
        selectedMaCoSo: maCoSo,
        docs: fresh.docs,
        clearError: true,
      ),
    );
    await _loadExistingDocs(maCoSo);
  }

  Future<void> _loadExistingDocs(String maCoSo) async {
    try {
      final list = await repository.getHoSoByCoSo(maCoSo);
      final newDocs = Map<String, DocumentSlot>.from(state.docs);

      for (final type in GiayToType.all) {
        final hsForType = list
            .where((h) => h.maLoaiGiayTo == type.code)
            .toList();
        if (hsForType.isEmpty) {
          newDocs[type.code] = DocumentSlot.empty(type);
        } else {
          // Lấy hồ sơ mới nhất
          hsForType.sort((a, b) {
            final aDate = a.ngayNop ?? DateTime(1970);
            final bDate = b.ngayNop ?? DateTime(1970);
            return bDate.compareTo(aDate);
          });
          final h = hsForType.first;
          newDocs[type.code] = DocumentSlot.empty(type).copyWith(
            existingMaHoSo: h.maHoSo,
            existingUrl: h.urlFile,
            existingTrangThai: h.trangThai,
            existingNgayHetHan: h.ngayHetHan,
          );
        }
      }
      emit(state.copyWith(docs: newDocs));
    } catch (_) {
      // Bỏ qua, người dùng vẫn có thể nộp mới.
    }
  }

  void pickFile(String code, XFile file) {
    final slot = state.docs[code];
    if (slot == null) return;
    final newDocs = Map<String, DocumentSlot>.from(state.docs);
    newDocs[code] = slot.copyWith(pickedFile: file, clearError: true);
    emit(state.copyWith(docs: newDocs, clearError: true));
  }

  void removePickedFile(String code) {
    final slot = state.docs[code];
    if (slot == null) return;
    final newDocs = Map<String, DocumentSlot>.from(state.docs);
    newDocs[code] = slot.copyWith(clearPickedFile: true);
    emit(state.copyWith(docs: newDocs));
  }

  void setNgayCap(String code, DateTime? date) {
    final slot = state.docs[code];
    if (slot == null) return;
    final newDocs = Map<String, DocumentSlot>.from(state.docs);
    newDocs[code] = slot.copyWith(ngayCap: date, clearNgayCap: date == null);
    emit(state.copyWith(docs: newDocs));
  }

  void setNgayHetHan(String code, DateTime? date) {
    final slot = state.docs[code];
    if (slot == null) return;
    final newDocs = Map<String, DocumentSlot>.from(state.docs);
    newDocs[code] = slot.copyWith(
      ngayHetHan: date,
      clearNgayHetHan: date == null,
    );
    emit(state.copyWith(docs: newDocs));
  }

  /// Submit toàn bộ slot có file đã chọn:
  ///  1. Upload file lên Cloudinary
  ///  2. Gọi POST /api/user/my-business/ho-so cho từng giấy tờ
  ///
  /// Slot chưa có file sẽ bỏ qua (người dùng có thể bổ sung sau).
  Future<bool> submit() async {
    final maCoSo = state.selectedMaCoSo;
    if (maCoSo == null || maCoSo.isEmpty) {
      emit(state.copyWith(errorMessage: 'Vui lòng chọn cơ sở kinh doanh'));
      return false;
    }

    final pending = state.docs.values.where((s) => s.isReadyToSend).toList();
    if (pending.isEmpty) {
      emit(
        state.copyWith(
          errorMessage:
              'Chưa có giấy tờ nào được tải lên, vui lòng chọn ít nhất 1 file.',
        ),
      );
      return false;
    }

    emit(
      state.copyWith(
        status: DocumentUploadStatus.submitting,
        clearError: true,
        clearSuccess: true,
        submittedCount: 0,
        totalToSubmit: pending.length,
      ),
    );

    final newDocs = Map<String, DocumentSlot>.from(state.docs);
    int done = 0;

    for (final slot in pending) {
      // Mark uploading
      newDocs[slot.code] = newDocs[slot.code]!.copyWith(
        isUploading: true,
        clearError: true,
      );
      emit(state.copyWith(docs: Map<String, DocumentSlot>.from(newDocs)));

      try {
        final url = await repository.uploadFile(slot.pickedFile!.path);
        await repository.createHoSo(
          maCoSo: maCoSo,
          maLoaiGiayTo: slot.code,
          ngayNop: DateTime.now(),
          ngayCap: slot.ngayCap,
          ngayHetHan: slot.ngayHetHan,
          trangThai: 'Cho duyet',
          urlFile: url,
        );

        // Cập nhật state slot: bỏ pickedFile, đánh dấu đã có
        newDocs[slot.code] = DocumentSlot(
          code: slot.code,
          label: slot.label,
          moTa: slot.moTa,
          existingUrl: url,
          existingTrangThai: 'Cho duyet',
          existingNgayHetHan: slot.ngayHetHan,
          existingMaHoSo: 'PENDING', // sẽ refresh lại từ server
        );
        done++;
        emit(
          state.copyWith(
            docs: Map<String, DocumentSlot>.from(newDocs),
            submittedCount: done,
          ),
        );
      } catch (e) {
        newDocs[slot.code] = newDocs[slot.code]!.copyWith(
          isUploading: false,
          error: e.toString(),
        );
        emit(
          state.copyWith(
            status: DocumentUploadStatus.error,
            docs: Map<String, DocumentSlot>.from(newDocs),
            errorMessage: 'Tải lên ${slot.label} thất bại: ${e.toString()}',
          ),
        );
        return false;
      }
    }

    // Reload từ server để có maHoSo thực
    await _loadExistingDocs(maCoSo);

    emit(
      state.copyWith(
        status: DocumentUploadStatus.success,
        successMessage: 'Đã gửi $done giấy tờ thành công, chờ phê duyệt.',
      ),
    );
    return true;
  }
}
