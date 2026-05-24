import 'package:equatable/equatable.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';

enum BusinessRegStatus { initial, loading, ready, submitting, success, error }

/// State cho form tạo mới cơ sở kinh doanh.
class BusinessRegState extends Equatable {
  final BusinessRegStatus status;

  // Form fields
  final String tenCoSo;
  final String soGiayPhep;
  final DateTime? ngayHetHanGiayPhep;
  final String? selectedMaPX;

  /// Ảnh bìa người dùng vừa chọn (chưa upload)
  final XFile? coverImage;

  /// URL ảnh bìa sau khi đã upload lên Cloudinary
  final String? coverImageUrl;
  final bool isUploadingCover;

  // Lookup data
  final List<PhuongXaModel> phuongXaList;

  // Result
  final MyBusinessModel? createdBusiness;

  // Messages
  final String? errorMessage;
  final String? successMessage;

  const BusinessRegState({
    this.status = BusinessRegStatus.initial,
    this.tenCoSo = '',
    this.soGiayPhep = '',
    this.ngayHetHanGiayPhep,
    this.selectedMaPX,
    this.coverImage,
    this.coverImageUrl,
    this.isUploadingCover = false,
    this.phuongXaList = const [],
    this.createdBusiness,
    this.errorMessage,
    this.successMessage,
  });

  bool get canSubmit => tenCoSo.trim().isNotEmpty;

  BusinessRegState copyWith({
    BusinessRegStatus? status,
    String? tenCoSo,
    String? soGiayPhep,
    DateTime? ngayHetHanGiayPhep,
    bool clearNgayHetHanGiayPhep = false,
    String? selectedMaPX,
    bool clearSelectedMaPX = false,
    XFile? coverImage,
    bool clearCoverImage = false,
    String? coverImageUrl,
    bool clearCoverImageUrl = false,
    bool? isUploadingCover,
    List<PhuongXaModel>? phuongXaList,
    MyBusinessModel? createdBusiness,
    String? errorMessage,
    bool clearError = false,
    String? successMessage,
    bool clearSuccess = false,
  }) {
    return BusinessRegState(
      status: status ?? this.status,
      tenCoSo: tenCoSo ?? this.tenCoSo,
      soGiayPhep: soGiayPhep ?? this.soGiayPhep,
      ngayHetHanGiayPhep: clearNgayHetHanGiayPhep
          ? null
          : ngayHetHanGiayPhep ?? this.ngayHetHanGiayPhep,
      selectedMaPX: clearSelectedMaPX
          ? null
          : selectedMaPX ?? this.selectedMaPX,
      coverImage: clearCoverImage ? null : coverImage ?? this.coverImage,
      coverImageUrl: clearCoverImageUrl
          ? null
          : coverImageUrl ?? this.coverImageUrl,
      isUploadingCover: isUploadingCover ?? this.isUploadingCover,
      phuongXaList: phuongXaList ?? this.phuongXaList,
      createdBusiness: createdBusiness ?? this.createdBusiness,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
      successMessage: clearSuccess
          ? null
          : successMessage ?? this.successMessage,
    );
  }

  @override
  List<Object?> get props => [
    status,
    tenCoSo,
    soGiayPhep,
    ngayHetHanGiayPhep,
    selectedMaPX,
    coverImage?.path,
    coverImageUrl,
    isUploadingCover,
    phuongXaList,
    createdBusiness,
    errorMessage,
    successMessage,
  ];
}
