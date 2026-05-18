import 'package:mobile_ui/data/remote/datasource/violation_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/violation_models.dart';

class ViolationRepository {
  final ViolationRemoteDataSource remote;

  ViolationRepository({required this.remote});

  Future<List<ViolationModel>> getMyViolations() => remote.getMyViolations();

  Future<ViolationModel> getDetail(String id) => remote.getViolationDetail(id);

  Future<PaymentModel> createPayment({
    required String maViPham,
    String? description,
  }) => remote.createPayment(maViPham: maViPham, description: description);

  Future<PaymentModel> getPayment(int orderCode) =>
      remote.getPayment(orderCode);

  Future<PaymentModel> syncPayment(int orderCode) =>
      remote.syncPayment(orderCode);
}
