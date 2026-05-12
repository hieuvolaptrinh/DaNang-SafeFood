import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';
import 'package:mobile_ui/viewmodel/register/register_cubit.dart';
import 'package:mobile_ui/viewmodel/register/register_state.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _businessCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _businessCtrl.dispose();
    _otpCtrl.dispose();
    _passCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<RegisterCubit, RegisterState>(
      listener: (context, state) {
        if (state.errorMessage != null && state.errorMessage!.isNotEmpty) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.errorMessage!)));
        }
        if (state.status == RegisterStatus.otpSent) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.successMessage ?? 'Đã gửi OTP')),
          );
        }
      },
      child: Scaffold(
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.white, AppTheme.primary.withValues(alpha: 0.06)],
            ),
          ),
          child: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: BlocBuilder<RegisterCubit, RegisterState>(
                builder: (context, state) {
                  final cubit = context.read<RegisterCubit>();
                  final isInfoStep = state.step == RegisterStep.enterInfo;
                  final isBusiness = state.role == 'CSKD';
                  return Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 440),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back_ios_rounded),
                            onPressed: () => Navigator.pop(context),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Tạo tài khoản',
                            style: GoogleFonts.inter(
                              color: AppTheme.textPrimary,
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Đăng ký để sử dụng hệ thống ATTP',
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 20),
                          AppCard(
                            borderRadius: 20,
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                AppTextField(
                                  label: 'Họ và tên',
                                  hint: 'Nhập họ tên đầy đủ',
                                  controller: _nameCtrl,
                                  errorText: state.fullNameError,
                                  enabled: isInfoStep,
                                  prefixIcon: const Icon(
                                    Icons.person_outline_rounded,
                                    color: AppTheme.textSecondary,
                                    size: 20,
                                  ),
                                  onChanged: cubit.fullNameChanged,
                                ),
                                const SizedBox(height: 16),
                                AppTextField(
                                  label: 'Email',
                                  hint: 'Nhập email của bạn',
                                  controller: _emailCtrl,
                                  keyboardType: TextInputType.emailAddress,
                                  errorText: state.emailError,
                                  enabled: isInfoStep,
                                  prefixIcon: const Icon(
                                    Icons.email_outlined,
                                    color: AppTheme.textSecondary,
                                    size: 20,
                                  ),
                                  onChanged: cubit.emailChanged,
                                ),
                                const SizedBox(height: 16),
                                AppTextField(
                                  label: 'Số điện thoại (tuỳ chọn)',
                                  hint: 'Nhập số điện thoại',
                                  controller: _phoneCtrl,
                                  keyboardType: TextInputType.phone,
                                  errorText: state.phoneError,
                                  enabled: isInfoStep,
                                  prefixIcon: const Icon(
                                    Icons.phone_outlined,
                                    color: AppTheme.textSecondary,
                                    size: 20,
                                  ),
                                  onChanged: cubit.phoneChanged,
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'Bạn là',
                                  style: GoogleFonts.inter(
                                    color: AppTheme.textPrimary,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    _RoleChip(
                                      label: 'Người dân',
                                      icon: Icons.people_outline_rounded,
                                      selected: state.role == 'NTD',
                                      onTap: isInfoStep
                                          ? () => cubit.roleChanged('NTD')
                                          : null,
                                    ),
                                    const SizedBox(width: 12),
                                    _RoleChip(
                                      label: 'Chủ cơ sở',
                                      icon: Icons.store_outlined,
                                      selected: state.role == 'CSKD',
                                      onTap: isInfoStep
                                          ? () => cubit.roleChanged('CSKD')
                                          : null,
                                    ),
                                  ],
                                ),
                                if (isBusiness) ...[
                                  const SizedBox(height: 16),
                                  AppTextField(
                                    label: 'Tên cơ sở (tuỳ chọn)',
                                    hint: 'Nhập tên cơ sở kinh doanh',
                                    controller: _businessCtrl,
                                    enabled: isInfoStep,
                                    prefixIcon: const Icon(
                                      Icons.storefront_outlined,
                                      color: AppTheme.textSecondary,
                                      size: 20,
                                    ),
                                    onChanged: cubit.businessNameChanged,
                                  ),
                                ],
                                const SizedBox(height: 16),
                                AppTextField(
                                  label: 'Mật khẩu',
                                  hint: 'Nhập mật khẩu (ít nhất 6 ký tự)',
                                  controller: _passCtrl,
                                  obscureText: state.obscurePassword,
                                  errorText: state.passwordError,
                                  enabled: isInfoStep,
                                  prefixIcon: const Icon(
                                    Icons.lock_outline_rounded,
                                    color: AppTheme.textSecondary,
                                    size: 20,
                                  ),
                                  suffixIcon: GestureDetector(
                                    onTap: cubit.togglePassword,
                                    child: Icon(
                                      state.obscurePassword
                                          ? Icons.visibility_off_outlined
                                          : Icons.visibility_outlined,
                                      color: AppTheme.textSecondary,
                                      size: 20,
                                    ),
                                  ),
                                  onChanged: cubit.passwordChanged,
                                ),
                                const SizedBox(height: 16),
                                AppTextField(
                                  label: 'Xác nhận mật khẩu',
                                  hint: 'Nhập lại mật khẩu',
                                  controller: _confirmCtrl,
                                  obscureText: state.obscureConfirmPassword,
                                  errorText: state.confirmPasswordError,
                                  enabled: isInfoStep,
                                  prefixIcon: const Icon(
                                    Icons.lock_outline_rounded,
                                    color: AppTheme.textSecondary,
                                    size: 20,
                                  ),
                                  suffixIcon: GestureDetector(
                                    onTap: cubit.toggleConfirmPassword,
                                    child: Icon(
                                      state.obscureConfirmPassword
                                          ? Icons.visibility_off_outlined
                                          : Icons.visibility_outlined,
                                      color: AppTheme.textSecondary,
                                      size: 20,
                                    ),
                                  ),
                                  onChanged: cubit.confirmPasswordChanged,
                                ),
                                if (state.step == RegisterStep.enterOtp) ...[
                                  const SizedBox(height: 16),
                                  AppTextField(
                                    label: 'Mã OTP',
                                    hint: 'Nhập mã OTP 6 chữ số',
                                    controller: _otpCtrl,
                                    keyboardType: TextInputType.number,
                                    errorText: state.otpError,
                                    prefixIcon: const Icon(
                                      Icons.verified_outlined,
                                      color: AppTheme.textSecondary,
                                      size: 20,
                                    ),
                                    onChanged: cubit.otpChanged,
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      TextButton(
                                        onPressed: cubit.goBackToInfo,
                                        child: Text(
                                          'Chỉnh sửa thông tin',
                                          style: GoogleFonts.inter(
                                            color: AppTheme.textSecondary,
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                      TextButton(
                                        onPressed: state.canResendOtp
                                            ? cubit.resendOtp
                                            : null,
                                        child: Text(
                                          state.canResendOtp
                                              ? 'Gửi lại OTP'
                                              : 'Gửi lại (${state.resendCooldown}s)',
                                          style: GoogleFonts.inter(
                                            color: AppTheme.primary,
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                                const SizedBox(height: 24),
                                AppButton(
                                  text: isInfoStep
                                      ? 'Gửi mã xác nhận'
                                      : 'Xác nhận đăng ký',
                                  isLoading:
                                      state.status == RegisterStatus.loading ||
                                      state.status == RegisterStatus.verifying,
                                  onPressed: () async {
                                    if (isInfoStep) {
                                      await cubit.sendOtp();
                                      return;
                                    }

                                    final response = await cubit
                                        .verifyRegister();
                                    if (response != null && context.mounted) {
                                      context.read<AuthCubit>().onLoginSuccess(
                                        response,
                                      );
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text('Đăng ký thành công!'),
                                        ),
                                      );
                                    }
                                  },
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Đã có tài khoản? ',
                                style: GoogleFonts.inter(
                                  color: AppTheme.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                              GestureDetector(
                                onTap: () => Navigator.pop(context),
                                child: Text(
                                  'Đăng nhập',
                                  style: GoogleFonts.inter(
                                    color: AppTheme.primary,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback? onTap;

  const _RoleChip({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: selected
                ? AppTheme.primary.withValues(alpha: 0.12)
                : AppTheme.surfaceBg,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: selected ? 0.08 : 0.04),
                blurRadius: selected ? 12 : 8,
                offset: Offset(0, selected ? 4 : 2),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 18,
                color: selected ? AppTheme.primary : AppTheme.textSecondary,
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: GoogleFonts.inter(
                  color: selected ? AppTheme.primary : AppTheme.textSecondary,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
