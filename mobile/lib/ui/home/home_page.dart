import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/section_header.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';
import 'package:mobile_ui/viewmodel/home/home_cubit.dart';
import 'package:mobile_ui/viewmodel/home/home_state.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeCubit, HomeState>(
      builder: (context, state) {
        if (state.status == HomeStatus.error) {
          return ErrorStateView(
            onRetry: () => context.read<HomeCubit>().loadData(),
          );
        }

        return RefreshIndicator(
          onRefresh: () => context.read<HomeCubit>().refresh(),
          color: AppTheme.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: SafeArea(
              child: Builder(
                builder: (context) {
                  final authState = context.watch<AuthCubit>().state;
                  final userName = authState.fullName ?? 'Bạn';

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ── Header with gradient ──
                      _GradientHeader(userName: userName),
                      const SizedBox(height: 20),

                      // ── Summary stats ──
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Row(
                          children: [
                            Expanded(
                              child: _StatCard(
                                icon: Icons.shield_outlined,
                                label: 'Cơ sở an toàn',
                                value: '${state.inspectedPlaces}',
                                gradient: const [
                                  Color(0xFF2E7D32),
                                  Color(0xFF66BB6A),
                                ],
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _StatCard(
                                icon: Icons.warning_amber_rounded,
                                label: 'Vi phạm',
                                value: '${state.recentViolations}',
                                gradient: const [
                                  Color(0xFFEF5350),
                                  Color(0xFFFF8A80),
                                ],
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _StatCard(
                                icon: Icons.campaign_outlined,
                                label: 'Phản ánh',
                                value: '${state.newComplaints}',
                                gradient: const [
                                  Color(0xFFF57C00),
                                  Color(0xFFFFB74D),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // ── Quick Actions ──
                      const SectionHeader(title: 'Chức năng chính'),
                      const SizedBox(height: 12),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Row(
                          children: [
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.search_rounded,
                                label: 'Tra cứu\ncơ sở',
                                color: const Color(0xFF2E7D32),
                                onTap: () {},
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.add_comment_rounded,
                                label: 'Gửi\nphản ánh',
                                color: const Color(0xFFF57C00),
                                onTap: () => Navigator.pushNamed(
                                  context,
                                  Routes.complaintForm,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.qr_code_scanner_rounded,
                                label: 'Quét\nmã QR',
                                color: const Color(0xFF7B1FA2),
                                onTap: () {},
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.map_outlined,
                                label: 'Bản đồ\nATTP',
                                color: const Color(0xFF1565C0),
                                onTap: () {},
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // ── Alert Banner ──
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: _AlertBanner(item: state.banner),
                      ),
                      const SizedBox(height: 24),

                      // ── News section ──
                      SectionHeader(
                        title: 'Tin tức ATTP',
                        actionText: 'Xem tất cả',
                        onActionTap: () =>
                            Navigator.pushNamed(context, Routes.notifications),
                      ),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: state.news.isEmpty
                            ? const _EmptySection(text: 'Chưa có tin tức mới')
                            : Column(
                                children: state.news
                                    .map((item) => _NewsCard(item: item))
                                    .toList(),
                              ),
                      ),
                      const SizedBox(height: 24),

                      // ── Food safety tips ──
                      SectionHeader(
                        title: 'Cảnh báo thực phẩm',
                        actionText: 'Xem tất cả',
                        onActionTap: () {},
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 150,
                        child: state.alerts.isEmpty
                            ? const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 20),
                                child: _EmptySection(
                                  text: 'Chưa có cảnh báo mới',
                                ),
                              )
                            : ListView(
                                scrollDirection: Axis.horizontal,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                ),
                                children: state.alerts
                                    .map((item) => _AlertFoodCard(item: item))
                                    .toList(),
                              ),
                      ),
                      const SizedBox(height: 100),
                    ],
                  );
                },
              ),
            ),
          ),
        );
      },
    );
  }
}

// ═══════════════════════════════════════════════════════════
// Gradient Header
// ═══════════════════════════════════════════════════════════
class _GradientHeader extends StatelessWidget {
  final String userName;

