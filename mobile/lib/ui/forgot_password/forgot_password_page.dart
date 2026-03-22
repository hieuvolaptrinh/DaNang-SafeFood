import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/viewmodel/forgot_password/forgot_password_cubit.dart';
import 'package:mobile_ui/viewmodel/forgot_password/forgot_password_state.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _emailCtrl = TextEditingController();

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ForgotPasswordCubit, ForgotPasswordState>(
      listener: (context, state) {
        if (state.status == ForgotPasswordStatus.success) {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              backgroundColor: AppTheme.spotifyDarkGray,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: Text(
                'Thành công',
                style: GoogleFonts.inter(color: AppTheme.spotifyWhite, fontWeight: FontWeight.bold),
              ),
              content: Text(
                'Yêu cầu đặt lại mật khẩu đã được gửi đến email/SĐT của bạn.',
                style: GoogleFonts.inter(color: AppTheme.spotifySubtle),
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context); // close dialog
                    Navigator.pop(context); // go back to login
                  },
                  child: Text(
                    'Quay lại đăng nhập',
                    style: GoogleFonts.inter(color: AppTheme.primary, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: BlocBuilder<ForgotPasswordCubit, ForgotPasswordState>(
              builder: (context, state) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),
                    Center(
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.accent.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.lock_reset_rounded,
                          size: 40,
                          color: AppTheme.accent,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Quên mật khẩu',
                      style: GoogleFonts.inter(
                        color: AppTheme.spotifyWhite,
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Nhập email hoặc số điện thoại đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.',
                      style: GoogleFonts.inter(
                        color: AppTheme.spotifySubtle,
                        fontSize: 14,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 32),

                    AppTextField(
                      label: 'Email / Số điện thoại',
                      hint: 'Nhập email hoặc số điện thoại',
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      errorText: state.emailError,
                      prefixIcon: const Icon(Icons.email_outlined, color: AppTheme.spotifySubtle, size: 20),
                      onChanged: (v) => context.read<ForgotPasswordCubit>().emailChanged(v),
                    ),
                    const SizedBox(height: 32),

                    AppButton(
                      text: 'Gửi yêu cầu',
                      isLoading: state.status == ForgotPasswordStatus.loading,
                      onPressed: () => context.read<ForgotPasswordCubit>().submit(),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
