import 'package:equatable/equatable.dart';

/// Cơ sở kinh doanh thuộc CSKD đăng nhập.
class MyBusinessModel extends Equatable {
  final String maCoSo;
  final String tenCoSo;
  final String? soGiayPhep;
  final DateTime? ngayHetHanGiayPhep;
  final String trangThai;
  final String? tenPhuongXa;
  final String? anhBia;

  const MyBusinessModel({
    required this.maCoSo,
    required this.tenCoSo,
    this.soGiayPhep,
    this.ngayHetHanGiayPhep,
    required this.trangThai,
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
    tenPhuongXa,
    anhBia,
  ];
}

/// Hồ sơ đăng kí kinh doanh
class HoSoDangKiModel extends Equatable {
  final String maHoSo;
  final DateTime? ngayNop;
  final String? trangThai;
  final String? maCoSo;
  final String? tenCoSo;

  const HoSoDangKiModel({
    required this.maHoSo,
    this.ngayNop,
    this.trangThai,
    this.maCoSo,
    this.tenCoSo,
  });

  factory HoSoDangKiModel.fromJson(Map<String, dynamic> json) {
    return HoSoDangKiModel(
      maHoSo: json['maHoSo'] as String? ?? '',
      ngayNop: json['ngayNop'] != null
          ? DateTime.tryParse(json['ngayNop'] as String)
          : null,
      trangThai: json['trangThai'] as String?,
      maCoSo: json['maCoSo'] as String?,
      tenCoSo: json['tenCoSo'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    if (maCoSo != null) 'maCoSo': maCoSo,
    if (ngayNop != null) 'ngayNop': ngayNop!.toIso8601String().substring(0, 10),
    if (trangThai != null) 'trangThai': trangThai,
  };

  @override
  List<Object?> get props => [maHoSo, ngayNop, trangThai, maCoSo, tenCoSo];
}
