import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/empty_state_view.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/viewmodel/business_status/business_status_cubit.dart';
import 'package:mobile_ui/viewmodel/business_status/business_status_state.dart';

class BusinessStatusPage extends StatelessWidget {
  const BusinessStatusPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: BlocBuilder<BusinessStatusCubit, BusinessStatusState>(
          builder: (context, state) {
            if (state.status == BusinessStatusType.loading) {
              return const Center(
                child: CircularProgressIndicator(color: AppTheme.primary),
              );
            }

            if (state.status == BusinessStatusType.error) {
              return ErrorStateView(
                message: 'Không thể tải thông tin lúc này, thử lại sau',
                onRetry: () =>
                    context.read<BusinessStatusCubit>().loadDocuments(),
              );
            }

            // Trường hợp E1: Empty
            if (state.status == BusinessStatusType.empty ||
                (state.status == BusinessStatusType.loaded &&
                    state.documents.isEmpty)) {
              return const EmptyStateView(
                icon: Icons.shield_outlined,
                title: 'Chưa có thông tin pháp lý',
                subtitle:
                    'Thông tin pháp lý của cơ sở đang được cập nhật, vui lòng quay lại sau.',
              );
            }

            return RefreshIndicator(
              onRefresh: () => context.read<BusinessStatusCubit>().refresh(),
              color: AppTheme.primary,
              child: CustomScrollView(
                slivers: [
                  // Header
                  SliverToBoxAdapter(
                    child: Container(
                      padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Tình trạng pháp lý',
                            style: GoogleFonts.inter(
                              fontSize: 24,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textPrimary,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Quản lý giấy phép và chứng nhận của cơ sở',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: AppTheme.textSecondary,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  // Summary Card
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                      child: _SummaryCard(documents: state.documents),
                    ),
                  ),
                  // Document List
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate((context, index) {
                        final doc = state.documents[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _DocumentCard(data: doc),
                        );
                      }, childCount: state.documents.length),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final List<BusinessStatusData> documents;

  const _SummaryCard({required this.documents});

  @override
  Widget build(BuildContext context) {
    final active = documents.where((d) => d.status == 'active').length;
    final expired = documents.where((d) => d.status == 'expired').length;
    final revoked = documents.where((d) => d.status == 'revoked').length;

    return AppCard(
      child: Row(
        children: [
          Expanded(
            child: _SummaryItem(
              icon: Icons.check_circle_outline,
              iconColor: AppTheme.success,
              label: 'Còn hiệu lực',
              value: active.toString(),
            ),
          ),
          Container(width: 1, height: 40, color: AppTheme.dividerColor),
          Expanded(
            child: _SummaryItem(
              icon: Icons.warning_amber_rounded,
              iconColor: AppTheme.warning,
              label: 'Hết hạn',
              value: expired.toString(),
            ),
          ),
          Container(width: 1, height: 40, color: AppTheme.dividerColor),
          Expanded(
            child: _SummaryItem(
              icon: Icons.cancel_outlined,
              iconColor: AppTheme.error,
              label: 'Thu hồi',
              value: revoked.toString(),
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  const _SummaryItem({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: iconColor, size: 24),
        const SizedBox(height: 6),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppTheme.textPrimary,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            color: AppTheme.textSecondary,
            height: 1.3,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

class _DocumentCard extends StatelessWidget {
  final BusinessStatusData data;

  const _DocumentCard({required this.data});

  SafetyStatus _mapStatus(String statusStr) {
    switch (statusStr) {
      case 'active':
        return SafetyStatus.safe; // Xanh
      case 'expired':
        return SafetyStatus.warning; // Cam
      case 'revoked':
        return SafetyStatus.violated; // Đỏ
      default:
        return SafetyStatus.processing; // Trắng nhạt / xám
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor(data.status);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header với status badge
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  _getStatusIcon(data.status),
                  color: statusColor,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            data.title,
                            style: GoogleFonts.inter(
                              color: AppTheme.textPrimary,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              height: 1.3,
                            ),
                          ),
                        ),
                        StatusBadge(
                          status: _mapStatus(data.status),
                          customLabel: data.statusLabel,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Số: ${data.licenseNumber}',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Divider(color: AppTheme.dividerColor, height: 1),
          const SizedBox(height: 14),
          // Thông tin ngày tháng
          Row(
            children: [
              Expanded(
                child: _InfoItem(
                  icon: Icons.calendar_today_outlined,
                  label: 'Ngày cấp',
                  value: data.issueDate,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _InfoItem(
                  icon: Icons.event_outlined,
                  label: 'Hết hạn',
                  value: data.expiryDate,
                  valueColor: data.status == 'expired'
                      ? AppTheme.error
                      : AppTheme.textPrimary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'active':
        return AppTheme.success;
      case 'expired':
        return AppTheme.warning;
      case 'revoked':
        return AppTheme.error;
      default:
        return AppTheme.textSecondary;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'active':
        return Icons.verified_user_outlined;
      case 'expired':
        return Icons.warning_amber_rounded;
      case 'revoked':
        return Icons.block_outlined;
      default:
        return Icons.description_outlined;
    }
  }
}

class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;

  const _InfoItem({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: AppTheme.textSecondary),
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.inter(
                  color: AppTheme.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.inter(
              color: valueColor ?? AppTheme.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
