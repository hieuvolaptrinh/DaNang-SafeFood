import 'package:equatable/equatable.dart';

/// Cơ sở kinh doanh thuộc CSKD đăng nhập.
class MyBusinessModel extends Equatable {
  final String maCoSo;
  final String tenCoSo;
  final String? soGiayPhep;
  final DateTime? ngayHetHanGiayPhep;
  final String trangThai;
  final String? trangThaiKinhDoanh;
  final String? trangThaiKinhDoanhLabel;
  final String? tenPhuongXa;
  final String? anhBia;

  const MyBusinessModel({
    required this.maCoSo,
    required this.tenCoSo,
    this.soGiayPhep,
    this.ngayHetHanGiayPhep,
    required this.trangThai,
    this.trangThaiKinhDoanh,
    this.trangThaiKinhDoanhLabel,
    this.tenPhuongXa,
    this.anhBia,
  });

  factory MyBusinessModel.fromJson(Map<String, dynamic> json) {
    return MyBusinessModel(
      maCoSo: json['maCoSo'] as String? ?? '',
      tenCoSo: json['tenCoSo'] as String? ?? '',
      soGiayPhep: json['soGiayPhep'] as String?,
      ngayHetHanGiayPhep: json['ngayHetHanGiayPhep'] != null
          ? DateTime.tryParse(json['ngayHetHanGiayPhep'] as String)
          : null,
      trangThai: json['trangThai'] as String? ?? 'Hoat dong',
      trangThaiKinhDoanh: json['trangThaiKinhDoanh'] as String?,
      trangThaiKinhDoanhLabel: json['trangThaiKinhDoanhLabel'] as String?,
      tenPhuongXa: json['tenPhuongXa'] as String?,
      anhBia: json['anhBia'] as String?,
    );
  }

  @override
  List<Object?> get props => [
    maCoSo,
    tenCoSo,
    soGiayPhep,
    ngayHetHanGiayPhep,
    trangThai,
    trangThaiKinhDoanh,
    trangThaiKinhDoanhLabel,
    tenPhuongXa,
    anhBia,
  ];
}

/// Phường xã (danh mục)
class PhuongXaModel extends Equatable {
  final String maPX;
  final String tenPhuongXa;

  const PhuongXaModel({required this.maPX, required this.tenPhuongXa});

  factory PhuongXaModel.fromJson(Map<String, dynamic> json) {
    return PhuongXaModel(
      maPX: json['maPX'] as String? ?? '',
      tenPhuongXa: json['tenPhuongXa'] as String? ?? '',
    );
  }

  @override
  List<Object?> get props => [maPX, tenPhuongXa];
}

/// Hồ sơ đăng kí kinh doanh
class HoSoDangKiModel extends Equatable {
  final String maHoSo;
  final DateTime? ngayNop;
  final DateTime? ngayCap;
  final DateTime? ngayHetHan;
  final String? trangThai;
  final String? urlFile;
  final String? maCoSo;
  final String? tenCoSo;
  final String? maLoaiGiayTo;
  final String? tenLoaiGiayTo;

  const HoSoDangKiModel({
    required this.maHoSo,
    this.ngayNop,
    this.ngayCap,
    this.ngayHetHan,
    this.trangThai,
    this.urlFile,
    this.maCoSo,
    this.tenCoSo,
    this.maLoaiGiayTo,
    this.tenLoaiGiayTo,
  });

  factory HoSoDangKiModel.fromJson(Map<String, dynamic> json) {
    return HoSoDangKiModel(
      maHoSo: json['maHoSo'] as String? ?? '',
      ngayNop: json['ngayNop'] != null
          ? DateTime.tryParse(json['ngayNop'] as String)
          : null,
      ngayCap: json['ngayCap'] != null
          ? DateTime.tryParse(json['ngayCap'] as String)
          : null,
      ngayHetHan: json['ngayHetHan'] != null
          ? DateTime.tryParse(json['ngayHetHan'] as String)
          : null,
      trangThai: json['trangThai'] as String?,
      urlFile: json['urlFile'] as String?,
      maCoSo: json['maCoSo'] as String?,
      tenCoSo: json['tenCoSo'] as String?,
      maLoaiGiayTo: json['maLoaiGiayTo'] as String?,
      tenLoaiGiayTo: json['tenLoaiGiayTo'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    if (maCoSo != null) 'maCoSo': maCoSo,
    if (ngayNop != null) 'ngayNop': ngayNop!.toIso8601String().substring(0, 10),
    if (trangThai != null) 'trangThai': trangThai,
    if (maLoaiGiayTo != null) 'maLoaiGiayTo': maLoaiGiayTo,
    if (urlFile != null) 'urlFile': urlFile,
  };

  @override
  List<Object?> get props => [
    maHoSo,
    ngayNop,
    ngayCap,
    ngayHetHan,
    trangThai,
    urlFile,
    maCoSo,
    tenCoSo,
    maLoaiGiayTo,
    tenLoaiGiayTo,
  ];
}
