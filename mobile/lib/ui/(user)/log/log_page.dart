import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/empty_state_view.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/data/remote/model/log_models.dart';
import 'package:mobile_ui/viewmodel/log/log_cubit.dart';
import 'package:mobile_ui/viewmodel/log/log_state.dart';

/// Màn hình lịch sử đăng nhập.
///
/// Hiển thị các phiên đăng nhập của người dùng kèm cờ "lạ/bình thường"
/// được AI service phát hiện. Người dùng có thể kéo để làm mới.
class LogPage extends StatelessWidget {
  const LogPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.scaffoldBg,
      appBar: AppBar(
        title: Text(
          'Lịch sử đăng nhập',
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: BlocBuilder<LogCubit, LogState>(
        builder: (context, state) {
          if (state.status == LogStatus.loading && state.logs.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state.status == LogStatus.error && state.logs.isEmpty) {
            return ErrorStateView(
              message: state.errorMessage ?? 'Đã xảy ra lỗi. Vui lòng thử lại.',
              onRetry: () => context.read<LogCubit>().refresh(),
            );
          }

          if (state.logs.isEmpty) {
            return const EmptyStateView(
              icon: Icons.history_rounded,
              title: 'Chưa có lịch sử đăng nhập',
              subtitle: 'Các phiên đăng nhập của bạn sẽ được hiển thị tại đây.',
            );
          }

          return RefreshIndicator(
            color: AppTheme.primary,
            onRefresh: () => context.read<LogCubit>().refresh(),
            child: ListView(
              padding: const EdgeInsets.all(16),
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                _SummaryCard(
                  total: state.logs.length,
                  abnormal: state.abnormalCount,
                ),
                const SizedBox(height: 16),
                ...state.logs.map((log) => _LogTile(log: log)),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final int total;
  final int abnormal;

  const _SummaryCard({required this.total, required this.abnormal});

  @override
  Widget build(BuildContext context) {
    final hasAbnormal = abnormal > 0;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.dividerColor),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: (hasAbnormal ? AppTheme.error : AppTheme.success)
                  .withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              hasAbnormal ? Icons.shield_outlined : Icons.verified_user_rounded,
              color: hasAbnormal ? AppTheme.error : AppTheme.success,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  hasAbnormal
                      ? 'Phát hiện $abnormal phiên đăng nhập lạ'
                      : 'Tất cả phiên đăng nhập đều bình thường',
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Tổng cộng $total lượt đăng nhập',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
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

class _LogTile extends StatelessWidget {
  final LoginLog log;

  const _LogTile({required this.log});

  @override
  Widget build(BuildContext context) {
    final abnormal = log.abnormal;
    final color = abnormal ? AppTheme.error : AppTheme.success;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: abnormal
              ? AppTheme.error.withValues(alpha: 0.3)
              : AppTheme.dividerColor,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  abnormal
                      ? Icons.warning_amber_rounded
                      : Icons.check_circle_outline_rounded,
                  color: color,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  _formatDate(log.time),
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  abnormal ? 'Đăng nhập lạ' : 'Bình thường',
                  style: GoogleFonts.inter(
                    color: color,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _InfoRow(icon: Icons.public_rounded, label: 'IP', value: log.ip),
          if ((log.device ?? '').isNotEmpty)
            _InfoRow(
              icon: Icons.devices_rounded,
              label: 'Thiết bị',
              value: log.device!,
            ),
          if ((log.location ?? '').isNotEmpty)
            _InfoRow(
              icon: Icons.location_on_outlined,
              label: 'Vị trí',
              value: log.location!,
            ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? time) {
    if (time == null) return 'Không rõ thời gian';
    final local = time.toLocal();
    String two(int v) => v.toString().padLeft(2, '0');
    return '${two(local.day)}/${two(local.month)}/${local.year} '
        '${two(local.hour)}:${two(local.minute)}';
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppTheme.textSecondary),
          const SizedBox(width: 8),
          SizedBox(
            width: 64,
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
              ),
            ),
          ),
        ],
      ),
    );
  }
}
