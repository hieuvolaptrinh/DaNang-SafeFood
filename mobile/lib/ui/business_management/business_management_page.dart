import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/section_header.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

class BusinessManagementPage extends StatelessWidget {
  const BusinessManagementPage({super.key});

  static final _mockBusinesses = [
    {
      'name': 'Nhà hàng Biển Xanh',
      'address': '123 Nguyễn Văn Linh, Hải Châu',
      'status': SafetyStatus.safe,
      'statusLabel': 'Hoạt động',
    },
    {
      'name': 'Quán Phở Bà Năm',
      'address': '45 Trần Phú, Hải Châu',
      'status': SafetyStatus.warning,
      'statusLabel': 'Chờ duyệt',
    },
    {
      'name': 'Tiệm Bánh Mì Hội An',
      'address': '67 Lê Duẩn, Thanh Khê',
      'status': SafetyStatus.violated,
      'statusLabel': 'Đình chỉ',
    },
  ];

  static final _mockViolations = [
    {
      'title': 'Vi phạm vệ sinh khu chế biến',
      'date': '18/03/2026',
      'fine': '5.000.000 VNĐ',
      'status': SafetyStatus.violated,
      'statusLabel': 'Chưa nộp',
    },
    {
      'title': 'Không có giấy khám sức khỏe nhân viên',
      'date': '10/03/2026',
      'fine': '3.000.000 VNĐ',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đã nộp',
    },
    {
      'title': 'Bảo quản thực phẩm không đúng quy định',
      'date': '01/03/2026',
      'fine': '8.000.000 VNĐ',
      'status': SafetyStatus.processing,
      'statusLabel': 'Khiếu nại',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BusinessManagementCubit, BusinessMgmtState>(
      builder: (context, state) {
        if (state.status == BusinessMgmtStatus.error) {
          return ErrorStateView(
            onRetry: () =>
                context.read<BusinessManagementCubit>().loadData(),
          );
        }

        if (state.status == BusinessMgmtStatus.loading) {
          return const Center(
            child: CircularProgressIndicator(color: AppTheme.primary),
          );
        }

        return RefreshIndicator(
          onRefresh: () =>
              context.read<BusinessManagementCubit>().refresh(),
          color: AppTheme.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),
                  // Header
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Quản lý kinh doanh',
                          style: GoogleFonts.inter(
                            color: AppTheme.textPrimary,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        _AddButton(
                          onTap: () => Navigator.pushNamed(
                            context,
                            Routes.businessRegistration,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // SECTION 1: My Businesses
                  SectionHeader(
                    title: 'Cơ sở của tôi',
                    actionText: 'Xem tất cả',
                    onActionTap: () {},
                  ),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      children: _mockBusinesses
                          .map((b) => _BusinessCard(
                                name: b['name'] as String,
                                address: b['address'] as String,
                                status: b['status'] as SafetyStatus,
                                statusLabel: b['statusLabel'] as String,
                                onTap: () => Navigator.pushNamed(
                                  context,
                                  Routes.bizDetail,
                                  arguments: {'name': b['name']},
                                ),
                              ))
                          .toList(),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // SECTION 2: Quick Actions
                  const SectionHeader(title: 'Thao tác nhanh'),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Row(
                      children: [
                        Expanded(
                          child: _QuickAction(
                            icon: Icons.add_business_rounded,
                            label: 'Đăng ký\nkinh doanh',
                            color: AppTheme.primary,
                            onTap: () => Navigator.pushNamed(
                              context,
                              Routes.businessRegistration,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _QuickAction(
                            icon: Icons.gavel_rounded,
                            label: 'Xem\nxử phạt',
                            color: const Color(0xFFEF5350),
                            onTap: () => Navigator.pushNamed(
                              context,
                              Routes.violationList,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Row(
                      children: [
                        Expanded(
                          child: _QuickAction(
                            icon: Icons.feedback_outlined,
                            label: 'Khiếu\nnại',
                            color: AppTheme.accent,
                            onTap: () => Navigator.pushNamed(
                              context,
                              Routes.businessComplaint,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _QuickAction(
                            icon: Icons.edit_note_rounded,
                            label: 'Cập nhật\nthông tin',
                            color: const Color(0xFF42A5F5),
                            onTap: () {},
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // SECTION 3: Recent Violations
                  SectionHeader(
                    title: 'Vi phạm gần đây',
                    actionText: 'Xem tất cả',
                    onActionTap: () => Navigator.pushNamed(
                      context,
                      Routes.violationList,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      children: _mockViolations
                          .map((v) => AppCard(
                                onTap: () => Navigator.pushNamed(
                                  context,
                                  Routes.violationDetail,
                                  arguments: {'title': v['title']},
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFEF5350)
                                            .withValues(alpha: 0.1),
                                        borderRadius:
                                            BorderRadius.circular(10),
                                      ),
                                      child: const Icon(
                                        Icons.gavel_rounded,
                                        color: Color(0xFFEF5350),
                                        size: 20,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            v['title'] as String,
                                            style: GoogleFonts.inter(
                                              color: AppTheme.textPrimary,
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              Text(
                                                v['date'] as String,
                                                style: GoogleFonts.inter(
                                                  color:
                                                      AppTheme.textSecondary,
                                                  fontSize: 11,
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                v['fine'] as String,
                                                style: GoogleFonts.inter(
                                                  color: const Color(
                                                      0xFFEF5350),
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    StatusBadge(
                                      status: v['status'] as SafetyStatus,
                                      customLabel:
                                          v['statusLabel'] as String,
                                    ),
                                  ],
                                ),
                              ))
                          .toList(),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // SECTION 4: Notifications / Requests
                  const SectionHeader(title: 'Thông báo kinh doanh'),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      children: [
                        _NoticeCard(
                          icon: Icons.event_note_rounded,
                          title: 'Giấy phép kinh doanh sắp hết hạn',
                          subtitle:
                              'Nhà hàng Biển Xanh — hết hạn 30/06/2026',
                          color: AppTheme.accent,
                        ),
                        _NoticeCard(
                          icon: Icons.check_circle_outline_rounded,
                          title: 'Đơn đăng ký đã được duyệt',
                          subtitle:
                              'Quán Phở Bà Năm — duyệt ngày 20/03/2026',
                          color: AppTheme.primary,
                        ),
                        _NoticeCard(
                          icon: Icons.schedule_rounded,
                          title: 'Lịch kiểm tra định kỳ',
                          subtitle:
                              'Tiệm Bánh Mì Hội An — kiểm tra 01/04/2026',
                          color: const Color(0xFF42A5F5),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

// ──── Private widgets ────

class _AddButton extends StatelessWidget {
  final VoidCallback onTap;

  const _AddButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: AppTheme.primary,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.add_rounded, color: Colors.white, size: 18),
            const SizedBox(width: 4),
            Text(
              'Thêm',
              style: GoogleFonts.inter(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BusinessCard extends StatelessWidget {
  final String name;
  final String address;
  final SafetyStatus status;
  final String statusLabel;
  final VoidCallback onTap;

  const _BusinessCard({
    required this.name,
    required this.address,
    required this.status,
    required this.statusLabel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.store_rounded,
                color: AppTheme.primary, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  address,
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          StatusBadge(status: status, customLabel: statusLabel),
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.15)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Icon(Icons.chevron_right_rounded,
                color: AppTheme.textSecondary, size: 20),
          ],
        ),
      ),
    );
  }
}

class _NoticeCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;

  const _NoticeCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
