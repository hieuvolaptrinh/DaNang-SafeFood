import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

class BusinessManagementPage extends StatelessWidget {
  const BusinessManagementPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BusinessManagementCubit, BusinessMgmtState>(
      builder: (context, state) {
        if (state.status == BusinessMgmtStatus.error &&
            state.businesses.isEmpty) {
          return ErrorStateView(
            message: state.errorMessage ?? 'Không thể tải dữ liệu',
            onRetry: () => context.read<BusinessManagementCubit>().loadData(),
          );
        }

        if (state.status == BusinessMgmtStatus.loading &&
            state.businesses.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(color: AppTheme.primary),
          );
        }

        return RefreshIndicator(
          onRefresh: () => context.read<BusinessManagementCubit>().refresh(),
          color: AppTheme.primary,
          child: CustomScrollView(
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Quản lý kinh doanh',
                          style: GoogleFonts.inter(
                            color: AppTheme.textPrimary,
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${state.businesses.length} cơ sở đang quản lý',
                          style: GoogleFonts.inter(
                            color: AppTheme.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Quick Actions
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                  child: _QuickActions(),
                ),
              ),

              // Cơ sở của tôi (tối đa 3)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _SectionTitle(title: 'Cơ sở của tôi'),
                      if (state.businesses.length > 3)
                        TextButton(
                          onPressed: () => Navigator.pushNamed(
                            context,
                            Routes.allBusinesses,
                          ),
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

              // Business cards (max 3)
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final b = state.businesses[index];
                      return _BusinessCard(business: b);
                    },
                    childCount: state.businesses.length > 3
                        ? 3
                        : state.businesses.length,
                  ),
                ),
              ),

              // Hồ sơ giấy tờ section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
                  child: _SectionTitle(title: 'Hồ sơ giấy tờ gần đây'),
                ),
              ),

              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                sliver: state.hoSoList.isEmpty
                    ? SliverToBoxAdapter(
                        child: Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: AppTheme.cardColor,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: AppShadow.level1,
                          ),
                          child: Column(
                            children: [
                              Icon(
                                Icons.description_outlined,
                                size: 40,
                                color: AppTheme.textTertiary.withValues(
                                  alpha: 0.5,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Chưa có hồ sơ nào',
                                style: GoogleFonts.inter(
                                  color: AppTheme.textSecondary,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    : SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final hs = state.hoSoList[index];
                            return _HoSoMiniCard(hoSo: hs);
                          },
                          childCount: state.hoSoList.length > 5
                              ? 5
                              : state.hoSoList.length,
                        ),
                      ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _QuickActions extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 2.2,
      children: [
        _ActionCard(
          icon: Icons.add_business_rounded,
          label: 'Đăng ký\nkinh doanh',
          color: AppTheme.primary,
          onTap: () =>
              Navigator.pushNamed(context, Routes.businessRegistration),
        ),
        _ActionCard(
          icon: Icons.gavel_rounded,
          label: 'Vi phạm\n& Xử phạt',
          color: AppTheme.error,
          onTap: () => Navigator.pushNamed(context, Routes.violationList),
        ),
        _ActionCard(
          icon: Icons.shield_outlined,
          label: 'Tình trạng\npháp lý',
          color: AppTheme.info,
          onTap: () => Navigator.pushNamed(context, Routes.businessStatus),
        ),
        _ActionCard(
          icon: Icons.feedback_outlined,
          label: 'Khiếu\nnại',
          color: AppTheme.accent,
          onTap: () => Navigator.pushNamed(context, Routes.businessComplaint),
        ),
      ],
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
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
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.2)),
          boxShadow: AppShadow.level1,
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
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
  final MyBusinessModel business;
  const _BusinessCard({required this.business});

  @override
  Widget build(BuildContext context) {
    final isActive = business.trangThaiKinhDoanh == 'DANG_HOAT_DONG';
    final isBanned = business.trangThaiKinhDoanh == 'BI_CAM';
    final isWarning = business.trangThaiKinhDoanh == 'CANH_CAO_VI_PHAM';

    final SafetyStatus badge;
    if (isActive) {
      badge = SafetyStatus.safe;
    } else if (isBanned) {
      badge = SafetyStatus.violated;
    } else if (isWarning) {
      badge = SafetyStatus.warning;
    } else {
      badge = SafetyStatus.processing;
    }

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
          borderRadius: BorderRadius.circular(16),
          onTap: () => Navigator.pushNamed(
            context,
            Routes.bizDetail,
            arguments: {'name': business.maCoSo},
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Avatar / Image
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    color: AppTheme.primary.withValues(alpha: 0.1),
                    image: business.anhBia != null
                        ? DecorationImage(
                            image: NetworkImage(business.anhBia!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: business.anhBia == null
                      ? const Icon(
                          Icons.store_rounded,
                          color: AppTheme.primary,
                          size: 24,
                        )
                      : null,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        business.tenCoSo,
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on_outlined,
                            size: 13,
                            color: AppTheme.textSecondary,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              business.tenPhuongXa ?? 'Chưa cập nhật',
                              style: GoogleFonts.inter(
                                color: AppTheme.textSecondary,
                                fontSize: 12,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      StatusBadge(
                        status: badge,
                        customLabel:
                            business.trangThaiKinhDoanhLabel ??
                            business.trangThai,
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.chevron_right_rounded,
                  color: AppTheme.textTertiary,
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _HoSoMiniCard extends StatelessWidget {
  final HoSoDangKiModel hoSo;
  const _HoSoMiniCard({required this.hoSo});

  @override
  Widget build(BuildContext context) {
    final approved =
        (hoSo.trangThai ?? '').contains('duyệt') ||
        (hoSo.trangThai ?? '').contains('duyet');
    final expired =
        (hoSo.trangThai ?? '').toLowerCase().contains('hết hạn') ||
        (hoSo.trangThai ?? '').toLowerCase().contains('het han');

    final Color dotColor;
    if (expired) {
      dotColor = AppTheme.error;
    } else if (approved) {
      dotColor = AppTheme.success;
    } else {
      dotColor = AppTheme.warning;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.dividerColor, width: 0.5),
      ),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  hoSo.tenLoaiGiayTo ?? 'Hồ sơ ${hoSo.maHoSo}',
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  hoSo.tenCoSo ?? '',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Text(
            hoSo.trangThai ?? '',
            style: GoogleFonts.inter(
              color: dotColor,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
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
          height: 18,
          decoration: BoxDecoration(
            color: AppTheme.primary,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 10),
        Text(
          title,
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
