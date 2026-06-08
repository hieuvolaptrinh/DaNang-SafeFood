import 'package:equatable/equatable.dart';

/// Trạng thái khắc phục (khớp enum BE).
enum KhacPhucStatus { chuaKhacPhuc, dangKhacPhuc, daKhacPhuc }

KhacPhucStatus _khacPhucFrom(String? raw) {
  switch (raw) {
    case 'DA_KHAC_PHUC':
      return KhacPhucStatus.daKhacPhuc;
    case 'DANG_KHAC_PHUC':
      return KhacPhucStatus.dangKhacPhuc;
    default:
      return KhacPhucStatus.chuaKhacPhuc;
  }
}

String khacPhucLabel(KhacPhucStatus s) {
  switch (s) {
    case KhacPhucStatus.daKhacPhuc:
      return 'Đã khắc phục';
    case KhacPhucStatus.dangKhacPhuc:
      return 'Đang khắc phục';
    case KhacPhucStatus.chuaKhacPhuc:
      return 'Chưa khắc phục';
  }
}

/// 1 hình thức khắc phục (xử phạt cụ thể) gắn với vi phạm.
class HinhThucKhacPhucInfo extends Equatable {
  final String maHinhThucKhacPhuc;
  final double soTienKhacPhuc;
  final KhacPhucStatus tinhTrangKhacPhuc;
  final String tinhTrangKhacPhucLabel;

  const HinhThucKhacPhucInfo({
    required this.maHinhThucKhacPhuc,
    required this.soTienKhacPhuc,
    this.tinhTrangKhacPhuc = KhacPhucStatus.chuaKhacPhuc,
    this.tinhTrangKhacPhucLabel = 'Chưa khắc phục',
  });

  bool get daKhacPhuc => tinhTrangKhacPhuc == KhacPhucStatus.daKhacPhuc;
  bool get dangKhacPhuc => tinhTrangKhacPhuc == KhacPhucStatus.dangKhacPhuc;

  factory HinhThucKhacPhucInfo.fromJson(Map<String, dynamic> json) {
    final st = _khacPhucFrom(json['tinhTrangKhacPhuc'] as String?);
    return HinhThucKhacPhucInfo(
      maHinhThucKhacPhuc: json['maHinhThucKhacPhuc'] as String? ?? '',
      soTienKhacPhuc: (json['soTienKhacPhuc'] as num?)?.toDouble() ?? 0,
      tinhTrangKhacPhuc: st,
      tinhTrangKhacPhucLabel:
          json['tinhTrangKhacPhucLabel'] as String? ?? khacPhucLabel(st),
    );
  }

  @override
  List<Object?> get props => [
    maHinhThucKhacPhuc,
    soTienKhacPhuc,
    tinhTrangKhacPhuc,
    tinhTrangKhacPhucLabel,
  ];
}

/// Vi phạm (xử phạt) của CSKD
class ViolationModel extends Equatable {
  final String maViPham;
  final String? moTaThem;
  final String? khacPhuc;
  final String trangThaiPheDuyet;
  final String mucDo;
  final String? maHoSo;
  final String? tenLoaiViPham;
  final String? maCoSo;
  final String? tenCoSo;
  final double tongTienPhat;
  final KhacPhucStatus tinhTrangKhacPhuc;
  final String tinhTrangKhacPhucLabel;
  final List<HinhThucKhacPhucInfo> danhSachKhacPhuc;
  final List<String> minhChungUrls;

  const ViolationModel({
    required this.maViPham,
    this.moTaThem,
    this.khacPhuc,
    required this.trangThaiPheDuyet,
    required this.mucDo,
    this.maHoSo,
    this.tenLoaiViPham,
    this.maCoSo,
    this.tenCoSo,
    required this.tongTienPhat,
    required this.tinhTrangKhacPhuc,
    required this.tinhTrangKhacPhucLabel,
    required this.danhSachKhacPhuc,
    required this.minhChungUrls,
  });

  bool get daKhacPhuc => tinhTrangKhacPhuc == KhacPhucStatus.daKhacPhuc;
  bool get dangKhacPhuc => tinhTrangKhacPhuc == KhacPhucStatus.dangKhacPhuc;

