import 'package:mobile_ui/data/remote/datasource/business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/business_models.dart';

class BusinessRepository {
  final BusinessRemoteDataSource remoteDataSource;

  BusinessRepository({required this.remoteDataSource});

  Future<PagedResponse<BusinessSearchModel>> searchBusinesses({
    String? keyword,
    String? trangThai,
    String? maPX,
    int page = 0,
    int size = 10,
  }) {
    return remoteDataSource.searchBusinesses(
      keyword: keyword,
      trangThai: trangThai,
      maPX: maPX,
      page: page,
      size: size,
    );
  }

  Future<BusinessDetailModel> getBusinessDetail(String maCoSo) {
    return remoteDataSource.getBusinessDetail(maCoSo);
  }

  Future<List<BusinessSearchModel>> fetchAllBusinessesForAI() {
    return remoteDataSource.fetchAllBusinessesForAI();
  }
}
