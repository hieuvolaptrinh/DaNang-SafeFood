import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';
import 'package:mobile_ui/viewmodel/auth/auth_state.dart';
import 'package:mobile_ui/viewmodel/profile/profile_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_state.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  /// Chuyển mã quyền sang tên hiển thị tiếng Việt
  String _roleLabel(AuthState auth) {
    if (auth.isCSKD) return 'Cơ sở kinh doanh';
    if (auth.isNTD) return 'Người tiêu dùng';
    if (auth.isAdmin) return 'Quản trị viên';
    return 'Người dùng';
  }

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthCubit>().state;

    return BlocBuilder<ProfileCubit, ProfileState>(
      builder: (context, state) {
        // Lấy thông tin từ AuthCubit (ưu tiên) rồi fallback về ProfileCubit
        final displayName = authState.fullName ?? state.name;
        final displayEmail = authState.email ?? state.email;
        final displayPhone = authState.phone ?? state.phone;
        final displayRole = _roleLabel(authState);
        final complaintCount = state.myComplaints.length;

        return SafeArea(
          child: SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 30),

                // Profile header
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.cardColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.dividerColor),
                  ),
                  child: Column(
                    children: [
                      // Avatar — tap để chỉnh sửa
                      GestureDetector(
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.editProfile,
                        ),
                        child: Stack(
                          children: [
                            Container(
                              width: 80,
                              height: 80,
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    AppTheme.primary,
                                    AppTheme.primaryLight,
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Text(
                                  displayName.isNotEmpty
                                      ? displayName[0].toUpperCase()
                                      : 'U',
                                  style: GoogleFonts.inter(
                                    color: Colors.white,
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: Container(
                                width: 26,
                                height: 26,
                                decoration: BoxDecoration(
                                  color: AppTheme.primary,
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white,
                                    width: 2,
                                  ),
                                ),
                                child: const Icon(
                                  Icons.edit_rounded,
                                  color: Colors.white,
                                  size: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        displayName.isNotEmpty ? displayName : 'Người dùng',
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        displayEmail ?? '',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                      if (displayPhone.isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(
                          displayPhone,
                          style: GoogleFonts.inter(
                            color: AppTheme.textTertiary,
                            fontSize: 12,
                          ),
                        ),
                      ],
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          displayRole,
                          style: GoogleFonts.inter(
                            color: AppTheme.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Quick stats
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _StatItem(
                            value: '$complaintCount',
                            label: 'Phản ánh',
                          ),
                          Container(
                            width: 1,
                            height: 30,
                            color: AppTheme.dividerColor,
                          ),
                          _StatItem(value: '0', label: 'Đã lưu'),
                          Container(
                            width: 1,
                            height: 30,
                            color: AppTheme.dividerColor,
                          ),
                          _StatItem(value: '0', label: 'Đánh giá'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Menu items
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'TÀI KHOẢN',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1,
                        ),
                      ),
                      const SizedBox(height: 8),

                      _MenuItem(
                        icon: Icons.person_outline_rounded,
                        title: 'Chỉnh sửa thông tin',
                        subtitle: displayName,
                        onTap: () async {
                          final result = await Navigator.pushNamed(
                            context,
                            Routes.editProfile,
                          );
                          if (result == true && context.mounted) {
                            context.read<ProfileCubit>().loadProfile();
                          }
                        },
                      ),
                      _MenuItem(
                        icon: Icons.feedback_outlined,
                        title: 'Phản ánh ATVSTP của tôi',
                        subtitle: '$complaintCount phản ánh',
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.myComplaints,
                        ),
                      ),
                      _MenuItem(
                        icon: Icons.bookmark_border_rounded,
                        title: 'Thông báo đã lưu',
                        onTap: () {},
                      ),
                      const SizedBox(height: 16),

                      Text(
                        'CÀI ĐẶT',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1,
                        ),
                      ),
                      const SizedBox(height: 8),
                      _MenuItem(
                        icon: Icons.lock_outline_rounded,
                        title: 'Đổi mật khẩu',
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.changePassword,
                        ),
                      ),
                      _MenuItem(
                        icon: Icons.language_rounded,
                        title: 'Ngôn ngữ',
                        subtitle: 'Tiếng Việt',
                        onTap: () {},
                      ),
                      _MenuItem(
                        icon: Icons.settings_outlined,
                        title: 'Cài đặt tài khoản',
                        onTap: () =>
                            Navigator.pushNamed(context, Routes.account),
                      ),
                      const SizedBox(height: 16),

                      Text(
                        'KHÁC',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1,
                        ),
                      ),
                      const SizedBox(height: 8),
                      _MenuItem(
                        icon: Icons.help_outline_rounded,
                        title: 'Hỗ trợ',
                        onTap: () {},
                      ),
                      _MenuItem(
                        icon: Icons.info_outline_rounded,
                        title: 'Về ứng dụng',
                        subtitle: 'Phiên bản 1.0.0',
                        onTap: () {},
                      ),
                      const SizedBox(height: 12),

                      // Logout
                      GestureDetector(
                        onTap: () async {
                          await context.read<AuthCubit>().logout();
                        },
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: const Color(
                              0xFFEF5350,
                            ).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: const Color(
                                0xFFEF5350,
                              ).withValues(alpha: 0.3),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.logout_rounded,
                                color: Color(0xFFEF5350),
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Đăng xuất',
                                style: GoogleFonts.inter(
                                  color: const Color(0xFFEF5350),
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 40),
                    ],
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

class _StatItem extends StatelessWidget {
  final String value;
  final String label;

  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 11),
        ),
      ],
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 4),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.dividerColor, width: 0.5),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppTheme.textSecondary, size: 22),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            if (subtitle != null) ...[
              Text(
                subtitle!,
                style: GoogleFonts.inter(
                  color: AppTheme.textSecondary,
                  fontSize: 12,
                ),
              ),
              const SizedBox(width: 4),
            ],
            const Icon(
              Icons.chevron_right_rounded,
              color: AppTheme.textSecondary,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