  const _GradientHeader({required this.userName});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppTheme.primary, AppTheme.primary.withValues(alpha: 0.85)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.3),
                width: 1.5,
              ),
            ),
            child: Center(
              child: Text(
                userName.isNotEmpty ? userName[0].toUpperCase() : 'U',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Xin chào,',
                  style: GoogleFonts.inter(
                    color: Colors.white.withValues(alpha: 0.8),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  userName,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          // Notification bell
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, Routes.notifications),
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.notifications_outlined,
                color: Colors.white,
                size: 22,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
// Stat Card (Gradient mini card)
// ═══════════════════════════════════════════════════════════
class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final List<Color> gradient;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.gradient,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: gradient[0].withValues(alpha: 0.12),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  gradient[0].withValues(alpha: 0.12),
                  gradient[1].withValues(alpha: 0.06),
                ],
              ),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: gradient[0], size: 20),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: GoogleFonts.inter(
              color: gradient[0],
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 10,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
// Action Card (Quick action grid item)
// ═══════════════════════════════════════════════════════════
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
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.10),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.10),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 11,
                fontWeight: FontWeight.w500,
                height: 1.3,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
// Alert Banner
// ═══════════════════════════════════════════════════════════
class _AlertBanner extends StatelessWidget {
  final NotificationModel? item;

  const _AlertBanner({this.item});

  String _title() {
    return item?.loaiThongBao ?? 'Cảnh báo nóng';
  }

  String _content() {
    return item?.tieuDe ??
        'Thu hồi lô hàng thực phẩm chức năng không rõ nguồn gốc tại Đà Nẵng';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFFEF5350).withValues(alpha: 0.08),
            const Color(0xFFF57C00).withValues(alpha: 0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFEF5350).withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFEF5350).withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.campaign_rounded,
              color: Color(0xFFEF5350),
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _title(),
                  style: GoogleFonts.inter(
                    color: const Color(0xFFEF5350),
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _content(),
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 13,
                    height: 1.4,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const Icon(
            Icons.chevron_right_rounded,
            color: AppTheme.textSecondary,
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
// News Card
// ═══════════════════════════════════════════════════════════
class _NewsCard extends StatelessWidget {
  final NotificationModel item;

  const _NewsCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: () {},
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: _categoryColor(item.loaiThongBao).withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              _categoryIcon(item.loaiThongBao ?? ''),
              color: _categoryColor(item.loaiThongBao),
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.tieuDe,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: _categoryColor(
                          item.loaiThongBao,
                        ).withValues(alpha: 0.10),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        item.loaiThongBao ?? 'Thông báo',
                        style: GoogleFonts.inter(
                          color: _categoryColor(item.loaiThongBao),
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      item.shortDate,
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  IconData _categoryIcon(String c) {
    switch (c) {
      case 'Khẩn Cấp':
        return Icons.warning_amber_rounded;
      case 'Tin Tức':
        return Icons.newspaper_rounded;
      case 'Pháp Quy':
        return Icons.gavel_rounded;
      default:
        return Icons.article_outlined;
    }
  }

  Color _categoryColor(String? category) {
    switch ((category ?? '').toLowerCase()) {
      case 'khẩn cấp':
      case 'khẩn':
        return const Color(0xFFEF5350);
      case 'pháp quy':
        return const Color(0xFF1565C0);
      case 'tin tức':
        return const Color(0xFF2E7D32);
      default:
        return AppTheme.primary;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// Alert Food Card
// ═══════════════════════════════════════════════════════════
class _AlertFoodCard extends StatelessWidget {
  final NotificationModel item;

  const _AlertFoodCard({required this.item});

  @override
  Widget build(BuildContext context) {
    final severityText = item.loaiThongBao ?? 'Cảnh báo';
    final isHighSeverity =
        severityText.toLowerCase().contains('khẩn') ||
        severityText.toLowerCase().contains('nguy');
    final color = isHighSeverity ? const Color(0xFFEF5350) : AppTheme.accent;

    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.10),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(Icons.warning_amber_rounded, color: color, size: 20),
          ),
          const SizedBox(height: 10),
          Text(
            item.tieuDe,
            style: GoogleFonts.inter(
              color: AppTheme.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            item.shortDate,
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 11,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              severityText,
              style: GoogleFonts.inter(
                color: color,
                fontSize: 10,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptySection extends StatelessWidget {
  final String text;

  const _EmptySection({required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 8),
      child: Text(
        text,
        style: GoogleFonts.inter(
          color: AppTheme.textSecondary,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
