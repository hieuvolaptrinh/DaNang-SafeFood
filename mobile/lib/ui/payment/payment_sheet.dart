import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/data/remote/model/violation_models.dart';
import 'package:mobile_ui/viewmodel/violation/violation_cubit.dart';
import 'package:mobile_ui/viewmodel/violation/violation_state.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

/// Bottom sheet hiển thị mã QR thanh toán PayOS.
///
/// Sử dụng:
///   showModalBottomSheet(
///     context: ctx,
///     isScrollControlled: true,
///     backgroundColor: Colors.transparent,
///     builder: (_) => BlocProvider.value(
///       value: ctx.read<ViolationCubit>(),
///       child: const PaymentSheet(),
///     ),
///   );
class PaymentSheet extends StatelessWidget {
  const PaymentSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ViolationCubit, ViolationState>(
      builder: (context, state) {
        return DraggableScrollableSheet(
          initialChildSize: 0.92,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          builder: (context, scrollCtrl) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: SingleChildScrollView(
                controller: scrollCtrl,
                child: _buildBody(context, state),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildBody(BuildContext context, ViolationState state) {
    if (state.paymentStatus == PaymentFlowStatus.creating) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 80),
        child: Center(
          child: CircularProgressIndicator(color: AppTheme.primary),
        ),
      );
    }

    if (state.paymentStatus == PaymentFlowStatus.error) {
      return Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Icon(Icons.error_outline, color: AppTheme.error, size: 56),
            const SizedBox(height: 12),
            Text(
              state.paymentError ?? 'Không thể tạo link thanh toán',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 20),
            AppButton(text: 'Đóng', onPressed: () => Navigator.pop(context)),
          ],
        ),
      );
    }

    final p = state.payment;
    if (p == null) {
      return const SizedBox(height: 200);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Handle
        Center(
          child: Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: AppTheme.dividerColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ),

        // Header
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.qr_code_2_rounded,
                  color: AppTheme.primary,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Thanh toán xử phạt',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      'Quét mã QR hoặc chuyển khoản theo thông tin bên dưới',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close_rounded, size: 22),
                onPressed: () {
                  context.read<ViolationCubit>().resetPayment();
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Status badge
        Center(child: _StatusBadge(status: p.trangThai)),
        const SizedBox(height: 16),

        // QR
        Center(child: _QrCard(payment: p)),

        const SizedBox(height: 20),

        // Amount
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: AppTheme.primaryGradient,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Số tiền cần thanh toán',
                style: GoogleFonts.inter(
                  color: Colors.white.withValues(alpha: 0.85),
                  fontSize: 13,
                ),
              ),
              Text(
                _formatVnd(p.soTien),
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Bank info
        if ((p.accountNumber ?? '').isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              'Thông tin chuyển khoản',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
          ),
          const SizedBox(height: 8),
          _CopyableRow(
            label: 'Ngân hàng',
            value: p.bankName ?? '—',
            copyable: false,
          ),
          _CopyableRow(label: 'Số tài khoản', value: p.accountNumber!),
          _CopyableRow(
            label: 'Chủ tài khoản',
            value: p.accountName ?? '—',
            copyable: false,
          ),
          _CopyableRow(label: 'Nội dung CK', value: p.moTa ?? 'NopPhat'),
          _CopyableRow(label: 'Số tiền', value: _formatVnd(p.soTien)),
        ],

        const SizedBox(height: 20),

        // Buttons
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              if ((p.checkoutUrl ?? '').isNotEmpty)
                AppButton(
                  text: 'Mở trang thanh toán',
                  icon: Icons.open_in_new_rounded,
                  onPressed: () async {
                    final uri = Uri.parse(p.checkoutUrl!);
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  },
                ),
              const SizedBox(height: 10),
              AppButton(
                text: 'Tôi đã thanh toán',
                isOutlined: true,
                icon: Icons.refresh_rounded,
                onPressed: () =>
                    context.read<ViolationCubit>().refreshPayment(),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            'Ứng dụng sẽ tự động cập nhật khi nhận được xác nhận thanh toán từ ngân hàng (thường mất vài giây).',
            style: GoogleFonts.inter(
              color: AppTheme.textTertiary,
              fontSize: 11,
              height: 1.5,
            ),
          ),
        ),

        const SizedBox(height: 32),
      ],
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final PaymentStatus status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;
    IconData icon;
    switch (status) {
      case PaymentStatus.paid:
        bg = AppTheme.success.withValues(alpha: 0.12);
        fg = AppTheme.success;
        label = 'Đã thanh toán';
        icon = Icons.check_circle_rounded;
        break;
      case PaymentStatus.cancelled:
        bg = AppTheme.error.withValues(alpha: 0.12);
        fg = AppTheme.error;
        label = 'Đã huỷ';
        icon = Icons.cancel_rounded;
        break;
      case PaymentStatus.expired:
        bg = AppTheme.textTertiary.withValues(alpha: 0.12);
        fg = AppTheme.textSecondary;
        label = 'Hết hạn';
        icon = Icons.timer_off_rounded;
        break;
      case PaymentStatus.pending:
        bg = AppTheme.warning.withValues(alpha: 0.12);
        fg = AppTheme.warning;
        label = 'Đang chờ thanh toán';
        icon = Icons.access_time_rounded;
        break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: fg, size: 16),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.inter(
              color: fg,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _QrCard extends StatelessWidget {
  final PaymentModel payment;
  const _QrCard({required this.payment});

  @override
  Widget build(BuildContext context) {
    final qrData = payment.qrCode ?? payment.checkoutUrl ?? '';
    final isPaid = payment.trangThai == PaymentStatus.paid;

    return Container(
      width: 240,
      height: 240,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withValues(alpha: 0.12),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
        border: Border.all(
          color: AppTheme.primary.withValues(alpha: 0.2),
          width: 1.5,
        ),
      ),
      child: isPaid
          ? Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.verified_rounded,
                  color: AppTheme.success,
                  size: 80,
                ),
                const SizedBox(height: 8),
                Text(
                  'Thanh toán thành công',
                  style: GoogleFonts.inter(
                    color: AppTheme.success,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            )
          : qrData.isEmpty
          ? Center(
              child: Text(
                'Không có dữ liệu QR',
                style: GoogleFonts.inter(
                  color: AppTheme.textSecondary,
                  fontSize: 12,
                ),
              ),
            )
          : QrImageView(
              data: qrData,
              version: QrVersions.auto,
              size: 208,
              backgroundColor: Colors.white,
              eyeStyle: const QrEyeStyle(
                eyeShape: QrEyeShape.square,
                color: AppTheme.primary,
              ),
              dataModuleStyle: const QrDataModuleStyle(
                dataModuleShape: QrDataModuleShape.square,
                color: AppTheme.textPrimary,
              ),
            ),
    );
  }
}

class _CopyableRow extends StatelessWidget {
  final String label;
  final String value;
  final bool copyable;

  const _CopyableRow({
    required this.label,
    required this.value,
    this.copyable = true,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 6, 20, 6),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: AppTheme.surfaceBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.dividerColor),
        ),
        child: Row(
          children: [
            SizedBox(
              width: 110,
              child: Text(
                label,
                style: GoogleFonts.inter(
                  color: AppTheme.textSecondary,
                  fontSize: 12,
                ),
              ),
            ),
            Expanded(
              child: Text(
                value,
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            if (copyable)
              GestureDetector(
                onTap: () async {
                  await Clipboard.setData(ClipboardData(text: value));
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Đã sao chép: $value'),
                        behavior: SnackBarBehavior.floating,
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  }
                },
                child: const Icon(
                  Icons.content_copy_rounded,
                  size: 16,
                  color: AppTheme.primary,
                ),
              ),
          ],
        ),
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
