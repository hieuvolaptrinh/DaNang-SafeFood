import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/viewmodel/profile/profile_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_state.dart';

class ChangePasswordPage extends StatefulWidget {
  const ChangePasswordPage({super.key});

  @override
  State<ChangePasswordPage> createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  final _currentCtrl = TextEditingController();
  final _newCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscureCurrent = true;
  bool _obscureNew = true;
  bool _obscureConfirm = true;
  String? _errCurrent, _errNew, _errConfirm;

  @override
  void dispose() {
    _currentCtrl.dispose();
    _newCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  bool _validate() {
    bool ok = true;
    setState(() {
      _errCurrent = _errNew = _errConfirm = null;
      if (_currentCtrl.text.isEmpty) { _errCurrent = 'Vui lòng nhập mật khẩu hiện tại'; ok = false; }
      if (_newCtrl.text.isEmpty) { _errNew = 'Vui lòng nhập mật khẩu mới'; ok = false; }
      else if (_newCtrl.text.length < 6) { _errNew = 'Mật khẩu mới phải có ít nhất 6 ký tự'; ok = false; }
      if (_confirmCtrl.text.isEmpty) { _errConfirm = 'Vui lòng xác nhận mật khẩu mới'; ok = false; }
      else if (_confirmCtrl.text != _newCtrl.text) { _errConfirm = 'Mật khẩu xác nhận không khớp'; ok = false; }
      if (_currentCtrl.text == _newCtrl.text && _newCtrl.text.isNotEmpty) { _errNew = 'Mật khẩu mới không được trùng mật khẩu cũ'; ok = false; }
    });
    return ok;
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ProfileCubit, ProfileState>(
      listenWhen: (p, c) => p.actionStatus != c.actionStatus,
      listener: (ctx, state) {
        if (state.actionStatus == ProfileActionStatus.success) {
          ScaffoldMessenger.of(ctx).showSnackBar(SnackBar(content: Text(state.successMessage ?? 'Thành công'), backgroundColor: AppTheme.success));
          ctx.read<ProfileCubit>().resetActionStatus();
          Navigator.pop(ctx, true);
        } else if (state.actionStatus == ProfileActionStatus.error) {
          ScaffoldMessenger.of(ctx).showSnackBar(SnackBar(content: Text(state.errorMessage ?? 'Lỗi'), backgroundColor: AppTheme.error));
          ctx.read<ProfileCubit>().resetActionStatus();
        }
      },
      child: Scaffold(
        backgroundColor: AppTheme.scaffoldBg,
        appBar: AppBar(
          leading: IconButton(icon: const Icon(Icons.arrow_back_ios_rounded, size: 20), onPressed: () => Navigator.pop(context)),
          title: Text('Đổi mật khẩu', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Container(width: 80, height: 80, decoration: BoxDecoration(color: AppTheme.primary.withValues(alpha: 0.1), shape: BoxShape.circle), child: const Icon(Icons.lock_outline_rounded, color: AppTheme.primary, size: 40)),
              const SizedBox(height: 12),
              Text('Nhập mật khẩu hiện tại và mật khẩu mới\nđể thay đổi mật khẩu', textAlign: TextAlign.center, style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 13, height: 1.5)),
              const SizedBox(height: 28),
              AppTextField(label: 'Mật khẩu hiện tại', hint: 'Nhập mật khẩu hiện tại', controller: _currentCtrl, obscureText: _obscureCurrent, errorText: _errCurrent, prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.textSecondary, size: 20), suffixIcon: IconButton(icon: Icon(_obscureCurrent ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: AppTheme.textSecondary, size: 20), onPressed: () => setState(() => _obscureCurrent = !_obscureCurrent))),
              const SizedBox(height: 16),
              AppTextField(label: 'Mật khẩu mới', hint: 'Tối thiểu 6 ký tự', controller: _newCtrl, obscureText: _obscureNew, errorText: _errNew, prefixIcon: const Icon(Icons.lock_reset_rounded, color: AppTheme.textSecondary, size: 20), suffixIcon: IconButton(icon: Icon(_obscureNew ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: AppTheme.textSecondary, size: 20), onPressed: () => setState(() => _obscureNew = !_obscureNew))),
              const SizedBox(height: 16),
              AppTextField(label: 'Xác nhận mật khẩu mới', hint: 'Nhập lại mật khẩu mới', controller: _confirmCtrl, obscureText: _obscureConfirm, errorText: _errConfirm, prefixIcon: const Icon(Icons.check_circle_outline_rounded, color: AppTheme.textSecondary, size: 20), suffixIcon: IconButton(icon: Icon(_obscureConfirm ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: AppTheme.textSecondary, size: 20), onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm))),
              const SizedBox(height: 24),
              _buildRequirements(),
              const SizedBox(height: 32),
              SizedBox(width: double.infinity, height: 52, child: BlocBuilder<ProfileCubit, ProfileState>(buildWhen: (p, c) => p.actionStatus != c.actionStatus, builder: (ctx, st) {
                final loading = st.actionStatus == ProfileActionStatus.loading;
                return ElevatedButton(onPressed: loading ? null : () { if (_validate()) ctx.read<ProfileCubit>().changePassword(currentPassword: _currentCtrl.text, newPassword: _newCtrl.text); }, style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)), elevation: 0), child: loading ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5)) : Text('Đổi mật khẩu', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600)));
              })),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRequirements() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppTheme.infoLight, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppTheme.info.withValues(alpha: 0.3))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [const Icon(Icons.info_outline_rounded, color: AppTheme.info, size: 18), const SizedBox(width: 8), Text('Yêu cầu mật khẩu', style: GoogleFonts.inter(color: AppTheme.info, fontSize: 13, fontWeight: FontWeight.w600))]),
        const SizedBox(height: 8),
        _req('Tối thiểu 6 ký tự', _newCtrl.text.length >= 6),
        _req('Khác với mật khẩu cũ', _newCtrl.text.isNotEmpty && _currentCtrl.text.isNotEmpty && _newCtrl.text != _currentCtrl.text),
        _req('Xác nhận trùng khớp', _confirmCtrl.text.isNotEmpty && _newCtrl.text == _confirmCtrl.text),
      ]),
    );
  }

  Widget _req(String text, bool met) => Padding(padding: const EdgeInsets.only(top: 4), child: Row(children: [Icon(met ? Icons.check_circle_rounded : Icons.circle_outlined, color: met ? AppTheme.success : AppTheme.textTertiary, size: 16), const SizedBox(width: 8), Text(text, style: GoogleFonts.inter(color: met ? AppTheme.success : AppTheme.textSecondary, fontSize: 12))]));
}
