class BusinessSearchModel {
  final String maCoSo;
  final String tenCoSo;
  final String? soGiayPhep;
  final String? ngayHetHanGiayPhep;
  final String trangThai;
  final String? maPX;
  final String? tenPhuongXa;
  final String? anhBia;
  final int soViPham;
  final List<String> loaiHinhKinhDoanh;

  const BusinessSearchModel({
    required this.maCoSo,
    required this.tenCoSo,
    this.soGiayPhep,
    this.ngayHetHanGiayPhep,
    required this.trangThai,
    this.maPX,
    this.tenPhuongXa,
    this.anhBia,
    required this.soViPham,
    required this.loaiHinhKinhDoanh,
  });

  factory BusinessSearchModel.fromJson(Map<String, dynamic> json) {
    return BusinessSearchModel(
      maCoSo: json['maCoSo'] as String,
      tenCoSo: json['tenCoSo'] as String,
      soGiayPhep: json['soGiayPhep'] as String?,
      ngayHetHanGiayPhep: json['ngayHetHanGiayPhep'] as String?,
      trangThai: json['trangThai'] as String,
      maPX: json['maPX'] as String?,
      tenPhuongXa: json['tenPhuongXa'] as String?,
      anhBia: json['anhBia'] as String?,
      soViPham: (json['soViPham'] as num?)?.toInt() ?? 0,
      loaiHinhKinhDoanh:
          (json['loaiHinhKinhDoanh'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }
}

class BusinessDetailModel {
  final BusinessInfoModel coSo;
  final String? anhBia;
  final int soViPham;
  final List<String> loaiHinhKinhDoanh;
  final List<CertificateModel> chungNhan;
  final List<LicenseModel> giayPhep;

  const BusinessDetailModel({
    required this.coSo,
    this.anhBia,
    required this.soViPham,
    required this.loaiHinhKinhDoanh,
    required this.chungNhan,
    required this.giayPhep,
  });

  factory BusinessDetailModel.fromJson(Map<String, dynamic> json) {
    return BusinessDetailModel(
      coSo: BusinessInfoModel.fromJson(json['coSo'] as Map<String, dynamic>),
      anhBia: json['anhBia'] as String?,
      soViPham: (json['soViPham'] as num?)?.toInt() ?? 0,
      loaiHinhKinhDoanh:
          (json['loaiHinhKinhDoanh'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      chungNhan:
          (json['chungNhan'] as List<dynamic>?)
              ?.map((e) => CertificateModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      giayPhep:
          (json['giayPhep'] as List<dynamic>?)
              ?.map((e) => LicenseModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class BusinessInfoModel {
  final String maCoSo;
  final String tenCoSo;
  final String? soGiayPhep;
  final String? ngayHetHanGiayPhep;
  final String trangThai;
  final String? maPX;
  final String? tenPhuongXa;
  final String? maChuSoHuu;
  final String? tenChuSoHuu;

  const BusinessInfoModel({
    required this.maCoSo,
    required this.tenCoSo,
    this.soGiayPhep,
    this.ngayHetHanGiayPhep,
    required this.trangThai,
    this.maPX,
    this.tenPhuongXa,
    this.maChuSoHuu,
    this.tenChuSoHuu,
  });

  factory BusinessInfoModel.fromJson(Map<String, dynamic> json) {
    return BusinessInfoModel(
      maCoSo: json['maCoSo'] as String,
      tenCoSo: json['tenCoSo'] as String,
      soGiayPhep: json['soGiayPhep'] as String?,
      ngayHetHanGiayPhep: json['ngayHetHanGiayPhep'] as String?,
      trangThai: json['trangThai'] as String,
      maPX: json['maPX'] as String?,
      tenPhuongXa: json['tenPhuongXa'] as String?,
      maChuSoHuu: json['maChuSoHuu'] as String?,
      tenChuSoHuu: json['tenChuSoHuu'] as String?,
    );
  }
}

class CertificateModel {
  final String maCN;
  final String tenChungNhan;
  final String ngayBanHanh;
  final String ngayHetHan;
  final String? trangThai;

  const CertificateModel({
    required this.maCN,
    required this.tenChungNhan,
    required this.ngayBanHanh,
    required this.ngayHetHan,
    this.trangThai,
  });

  factory CertificateModel.fromJson(Map<String, dynamic> json) {
    return CertificateModel(
      maCN: json['maCN'] as String,
      tenChungNhan: json['tenChungNhan'] as String,
      ngayBanHanh: json['ngayBanHanh'] as String,
      ngayHetHan: json['ngayHetHan'] as String,
      trangThai: json['trangThai'] as String?,
    );
  }
}

class LicenseModel {
  final String maGiayPhep;
  final String loaiGiayPhep;
  final String? trangThai;
  final String ngayCap;
  final String ngayHetHan;

  const LicenseModel({
    required this.maGiayPhep,
    required this.loaiGiayPhep,
    this.trangThai,
    required this.ngayCap,
    required this.ngayHetHan,
  });

  factory LicenseModel.fromJson(Map<String, dynamic> json) {
    return LicenseModel(
      maGiayPhep: json['maGiayPhep'] as String,
      loaiGiayPhep: json['loaiGiayPhep'] as String,
      trangThai: json['trangThai'] as String?,
      ngayCap: json['ngayCap'] as String,
      ngayHetHan: json['ngayHetHan'] as String,
    );
  }
}

class PagedResponse<T> {
  final List<T> content;
  final int totalElements;
  final int totalPages;
  final int number;
  final int size;

  const PagedResponse({
    required this.content,
    required this.totalElements,
    required this.totalPages,
    required this.number,
    required this.size,
  });

  factory PagedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJsonT,
  ) {
    return PagedResponse(
      content: (json['content'] as List<dynamic>)
          .map((e) => fromJsonT(e as Map<String, dynamic>))
          .toList(),
      totalElements: (json['totalElements'] as num).toInt(),
      totalPages: (json['totalPages'] as num).toInt(),
      number: (json['number'] as num).toInt(),
      size: (json['size'] as num).toInt(),
    );
  }
}
