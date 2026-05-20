import 'package:mobile_ui/data/remote/datasource/my_business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';

class MyBusinessRepository {
  final MyBusinessRemoteDataSource remote;

  MyBusinessRepository({required this.remote});

  Future<String> uploadFile(String filePath) => remote.uploadFile(filePath);

  Future<List<MyBusinessModel>> getMyBusinesses() => remote.getMyBusinesses();

  Future<List<PhuongXaModel>> getPhuongXaList() => remote.getPhuongXaList();

  Future<MyBusinessModel> createBusiness({
    required String tenCoSo,
    String? soGiayPhep,
    DateTime? ngayHetHanGiayPhep,
    String? maPX,
    String? anhBia,
  }) => remote.createBusiness(
    tenCoSo: tenCoSo,
    soGiayPhep: soGiayPhep,
    ngayHetHanGiayPhep: ngayHetHanGiayPhep,
    maPX: maPX,
    anhBia: anhBia,
  );

  Future<List<HoSoDangKiModel>> getMyHoSoList() => remote.getMyHoSoList();

  Future<List<HoSoDangKiModel>> getHoSoByCoSo(String maCoSo) =>
      remote.getHoSoByCoSo(maCoSo);

  Future<HoSoDangKiModel> createHoSo({
    required String maCoSo,
    String? maLoaiGiayTo,
    DateTime? ngayNop,
    DateTime? ngayCap,
    DateTime? ngayHetHan,
    String? trangThai,
    String? urlFile,
  }) => remote.createHoSo(
    maCoSo: maCoSo,
    maLoaiGiayTo: maLoaiGiayTo,
    ngayNop: ngayNop,
    ngayCap: ngayCap,
    ngayHetHan: ngayHetHan,
    trangThai: trangThai,
    urlFile: urlFile,
  );

  Future<HoSoDangKiModel> updateHoSo({
    required String maHoSo,
    required String maCoSo,
    String? maLoaiGiayTo,
    DateTime? ngayNop,
    DateTime? ngayCap,
    DateTime? ngayHetHan,
    String? trangThai,
    String? urlFile,
  }) => remote.updateHoSo(
    maHoSo: maHoSo,
    maCoSo: maCoSo,
    maLoaiGiayTo: maLoaiGiayTo,
    ngayNop: ngayNop,
    ngayCap: ngayCap,
    ngayHetHan: ngayHetHan,
    trangThai: trangThai,
    urlFile: urlFile,
  );

  Future<void> deleteHoSo(String maHoSo) => remote.deleteHoSo(maHoSo);
}
