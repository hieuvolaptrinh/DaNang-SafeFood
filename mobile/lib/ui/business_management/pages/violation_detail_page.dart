import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/section_header.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/data/remote/model/violation_models.dart';
import 'package:mobile_ui/ui/payment/payment_sheet.dart';
import 'package:mobile_ui/viewmodel/violation/violation_cubit.dart';
import 'package:mobile_ui/viewmodel/violation/violation_state.dart';

/// Chi tiết 1 vi phạm. Cho phép CSKD nhấn "Thanh toán" → mở bottom sheet
/// hiển thị mã QR PayOS để chuyển khoản. Khi PayOS xác nhận → trạng thái
/// được cập nhật thành "Đã khắc phục".
class ViolationDetailPage extends StatefulWidget {
  final String maViPham;

  const ViolationDetailPage({super.key, required this.maViPham});

  @override
  State<ViolationDetailPage> createState() => _ViolationDetailPageState();
}

class _ViolationDetailPageState extends State<ViolationDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ViolationCubit>().loadDetail(widget.maViPham);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Chi tiết vi phạm',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: BlocBuilder<ViolationCubit, ViolationState>(
        builder: (context, state) {
          if (state.status == ViolationStatus.loading ||
              state.selected == null) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }
          if (state.status == ViolationStatus.error) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Text(
                  state.errorMessage ?? 'Có lỗi xảy ra',
                  style: GoogleFonts.inter(color: AppTheme.error),
                ),
              ),
            );
          }
          return _Body(violation: state.selected!);
        },
      ),
    );
  }
}

class _Body extends StatelessWidget {
  final ViolationModel violation;
  const _Body({required this.violation});

