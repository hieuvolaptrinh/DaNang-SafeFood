import 'dart:io';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/business_registration/business_registration_cubit.dart';
import 'package:mobile_ui/viewmodel/business_registration/business_registration_state.dart';

/// Trang đăng ký kinh doanh — TẠO MỚI 1 cơ sở kinh doanh.
/// Người dùng nhập tên, số GP, phường xã, ảnh bìa.
/// Sau khi tạo thành công sẽ điều hướng sang trang bổ sung 4 loại giấy tờ.
class BusinessRegistrationPage extends StatefulWidget {
  const BusinessRegistrationPage({super.key});

  @override
  State<BusinessRegistrationPage> createState() =>
      _BusinessRegistrationPageState();
}

class _BusinessRegistrationPageState extends State<BusinessRegistrationPage> {
  final _tenCoSoCtrl = TextEditingController();
  final _soGiayPhepCtrl = TextEditingController();

  @override
  void dispose() {
    _tenCoSoCtrl.dispose();
    _soGiayPhepCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<BusinessRegistrationCubit, BusinessRegState>(
      listenWhen: (prev, curr) =>
          prev.status != curr.status || prev.errorMessage != curr.errorMessage,
      listener: (context, state) {
        if (state.status == BusinessRegStatus.success &&
            state.createdBusiness != null) {
          _snack(
            context,
            state.successMessage ?? 'Tạo cơ sở thành công',
            isError: false,
          );
          // Sau 600ms điều hướng sang trang upload giấy tờ với mã cơ sở vừa tạo
          Future.delayed(const Duration(milliseconds: 600), () {
            if (!context.mounted) return;
            Navigator.pushReplacementNamed(
              context,
              Routes.documentUpload,
              arguments: {'maCoSo': state.createdBusiness!.maCoSo},
            );
          });
        }
        if (state.status == BusinessRegStatus.error &&
            state.errorMessage != null) {
          _snack(context, state.errorMessage!, isError: true);
        }
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
              onPressed: () => Navigator.pop(context),
            ),
            title: Text(
              'Đăng ký kinh doanh',
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          body: state.status == BusinessRegStatus.loading
              ? const Center(
                  child: CircularProgressIndicator(color: AppTheme.primary),
                )
              : _buildForm(context, state),
        );
      },
    );
  }

  Widget _buildForm(BuildContext context, BusinessRegState state) {
    final cubit = context.read<BusinessRegistrationCubit>();

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step indicator
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppTheme.primary.withValues(alpha: 0.18),
              ),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.info_outline_rounded,
                  color: AppTheme.primary,
                  size: 20,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Bước 1: Tạo cơ sở kinh doanh. '
                    'Sau khi tạo bạn sẽ được nhắc bổ sung 4 loại giấy tờ.',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Cover image
          _CoverImagePicker(
            image: state.coverImage,
            uploadedUrl: state.coverImageUrl,
            isUploading: state.isUploadingCover,
            onPick: () => _pickCoverImage(context),
            onRemove: cubit.removeCoverImage,
          ),
          const SizedBox(height: 20),

          AppTextField(
            label: 'Tên cơ sở kinh doanh *',
            hint: 'Ví dụ: Nhà hàng An Lành',
            controller: _tenCoSoCtrl,
            onChanged: cubit.setTenCoSo,
            prefixIcon: const Icon(
              Icons.store_outlined,
              color: AppTheme.textSecondary,
              size: 20,
            ),
          ),
          const SizedBox(height: 16),

          AppTextField(
            label: 'Số giấy phép',
            hint: 'Số đăng ký kinh doanh (nếu có)',
            controller: _soGiayPhepCtrl,
            onChanged: cubit.setSoGiayPhep,
            prefixIcon: const Icon(
              Icons.numbers_rounded,
              color: AppTheme.textSecondary,
              size: 20,
            ),
          ),
          const SizedBox(height: 16),

          // Phường xã
          _PhuongXaSelector(
            phuongXaList: state.phuongXaList,
            selectedMaPX: state.selectedMaPX,
            onChanged: cubit.setMaPX,
          ),
          const SizedBox(height: 16),

          // Ngày hết hạn giấy phép
          _DateField(
            label: 'Ngày hết hạn giấy phép',
            value: state.ngayHetHanGiayPhep,
            onTap: () => _pickDate(
              context,
              initial: state.ngayHetHanGiayPhep,
              onPick: cubit.setNgayHetHanGiayPhep,
            ),
            onClear: state.ngayHetHanGiayPhep != null
                ? () => cubit.setNgayHetHanGiayPhep(null)
                : null,
          ),
          const SizedBox(height: 32),

          AppButton(
            text: 'Tạo cơ sở kinh doanh',
            icon: Icons.add_business_rounded,
            isLoading: state.status == BusinessRegStatus.submitting,
            onPressed:
                !state.canSubmit ||
                    state.isUploadingCover ||
                    state.status == BusinessRegStatus.submitting
                ? null
                : () => cubit.submit(),
          ),
          const SizedBox(height: 8),
          Center(
            child: Text(
              'Bước tiếp theo: tải lên 4 loại giấy tờ.',
              style: GoogleFonts.inter(
                color: AppTheme.textTertiary,
                fontSize: 11,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickCoverImage(BuildContext context) async {
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined),
              title: const Text('Chụp ảnh'),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.image_outlined),
              title: const Text('Chọn từ thư viện'),
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
    if (source == null) return;
    try {
      final picker = ImagePicker();
      final x = await picker.pickImage(source: source, imageQuality: 85);
      if (x != null && context.mounted) {
        await context.read<BusinessRegistrationCubit>().pickCoverImage(x);
      }
    } catch (e) {
      if (context.mounted) {
        _snack(context, 'Không chọn được ảnh', isError: true);
      }
    }
  }

  Future<void> _pickDate(
    BuildContext context, {
    DateTime? initial,
    required ValueChanged<DateTime> onPick,
  }) async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: initial ?? DateTime(now.year + 1),
      firstDate: DateTime(now.year - 5),
      lastDate: DateTime(now.year + 30),
    );
    if (picked != null) onPick(picked);
  }

  void _snack(BuildContext context, String msg, {required bool isError}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg, style: GoogleFonts.inter(fontSize: 13)),
        backgroundColor: isError ? AppTheme.error : AppTheme.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }
}

