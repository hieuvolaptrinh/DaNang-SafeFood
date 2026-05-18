import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/data/remote/repository/my_business_repository.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

class BusinessManagementCubit extends Cubit<BusinessMgmtState> {
  final MyBusinessRepository repository;

  BusinessManagementCubit({required this.repository})
    : super(const BusinessMgmtState());

  /// Tải toàn bộ dữ liệu: cơ sở + hồ sơ
  Future<void> loadData() async {
    emit(state.copyWith(status: BusinessMgmtStatus.loading));
    try {
      final results = await Future.wait([
        repository.getMyBusinesses(),
        repository.getMyHoSoList(),
      ]);
      emit(
        state.copyWith(
          status: BusinessMgmtStatus.loaded,
          businesses: results[0] as dynamic,
          hoSoList: results[1] as dynamic,
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          status: BusinessMgmtStatus.error,
          errorMessage: e.toString(),
        ),
      );
    }
  }

  Future<void> refresh() async => loadData();

  /// Chọn 1 cơ sở để filter danh sách hồ sơ.
  /// Nếu maCoSo = null → reset về toàn bộ hồ sơ.
  Future<void> selectCoSo(String? maCoSo) async {
    if (maCoSo == null) {
      // Quay về toàn bộ
      emit(state.copyWith(clearSelectedCoSo: true));
      try {
        final list = await repository.getMyHoSoList();
        emit(state.copyWith(hoSoList: list));
      } catch (_) {}
      return;
    }

    emit(state.copyWith(selectedCoSoId: maCoSo));
    try {
      final list = await repository.getHoSoByCoSo(maCoSo);
      emit(state.copyWith(hoSoList: list));
    } catch (e) {
      emit(state.copyWith(errorMessage: e.toString()));
    }
  }

  Future<bool> createHoSo({
    required String maCoSo,
    DateTime? ngayNop,
    String? trangThai,
  }) async {
    emit(state.copyWith(isMutating: true, mutateError: null));
    try {
      await repository.createHoSo(
        maCoSo: maCoSo,
        ngayNop: ngayNop,
        trangThai: trangThai,
      );
      emit(
        state.copyWith(
          isMutating: false,
          mutateMessage: 'Tạo hồ sơ thành công',
        ),
      );
      await _reloadHoSo();
      return true;
    } catch (e) {
      emit(state.copyWith(isMutating: false, mutateError: e.toString()));
      return false;
    }
  }

  Future<bool> updateHoSo({
    required String maHoSo,
    required String maCoSo,
    DateTime? ngayNop,
    String? trangThai,
  }) async {
    emit(state.copyWith(isMutating: true, mutateError: null));
    try {
      await repository.updateHoSo(
        maHoSo: maHoSo,
        maCoSo: maCoSo,
        ngayNop: ngayNop,
        trangThai: trangThai,
      );
      emit(
        state.copyWith(
          isMutating: false,
          mutateMessage: 'Cập nhật hồ sơ thành công',
        ),
      );
      await _reloadHoSo();
      return true;
    } catch (e) {
      emit(state.copyWith(isMutating: false, mutateError: e.toString()));
      return false;
    }
  }

  Future<bool> deleteHoSo(String maHoSo) async {
    emit(state.copyWith(isMutating: true, mutateError: null));
    try {
      await repository.deleteHoSo(maHoSo);
      emit(
        state.copyWith(
          isMutating: false,
          mutateMessage: 'Xoá hồ sơ thành công',
        ),
      );
      await _reloadHoSo();
      return true;
    } catch (e) {
      emit(state.copyWith(isMutating: false, mutateError: e.toString()));
      return false;
    }
  }

  Future<void> _reloadHoSo() async {
    try {
      if (state.selectedCoSoId != null) {
        final list = await repository.getHoSoByCoSo(state.selectedCoSoId!);
        emit(state.copyWith(hoSoList: list));
      } else {
        final list = await repository.getMyHoSoList();
        emit(state.copyWith(hoSoList: list));
      }
    } catch (_) {}
  }
}
