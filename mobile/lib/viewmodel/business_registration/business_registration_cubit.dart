import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_ui/data/remote/repository/my_business_repository.dart';
import 'package:mobile_ui/viewmodel/business_registration/business_registration_state.dart';

/// Cubit cho trang đăng kí (tạo mới) cơ sở kinh doanh.
class BusinessRegistrationCubit extends Cubit<BusinessRegState> {
  final MyBusinessRepository repository;

  BusinessRegistrationCubit({required this.repository})
    : super(const BusinessRegState());

  /// Tải danh mục phường xã để hiện trong dropdown.
  Future<void> loadInitial() async {
    emit(state.copyWith(status: BusinessRegStatus.loading));
    try {
      final phuongXas = await repository.getPhuongXaList();
      emit(
        state.copyWith(
          status: BusinessRegStatus.ready,
          phuongXaList: phuongXas,
        ),
      );
    } catch (e) {
      // Không chặn, vẫn cho user nhập, chỉ là dropdown trống
      emit(
        state.copyWith(
          status: BusinessRegStatus.ready,
          errorMessage: 'Không tải được danh sách phường xã',
        ),
      );
    }
  }

  void setTenCoSo(String value) =>
      emit(state.copyWith(tenCoSo: value, clearError: true));

  void setSoGiayPhep(String value) => emit(state.copyWith(soGiayPhep: value));

  void setNgayHetHanGiayPhep(DateTime? date) {
    emit(
      state.copyWith(
        ngayHetHanGiayPhep: date,
        clearNgayHetHanGiayPhep: date == null,
      ),
    );
  }

  void setMaPX(String? maPX) {
    emit(state.copyWith(selectedMaPX: maPX, clearSelectedMaPX: maPX == null));
  }

  /// Người dùng chọn 1 ảnh bìa từ thiết bị, ngay lập tức upload lên Cloudinary
  /// và lưu URL vào state để khi submit không phải đợi.
  Future<void> pickCoverImage(XFile image) async {
    emit(
      state.copyWith(
        coverImage: image,
        isUploadingCover: true,
        clearError: true,
        clearCoverImageUrl: true,
      ),
    );
    try {
      final url = await repository.uploadFile(image.path);
      emit(state.copyWith(coverImageUrl: url, isUploadingCover: false));
    } catch (e) {
      emit(
        state.copyWith(
          isUploadingCover: false,
          errorMessage: 'Không tải được ảnh bìa, vui lòng thử lại',
          clearCoverImage: true,
        ),
      );
    }
  }

  void removeCoverImage() {
    emit(
      state.copyWith(
        clearCoverImage: true,
        clearCoverImageUrl: true,
        isUploadingCover: false,
      ),
    );
  }

  /// Tạo mới cơ sở kinh doanh trên server.
  Future<bool> submit() async {
    if (!state.canSubmit) {
      emit(state.copyWith(errorMessage: 'Vui lòng nhập tên cơ sở kinh doanh'));
      return false;
    }
    if (state.isUploadingCover) {
      emit(state.copyWith(errorMessage: 'Đang tải ảnh bìa, vui lòng đợi'));
      return false;
    }

    emit(
      state.copyWith(
        status: BusinessRegStatus.submitting,
        clearError: true,
        clearSuccess: true,
      ),
    );

    try {
      final created = await repository.createBusiness(
        tenCoSo: state.tenCoSo.trim(),
        soGiayPhep: state.soGiayPhep.trim().isEmpty
            ? null
            : state.soGiayPhep.trim(),
        ngayHetHanGiayPhep: state.ngayHetHanGiayPhep,
        maPX: state.selectedMaPX,
        anhBia: state.coverImageUrl,
      );

      emit(
        state.copyWith(
          status: BusinessRegStatus.success,
          createdBusiness: created,
          successMessage:
              'Đã tạo cơ sở "${created.tenCoSo}". Hãy bổ sung 4 loại giấy tờ để được duyệt.',
        ),
      );
      return true;
    } catch (e) {
      emit(
        state.copyWith(
          status: BusinessRegStatus.error,
          errorMessage: e.toString(),
        ),
      );
      return false;
    }
  }
}