/// ===== Sub widgets =====

class _CoverImagePicker extends StatelessWidget {
  final XFile? image;
  final String? uploadedUrl;
  final bool isUploading;
  final VoidCallback onPick;
  final VoidCallback onRemove;

  const _CoverImagePicker({
    required this.image,
    required this.uploadedUrl,
    required this.isUploading,
    required this.onPick,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Ảnh bìa cơ sở',
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: image == null ? onPick : null,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            height: 160,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppTheme.surfaceBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: AppTheme.primary.withValues(alpha: 0.2),
                style: BorderStyle.solid,
              ),
              image: image != null && !kIsWeb
                  ? DecorationImage(
                      image: FileImage(File(image!.path)),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: image == null
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.add_photo_alternate_outlined,
                        size: 36,
                        color: AppTheme.primary,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Bấm để chọn ảnh bìa',
                        style: GoogleFonts.inter(
                          color: AppTheme.primary,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  )
                : Stack(
                    children: [
                      if (isUploading)
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.4),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Center(
                            child: CircularProgressIndicator(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Material(
                          color: Colors.black.withValues(alpha: 0.55),
                          shape: const CircleBorder(),
                          child: InkWell(
                            customBorder: const CircleBorder(),
                            onTap: onRemove,
                            child: const Padding(
                              padding: EdgeInsets.all(6),
                              child: Icon(
                                Icons.close_rounded,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                          ),
                        ),
                      ),
                      if (uploadedUrl != null)
                        Positioned(
                          bottom: 8,
                          left: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppTheme.success,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'Đã tải lên',
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
          ),
        ),
      ],
    );
  }
}

class _PhuongXaSelector extends StatelessWidget {
  final List<PhuongXaModel> phuongXaList;
  final String? selectedMaPX;
  final ValueChanged<String?> onChanged;

  const _PhuongXaSelector({
    required this.phuongXaList,
    required this.selectedMaPX,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final hasSelection =
        selectedMaPX != null && phuongXaList.any((p) => p.maPX == selectedMaPX);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Phường / xã',
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          decoration: BoxDecoration(
            color: AppTheme.surfaceBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.dividerColor),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String?>(
              value: hasSelection ? selectedMaPX : null,
              isExpanded: true,
              hint: Text(
                phuongXaList.isEmpty ? 'Đang tải...' : 'Chọn phường / xã',
                style: GoogleFonts.inter(
                  color: AppTheme.textTertiary,
                  fontSize: 14,
                ),
              ),
              icon: const Icon(
                Icons.keyboard_arrow_down_rounded,
                color: AppTheme.textSecondary,
              ),
              items: [
                const DropdownMenuItem<String?>(
                  value: null,
                  child: Text('— Chưa chọn —'),
                ),
                ...phuongXaList.map(
                  (p) => DropdownMenuItem<String?>(
                    value: p.maPX,
                    child: Text(
                      p.tenPhuongXa,
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 14,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ],
              onChanged: onChanged,
            ),
          ),
        ),
      ],
    );
  }
}

class _DateField extends StatelessWidget {
  final String label;
  final DateTime? value;
  final VoidCallback onTap;
  final VoidCallback? onClear;

  const _DateField({
    required this.label,
    required this.value,
    required this.onTap,
    this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: AppTheme.surfaceBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.dividerColor),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.calendar_today_outlined,
                  size: 18,
                  color: AppTheme.textSecondary,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    value != null ? _fmt(value!) : 'Chọn ngày',
                    style: GoogleFonts.inter(
                      color: value != null
                          ? AppTheme.textPrimary
                          : AppTheme.textTertiary,
                      fontSize: 14,
                    ),
                  ),
                ),
                if (onClear != null)
                  InkWell(
                    onTap: onClear,
                    customBorder: const CircleBorder(),
                    child: const Padding(
                      padding: EdgeInsets.all(4),
                      child: Icon(
                        Icons.close_rounded,
                        size: 16,
                        color: AppTheme.textTertiary,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  String _fmt(DateTime d) =>
      '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
}
