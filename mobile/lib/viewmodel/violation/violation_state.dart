import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/violation_models.dart';

enum ViolationStatus { initial, loading, loaded, error }

enum PaymentFlowStatus { idle, creating, ready, polling, paid, error }

class ViolationState extends Equatable {
  final ViolationStatus status;
  final List<ViolationModel> violations;
  final ViolationModel? selected;
  final String? errorMessage;

  // Thanh toán
  final PaymentFlowStatus paymentStatus;
  final PaymentModel? payment;
  final String? paymentError;

  const ViolationState({
    this.status = ViolationStatus.initial,
    this.violations = const [],
    this.selected,
    this.errorMessage,
    this.paymentStatus = PaymentFlowStatus.idle,
    this.payment,
    this.paymentError,
  });

  ViolationState copyWith({
    ViolationStatus? status,
    List<ViolationModel>? violations,
    ViolationModel? selected,
    String? errorMessage,
    PaymentFlowStatus? paymentStatus,
    PaymentModel? payment,
    String? paymentError,
    bool resetPayment = false,
  }) {
    return ViolationState(
      status: status ?? this.status,
      violations: violations ?? this.violations,
      selected: selected ?? this.selected,
      errorMessage: errorMessage,
      paymentStatus: resetPayment
          ? PaymentFlowStatus.idle
          : paymentStatus ?? this.paymentStatus,
      payment: resetPayment ? null : payment ?? this.payment,
      paymentError: resetPayment ? null : paymentError,
    );
  }

  @override
  List<Object?> get props => [
    status,
    violations,
    selected,
    errorMessage,
    paymentStatus,
    payment,
    paymentError,
  ];
}
