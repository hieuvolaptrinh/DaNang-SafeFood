import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/viewmodel/document_upload/document_upload_cubit.dart';
import 'package:mobile_ui/viewmodel/document_upload/document_upload_state.dart';

/// Trang bổ sung / cập nhật 4 loại giấy tờ cho 1 cơ sở kinh doanh đã có.
/// Dùng khi user vào từ Biz Detail bấm vào ô giấy tờ thiếu/hết hạn.
class DocumentUploadPage extends StatelessWidget {
  /// Mã cơ sở chọn sẵn (dùng khi mở từ trang chi tiết cơ sở)
  final String? preSelectMaCoSo;

  /// Mã loại giấy tờ chọn sẵn để mở picker ngay (deep link từ Biz Detail)
  final String? focusLoaiGiayTo;

  const DocumentUploadPage({
    super.key,
    this.preSelectMaCoSo,
    this.focusLoaiGiayTo,
  });

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<DocumentUploadCubit, DocumentUploadState>(
      listenWhen: (prev, curr) =>
          prev.status != curr.status ||
          prev.errorMessage != curr.errorMessage ||
          prev.successMessage != curr.successMessage,
      listener: (context, state) {
        if (state.status == DocumentUploadStatus.success &&
            state.successMessage != null) {
          _snack(context, state.successMessage!, isError: false);
          Future.delayed(const Duration(milliseconds: 700), () {
            if (context.mounted) Navigator.pop(context, true);
          });
        }
        if (state.errorMessage != null && state.errorMessage!.isNotEmpty) {
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
              'Bổ sung giấy tờ',
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          body: _buildBody(context, state),
        );
      },
    );
  }

  Widget _buildBody(BuildContext context, DocumentUploadState state) {
    if (state.status == DocumentUploadStatus.loadingBusinesses) {
      return const Center(
        child: CircularProgressIndicator(color: AppTheme.primary),
      );
    }
    if (state.businesses.isEmpty &&
        state.status != DocumentUploadStatus.loadingBusinesses) {
      return _EmptyState(
        onRetry: () => context.read<DocumentUploadCubit>().loadInitial(),
      );
    }

    final cubit = context.read<DocumentUploadCubit>();

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _InfoBanner(filledCount: state.filledCount),
          const SizedBox(height: 16),
          _BusinessSelector(
            businesses: state.businesses,
            selectedMaCoSo: state.selectedMaCoSo,
            onChanged: (id) => cubit.selectCoSo(id),
          ),
          const SizedBox(height: 20),
          Text(
            'Giấy tờ cần có (${state.filledCount}/${GiayToType.all.length})',
            style: GoogleFonts.inter(
              color: AppTheme.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Bạn có thể nộp đủ 4 loại hoặc bổ sung sau cho từng loại.',
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 12),

          ...GiayToType.all.map((type) {
            final slot = state.docs[type.code]!;
            return _DocumentSlotCard(
              slot: slot,
              autoFocus: focusLoaiGiayTo == type.code,
              onPickImage: () => _pickFromCamera(context, type.code),
              onPickGallery: () => _pickFromGallery(context, type.code),
              onPickFile: () => _pickFromFiles(context, type.code),
              onRemove: () => cubit.removePickedFile(type.code),
              onPickIssueDate: () => _pickDate(
                context,
                initial: slot.ngayCap,
                onPick: (d) => cubit.setNgayCap(type.code, d),
              ),
              onPickExpireDate: () => _pickDate(
                context,
                initial: slot.ngayHetHan,
                onPick: (d) => cubit.setNgayHetHan(type.code, d),
              ),
            );
          }),

          const SizedBox(height: 24),
          if (state.status == DocumentUploadStatus.submitting)
            _SubmitProgress(
              done: state.submittedCount,
              total: state.totalToSubmit,
            )
          else
            AppButton(
              text: state.pendingSubmitCount == 0
                  ? 'Chưa có file để nộp'
                  : 'Gửi ${state.pendingSubmitCount} giấy tờ',
              icon: Icons.send_rounded,
              isLoading: state.status == DocumentUploadStatus.submitting,
              onPressed:
                  state.pendingSubmitCount == 0 || state.selectedMaCoSo == null
                  ? null
                  : () => cubit.submit(),
            ),
          const SizedBox(height: 8),
          Center(
            child: Text(
              'Mỗi loại giấy tờ chưa có sẽ được hiển thị "Bổ sung sau".',
              style: GoogleFonts.inter(
                color: AppTheme.textTertiary,
                fontSize: 11,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  /// ========= Helpers =========

  Future<void> _pickFromCamera(BuildContext context, String code) async {
    try {
      final picker = ImagePicker();
      final x = await picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
      );
      if (x != null && context.mounted) {
        context.read<DocumentUploadCubit>().pickFile(code, x);
      }
    } catch (e) {
      if (context.mounted) {
        _snack(context, 'Không mở được camera', isError: true);
      }
    }
  }

  Future<void> _pickFromGallery(BuildContext context, String code) async {
    try {
      final picker = ImagePicker();
      final x = await picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
      );
      if (x != null && context.mounted) {
        context.read<DocumentUploadCubit>().pickFile(code, x);
      }
    } catch (e) {
      if (context.mounted) {
        _snack(context, 'Không truy cập được thư viện', isError: true);
      }
    }
  }

  Future<void> _pickFromFiles(BuildContext context, String code) async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      );
      if (result != null && result.files.single.path != null) {
        if (!context.mounted) return;
        context.read<DocumentUploadCubit>().pickFile(
          code,
          XFile(result.files.single.path!),
        );
      }
    } catch (e) {
      if (context.mounted) {
        _snack(context, 'Không chọn được file', isError: true);
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
      initialDate: initial ?? now,
      firstDate: DateTime(now.year - 20),
      lastDate: DateTime(now.year + 20),
    );
    if (picked != null) {
      onPick(picked);
    }
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

class _InfoBanner extends StatelessWidget {
  final int filledCount;
  const _InfoBanner({required this.filledCount});

  @override
  Widget build(BuildContext context) {
    final isFull = filledCount == GiayToType.all.length;
    final color = isFull ? AppTheme.success : AppTheme.primary;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(
            isFull ? Icons.verified_rounded : Icons.info_outline_rounded,
            color: color,
            size: 22,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              isFull
                  ? 'Đã đủ 4 loại giấy tờ — sẵn sàng được duyệt.'
                  : 'Cần đủ 4 loại giấy tờ để được phép kinh doanh. '
                        'Bạn có thể nộp dần.',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 12,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BusinessSelector extends StatelessWidget {
  final List<MyBusinessModel> businesses;
  final String? selectedMaCoSo;
  final ValueChanged<String> onChanged;

  const _BusinessSelector({
    required this.businesses,
    required this.selectedMaCoSo,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final selected = businesses.firstWhere(
      (b) => b.maCoSo == selectedMaCoSo,
      orElse: () => businesses.first,
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Cơ sở kinh doanh',
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
            child: DropdownButton<String>(
              value: selected.maCoSo,
              isExpanded: true,
              icon: const Icon(
                Icons.keyboard_arrow_down_rounded,
                color: AppTheme.textSecondary,
              ),
              items: businesses
                  .map(
                    (b) => DropdownMenuItem(
                      value: b.maCoSo,
                      child: Text(
                        b.tenCoSo,
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 14,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  )
                  .toList(),
              onChanged: (v) {
                if (v != null) onChanged(v);
              },
            ),
          ),
        ),
      ],
    );
  }
}

class _DocumentSlotCard extends StatelessWidget {
  final DocumentSlot slot;
  final bool autoFocus;
  final VoidCallback onPickImage;
  final VoidCallback onPickGallery;
  final VoidCallback onPickFile;
  final VoidCallback onRemove;
  final VoidCallback onPickIssueDate;
  final VoidCallback onPickExpireDate;

  const _DocumentSlotCard({
    required this.slot,
    required this.autoFocus,
    required this.onPickImage,
    required this.onPickGallery,
    required this.onPickFile,
    required this.onRemove,
    required this.onPickIssueDate,
    required this.onPickExpireDate,
  });

  Color get _accentColor {
    if (slot.hasPicked) return AppTheme.primary;
    if (slot.hasExisting && !slot.isExpired) return AppTheme.success;
    if (slot.hasExisting && slot.isExpired) return AppTheme.error;
    return AppTheme.textTertiary;
  }

  String get _statusLabel {
    if (slot.hasPicked) return 'Đã chọn — chờ gửi';
    if (slot.hasExisting && slot.isExpired) return 'Hết hạn — cần nộp lại';
    if (slot.hasExisting) return slot.existingTrangThai ?? 'Đã có';
    return 'Bổ sung sau';
  }

  @override
  Widget build(BuildContext context) {
    final color = _accentColor;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.description_outlined, color: color, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      slot.label,
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      _statusLabel,
                      style: GoogleFonts.inter(
                        color: color,
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              if (slot.isUploading)
                const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppTheme.primary,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),

          // File preview / picker
          if (slot.hasPicked)
            _PickedFilePreview(file: slot.pickedFile!, onRemove: onRemove)
          else if (slot.hasExisting && slot.existingUrl != null)
            _ExistingFilePreview(
              url: slot.existingUrl!,
              isExpired: slot.isExpired,
            )
          else
            _UploadButtons(
              onCamera: onPickImage,
              onGallery: onPickGallery,
              onFile: onPickFile,
            ),

          // Date fields chỉ hiện khi đã chọn file mới
          if (slot.hasPicked) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _DateField(
                    label: 'Ngày cấp',
                    value: slot.ngayCap,
                    onTap: onPickIssueDate,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _DateField(
                    label: 'Hết hạn',
                    value: slot.ngayHetHan,
                    onTap: onPickExpireDate,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _UploadButtons extends StatelessWidget {
  final VoidCallback onCamera;
  final VoidCallback onGallery;
  final VoidCallback onFile;

  const _UploadButtons({
    required this.onCamera,
    required this.onGallery,
    required this.onFile,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _UploadChip(
            icon: Icons.camera_alt_outlined,
            label: 'Chụp',
            onTap: onCamera,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _UploadChip(
            icon: Icons.image_outlined,
            label: 'Thư viện',
            onTap: onGallery,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _UploadChip(
            icon: Icons.attach_file_rounded,
            label: 'Tệp',
            onTap: onFile,
          ),
        ),
      ],
    );
  }
}

class _UploadChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _UploadChip({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppTheme.primary.withValues(alpha: 0.06),
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border.all(color: AppTheme.primary.withValues(alpha: 0.18)),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            children: [
              Icon(icon, color: AppTheme.primary, size: 20),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.inter(
                  color: AppTheme.primary,
                  fontSize: 11,
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

class _PickedFilePreview extends StatelessWidget {
  final XFile file;
  final VoidCallback onRemove;

  const _PickedFilePreview({required this.file, required this.onRemove});

  bool get _isImage {
    final ext = file.path.toLowerCase();
    return ext.endsWith('.jpg') ||
        ext.endsWith('.jpeg') ||
        ext.endsWith('.png') ||
        ext.endsWith('.webp') ||
        ext.endsWith('.bmp') ||
        ext.endsWith('.gif');
  }

  @override
  Widget build(BuildContext context) {
    final fileName = file.path.split(Platform.pathSeparator).last;
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppTheme.surfaceBg,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              width: 56,
              height: 56,
              child: _isImage && !kIsWeb
                  ? Image.file(File(file.path), fit: BoxFit.cover)
                  : Container(
                      color: AppTheme.primary.withValues(alpha: 0.08),
                      child: const Icon(
                        Icons.picture_as_pdf_rounded,
                        color: AppTheme.primary,
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fileName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Sẵn sàng tải lên',
                  style: GoogleFonts.inter(
                    color: AppTheme.success,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close_rounded, size: 18),
            color: AppTheme.error,
            onPressed: onRemove,
          ),
        ],
      ),
    );
  }
}

class _ExistingFilePreview extends StatelessWidget {
  final String url;
  final bool isExpired;

  const _ExistingFilePreview({required this.url, required this.isExpired});

  @override
  Widget build(BuildContext context) {
    final color = isExpired ? AppTheme.error : AppTheme.success;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(
            isExpired
                ? Icons.warning_amber_rounded
                : Icons.check_circle_rounded,
            color: color,
            size: 18,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              isExpired
                  ? 'Hồ sơ hiện tại đã hết hạn — chọn file mới để gia hạn'
                  : 'Đã có hồ sơ trong hệ thống',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DateField extends StatelessWidget {
  final String label;
  final DateTime? value;
  final VoidCallback onTap;

  const _DateField({
    required this.label,
    required this.value,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: AppTheme.surfaceBg,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppTheme.dividerColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 11,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(
                  Icons.calendar_today_outlined,
                  size: 14,
                  color: AppTheme.textTertiary,
                ),
                const SizedBox(width: 6),
                Text(
                  value != null ? _fmt(value!) : 'Chọn ngày',
                  style: GoogleFonts.inter(
                    color: value != null
                        ? AppTheme.textPrimary
                        : AppTheme.textTertiary,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _fmt(DateTime d) =>
      '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
}

class _SubmitProgress extends StatelessWidget {
  final int done;
  final int total;
  const _SubmitProgress({required this.done, required this.total});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.primary.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppTheme.primary,
                ),
              ),
              const SizedBox(width: 10),
              Text(
                'Đang gửi $done/$total giấy tờ...',
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: total == 0 ? 0 : done / total,
              minHeight: 5,
              backgroundColor: AppTheme.dividerColor,
              valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final VoidCallback onRetry;
  const _EmptyState({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.business_outlined,
              size: 64,
              color: AppTheme.textTertiary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 12),
            Text(
              'Chưa có cơ sở kinh doanh',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Bạn cần tạo cơ sở kinh doanh trước khi nộp hồ sơ.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 16),
            TextButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }
}
