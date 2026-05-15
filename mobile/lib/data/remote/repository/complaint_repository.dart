import 'package:mobile_ui/data/remote/datasource/complaint_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';

class ComplaintRepository {
  final ComplaintRemoteDataSource remoteDataSource;

  ComplaintRepository({required this.remoteDataSource});

  /// Lấy danh sách phản ánh của người dùng hiện tại
  Future<List<ComplaintSummary>> getMyComplaints() {
    return remoteDataSource.getMyComplaints();
  }

  /// Lấy chi tiết phản ánh theo ID
  Future<ComplaintSummary> getComplaintDetail(String id) {
    return remoteDataSource.getComplaintDetail(id);
  }

  /// Lấy danh sách loại phản ánh
  Future<List<ComplaintType>> getComplaintTypes() {
    return remoteDataSource.getComplaintTypes();
  }

  /// Tạo phản ánh mới
  Future<ComplaintSummary> createComplaint(ComplaintCreateRequest request) {
    return remoteDataSource.createComplaint(request);
  }

  /// Upload ảnh lên Cloudinary
  Future<String> uploadImage(String filePath) {
    return remoteDataSource.uploadImage(filePath);
  }
}
