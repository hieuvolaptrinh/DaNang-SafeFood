import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/account/account_cubit.dart';
import 'package:mobile_ui/viewmodel/account/account_state.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';

class AccountPage extends StatelessWidget {
  const AccountPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Cài đặt tài khoản',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: BlocBuilder<AccountCubit, AccountState>(
        builder: (context, state) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _SectionTitle(title: 'Thông tin tài khoản'),
                const SizedBox(height: 8),
                Builder(
                  builder: (context) {
                    final auth = context.watch<AuthCubit>().state;
                    return Column(children: [
                      _InfoTile(
                        icon: Icons.person_outline_rounded,
                        title: 'Họ tên',
                        value: auth.fullName ?? 'Chưa cập nhật',
                      ),
                      _InfoTile(
                        icon: Icons.email_outlined,
                        title: 'Email',
                        value: auth.email ?? 'Chưa cập nhật',
                      ),
                      _InfoTile(
                        icon: Icons.phone_outlined,
                        title: 'Số điện thoại',
                        value: auth.phone ?? 'Chưa cập nhật',
                      ),
                    ]);
                  },
                ),

                const SizedBox(height: 24),
                _SectionTitle(title: 'Bảo mật'),
                const SizedBox(height: 8),
                _ActionTile(
                  icon: Icons.lock_outline_rounded,
                  title: 'Đổi mật khẩu',
                  onTap: () => Navigator.pushNamed(context, Routes.changePassword),
                ),
                _ActionTile(
                  icon: Icons.security_outlined,
                  title: 'Xác thực 2 bước',
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.accent.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      'Tắt',
                      style: GoogleFonts.inter(
                        color: AppTheme.accent,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  onTap: () {},
                ),

                const SizedBox(height: 24),
                _SectionTitle(title: 'Thông báo'),
                const SizedBox(height: 8),
                _ToggleTile(
                  icon: Icons.notifications_outlined,
                  title: 'Thông báo đẩy',
                  value: state.pushNotifications,
                  onChanged: (_) => context.read<AccountCubit>().togglePushNotifications(),
                ),
                _ToggleTile(
                  icon: Icons.email_outlined,
                  title: 'Thông báo qua email',
                  value: state.emailNotifications,
                  onChanged: (_) => context.read<AccountCubit>().toggleEmailNotifications(),
                ),

                const SizedBox(height: 24),
                _SectionTitle(title: 'Khác'),
                const SizedBox(height: 8),
                _ActionTile(
                  icon: Icons.privacy_tip_outlined,
                  title: 'Chính sách bảo mật',
                  onTap: () {},
                ),
                _ActionTile(
                  icon: Icons.description_outlined,
                  title: 'Điều khoản sử dụng',
                  onTap: () {},
                ),
                _ActionTile(
                  icon: Icons.help_outline_rounded,
                  title: 'Trung tâm hỗ trợ',
                  onTap: () {},
                ),
                _ActionTile(
                  icon: Icons.info_outline_rounded,
                  title: 'Phiên bản ứng dụng',
                  trailing: Text(
                    '1.0.0',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 13,
                    ),
                  ),
                  onTap: () {},
                ),

                const SizedBox(height: 24),

                // Logout
                GestureDetector(
                  onTap: () {
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      Routes.login,
                      (route) => false,
                    );
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF5350).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: const Color(0xFFEF5350).withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.logout_rounded,
                            color: Color(0xFFEF5350), size: 20),
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

                const SizedBox(height: 24),

                // Delete account
                Center(
                  child: TextButton(
                    onPressed: () {},
                    child: Text(
                      'Xóa tài khoản',
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title.toUpperCase(),
      style: GoogleFonts.inter(
        color: AppTheme.textSecondary,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: 1,
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;

  const _InfoTile({
    required this.icon,
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.dividerColor, width: 0.5),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.textSecondary, size: 20),
          const SizedBox(width: 14),
          Text(
            title,
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 13,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: GoogleFonts.inter(
              color: AppTheme.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final Widget? trailing;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.title,
    this.trailing,
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
            Icon(icon, color: AppTheme.textSecondary, size: 20),
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
            if (trailing != null) ...[
              trailing!,
              const SizedBox(width: 4),
            ],
            const Icon(Icons.chevron_right_rounded,
                color: AppTheme.textSecondary, size: 20),
          ],
        ),
      ),
    );
  }
}

class _ToggleTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _ToggleTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.dividerColor, width: 0.5),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.textSecondary, size: 20),
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
          Switch(
            value: value,
            onChanged: onChanged,
            thumbColor: WidgetStateProperty.resolveWith((states) {
              if (states.contains(WidgetState.selected)) return AppTheme.primary;
              return Colors.grey[400];
            }),
            trackColor: WidgetStateProperty.resolveWith((states) {
              if (states.contains(WidgetState.selected)) return AppTheme.primary.withValues(alpha: 0.4);
              return Colors.grey[300];
            }),
          ),
        ],
      ),
    );
  }
}
