import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/login/login_cubit.dart';
import 'package:mobile_ui/viewmodel/login/login_state.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginCubit, LoginState>(
      listener: (context, state) {
        if (state.status == LoginStatus.success) {
          Navigator.pushReplacementNamed(context, Routes.main);
        } else if (state.status == LoginStatus.error) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.errorMessage ?? 'Đăng nhập thất bại')),
          );
        }
      },
      child: Scaffold(
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: BlocBuilder<LoginCubit, LoginState>(
              builder: (context, state) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 60),
                    // Logo / App name
                    Center(
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.verified_user_rounded,
                          size: 48,
                          color: AppTheme.primary,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Center(
                      child: Text(
                        'ATTP Đà Nẵng',
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Center(
                      child: Text(
                        'Hệ thống quản lý an toàn vệ sinh thực phẩm',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 14,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 48),

                    // Email field
                    AppTextField(
                      label: 'Email / Số điện thoại',
                      hint: 'Nhập email hoặc số điện thoại',
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      errorText: state.emailError,
                      prefixIcon: const Icon(
                        Icons.person_outline_rounded,
                        color: AppTheme.textSecondary,
                        size: 20,
                      ),
                      onChanged: (v) =>
                          context.read<LoginCubit>().emailChanged(v),
                    ),
                    const SizedBox(height: 20),

                    // Password field
                    AppTextField(
                      label: 'Mật khẩu',
                      hint: 'Nhập mật khẩu',
                      controller: _passwordController,
                      obscureText: state.obscurePassword,
                      errorText: state.passwordError,
                      prefixIcon: const Icon(
                        Icons.lock_outline_rounded,
                        color: AppTheme.textSecondary,
                        size: 20,
                      ),
                      suffixIcon: GestureDetector(
                        onTap: () => context
                            .read<LoginCubit>()
                            .togglePasswordVisibility(),
                        child: Icon(
                          state.obscurePassword
                              ? Icons.visibility_off_outlined
                              : Icons.visibility_outlined,
                          color: AppTheme.textSecondary,
                          size: 20,
                        ),
                      ),
                      onChanged: (v) =>
                          context.read<LoginCubit>().passwordChanged(v),
                    ),
                    const SizedBox(height: 12),

                    // Forgot password link
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () =>
                            Navigator.pushNamed(context, Routes.forgotPassword),
                        child: Text(
                          'Quên mật khẩu?',
                          style: GoogleFonts.inter(
                            color: AppTheme.primary,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Login button
                    AppButton(
                      text: 'Đăng nhập',
                      isLoading: state.status == LoginStatus.loading,
                      onPressed: () => context.read<LoginCubit>().login(),
                    ),
                    const SizedBox(height: 20),

                    // Divider OR
                    Row(
                      children: [
                        Expanded(child: Divider(color: AppTheme.dividerColor)),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            'HOẶC',
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Expanded(child: Divider(color: AppTheme.dividerColor)),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // VNeID login button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          // TODO: Implement VNeID login
                        },
                        icon: Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            color: const Color(0xFFCC0000),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Center(
                            child: Text(
                              'V',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ),
                        label: Text(
                          'Đăng nhập bằng VNeID',
                          style: GoogleFonts.inter(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.textPrimary,
                          side: const BorderSide(color: AppTheme.dividerColor),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Register link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Chưa có tài khoản? ',
                          style: GoogleFonts.inter(
                            color: AppTheme.textSecondary,
                            fontSize: 14,
                          ),
                        ),
                        GestureDetector(
                          onTap: () =>
                              Navigator.pushNamed(context, Routes.register),
                          child: Text(
                            'Đăng ký',
                            style: GoogleFonts.inter(
                              color: AppTheme.primary,
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 40),
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
