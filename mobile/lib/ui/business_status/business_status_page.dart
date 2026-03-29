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
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Tình trạng pháp lý',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: BlocBuilder<BusinessStatusCubit, BusinessStatusState>(
        builder: (context, state) {
          if (state.status == BusinessStatusType.loading) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }

          if (state.status == BusinessStatusType.error) {
            return ErrorStateView(
              message: 'Không thể tải thông tin lúc này, thử lại sau',
              onRetry: () => context.read<BusinessStatusCubit>().loadDocuments(),
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
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: state.documents.length,
              itemBuilder: (context, index) {
                final doc = state.documents[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _DocumentCard(data: doc),
                );
              },
            ),
          );
        },
      ),
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
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.verified_user_outlined,
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
                      data.title,
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Số: ${data.licenseNumber}',
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
          const SizedBox(height: 16),
          Divider(color: AppTheme.dividerColor, height: 1),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Ngày cấp',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    data.issueDate,
                    style: GoogleFonts.inter(
                      color: AppTheme.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Ngày hết hạn',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    data.expiryDate,
                    style: GoogleFonts.inter(
                      color: AppTheme.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              StatusBadge(
                status: _mapStatus(data.status),
                customLabel: data.statusLabel,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
