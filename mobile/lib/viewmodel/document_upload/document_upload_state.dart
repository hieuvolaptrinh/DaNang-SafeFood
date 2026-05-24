import 'package:equatable/equatable.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';

enum DocumentUploadStatus {
  initial,
  loadingBusinesses,
  ready,
  submitting,
  success,
  error,
}

/// 4 loại giấy tờ cố định — match với bảng `loai_giay_to` ở DB.
class GiayToType {
  final String code;
  final String label;
  final String moTa;

  const GiayToType({
    required this.code,
    required this.label,
    required this.moTa,
  });

  static const hopDong = GiayToType(
    code: 'HOP_DONG_THUE_MAT_BANG',
    label: 'Hợp đồng thuê mặt bằng',
    moTa: 'Hợp đồng thuê/mượn mặt bằng kinh doanh',
  );
  static const attp = GiayToType(
    code: 'GIAY_PHEP_ATTP',
    label: 'Giấy phép ATTP',
    moTa: 'Giấy chứng nhận đủ điều kiện an toàn thực phẩm',
  );
  static const pccc = GiayToType(
    code: 'GIAY_TO_PCCC',
    label: 'Giấy tờ PCCC',
    moTa: 'Giấy xác nhận đủ điều kiện phòng cháy chữa cháy',
  );
  static const gpkd = GiayToType(
    code: 'GIAY_PHEP_KINH_DOANH',
    label: 'Giấy phép kinh doanh',
    moTa: 'Giấy chứng nhận đăng ký kinh doanh',
  );

  static const all = <GiayToType>[hopDong, attp, pccc, gpkd];

  static GiayToType? byCode(String code) {
    for (final t in all) {
      if (t.code == code) return t;
    }
    return null;
  }
}

/// Trạng thái 1 slot giấy tờ trong form.
class DocumentSlot extends Equatable {
  final String code;
  final String label;
  final String moTa;

  /// File mới chọn từ thiết bị (chưa upload)
  final XFile? pickedFile;

  /// Ngày cấp / ngày hết hạn người dùng nhập
  final DateTime? ngayCap;
  final DateTime? ngayHetHan;

  /// Hồ sơ đã tồn tại trong DB cho cơ sở này (nếu có)
  final String? existingMaHoSo;
  final String? existingUrl;
  final String? existingTrangThai;
  final DateTime? existingNgayHetHan;

  /// Trạng thái upload riêng cho slot này
  final bool isUploading;
  final String? error;

  const DocumentSlot({
    required this.code,
    required this.label,
    required this.moTa,
    this.pickedFile,
    this.ngayCap,
    this.ngayHetHan,
    this.existingMaHoSo,
    this.existingUrl,
    this.existingTrangThai,
    this.existingNgayHetHan,
    this.isUploading = false,
    this.error,
  });

  factory DocumentSlot.empty(GiayToType type) =>
      DocumentSlot(code: type.code, label: type.label, moTa: type.moTa);

  bool get hasPicked => pickedFile != null;
  bool get hasExisting => existingMaHoSo != null;
  bool get isExpired {
    if (existingNgayHetHan == null) return false;
    return existingNgayHetHan!.isBefore(DateTime.now());
  }

  bool get isReadyToSend => hasPicked;

  DocumentSlot copyWith({
    XFile? pickedFile,
    bool clearPickedFile = false,
    DateTime? ngayCap,
    bool clearNgayCap = false,
    DateTime? ngayHetHan,
    bool clearNgayHetHan = false,
    String? existingMaHoSo,
    String? existingUrl,
    String? existingTrangThai,
    DateTime? existingNgayHetHan,
    bool clearExisting = false,
    bool? isUploading,
    String? error,
    bool clearError = false,
  }) {
    return DocumentSlot(
      code: code,
      label: label,
      moTa: moTa,
      pickedFile: clearPickedFile ? null : pickedFile ?? this.pickedFile,
      ngayCap: clearNgayCap ? null : ngayCap ?? this.ngayCap,
      ngayHetHan: clearNgayHetHan ? null : ngayHetHan ?? this.ngayHetHan,
      existingMaHoSo: clearExisting
          ? null
          : existingMaHoSo ?? this.existingMaHoSo,
      existingUrl: clearExisting ? null : existingUrl ?? this.existingUrl,
      existingTrangThai: clearExisting
          ? null
          : existingTrangThai ?? this.existingTrangThai,
      existingNgayHetHan: clearExisting
          ? null
          : existingNgayHetHan ?? this.existingNgayHetHan,
      isUploading: isUploading ?? this.isUploading,
      error: clearError ? null : error ?? this.error,
    );
  }

  @override
  List<Object?> get props => [
    code,
    label,
    moTa,
    pickedFile?.path,
    ngayCap,
    ngayHetHan,
    existingMaHoSo,
    existingUrl,
    existingTrangThai,
    existingNgayHetHan,
    isUploading,
    error,
  ];
}

class DocumentUploadState extends Equatable {
  final DocumentUploadStatus status;
  final List<MyBusinessModel> businesses;
  final String? selectedMaCoSo;
  final Map<String, DocumentSlot> docs; // key = maLoaiGiayTo
  final String? errorMessage;
  final String? successMessage;
  final int submittedCount;
  final int totalToSubmit;

  const DocumentUploadState({
    this.status = DocumentUploadStatus.initial,
    this.businesses = const [],
    this.selectedMaCoSo,
    this.docs = const {},
    this.errorMessage,
    this.successMessage,
    this.submittedCount = 0,
    this.totalToSubmit = 0,
  });

  factory DocumentUploadState.initial() {
    final map = <String, DocumentSlot>{
      for (final t in GiayToType.all) t.code: DocumentSlot.empty(t),
    };
    return DocumentUploadState(docs: map);
  }

  /// Số giấy tờ đã có (đang chọn để nộp HOẶC đã tồn tại còn hạn)
  int get filledCount {
    return docs.values
        .where((s) => s.hasPicked || (s.hasExisting && !s.isExpired))
        .length;
  }

  /// Số giấy tờ chuẩn bị gửi đi trong lần submit này
  int get pendingSubmitCount {
    return docs.values.where((s) => s.isReadyToSend).length;
  }

  bool get isComplete => filledCount == GiayToType.all.length;

  DocumentUploadState copyWith({
    DocumentUploadStatus? status,
    List<MyBusinessModel>? businesses,
    String? selectedMaCoSo,
    bool clearSelectedMaCoSo = false,
    Map<String, DocumentSlot>? docs,
    String? errorMessage,
    bool clearError = false,
    String? successMessage,
    bool clearSuccess = false,
    int? submittedCount,
    int? totalToSubmit,
  }) {
    return DocumentUploadState(
      status: status ?? this.status,
      businesses: businesses ?? this.businesses,
      selectedMaCoSo: clearSelectedMaCoSo
          ? null
          : selectedMaCoSo ?? this.selectedMaCoSo,
      docs: docs ?? this.docs,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
      successMessage: clearSuccess
          ? null
          : successMessage ?? this.successMessage,
      submittedCount: submittedCount ?? this.submittedCount,
      totalToSubmit: totalToSubmit ?? this.totalToSubmit,
    );
  }

  @override
  List<Object?> get props => [
    status,
    businesses,
    selectedMaCoSo,
    docs,
    errorMessage,
    successMessage,
    submittedCount,
    totalToSubmit,
  ];
}
