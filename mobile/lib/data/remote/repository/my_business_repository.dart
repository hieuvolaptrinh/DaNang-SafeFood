import 'package:mobile_ui/data/remote/datasource/my_business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';

class MyBusinessRepository {
  final MyBusinessRemoteDataSource remote;

  MyBusinessRepository({required this.remote});

  Future<List<MyBusinessModel>> getMyBusinesses() => remote.getMyBusinesses();

  Future<List<HoSoDangKiModel>> getMyHoSoList() => remote.getMyHoSoList();

  Future<List<HoSoDangKiModel>> getHoSoByCoSo(String maCoSo) =>
      remote.getHoSoByCoSo(maCoSo);

  Future<HoSoDangKiModel> createHoSo({
    required String maCoSo,
    DateTime? ngayNop,
    String? trangThai,
  }) =>
      remote.createHoSo(maCoSo: maCoSo, ngayNop: ngayNop, trangThai: trangThai);

  Future<HoSoDangKiModel> updateHoSo({
    required String maHoSo,
    required String maCoSo,
    DateTime? ngayNop,
    String? trangThai,
  }) => remote.updateHoSo(
    maHoSo: maHoSo,
    maCoSo: maCoSo,
    ngayNop: ngayNop,
    trangThai: trangThai,
  );

  Future<void> deleteHoSo(String maHoSo) => remote.deleteHoSo(maHoSo);
}
