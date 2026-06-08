import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/data/remote/model/violation_models.dart';
import 'package:mobile_ui/data/remote/repository/violation_repository.dart';
import 'package:mobile_ui/viewmodel/violation/violation_state.dart';

class ViolationCubit extends Cubit<ViolationState> {
  final ViolationRepository repository;
  Timer? _pollTimer;

  ViolationCubit({required this.repository}) : super(const ViolationState());

  Future<void> loadMyViolations() async {
    emit(state.copyWith(status: ViolationStatus.loading));
    try {
      final list = await repository.getMyViolations();
      emit(state.copyWith(status: ViolationStatus.loaded, violations: list));
    } catch (e) {
      emit(
        state.copyWith(
          status: ViolationStatus.error,
          errorMessage: e.toString(),
        ),
      );
    }
  }

  Future<void> loadDetail(String id) async {
    emit(state.copyWith(status: ViolationStatus.loading));
    try {
      final detail = await repository.getDetail(id);
      emit(state.copyWith(status: ViolationStatus.loaded, selected: detail));
    } catch (e) {
      emit(
        state.copyWith(
          status: ViolationStatus.error,
          errorMessage: e.toString(),
        ),
      );
    }
  }

  Future<void> uploadProof(String maViPham, String filePath) async {
    emit(state.copyWith(status: ViolationStatus.loading));
    try {
      await repository.uploadMinhChung(maViPham, filePath);
      await loadDetail(maViPham); // reload detail after success
    } catch (e) {
      emit(
        state.copyWith(
          status: ViolationStatus.error,
          errorMessage: e.toString(),
        ),
      );
    }
  }

  Future<PaymentModel?> createPayment({
    required String maViPham,
    String? description,
  }) async {
    emit(
      state.copyWith(
        paymentStatus: PaymentFlowStatus.creating,
        paymentError: null,
      ),
    );
    try {
      final p = await repository.createPayment(
        maViPham: maViPham,
        description: description,
      );
      emit(state.copyWith(paymentStatus: PaymentFlowStatus.ready, payment: p));
      _startPolling(p.orderCode);
      return p;
    } catch (e) {
      emit(
        state.copyWith(
          paymentStatus: PaymentFlowStatus.error,
          paymentError: e.toString(),
        ),
      );
      return null;
    }
  }

  /// Poll trạng thái thanh toán mỗi 3s. Khi PAID → dừng và reload chi tiết vi phạm.
  void _startPolling(int orderCode) {
    _pollTimer?.cancel();
    _pollTimer = Timer.periodic(const Duration(seconds: 3), (timer) async {
      try {
        final p = await repository.syncPayment(orderCode);
        emit(state.copyWith(payment: p));
        if (p.trangThai == PaymentStatus.paid) {
          timer.cancel();
          emit(state.copyWith(paymentStatus: PaymentFlowStatus.paid));
          // Reload chi tiết vi phạm để cập nhật "Đã khắc phục"
          if (state.selected != null) {
            await loadDetail(state.selected!.maViPham);
          }
        } else if (p.trangThai == PaymentStatus.cancelled ||
            p.trangThai == PaymentStatus.expired) {
          timer.cancel();
        }
      } catch (_) {
        // bỏ qua lỗi tạm thời, tiếp tục poll
      }
    });
  }

  void stopPolling() {
    _pollTimer?.cancel();
    _pollTimer = null;
  }

  void resetPayment() {
    stopPolling();
    emit(state.copyWith(resetPayment: true));
  }

  Future<void> refreshPayment() async {
    final orderCode = state.payment?.orderCode;
    if (orderCode == null) return;
    try {
      final p = await repository.syncPayment(orderCode);
      emit(state.copyWith(payment: p));
      if (p.trangThai == PaymentStatus.paid) {
        emit(state.copyWith(paymentStatus: PaymentFlowStatus.paid));
        if (state.selected != null) {
          await loadDetail(state.selected!.maViPham);
        }
      }
    } catch (_) {}
  }

  @override
  Future<void> close() {
    _pollTimer?.cancel();
    return super.close();
  }
}
