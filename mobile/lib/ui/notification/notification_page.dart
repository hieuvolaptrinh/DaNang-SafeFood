import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/empty_state_view.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/notification/notification_cubit.dart';
import 'package:mobile_ui/viewmodel/notification/notification_state.dart';

class NotificationPage extends StatelessWidget {
  const NotificationPage({super.key});

  static const _categories = ['Tất cả', 'Khẩn Cấp', 'Tin Tức', 'Pháp Quy'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.scaffoldBg,
      appBar: AppBar(
        title: Text(
          'Thông báo',
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_rounded,
            color: AppTheme.textPrimary,
            size: 20,
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Tab Cộng đồng / Cá nhân ──
            const SizedBox(height: 12),
            _TabSelector(),
            const SizedBox(height: 12),

            // ── Category filter chips ──
            SizedBox(
              height: 40,
              child: BlocBuilder<NotificationCubit, NotificationState>(
                buildWhen: (prev, curr) =>
                    prev.selectedCategory != curr.selectedCategory ||
                    prev.activeTab != curr.activeTab,
                builder: (context, state) {
                  return ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: _categories.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final c = _categories[index];
                      final selected = state.selectedCategory == c;
                      return GestureDetector(
                        onTap: () => context
                            .read<NotificationCubit>()
                            .filterByCategory(c),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: selected
                                ? _categoryColor(c)
                                : AppTheme.cardColor,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: selected
                                    ? _categoryColor(c)
                                        .withValues(alpha: 0.3)
                                    : Colors.black.withValues(alpha: 0.05),
                                blurRadius: selected ? 8 : 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Text(
                            c,
                            style: GoogleFonts.inter(
                              color: selected
                                  ? Colors.white
                                  : AppTheme.textSecondary,
                              fontSize: 13,
                              fontWeight: selected
                                  ? FontWeight.w600
                                  : FontWeight.w400,
                            ),
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
            const SizedBox(height: 12),

            // ── Content ──
            Expanded(
              child: BlocBuilder<NotificationCubit, NotificationState>(
                builder: (context, state) {
                  final status = state.activeStatus;

                  if (status == NotificationStatus.loading) {
                    return const Center(
                      child: CircularProgressIndicator(
                          color: AppTheme.primary),
                    );
                  }

                  if (status == NotificationStatus.error) {
                    return ErrorStateView(
                      message: state.errorMessage ??
                          'Không thể tải thông báo',
                      onRetry: () =>
                          context.read<NotificationCubit>().refresh(),
                    );
                  }

                  final filtered = state.filteredNotifications;

                  if (status == NotificationStatus.empty ||
                      filtered.isEmpty) {
                    final isPersonal =
                        state.activeTab == NotificationTab.personal;
                    return EmptyStateView(
                      icon: isPersonal
                          ? Icons.person_off_outlined
                          : Icons.notifications_off_outlined,
                      title: isPersonal
                          ? 'Chưa có thông báo cá nhân'
                          : 'Chưa có thông báo cộng đồng',
                      subtitle: isPersonal
                          ? 'Bạn sẽ nhận thông báo cá nhân khi có cập nhật liên quan đến hồ sơ của bạn.'
                          : 'Hiện chưa có thông báo cộng đồng nào.',
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: () =>
                        context.read<NotificationCubit>().refresh(),
                    color: AppTheme.primary,
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final item = filtered[index];
                        return _NotificationCard(
                          notification: item,
                          onTap: () => Navigator.pushNamed(
                            context,
                            Routes.notificationDetail,
                            arguments: item,
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _categoryColor(String category) {
    switch (category) {
      case 'Khẩn Cấp':
        return const Color(0xFFEF5350);
      case 'Tin Tức':
        return AppTheme.primary;
      case 'Pháp Quy':
        return const Color(0xFF42A5F5);
      default:
        return AppTheme.primary;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// Tab Selector: Cộng đồng / Cá nhân
// ═══════════════════════════════════════════════════════════
class _TabSelector extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<NotificationCubit, NotificationState>(
      buildWhen: (prev, curr) => prev.activeTab != curr.activeTab,
      builder: (context, state) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: AppTheme.surfaceBg,
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: _TabButton(
                    label: 'Cộng đồng',
                    icon: Icons.public_rounded,
                    isActive:
                        state.activeTab == NotificationTab.community,
                    onTap: () => context
                        .read<NotificationCubit>()
                        .switchTab(NotificationTab.community),
                  ),
                ),
                Expanded(
                  child: _TabButton(
                    label: 'Cá nhân',
                    icon: Icons.person_rounded,
                    isActive:
                        state.activeTab == NotificationTab.personal,
                    onTap: () => context
                        .read<NotificationCubit>()
                        .switchTab(NotificationTab.personal),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _TabButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isActive;
  final VoidCallback onTap;

  const _TabButton({
    required this.label,
    required this.icon,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: AppTheme.primary.withValues(alpha: 0.12),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : [],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 18,
              color: isActive ? AppTheme.primary : AppTheme.textSecondary,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.inter(
                color:
                    isActive ? AppTheme.primary : AppTheme.textSecondary,
                fontSize: 14,
                fontWeight:
                    isActive ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
// Notification Card
// ═══════════════════════════════════════════════════════════
class _NotificationCard extends StatelessWidget {
  final NotificationModel notification;
  final VoidCallback onTap;

  const _NotificationCard({
    required this.notification,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = _typeColor(notification.loaiThongBao);
    final icon = _typeIcon(notification.loaiThongBao);

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: AppCard(
        onTap: onTap,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.10),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: color.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          notification.loaiThongBao ?? 'Thông báo',
                          style: GoogleFonts.inter(
                            color: color,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      if (notification.isCongDong) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.primary
                                .withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.public,
                                size: 10,
                                color: AppTheme.primary,
                              ),
                              const SizedBox(width: 2),
                              Text(
                                'Cộng đồng',
                                style: GoogleFonts.inter(
                                  color: AppTheme.primary,
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      const Spacer(),
                      Text(
                        notification.shortDate,
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    notification.tieuDe,
                    style: GoogleFonts.inter(
                      color: AppTheme.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notification.noiDung,
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                      height: 1.4,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _typeColor(String? type) {
    switch (type) {
      case 'Khẩn Cấp':
        return const Color(0xFFEF5350);
      case 'Tin Tức':
        return AppTheme.primary;
      case 'Pháp Quy':
        return const Color(0xFF42A5F5);
      default:
        return AppTheme.textSecondary;
    }
  }

  IconData _typeIcon(String? type) {
    switch (type) {
      case 'Khẩn Cấp':
        return Icons.warning_amber_rounded;
      case 'Tin Tức':
        return Icons.newspaper_rounded;
      case 'Pháp Quy':
        return Icons.gavel_rounded;
      default:
        return Icons.notifications_outlined;
    }
  }
}
