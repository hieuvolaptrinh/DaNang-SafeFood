import 'package:equatable/equatable.dart';

/// Model cho danh sách phản ánh (summary)
class ComplaintSummary extends Equatable {
  final String id;
  final String status;
  final String title;
  final String content;
  final String? location;
  final DateTime? submittedAt;
  final String typeId;
  final String typeName;
  final String? businessId;
  final String? businessName;
  final List<String> fileUrls;

  const ComplaintSummary({
    required this.id,
    required this.status,
    required this.title,
    required this.content,
    this.location,
    this.submittedAt,
    required this.typeId,
    required this.typeName,
    this.businessId,
    this.businessName,
    this.fileUrls = const [],
  });

  factory ComplaintSummary.fromJson(Map<String, dynamic> json) {
    return ComplaintSummary(
      id: json['maPhanAnh'] as String? ?? '',
      status: json['trangThaiPhanAnh'] as String? ?? 'Chưa xử lý',
      title: json['tieuDe'] as String? ?? '',
      content: json['noiDung'] as String? ?? '',
      location: json['diaDiem'] as String?,
      submittedAt: json['ngayGui'] != null
          ? DateTime.tryParse(json['ngayGui'] as String)
          : null,
      typeId: json['maLoaiPhanAnh'] as String? ?? '',
      typeName: json['tenLoaiPhanAnh'] as String? ?? '',
      businessId: json['maCoSo'] as String?,
      businessName: json['tenCoSo'] as String?,
      fileUrls: json['fileUrls'] != null
          ? List<String>.from(json['fileUrls'] as List)
          : [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'maPhanAnh': id,
      'trangThaiPhanAnh': status,
      'tieuDe': title,
      'noiDung': content,
      'diaDiem': location,
      'ngayGui': submittedAt?.toIso8601String(),
      'maLoaiPhanAnh': typeId,
      'tenLoaiPhanAnh': typeName,
      'maCoSo': businessId,
      'tenCoSo': businessName,
      'fileUrls': fileUrls,
    };
  }

  @override
  List<Object?> get props => [
    id,
    status,
    title,
    content,
    location,
    submittedAt,
    typeId,
    typeName,
    businessId,
    businessName,
    fileUrls,
  ];
}

/// Model cho loại phản ánh
class ComplaintType extends Equatable {
  final String id;
  final String name;

  const ComplaintType({required this.id, required this.name});

  factory ComplaintType.fromJson(Map<String, dynamic> json) {
    return ComplaintType(
      id: json['maLoaiPhanAnh'] as String? ?? '',
      name: json['tenLoaiPhanAnh'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'maLoaiPhanAnh': id, 'tenLoaiPhanAnh': name};
  }

  @override
  List<Object?> get props => [id, name];
}

/// Request model để tạo phản ánh mới
class ComplaintCreateRequest extends Equatable {
  final String title;
  final String content;
  final String typeId;
  final String? businessId;
  final String? location;
  final List<String> fileUrls;

  const ComplaintCreateRequest({
    required this.title,
    required this.content,
    required this.typeId,
    this.businessId,
    this.location,
    this.fileUrls = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'tieuDe': title,
      'noiDung': content,
      'maLoaiPhanAnh': typeId,
      if (businessId != null && businessId!.isNotEmpty) 'maCoSo': businessId,
      if (location != null && location!.isNotEmpty) 'diaDiem': location,
      'fileUrls': fileUrls,
    };
  }

  @override
  List<Object?> get props => [
    title,
    content,
    typeId,
    businessId,
    location,
    fileUrls,
  ];
}
