import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

class _ForgotPasswordPageState extends State<ForgotPasswordPage>
    with SingleTickerProviderStateMixin {
  final _emailCtrl = TextEditingController();
  final _otpControllers = List.generate(6, (_) => TextEditingController());
  final _otpFocusNodes = List.generate(6, (_) => FocusNode());
  final _newPasswordCtrl = TextEditingController();
  final _confirmPasswordCtrl = TextEditingController();

  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0.05, 0),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOut));
    _animController.forward();
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    for (final c in _otpControllers) {
      c.dispose();
    }
    for (final f in _otpFocusNodes) {
      f.dispose();
    }
    _newPasswordCtrl.dispose();
    _confirmPasswordCtrl.dispose();
    _animController.dispose();
    super.dispose();
  }

  void _playTransition() {
    _animController.reset();
    _animController.forward();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ForgotPasswordCubit, ForgotPasswordState>(
      listener: (context, state) {
        // Animate bước chuyển
        if (state.step == ForgotPasswordStep.enterOtp &&
            state.status == ForgotPasswordStatus.otpSent) {
          _playTransition();
        }
        if (state.step == ForgotPasswordStep.resetPassword) {
          _playTransition();
        }

        // Hiển thị lỗi
        if (state.errorMessage != null && state.errorMessage!.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(
                    Icons.error_outline,
                    color: Colors.white,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      state.errorMessage!,
                      style: GoogleFonts.inter(fontSize: 13),
                    ),
                  ),
                ],
              ),
              backgroundColor: const Color(0xFFB00020),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              margin: const EdgeInsets.all(16),
            ),
          );
        }

        // Thành công → dialog rồi quay về login
        if (state.status == ForgotPasswordStatus.success) {
          _showSuccessDialog(context);
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
            child: Column(
              children: [
                _TopBar(onPlayTransition: _playTransition),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    physics: const BouncingScrollPhysics(),
                    child: FadeTransition(
                      opacity: _fadeAnim,
                      child: SlideTransition(
                        position: _slideAnim,
                        child: _StepContentRouter(
                          emailCtrl: _emailCtrl,
                          otpControllers: _otpControllers,
                          otpFocusNodes: _otpFocusNodes,
                          newPasswordCtrl: _newPasswordCtrl,
                          confirmPasswordCtrl: _confirmPasswordCtrl,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─── Success dialog ──────────────────────────────────────
  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Dialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Animated checkmark
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.success.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.success.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    size: 32,
                    color: AppTheme.success,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Thành công!',
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Mật khẩu đã được đặt lại thành công.\nBạn có thể đăng nhập với mật khẩu mới.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  color: AppTheme.textSecondary,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  text: 'Quay lại đăng nhập',
                  icon: Icons.login_rounded,
                  onPressed: () {
                    Navigator.pop(context); // close dialog
                    Navigator.pop(context); // go back to login
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Success dialog ──────────────────────────────────────
void _showSuccessDialog(BuildContext context) {
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (_) => Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Animated checkmark
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.success.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.success.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_rounded,
                  size: 32,
                  color: AppTheme.success,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Thành công!',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Mật khẩu đã được đặt lại thành công.\nBạn có thể đăng nhập với mật khẩu mới.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 14,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: AppButton(
                text: 'Quay lại đăng nhập',
                icon: Icons.login_rounded,
                onPressed: () {
                  Navigator.pop(context); // close dialog
                  Navigator.pop(context); // go back to login
                },
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

// ═══════════════════════════════════════════════════════════
// Separate Widgets for Optimization
// ═══════════════════════════════════════════════════════════

class _TopBar extends StatelessWidget {
  final VoidCallback onPlayTransition;

  const _TopBar({required this.onPlayTransition});

  @override
  Widget build(BuildContext context) {
    return BlocSelector<
      ForgotPasswordCubit,
      ForgotPasswordState,
      ForgotPasswordStep
    >(
      selector: (state) => state.step,
      builder: (context, step) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Row(
            children: [
              IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.arrow_back_ios_rounded,
                    size: 18,
                    color: AppTheme.textPrimary,
                  ),
                ),
                onPressed: () {
                  if (step != ForgotPasswordStep.enterEmail) {
                    context.read<ForgotPasswordCubit>().goBack();
                    onPlayTransition();
                  } else {
                    Navigator.pop(context);
                  }
                },
              ),
              const Spacer(),
              _StepIndicator(step: step),
              const Spacer(),
              const SizedBox(width: 48),
            ],
          ),
        );
      },
    );
  }
}

class _StepIndicator extends StatelessWidget {
  final ForgotPasswordStep step;

  const _StepIndicator({required this.step});

  @override
  Widget build(BuildContext context) {
    final steps = ForgotPasswordStep.values;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(steps.length, (i) {
        final isActive = i <= step.index;
        final isCurrent = i == step.index;
        return Row(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: isCurrent ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: isActive ? AppTheme.primary : const Color(0xFFD1D5DB),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            if (i < steps.length - 1) const SizedBox(width: 6),
          ],
        );
      }),
    );
  }
}

class _StepContentRouter extends StatelessWidget {
  final TextEditingController emailCtrl;
  final List<TextEditingController> otpControllers;
  final List<FocusNode> otpFocusNodes;
  final TextEditingController newPasswordCtrl;
  final TextEditingController confirmPasswordCtrl;

  const _StepContentRouter({
    required this.emailCtrl,
    required this.otpControllers,
    required this.otpFocusNodes,
    required this.newPasswordCtrl,
    required this.confirmPasswordCtrl,
  });

  @override
  Widget build(BuildContext context) {
    return BlocSelector<
      ForgotPasswordCubit,
      ForgotPasswordState,
      ForgotPasswordStep
    >(
      selector: (state) => state.step,
      builder: (context, step) {
        switch (step) {
          case ForgotPasswordStep.enterEmail:
            return _EmailStep(emailCtrl: emailCtrl);
          case ForgotPasswordStep.enterOtp:
            return _OtpStep(
              otpControllers: otpControllers,
              otpFocusNodes: otpFocusNodes,
            );
          case ForgotPasswordStep.resetPassword:
            return _ResetPasswordStep(
              newPasswordCtrl: newPasswordCtrl,
              confirmPasswordCtrl: confirmPasswordCtrl,
            );
        }
      },
    );
  }
}

// ═══════════════════════════════════════════════════════════
// Email Step Widget
// ═══════════════════════════════════════════════════════════
class _EmailStep extends StatelessWidget {
  final TextEditingController emailCtrl;

  const _EmailStep({required this.emailCtrl});

  @override
  Widget build(BuildContext context) {
    return BlocSelector<
      ForgotPasswordCubit,
      ForgotPasswordState,
      ({String? emailError, ForgotPasswordStatus status})
    >(
      selector: (state) => (emailError: state.emailError, status: state.status),
      builder: (context, data) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Center(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.primary.withValues(alpha: 0.10),
                      AppTheme.primary.withValues(alpha: 0.04),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                ),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.primary.withValues(alpha: 0.20),
                        AppTheme.primary.withValues(alpha: 0.08),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.lock_reset_rounded,
                    size: 36,
                    color: AppTheme.primary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 28),
            Text(
              'Quên mật khẩu?',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 26,
                fontWeight: FontWeight.w700,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Nhập địa chỉ email đã đăng ký, chúng tôi sẽ gửi mã OTP để xác thực.',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 14,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 32),
            AppTextField(
              label: 'Email',
              hint: 'example@gmail.com',
              controller: emailCtrl,
              keyboardType: TextInputType.emailAddress,
              errorText: data.emailError,
              prefixIcon: const Icon(
                Icons.email_outlined,
                color: AppTheme.textSecondary,
                size: 20,
              ),
              onChanged: (v) =>
                  context.read<ForgotPasswordCubit>().emailChanged(v),
            ),
            const SizedBox(height: 32),
            AppButton(
              text: 'Gửi mã OTP',
              icon: Icons.send_rounded,
              isLoading: data.status == ForgotPasswordStatus.loading,
              onPressed: () => context.read<ForgotPasswordCubit>().sendOtp(),
            ),
            const SizedBox(height: 20),
            Center(
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                child: RichText(
                  text: TextSpan(
                    text: 'Đã nhớ mật khẩu? ',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 14,
                    ),
                    children: [
                      TextSpan(
                        text: 'Đăng nhập',
                        style: GoogleFonts.inter(
                          color: AppTheme.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        );
      },
    );
  }
}

// ═══════════════════════════════════════════════════════════
// OTP Step Widget
// ═══════════════════════════════════════════════════════════
class _OtpStep extends StatelessWidget {
  final List<TextEditingController> otpControllers;
  final List<FocusNode> otpFocusNodes;

  const _OtpStep({required this.otpControllers, required this.otpFocusNodes});

  @override
  Widget build(BuildContext context) {
    return BlocSelector<
      ForgotPasswordCubit,
      ForgotPasswordState,
      ({String email, String? otpError})
    >(
      selector: (state) => (email: state.email, otpError: state.otpError),
      builder: (context, data) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Center(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.accent.withValues(alpha: 0.10),
                      AppTheme.accent.withValues(alpha: 0.04),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                ),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.accent.withValues(alpha: 0.20),
                        AppTheme.accent.withValues(alpha: 0.08),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.mark_email_read_rounded,
                    size: 36,
                    color: AppTheme.accent,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 28),
            Text(
              'Xác thực OTP',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 26,
                fontWeight: FontWeight.w700,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 8),
            RichText(
              text: TextSpan(
                text: 'Mã OTP đã được gửi đến ',
                style: GoogleFonts.inter(
                  color: AppTheme.textSecondary,
                  fontSize: 14,
                  height: 1.6,
                ),
                children: [
                  TextSpan(
                    text: data.email,
                    style: GoogleFonts.inter(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(
                6,
                (i) => _OtpBox(
                  controller: otpControllers[i],
                  focusNode: otpFocusNodes[i],
                  index: i,
                  otpControllers: otpControllers,
                  otpFocusNodes: otpFocusNodes,
                ),
              ),
            ),
            if (data.otpError != null) ...[
              const SizedBox(height: 8),
              Text(
                data.otpError!,
                style: GoogleFonts.inter(
                  color: const Color(0xFFB00020),
                  fontSize: 12,
                ),
              ),
            ],
            const SizedBox(height: 24),
            const Center(child: _ResendOtpButton()),
            const SizedBox(height: 32),
            AppButton(
              text: 'Xác nhận',
              icon: Icons.verified_rounded,
              onPressed: () =>
                  context.read<ForgotPasswordCubit>().proceedToResetPassword(),
            ),
            const SizedBox(height: 32),
          ],
        );
      },
    );
  }
}

class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final int index;
  final List<TextEditingController> otpControllers;
  final List<FocusNode> otpFocusNodes;

  const _OtpBox({
    required this.controller,
    required this.focusNode,
    required this.index,
    required this.otpControllers,
    required this.otpFocusNodes,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 48,
      height: 56,
      child: ListenableBuilder(
        listenable: focusNode,
        builder: (context, _) {
          return Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: focusNode.hasFocus
                      ? AppTheme.primary.withValues(alpha: 0.18)
                      : Colors.black.withValues(alpha: 0.05),
                  blurRadius: focusNode.hasFocus ? 10 : 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: TextField(
              controller: controller,
              focusNode: focusNode,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              maxLength: 1,
              style: GoogleFonts.inter(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              ),
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              decoration: InputDecoration(
                counterText: '',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.transparent,
                contentPadding: EdgeInsets.zero,
              ),
              onChanged: (value) {
                final otp = otpControllers.map((c) => c.text).join();
                context.read<ForgotPasswordCubit>().otpChanged(otp);

                if (value.isNotEmpty && index < 5) {
                  otpFocusNodes[index + 1].requestFocus();
                }
                if (value.isEmpty && index > 0) {
                  otpFocusNodes[index - 1].requestFocus();
                }
              },
            ),
          );
        },
      ),
    );
  }
}

class _ResendOtpButton extends StatelessWidget {
  const _ResendOtpButton();

  @override
  Widget build(BuildContext context) {
    return BlocSelector<
      ForgotPasswordCubit,
      ForgotPasswordState,
      ({bool canResend, int cooldown})
    >(
      selector: (state) =>
          (canResend: state.canResendOtp, cooldown: state.resendCooldown),
      builder: (context, data) {
        return AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: data.canResend
              ? TextButton.icon(
                  key: const ValueKey('resend'),
                  onPressed: () =>
                      context.read<ForgotPasswordCubit>().resendOtp(),
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  label: Text(
                    'Gửi lại mã',
                    style: GoogleFonts.inter(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                )
              : Container(
                  key: ValueKey('countdown-${data.cooldown}'),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceBg,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.timer_outlined,
                        size: 16,
                        color: AppTheme.textSecondary,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Gửi lại sau ${data.cooldown}s',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
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

// ═══════════════════════════════════════════════════════════
// Reset Password Step Widget
// ═══════════════════════════════════════════════════════════
class _ResetPasswordStep extends StatelessWidget {
  final TextEditingController newPasswordCtrl;
  final TextEditingController confirmPasswordCtrl;

  const _ResetPasswordStep({
    required this.newPasswordCtrl,
    required this.confirmPasswordCtrl,
  });

  @override
  Widget build(BuildContext context) {
    return BlocSelector<
      ForgotPasswordCubit,
      ForgotPasswordState,
      ({
        String? passwordError,
        bool obscurePassword,
        bool obscureConfirm,
        ForgotPasswordStatus status,
      })
    >(
      selector: (state) => (
        passwordError: state.passwordError,
        obscurePassword: state.obscurePassword,
        obscureConfirm: state.obscureConfirmPassword,
        status: state.status,
      ),
      builder: (context, data) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Center(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.success.withValues(alpha: 0.10),
                      AppTheme.success.withValues(alpha: 0.04),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                ),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.success.withValues(alpha: 0.20),
                        AppTheme.success.withValues(alpha: 0.08),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.lock_open_rounded,
                    size: 36,
                    color: AppTheme.success,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 28),
            Text(
              'Đặt mật khẩu mới',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 26,
                fontWeight: FontWeight.w700,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Tạo mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít nhất 6 ký tự.',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 14,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 32),
            AppTextField(
              label: 'Mật khẩu mới',
              hint: 'Nhập mật khẩu mới',
              controller: newPasswordCtrl,
              obscureText: data.obscurePassword,
              errorText: data.passwordError,
              prefixIcon: const Icon(
                Icons.lock_outline_rounded,
                color: AppTheme.textSecondary,
                size: 20,
              ),
              suffixIcon: IconButton(
                icon: Icon(
                  data.obscurePassword
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: AppTheme.textSecondary,
                  size: 20,
                ),
                onPressed: () =>
                    context.read<ForgotPasswordCubit>().toggleObscurePassword(),
              ),
              onChanged: (v) =>
                  context.read<ForgotPasswordCubit>().newPasswordChanged(v),
            ),
            const SizedBox(height: 20),
            AppTextField(
              label: 'Xác nhận mật khẩu',
              hint: 'Nhập lại mật khẩu',
              controller: confirmPasswordCtrl,
              obscureText: data.obscureConfirm,
              prefixIcon: const Icon(
                Icons.lock_outline_rounded,
                color: AppTheme.textSecondary,
                size: 20,
              ),
              suffixIcon: IconButton(
                icon: Icon(
                  data.obscureConfirm
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: AppTheme.textSecondary,
                  size: 20,
                ),
                onPressed: () => context
                    .read<ForgotPasswordCubit>()
                    .toggleObscureConfirmPassword(),
              ),
              onChanged: (v) =>
                  context.read<ForgotPasswordCubit>().confirmPasswordChanged(v),
            ),
            const SizedBox(height: 32),
            AppButton(
              text: 'Đặt lại mật khẩu',
              icon: Icons.check_circle_outline_rounded,
              isLoading: data.status == ForgotPasswordStatus.verifying,
              onPressed: () =>
                  context.read<ForgotPasswordCubit>().resetPassword(),
            ),
            const SizedBox(height: 32),
          ],
        );
      },
    );
  }
}