  factory ViolationModel.fromJson(Map<String, dynamic> json) {
    final ds =
        (json['danhSachKhacPhuc'] as List<dynamic>?)
            ?.map(
              (e) => HinhThucKhacPhucInfo.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const <HinhThucKhacPhucInfo>[];

    final st = _khacPhucFrom(json['tinhTrangKhacPhuc'] as String?);

    return ViolationModel(
      maViPham: json['maViPham'] as String? ?? '',
      moTaThem: json['moTaThem'] as String?,
      khacPhuc: json['khacPhuc'] as String?,
      trangThaiPheDuyet: json['trangThaiPheDuyet'] as String? ?? 'CHO_DUYET',
      mucDo: json['mucDo'] as String? ?? '',
      maHoSo: json['maHoSo'] as String?,
      tenLoaiViPham: json['tenLoaiViPham'] as String?,
      maCoSo: json['maCoSo'] as String?,
      tenCoSo: json['tenCoSo'] as String?,
      tongTienPhat: (json['tongTienPhat'] as num?)?.toDouble() ?? 0,
      tinhTrangKhacPhuc: st,
      tinhTrangKhacPhucLabel:
          json['tinhTrangKhacPhucLabel'] as String? ?? khacPhucLabel(st),
      danhSachKhacPhuc: ds,
      minhChungUrls: (json['minhChungUrls'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
    );
  }

  @override
  List<Object?> get props => [
    maViPham,
    moTaThem,
    khacPhuc,
    trangThaiPheDuyet,
    mucDo,
    maHoSo,
    tenLoaiViPham,
    maCoSo,
    tenCoSo,
    tongTienPhat,
    tinhTrangKhacPhuc,
    tinhTrangKhacPhucLabel,
    danhSachKhacPhuc,
    minhChungUrls,
  ];
}

/// Trạng thái giao dịch thanh toán
enum PaymentStatus { pending, paid, cancelled, expired }

PaymentStatus _statusFrom(String? raw) {
  switch (raw) {
    case 'PAID':
      return PaymentStatus.paid;
    case 'CANCELLED':
      return PaymentStatus.cancelled;
    case 'EXPIRED':
      return PaymentStatus.expired;
    default:
      return PaymentStatus.pending;
  }
}

/// Giao dịch thanh toán PayOS
class PaymentModel extends Equatable {
  final String maGiaoDich;
  final int orderCode;
  final double soTien;
  final String? moTa;
  final String? qrCode;
  final String? checkoutUrl;
  final String? bankName;
  final String? accountNumber;
  final String? accountName;
  final PaymentStatus trangThai;
  final String? maXuPhat;
  final DateTime? createdAt;
  final DateTime? paidAt;
  final DateTime? expiresAt;

  const PaymentModel({
    required this.maGiaoDich,
    required this.orderCode,
    required this.soTien,
    this.moTa,
    this.qrCode,
    this.checkoutUrl,
    this.bankName,
    this.accountNumber,
    this.accountName,
    required this.trangThai,
    this.maXuPhat,
    this.createdAt,
    this.paidAt,
    this.expiresAt,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic v) {
      if (v == null) return null;
      if (v is String) return DateTime.tryParse(v);
      if (v is num) {
        return DateTime.fromMillisecondsSinceEpoch(v.toInt() * 1000);
      }
      return null;
    }

    return PaymentModel(
      maGiaoDich: json['maGiaoDich'] as String? ?? '',
      orderCode: (json['orderCode'] as num?)?.toInt() ?? 0,
      soTien: (json['soTien'] as num?)?.toDouble() ?? 0,
      moTa: json['moTa'] as String?,
      qrCode: json['qrCode'] as String?,
      checkoutUrl: json['checkoutUrl'] as String?,
      bankName: json['bankName'] as String?,
      accountNumber: json['accountNumber'] as String?,
      accountName: json['accountName'] as String?,
      trangThai: _statusFrom(json['trangThai'] as String?),
      maXuPhat: json['maXuPhat'] as String?,
      createdAt: parseDate(json['createdAt']),
      paidAt: parseDate(json['paidAt']),
      expiresAt: parseDate(json['expiresAt']),
    );
  }

  @override
  List<Object?> get props => [
    maGiaoDich,
    orderCode,
    soTien,
    moTa,
    qrCode,
    checkoutUrl,
    bankName,
    accountNumber,
    accountName,
    trangThai,
    maXuPhat,
    createdAt,
    paidAt,
    expiresAt,
  ];
}
