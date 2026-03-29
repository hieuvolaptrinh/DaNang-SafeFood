import 'package:flutter_bloc/flutter_bloc.dart';
import 'business_status_state.dart';

class BusinessStatusCubit extends Cubit<BusinessStatusState> {
  BusinessStatusCubit() : super(const BusinessStatusState());

  Future<void> loadDocuments() async {
    emit(state.copyWith(status: BusinessStatusType.loading));
    
    // Giả lập delay mạng
    await Future.delayed(const Duration(seconds: 1));

    // Chọn danh sách mock dữ liệu
    final List<BusinessStatusData> mockData = [
      const BusinessStatusData(
        title: 'Giấy chứng nhận đăng ký kinh doanh',
        licenseNumber: 'GP-2024-00123',
        issueDate: '15/01/2024',
        expiryDate: '15/01/2029',
        status: 'active', // Còn hạn
        statusLabel: 'Còn hạn',
      ),
      const BusinessStatusData(
        title: 'Giấy chứng nhận cơ sở đủ ĐK ATTP',
        licenseNumber: 'ATTP-2024-00456',
        issueDate: '20/02/2024',
        expiryDate: '20/02/2027',
        status: 'warning', // Gần hết hạn hoặc Hết hạn (nếu logic tùy chỉnh) -> dùng active cho mock
        statusLabel: 'Còn hạn',
      ),
      const BusinessStatusData(
        title: 'Giấy phép kinh doanh rượu, bia',
        licenseNumber: 'RUOU-2021-00789',
        issueDate: '01/03/2021',
        expiryDate: '01/03/2023',
        status: 'expired', // Hết hạn
        statusLabel: 'Hết hạn',
      ),
      const BusinessStatusData(
        title: 'Giấy phép quảng cáo thực phẩm chức năng',
        licenseNumber: 'QC-2022-00102',
        issueDate: '10/05/2022',
        expiryDate: '10/05/2023',
        status: 'revoked', // Bị thu hồi
        statusLabel: 'Bị thu hồi',
      ),
    ];

    try {
      // Logic giả lập các luồng Exception (Usecase: E1, E2)
      // E2 Error:
      // emit(state.copyWith(status: BusinessStatusType.error, errorMessage: 'Không thể tải thông tin lúc này, thử lại sau'));
      
      // E1 Empty:
      // emit(state.copyWith(status: BusinessStatusType.empty));

      // Normal flow:
      emit(state.copyWith(
        status: BusinessStatusType.loaded,
        documents: mockData,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: BusinessStatusType.error,
        errorMessage: 'Trượt dữ liệu.',
      ));
    }
  }

  Future<void> refresh() async => loadDocuments();
}
