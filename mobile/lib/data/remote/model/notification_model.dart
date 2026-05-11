class NotificationModel {
  final String maThongBao;
  final String tieuDe;
  final String noiDung;
  final String? ngayGui;
  final String? loaiThongBao;
  final bool isCongDong;

  const NotificationModel({
    required this.maThongBao,
    required this.tieuDe,
    required this.noiDung,
    this.ngayGui,
    this.loaiThongBao,
    this.isCongDong = false,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      maThongBao: json['maThongBao'] as String? ?? '',
      tieuDe: json['tieuDe'] as String? ?? '',
      noiDung: json['noiDung'] as String? ?? '',
      ngayGui: json['ngayGui'] as String?,
      loaiThongBao: json['loaiThongBao'] as String?,
      isCongDong: json['isCongDong'] as bool? ?? false,
    );
  }

  /// Ngày gửi đã format (dd/MM/yyyy HH:mm)
  String get formattedDate {
    if (ngayGui == null) return '';
    try {
      final dt = DateTime.parse(ngayGui!);
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} '
          '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return ngayGui ?? '';
    }
  }

  /// Ngày gửi rút gọn (dd/MM/yyyy)
  String get shortDate {
    if (ngayGui == null) return '';
    try {
      final dt = DateTime.parse(ngayGui!);
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
    } catch (_) {
      return ngayGui ?? '';
    }
  }
}
