import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_state.dart';
import 'package:permission_handler/permission_handler.dart';

class ComplaintFormPage extends StatefulWidget {
  const ComplaintFormPage({super.key});

  @override
  State<ComplaintFormPage> createState() => _ComplaintFormPageState();
}

class _ComplaintFormPageState extends State<ComplaintFormPage> {
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _businessCtrl = TextEditingController();
  String? _selectedTypeId;
  final List<XFile> _pickedFiles = [];
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _locationCtrl.dispose();
    _businessCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_titleCtrl.text.trim().isEmpty || _descCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập đủ tiêu đề và mô tả')),
      );
      return;
    }

    final typeId = _selectedTypeId;
    if (typeId == null || typeId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn loại phản ánh')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    final result = await context.read<ComplaintCubit>().submitComplaint(
      request: ComplaintCreateRequest(
        title: _titleCtrl.text.trim(),
        content: _descCtrl.text.trim(),
        typeId: typeId,
        businessId: _businessCtrl.text.trim().isEmpty
            ? null
            : _businessCtrl.text.trim(),
        location: _locationCtrl.text.trim().isEmpty
            ? null
            : _locationCtrl.text.trim(),
      ),
      filePaths: _pickedFiles.map((e) => e.path).toList(),
    );
    setState(() => _isSubmitting = false);

    if (mounted && result != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã gửi phản ánh thành công!')),
      );
      Navigator.pop(context);
    } else if (mounted && result == null) {
      final message =
          context.read<ComplaintCubit>().state.errorMessage ??
          'Gửi phản ánh thất bại';
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  Future<void> _pickGalleryImages() async {
    final isGranted = await _requestMediaPermission();
    if (!isGranted) return;

    final picker = ImagePicker();
    final images = await picker.pickMultiImage(imageQuality: 85);
    if (images.isNotEmpty) {
      setState(() {
        _pickedFiles.addAll(images);
      });
    }
  }

  Future<void> _pickCameraImage() async {
    final isGranted = await _requestMediaPermission(requireCamera: true);
    if (!isGranted) return;

    final picker = ImagePicker();
    final image = await picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 85,
    );
    if (image != null) {
      setState(() => _pickedFiles.add(image));
    }
  }

  Future<bool> _requestMediaPermission({bool requireCamera = false}) async {
    final permissions = <Permission>[
      Permission.photos,
      Permission.storage,
      if (requireCamera) Permission.camera,
    ];

    final result = await permissions.request();
    final granted =
        result.values.any((status) => status.isGranted) ||
        result.values.any((status) => status.isLimited);

    if (!granted && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cần quyền truy cập ảnh để tải lên')),
      );
    }

    return granted;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Tạo phản ánh',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: BlocBuilder<ComplaintCubit, ComplaintState>(
        builder: (context, state) {
          final types = state.types;
          _selectedTypeId ??= types.isNotEmpty ? types.first.id : null;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppTextField(
                  label: 'Tiêu đề',
                  hint: 'Nhập tiêu đề phản ánh',
                  controller: _titleCtrl,
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Mô tả chi tiết',
                  hint: 'Mô tả vấn đề bạn phát hiện...',
                  controller: _descCtrl,
                  maxLines: 4,
                  keyboardType: TextInputType.multiline,
                ),
                const SizedBox(height: 16),
                Text(
                  'Loại phản ánh',
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.dividerColor),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedTypeId,
                      isExpanded: true,
                      dropdownColor: Colors.white,
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 15,
                      ),
                      icon: const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: AppTheme.textSecondary,
                      ),
                      items: types
                          .map(
                            (t) => DropdownMenuItem(
                              value: t.id,
                              child: Text(t.name),
                            ),
                          )
                          .toList(),
                      onChanged: (v) {
                        if (v != null) setState(() => _selectedTypeId = v);
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Địa điểm',
                  hint: 'Nhập địa chỉ hoặc mô tả địa điểm',
                  controller: _locationCtrl,
                  prefixIcon: const Icon(
                    Icons.location_on_outlined,
                    color: AppTheme.textSecondary,
                    size: 20,
                  ),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Mã cơ sở (nếu biết)',
                  hint: 'Ví dụ: CS001',
                  controller: _businessCtrl,
                  prefixIcon: const Icon(
                    Icons.store_outlined,
                    color: AppTheme.textSecondary,
                    size: 20,
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Hình ảnh đính kèm',
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    ..._pickedFiles.map(
                      (file) => Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.file(
                              File(file.path),
                              width: 86,
                              height: 86,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Positioned(
                            top: 4,
                            right: 4,
                            child: GestureDetector(
                              onTap: () =>
                                  setState(() => _pickedFiles.remove(file)),
                              child: Container(
                                padding: const EdgeInsets.all(2),
                                decoration: const BoxDecoration(
                                  color: Color(0xFFEF5350),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.close,
                                  size: 14,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    _ActionTile(
                      icon: Icons.photo_library_outlined,
                      label: 'Thư viện',
                      onTap: _pickGalleryImages,
                    ),
                    _ActionTile(
                      icon: Icons.camera_alt_outlined,
                      label: 'Chụp ảnh',
                      onTap: _pickCameraImage,
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                AppButton(
                  text: 'Gửi phản ánh',
                  isLoading: _isSubmitting,
                  onPressed: _submit,
                  icon: Icons.send_rounded,
                ),
                const SizedBox(height: 40),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 86,
        height: 86,
        decoration: BoxDecoration(
          color: AppTheme.primary.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.primary.withValues(alpha: 0.3)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: AppTheme.primary, size: 24),
            const SizedBox(height: 6),
            Text(
              label,
              style: GoogleFonts.inter(
                color: AppTheme.primary,
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
