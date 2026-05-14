import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
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
      'revenue': '45.2M',
      'inspections': 3,
    },
    {
      'name': 'Quán Phở Bà Năm',
      'address': '45 Trần Phú, Hải Châu',
      'status': SafetyStatus.warning,
      'statusLabel': 'Chờ duyệt',
      'revenue': '28.5M',
      'inspections': 1,
    },
  ];

  static final _mockViolations = [
    {
      'title': 'Vi phạm vệ sinh khu chế biến',
      'business': 'Nhà hàng Biển Xanh',
      'date': '18/03/2026',
      'fine': '5.000.000 VNĐ',
      'status': SafetyStatus.violated,
      'statusLabel': 'Chưa nộp',
    },
    {
      'title': 'Không có giấy khám sức khỏe',
      'business': 'Quán Phở Bà Năm',
      'date': '10/03/2026',
      'fine': '3.000.000 VNĐ',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đã nộp',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BusinessManagementCubit, BusinessMgmtState>(
      builder: (context, state) {
        if (state.status == BusinessMgmtStatus.error) {
          return ErrorStateView(
            onRetry: () => context.read<BusinessManagementCubit>().loadData(),
          );
        }

        if (state.status == BusinessMgmtStatus.loading) {
          return const Center(
            child: CircularProgressIndicator(color: AppTheme.primary),
          );
        }

        return RefreshIndicator(
          onRefresh: () => context.read<BusinessManagementCubit>().refresh(),
          color: AppTheme.primary,
          child: CustomScrollView(
            slivers: [
              // Modern App Bar
              SliverAppBar(
                expandedHeight: 140,
                floating: false,
                pinned: true,
                backgroundColor: Colors.white,
                surfaceTintColor: Colors.transparent,
                elevation: 0,
                flexibleSpace: FlexibleSpaceBar(
                  titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
                  title: Text(
                    'Quản lý kinh doanh',
                    style: GoogleFonts.inter(
                      color: AppTheme.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.5,
                    ),
                  ),
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          AppTheme.primary.withOpacity(0.03),
                          AppTheme.primaryLight.withOpacity(0.05),
                        ],
                      ),
                    ),
                  ),
                ),
                actions: [
                  Container(
                    margin: const EdgeInsets.only(right: 12, top: 8),
                    child: IconButton(
                      onPressed: () => Navigator.pushNamed(
                        context,
                        Routes.businessRegistration,
                      ),
                      icon: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppTheme.primary,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: AppShadow.level1,
                        ),
                        child: const Icon(
                          Icons.add_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              // Stats Overview
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                  child: Row(
                    children: [
                      Expanded(
                        child: _StatCard(
                          icon: Icons.store_rounded,
                          value: '${_mockBusinesses.length}',
                          label: 'Cơ sở',
                          color: AppTheme.primary,
                          gradient: AppTheme.primaryGradient,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          icon: Icons.gavel_rounded,
                          value: '${_mockViolations.length}',
                          label: 'Vi phạm',
                          color: AppTheme.error,
                          gradient: const LinearGradient(
                            colors: [Color(0xFFDC2626), Color(0xFFEF4444)],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Quick Actions Grid
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _SectionTitle(title: 'Thao tác nhanh'),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _QuickActionCard(
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
                            child: _QuickActionCard(
                              icon: Icons.shield_outlined,
                              label: 'Tình trạng\npháp lý',
                              color: AppTheme.info,
                              onTap: () => Navigator.pushNamed(
                                context,
                                Routes.businessStatus,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _QuickActionCard(
                              icon: Icons.gavel_rounded,
                              label: 'Xem\nxử phạt',
                              color: AppTheme.error,
                              onTap: () => Navigator.pushNamed(
                                context,
                                Routes.violationList,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _QuickActionCard(
                              icon: Icons.feedback_outlined,
                              label: 'Khiếu\nnại',
                              color: AppTheme.accent,
                              onTap: () => Navigator.pushNamed(
                                context,
                                Routes.businessComplaint,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // My Businesses Section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _SectionTitle(title: 'Cơ sở của tôi'),
                      TextButton(
                        onPressed: () {},
                        child: Text(
                          'Xem tất cả',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final b = _mockBusinesses[index];
                    return _BusinessCard(
                      name: b['name'] as String,
                      address: b['address'] as String,
                      status: b['status'] as SafetyStatus,
                      statusLabel: b['statusLabel'] as String,
                      revenue: b['revenue'] as String,
                      inspections: b['inspections'] as int,
                      onTap: () => Navigator.pushNamed(
                        context,
                        Routes.bizDetail,
                        arguments: {'name': b['name']},
                      ),
                    );
                  }, childCount: _mockBusinesses.length),
                ),
              ),

              // Recent Violations Section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _SectionTitle(title: 'Vi phạm gần đây'),
                      TextButton(
                        onPressed: () =>
                            Navigator.pushNamed(context, Routes.violationList),
                        child: Text(
                          'Xem tất cả',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final v = _mockViolations[index];
                    return _ViolationCard(
                      title: v['title'] as String,
                      business: v['business'] as String,
                      date: v['date'] as String,
                      fine: v['fine'] as String,
                      status: v['status'] as SafetyStatus,
                      statusLabel: v['statusLabel'] as String,
                      onTap: () => Navigator.pushNamed(
                        context,
                        Routes.violationDetail,
                        arguments: {'title': v['title']},
                      ),
                    );
                  }, childCount: _mockViolations.length),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// ──── Enhanced Components ────

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;
  final Gradient gradient;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
    required this.gradient,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: AppShadow.level2,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.white.withOpacity(0.9), size: 28),
          const SizedBox(height: 16),
          Text(
            value,
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w700,
              height: 1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.inter(
              color: Colors.white.withOpacity(0.85),
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
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
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.2), width: 1.5),
          boxShadow: AppShadow.level1,
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
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
                  height: 1.3,
                ),
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
  final String revenue;
  final int inspections;
  final VoidCallback onTap;

  const _BusinessCard({
    required this.name,
    required this.address,
    required this.status,
    required this.statusLabel,
    required this.revenue,
    required this.inspections,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadow.level1,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.store_rounded,
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
                            name,
                            style: GoogleFonts.inter(
                              color: AppTheme.textPrimary,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              height: 1.3,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            address,
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 12,
                              height: 1.3,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    StatusBadge(status: status, customLabel: statusLabel),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceBg,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: _InfoItem(
                          icon: Icons.attach_money_rounded,
                          label: 'Doanh thu',
                          value: revenue,
                        ),
                      ),
                      Container(
                        width: 1,
                        height: 32,
                        color: AppTheme.dividerColor,
                      ),
                      Expanded(
                        child: _InfoItem(
                          icon: Icons.fact_check_outlined,
                          label: 'Kiểm tra',
                          value: '$inspections lần',
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ViolationCard extends StatelessWidget {
  final String title;
  final String business;
  final String date;
  final String fine;
  final SafetyStatus status;
  final String statusLabel;
  final VoidCallback onTap;

  const _ViolationCard({
    required this.title,
    required this.business,
    required this.date,
    required this.fine,
    required this.status,
    required this.statusLabel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.error.withOpacity(0.2), width: 1),
        boxShadow: AppShadow.level1,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.error.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.gavel_rounded,
                        color: AppTheme.error,
                        size: 20,
                      ),
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
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              height: 1.3,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            business,
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    StatusBadge(status: status, customLabel: statusLabel),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.calendar_today_outlined,
                      size: 14,
                      color: AppTheme.textSecondary,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      date,
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                    const Spacer(),
                    Icon(
                      Icons.payments_outlined,
                      size: 14,
                      color: AppTheme.error,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      fine,
                      style: GoogleFonts.inter(
                        color: AppTheme.error,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, size: 16, color: AppTheme.textSecondary),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 10,
              ),
            ),
            Text(
              value,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 20,
          decoration: BoxDecoration(
            color: AppTheme.primary,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
