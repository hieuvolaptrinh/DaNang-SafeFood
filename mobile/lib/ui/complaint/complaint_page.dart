import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/empty_state_view.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_state.dart';

class ComplaintPage extends StatelessWidget {
  const ComplaintPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: BlocBuilder<ComplaintCubit, ComplaintState>(
        builder: (context, state) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Phản ánh',
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    AppButton(
                      text: 'Tạo mới',
                      icon: Icons.add_rounded,
                      width: 150,
                      onPressed: () =>
                          Navigator.pushNamed(context, Routes.complaintForm),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Danh sách phản ánh của bạn',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              Expanded(child: _ComplaintBody(state: state)),
            ],
          );
        },
      ),
    );
  }
}

class _ComplaintBody extends StatelessWidget {
  final ComplaintState state;

  const _ComplaintBody({required this.state});

  @override
  Widget build(BuildContext context) {
    if (state.status == ComplaintStatus.loading) {
      return const Center(
        child: CircularProgressIndicator(color: AppTheme.primary),
      );
    }

    if (state.status == ComplaintStatus.error) {
      return ErrorStateView(
        message: state.errorMessage ?? 'Không thể tải phản ánh',
        onRetry: () => context.read<ComplaintCubit>().loadComplaints(),
      );
    }

    if (state.complaints.isEmpty) {
      return const EmptyStateView(
        icon: Icons.campaign_outlined,
        title: 'Chưa có phản ánh',
        subtitle: 'Bạn có thể tạo phản ánh mới để hệ thống tiếp nhận.',
      );
    }

    return RefreshIndicator(
      onRefresh: () => context.read<ComplaintCubit>().refresh(),
      color: AppTheme.primary,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: state.complaints.length,
        itemBuilder: (context, index) {
          final item = state.complaints[index];
          return AppCard(
            onTap: () => Navigator.pushNamed(
              context,
              Routes.complaintDetail,
              arguments: {'id': item.id},
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.title,
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    StatusBadge(
                      status: _mapStatus(item.status),
                      customLabel: item.status,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Icon(
                      Icons.location_on_outlined,
                      size: 14,
                      color: AppTheme.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        item.location ??
                            item.businessName ??
                            'Không rõ địa điểm',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      _formatDate(item.submittedAt),
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

SafetyStatus _mapStatus(String status) {
  final normalized = status.toLowerCase();
  if (normalized.contains('đã') || normalized.contains('da')) {
    return SafetyStatus.safe;
  }
  if (normalized.contains('chưa') || normalized.contains('chua')) {
    return SafetyStatus.warning;
  }
  if (normalized.contains('vi phạm') || normalized.contains('vi pham')) {
    return SafetyStatus.violated;
  }
  return SafetyStatus.processing;
}

String _formatDate(DateTime? date) {
  if (date == null) return '--/--/----';
  final day = date.day.toString().padLeft(2, '0');
  final month = date.month.toString().padLeft(2, '0');
  return '$day/$month/${date.year}';
}
