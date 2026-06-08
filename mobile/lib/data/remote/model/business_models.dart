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
  final List<String> diaChiChiNhanh;

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
    this.diaChiChiNhanh = const [],
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
      diaChiChiNhanh:
          (json['diaChiChiNhanh'] as List<dynamic>?)
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
  final List<ChiNhanhModel> chiNhanhs;
  final List<KhieuNaiModel> khieuNais;
  final List<ViPhamModel> viPhams;

  const BusinessDetailModel({
    required this.coSo,
    this.anhBia,
    required this.soViPham,
    required this.loaiHinhKinhDoanh,
    required this.chungNhan,
    required this.giayPhep,
    this.chiNhanhs = const [],
    this.khieuNais = const [],
    this.viPhams = const [],
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
      chiNhanhs:
          (json['chiNhanhs'] as List<dynamic>?)
              ?.map((e) => ChiNhanhModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      khieuNais:
          (json['khieuNais'] as List<dynamic>?)
              ?.map((e) => KhieuNaiModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      viPhams:
          (json['viPhams'] as List<dynamic>?)
              ?.map((e) => ViPhamModel.fromJson(e as Map<String, dynamic>))
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
  final String? ngayBanHanh;
  final String? ngayHetHan;
  final String? trangThai;

  const CertificateModel({
    required this.maCN,
    required this.tenChungNhan,
    this.ngayBanHanh,
    this.ngayHetHan,
    this.trangThai,
  });

  factory CertificateModel.fromJson(Map<String, dynamic> json) {
    return CertificateModel(
      maCN: json['maCN'] as String,
      tenChungNhan: json['tenChungNhan'] as String,
      ngayBanHanh: json['ngayBanHanh'] as String?,
      ngayHetHan: json['ngayHetHan'] as String?,
      trangThai: json['trangThai'] as String?,
    );
  }
}

class LicenseModel {
  final String maGiayPhep;
  final String loaiGiayPhep;
  final String? trangThai;
  final String? ngayCap;
  final String? ngayHetHan;

  const LicenseModel({
    required this.maGiayPhep,
    required this.loaiGiayPhep,
    this.trangThai,
    this.ngayCap,
    this.ngayHetHan,
  });

  factory LicenseModel.fromJson(Map<String, dynamic> json) {
    return LicenseModel(
      maGiayPhep: json['maGiayPhep'] as String,
      loaiGiayPhep: json['loaiGiayPhep'] as String,
      trangThai: json['trangThai'] as String?,
      ngayCap: json['ngayCap'] as String?,
      ngayHetHan: json['ngayHetHan'] as String?,
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

class ChiNhanhModel {
  final String? diaChi;
  final String? soDienThoai;

  const ChiNhanhModel({this.diaChi, this.soDienThoai});

  factory ChiNhanhModel.fromJson(Map<String, dynamic> json) {
    return ChiNhanhModel(
      diaChi: json['diaChi'] as String?,
      soDienThoai: json['soDienThoai'] as String?,
    );
  }
}

class KhieuNaiModel {
  final String maKhieuNai;
  final String? tieuDe;
  final String? moTaChiTiet;
  final String? ketQuaXuLy;
  final String? trangThai;
  final String? thoiGianKhieuNai;

  const KhieuNaiModel({
    required this.maKhieuNai,
    this.tieuDe,
    this.moTaChiTiet,
    this.ketQuaXuLy,
    this.trangThai,
    this.thoiGianKhieuNai,
  });

  factory KhieuNaiModel.fromJson(Map<String, dynamic> json) {
    return KhieuNaiModel(
      maKhieuNai: json['maKhieuNai'] as String,
      tieuDe: json['tieuDe'] as String?,
      moTaChiTiet: json['moTaChiTiet'] as String?,
      ketQuaXuLy: json['ketQuaXuLy'] as String?,
      trangThai: json['trangThai'] as String?,
      thoiGianKhieuNai: json['thoiGianKhieuNai'] as String?,
    );
  }
}

class ViPhamModel {
  final String maViPham;
  final String? moTaThem;
  final String? khacPhuc;
  final String? mucDo;
  final double? soTienPhat;
  final String? trangThaiPheDuyet;
  final String? loaiViPham;

  const ViPhamModel({
    required this.maViPham,
    this.moTaThem,
    this.khacPhuc,
    this.mucDo,
    this.soTienPhat,
    this.trangThaiPheDuyet,
    this.loaiViPham,
  });

  factory ViPhamModel.fromJson(Map<String, dynamic> json) {
    return ViPhamModel(
      maViPham: json['maViPham'] as String,
      moTaThem: json['moTaThem'] as String?,
      khacPhuc: json['khacPhuc'] as String?,
      mucDo: json['mucDo'] as String?,
      soTienPhat: (json['soTienPhat'] as num?)?.toDouble(),
      trangThaiPheDuyet: json['trangThaiPheDuyet'] as String?,
      loaiViPham: json['loaiViPham'] as String?,
    );
  }
}
