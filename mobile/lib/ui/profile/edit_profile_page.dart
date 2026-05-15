import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_state.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  bool _hasChanges = false;

  @override
  void initState() {
    super.initState();
    final authState = context.read<AuthCubit>().state;
    final profileState = context.read<ProfileCubit>().state;

    _nameController = TextEditingController(
      text: authState.fullName ?? profileState.name,
    );
    _emailController = TextEditingController(
      text: authState.email ?? profileState.email,
    );
    _phoneController = TextEditingController(
      text: authState.phone ?? profileState.phone,
    );

    _nameController.addListener(_onFieldChanged);
    _emailController.addListener(_onFieldChanged);
    _phoneController.addListener(_onFieldChanged);
  }

  void _onFieldChanged() {
    final authState = context.read<AuthCubit>().state;
    final profileState = context.read<ProfileCubit>().state;

    final originalName = authState.fullName ?? profileState.name;
    final originalEmail = authState.email ?? profileState.email;
    final originalPhone = authState.phone ?? profileState.phone;

    setState(() {
      _hasChanges = _nameController.text != originalName ||
          _emailController.text != originalEmail ||
          _phoneController.text != originalPhone;
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ProfileCubit, ProfileState>(
      listenWhen: (prev, curr) => prev.actionStatus != curr.actionStatus,
      listener: (context, state) {
        if (state.actionStatus == ProfileActionStatus.success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.successMessage ?? 'Cập nhật thành công'),
              backgroundColor: AppTheme.success,
            ),
          );
          // Cập nhật AuthCubit nếu cần
          context.read<ProfileCubit>().resetActionStatus();
          Navigator.pop(context, true);
        } else if (state.actionStatus == ProfileActionStatus.error) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.errorMessage ?? 'Có lỗi xảy ra'),
              backgroundColor: AppTheme.error,
            ),
          );
          context.read<ProfileCubit>().resetActionStatus();
        }
      },
      child: Scaffold(
        backgroundColor: AppTheme.scaffoldBg,
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
          title: Text(
            'Chỉnh sửa thông tin',
            style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
          ),
          actions: [
            BlocBuilder<ProfileCubit, ProfileState>(
              buildWhen: (prev, curr) =>
                  prev.actionStatus != curr.actionStatus,
              builder: (context, state) {
                final isLoading =
                    state.actionStatus == ProfileActionStatus.loading;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: TextButton(
                    onPressed: _hasChanges && !isLoading ? _onSave : null,
                    child: isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Text(
                            'Lưu',
                            style: GoogleFonts.inter(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: _hasChanges
                                  ? AppTheme.primary
                                  : AppTheme.textTertiary,
                            ),
                          ),
                  ),
                );
              },
            ),
          ],
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Avatar section
              Center(
                child: Stack(
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: const BoxDecoration(
                        gradient: AppTheme.primaryGradient,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          _nameController.text.isNotEmpty
                              ? _nameController.text[0].toUpperCase()
                              : 'U',
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 40,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppTheme.primary,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: AppShadow.level2,
                        ),
                        child: const Icon(
                          Icons.camera_alt_rounded,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Form fields
              AppTextField(
                label: 'Họ và tên',
                hint: 'Nhập họ và tên',
                controller: _nameController,
                prefixIcon: const Icon(Icons.person_outline_rounded,
                    color: AppTheme.textSecondary, size: 20),
              ),
              const SizedBox(height: 16),

              AppTextField(
                label: 'Email',
                hint: 'Nhập email',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                prefixIcon: const Icon(Icons.email_outlined,
                    color: AppTheme.textSecondary, size: 20),
              ),
              const SizedBox(height: 16),

              AppTextField(
                label: 'Số điện thoại',
                hint: 'Nhập số điện thoại',
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                prefixIcon: const Icon(Icons.phone_outlined,
                    color: AppTheme.textSecondary, size: 20),
              ),
              const SizedBox(height: 16),

              // Username (read-only)
              BlocBuilder<AuthCubit, dynamic>(
                builder: (context, authState) {
                  return AppTextField(
                    label: 'Tên đăng nhập',
                    controller: TextEditingController(
                      text: (authState as dynamic).username ?? '',
                    ),
                    readOnly: true,
                    enabled: false,
                    prefixIcon: const Icon(Icons.alternate_email_rounded,
                        color: AppTheme.textTertiary, size: 20),
                  );
                },
              ),

              const SizedBox(height: 32),

              // Save button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: BlocBuilder<ProfileCubit, ProfileState>(
                  buildWhen: (prev, curr) =>
                      prev.actionStatus != curr.actionStatus,
                  builder: (context, state) {
                    final isLoading =
                        state.actionStatus == ProfileActionStatus.loading;
                    return ElevatedButton(
                      onPressed: _hasChanges && !isLoading ? _onSave : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                        disabledBackgroundColor:
                            AppTheme.primary.withValues(alpha: 0.4),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        elevation: 0,
                      ),
                      child: isLoading
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2.5,
                              ),
                            )
                          : Text(
                              'Lưu thay đổi',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _onSave() {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final phone = _phoneController.text.trim();

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập họ và tên'),
          backgroundColor: AppTheme.error,
        ),
      );
      return;
    }

    context.read<ProfileCubit>().updateProfile(
          fullName: name,
          email: email.isNotEmpty ? email : null,
          phone: phone.isNotEmpty ? phone : null,
        );
  }
}