  @override
  Widget build(BuildContext context) {
    final daKhacPhuc = violation.daKhacPhuc;
    final dangKhacPhuc = violation.dangKhacPhuc;
    final tienChuaNop = violation.danhSachKhacPhuc
        .where((h) => !h.daKhacPhuc)
        .fold<double>(0, (s, h) => s + h.soTienKhacPhuc);

    SafetyStatus badgeStatus;
    if (daKhacPhuc) {
      badgeStatus = SafetyStatus.safe;
    } else if (dangKhacPhuc) {
      badgeStatus = SafetyStatus.processing;
    } else {
      badgeStatus = SafetyStatus.violated;
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          StatusBadge(
            status: badgeStatus,
            customLabel: violation.tinhTrangKhacPhucLabel,
          ),
          const SizedBox(height: 12),

          Text(
            violation.tenLoaiViPham ?? 'Vi phạm',
            style: GoogleFonts.inter(
              color: AppTheme.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.bold,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 16),

          _InfoRow(label: 'Mã vi phạm', value: violation.maViPham),
          _InfoRow(label: 'Cơ sở', value: violation.tenCoSo ?? '—'),
          _InfoRow(label: 'Mức độ', value: violation.mucDo),
          _InfoRow(
            label: 'Trạng thái duyệt',
            value: _trangThaiPheDuyetLabel(violation.trangThaiPheDuyet),
          ),
          if (violation.maHoSo != null)
            _InfoRow(label: 'Mã hồ sơ', value: violation.maHoSo!),

          const SizedBox(height: 16),

          // Tổng tiền phạt
          _AmountCard(
            tongTien: violation.tongTienPhat,
            daNop: violation.tongTienPhat - tienChuaNop,
            chuaNop: tienChuaNop,
          ),

          const SizedBox(height: 20),
          const Divider(color: AppTheme.dividerColor),
          const SizedBox(height: 20),

          if ((violation.moTaThem ?? '').isNotEmpty) ...[
            const SectionHeader(
              title: 'Mô tả vi phạm',
              padding: EdgeInsets.symmetric(vertical: 8),
            ),
            Text(
              violation.moTaThem!,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 14,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 20),
          ],

          if ((violation.khacPhuc ?? '').isNotEmpty) ...[
            const SectionHeader(
              title: 'Yêu cầu khắc phục',
              padding: EdgeInsets.symmetric(vertical: 8),
            ),
            Text(
              violation.khacPhuc!,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 14,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 20),
          ],

          // Danh sách hình thức khắc phục
          const SectionHeader(
            title: 'Hình thức xử phạt',
            padding: EdgeInsets.symmetric(vertical: 8),
          ),
          if (violation.danhSachKhacPhuc.isEmpty)
            Text(
              'Chưa có hình thức xử phạt',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
            )
          else
            ...violation.danhSachKhacPhuc.map((h) => _KhacPhucItem(item: h)),

          const SizedBox(height: 32),

          // Action: Thanh toán
          if (!daKhacPhuc && tienChuaNop > 0)
            ElevatedButton.icon(
              onPressed: () => _onPay(context, violation),
              icon: const Icon(Icons.qr_code_2_rounded, size: 20),
              label: Text(
                'Tạo mã QR thanh toán',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 52),
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            )
          else if (daKhacPhuc)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.success.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: AppTheme.success.withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.verified_rounded,
                    color: AppTheme.success,
                    size: 24,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Vi phạm này đã được khắc phục đầy đủ',
                      style: GoogleFonts.inter(
                        color: AppTheme.success,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  String _trangThaiPheDuyetLabel(String s) {
    switch (s) {
      case 'CHO_DUYET':
        return 'Chờ duyệt';
      case 'DA_DUYET':
        return 'Đã duyệt';
      case 'TU_CHOI':
        return 'Từ chối';
      default:
        return s;
    }
  }

  Future<void> _onPay(BuildContext context, ViolationModel v) async {
    final cubit = context.read<ViolationCubit>();
    cubit.resetPayment();

    // Mở sheet ngay với spinner
    final result = cubit.createPayment(
      maViPham: v.maViPham,
      description: 'VP${v.maViPham}',
    );

    if (!context.mounted) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      isDismissible: false,
      builder: (sheetCtx) =>
          BlocProvider.value(value: cubit, child: const PaymentSheet()),
    );

    await result; // chờ tạo xong (sheet sẽ tự update qua bloc)
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AmountCard extends StatelessWidget {
  final double tongTien;
  final double daNop;
  final double chuaNop;
  const _AmountCard({
    required this.tongTien,
    required this.daNop,
    required this.chuaNop,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFFF1F1), Color(0xFFFFE2E2)],
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.error.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tổng tiền phạt',
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            _formatVnd(tongTien),
            style: GoogleFonts.inter(
              color: AppTheme.error,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _MiniStat(
                  label: 'Đã nộp',
                  value: _formatVnd(daNop),
                  color: AppTheme.success,
                ),
              ),
              Container(width: 1, height: 32, color: AppTheme.dividerColor),
              Expanded(
                child: _MiniStat(
                  label: 'Còn lại',
                  value: _formatVnd(chuaNop),
                  color: AppTheme.warning,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _MiniStat({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 11,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: GoogleFonts.inter(
              color: color,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _KhacPhucItem extends StatelessWidget {
  final HinhThucKhacPhucInfo item;
  const _KhacPhucItem({required this.item});

  @override
  Widget build(BuildContext context) {
    final done = item.daKhacPhuc;
    final inProgress = item.dangKhacPhuc;

    final Color color;
    final Color amountColor;
    final IconData icon;
    if (done) {
      color = AppTheme.success;
      amountColor = AppTheme.success;
      icon = Icons.check_circle_rounded;
    } else if (inProgress) {
      color = AppTheme.info;
      amountColor = AppTheme.info;
      icon = Icons.hourglass_top_rounded;
    } else {
      color = AppTheme.warning;
      amountColor = AppTheme.error;
      icon = Icons.payments_outlined;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _formatVnd(item.soTienKhacPhuc),
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: amountColor,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  item.tinhTrangKhacPhucLabel,
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

String _formatVnd(double amount) {
  final str = amount.toInt().toString();
  final buf = StringBuffer();
  int count = 0;
  for (int i = str.length - 1; i >= 0; i--) {
    buf.write(str[i]);
    count++;
    if (count % 3 == 0 && i != 0) buf.write('.');
  }
  return '${buf.toString().split('').reversed.join()} VNĐ';
}
