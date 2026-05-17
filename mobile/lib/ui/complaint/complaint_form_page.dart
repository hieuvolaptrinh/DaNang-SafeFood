import 'dart:io';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_state.dart';
import 'package:permission_handler/permission_handler.dart';

import 'package:mobile_ui/core/utils/dio_client.dart';
import 'package:mobile_ui/data/remote/datasource/business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/business_repository.dart';
import 'package:mobile_ui/data/remote/model/business_models.dart';

enum LocationMode { business, manual }

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
  String? _selectedBusinessId;
  final List<XFile> _pickedFiles = [];
  bool _isSubmitting = false;
  LocationMode _locationMode = LocationMode.business;

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
      _showSnackBar('Vui lòng nhập đủ tiêu đề và mô tả', isError: true);
      return;
    }

    final typeId = _selectedTypeId;
    if (typeId == null || typeId.isEmpty) {
      _showSnackBar('Vui lòng chọn loại phản ánh', isError: true);
      return;
    }

    if (_locationMode == LocationMode.business && _selectedBusinessId == null) {
      _showSnackBar('Vui lòng chọn cơ sở kinh doanh', isError: true);
      return;
    }

    if (_locationMode == LocationMode.manual &&
        _locationCtrl.text.trim().isEmpty) {
      _showSnackBar('Vui lòng nhập địa điểm', isError: true);
      return;
    }

    setState(() => _isSubmitting = true);
    final result = await context.read<ComplaintCubit>().submitComplaint(
      request: ComplaintCreateRequest(
        title: _titleCtrl.text.trim(),
        content: _descCtrl.text.trim(),
        typeId: typeId,
        businessId: _locationMode == LocationMode.business
            ? _selectedBusinessId
            : null,
        location: _locationMode == LocationMode.manual
            ? _locationCtrl.text.trim()
            : null,
      ),
      filePaths: _pickedFiles.map((e) => e.path).toList(),
    );
    setState(() => _isSubmitting = false);

    if (mounted && result != null) {
      _showSnackBar('Đã gửi phản ánh thành công!');
      Navigator.pop(context);
    } else if (mounted && result == null) {
      final message =
          context.read<ComplaintCubit>().state.errorMessage ??
          'Gửi phản ánh thất bại';
      _showSnackBar(message, isError: true);
    }
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError ? Icons.error_outline : Icons.check_circle_outline,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(message, style: GoogleFonts.inter(fontSize: 14)),
            ),
          ],
        ),
        backgroundColor: isError ? AppTheme.error : AppTheme.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  Future<void> _pickGalleryImages() async {
    if (!kIsWeb) {
      final isGranted = await _requestMediaPermission();
      if (!isGranted) return;
    }

    final picker = ImagePicker();
    final images = await picker.pickMultiImage(imageQuality: 85);
    if (images.isNotEmpty) {
      setState(() => _pickedFiles.addAll(images));
    }
  }

  Future<void> _pickCameraImage() async {
    if (!kIsWeb) {
      final isGranted = await _requestMediaPermission(requireCamera: true);
      if (!isGranted) return;
    }

    final picker = ImagePicker();
    final image = await picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 85,
    );
    if (image != null) {
      setState(() => _pickedFiles.add(image));
    }
  }

  Future<void> _pickVideo() async {
    if (!kIsWeb) {
      final isGranted = await _requestMediaPermission(requireCamera: true);
      if (!isGranted) return;
    }

    final picker = ImagePicker();
    final video = await picker.pickVideo(
      source: ImageSource.gallery,
      maxDuration: const Duration(minutes: 2),
    );
    if (video != null) {
      setState(() => _pickedFiles.add(video));
    }
  }

  Future<void> _pickFiles() async {
    final result = await FilePicker.pickFiles(
      allowMultiple: true,
      type: FileType.custom,
      allowedExtensions: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'bmp',
        'mp4',
        'mov',
        'avi',
        'mkv',
        'pdf',
        'doc',
        'docx',
      ],
    );

    if (result != null && result.files.isNotEmpty) {
      setState(() {
        for (final file in result.files) {
          if (file.path != null) {
            _pickedFiles.add(XFile(file.path!));
          }
        }
      });
    }
  }

  Future<bool> _requestMediaPermission({bool requireCamera = false}) async {
    if (kIsWeb) return true;
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
      _showSnackBar('Cần quyền truy cập để tải lên tệp', isError: true);
    }

    return granted;
  }

  Future<void> _showBusinessSearchSheet(BuildContext context) async {
    final result = await showModalBottomSheet<BusinessSearchModel>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const _BusinessSearchSheet(),
    );

    if (result != null) {
      setState(() {
        _selectedBusinessId = result.maCoSo;
        _businessCtrl.text = result.tenCoSo;
      });
    }
  }

  String _getFileExtension(String path) {
    return path.split('.').last.toLowerCase();
  }

  bool _isImageFile(String path) {
    final ext = _getFileExtension(path);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].contains(ext);
  }

  bool _isVideoFile(String path) {
    final ext = _getFileExtension(path);
    return ['mp4', 'mov', 'avi', 'mkv', 'wmv'].contains(ext);
  }

  IconData _getFileIcon(String path) {
    if (_isImageFile(path)) return Icons.image_outlined;
    if (_isVideoFile(path)) return Icons.videocam_outlined;
    final ext = _getFileExtension(path);
    if (['pdf'].contains(ext)) return Icons.picture_as_pdf_outlined;
    if (['doc', 'docx'].contains(ext)) return Icons.description_outlined;
    return Icons.insert_drive_file_outlined;
  }

  String _getFileName(String path) {
    final name = path.split(Platform.pathSeparator).last;
    if (name.length > 20) {
      return '${name.substring(0, 15)}...${name.split('.').last}';
    }
    return name;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.scaffoldBg,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Tạo phản ánh',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
        actions: [
          if (_pickedFiles.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Chip(
                label: Text(
                  '${_pickedFiles.length} tệp',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: AppTheme.primary,
                  ),
                ),
                backgroundColor: AppTheme.primary.withValues(alpha: 0.1),
                side: BorderSide.none,
                padding: const EdgeInsets.symmetric(horizontal: 4),
              ),
            ),
        ],
      ),
      body: BlocBuilder<ComplaintCubit, ComplaintState>(
        builder: (context, state) {
          final types = state.types;
          _selectedTypeId ??= types.isNotEmpty ? types.first.id : null;

          return SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Section header - Thông tin cơ bản
                _SectionHeader(
                  icon: Icons.edit_note_rounded,
                  title: 'Thông tin cơ bản',
                ),
                const SizedBox(height: 12),
                _buildBasicInfoCard(types),
                const SizedBox(height: 24),

                // Section header - Địa điểm phản ánh
                _SectionHeader(
                  icon: Icons.location_on_rounded,
                  title: 'Địa điểm phản ánh',
                ),
                const SizedBox(height: 12),
                _buildLocationCard(),
                const SizedBox(height: 24),

                // Section header - Tệp đính kèm
                _SectionHeader(
                  icon: Icons.attach_file_rounded,
                  title: 'Tệp đính kèm',
                  subtitle: 'Hình ảnh, video, tài liệu',
                ),
                const SizedBox(height: 12),
                _buildAttachmentCard(),
                const SizedBox(height: 32),

                // Submit button
                AppButton(
                  text: 'Gửi phản ánh',
                  isLoading: _isSubmitting,
                  onPressed: _submit,
                  icon: Icons.send_rounded,
                ),
                const SizedBox(height: 20),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildBasicInfoCard(List<ComplaintType> types) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadow.level1,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppTextField(
            label: 'Tiêu đề',
            hint: 'Nhập tiêu đề phản ánh',
            controller: _titleCtrl,
            prefixIcon: const Icon(
              Icons.title_rounded,
              color: AppTheme.textSecondary,
              size: 20,
            ),
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
                      (t) => DropdownMenuItem(value: t.id, child: Text(t.name)),
                    )
                    .toList(),
                onChanged: (v) {
                  if (v != null) setState(() => _selectedTypeId = v);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadow.level1,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Segmented control for location mode
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: AppTheme.surfaceBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _LocationModeTab(
                    icon: Icons.store_rounded,
                    label: 'Cơ sở kinh doanh',
                    isSelected: _locationMode == LocationMode.business,
                    onTap: () =>
                        setState(() => _locationMode = LocationMode.business),
                  ),
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: _LocationModeTab(
                    icon: Icons.edit_location_alt_rounded,
                    label: 'Nhập địa điểm',
                    isSelected: _locationMode == LocationMode.manual,
                    onTap: () =>
                        setState(() => _locationMode = LocationMode.manual),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Content based on mode
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 250),
            child: _locationMode == LocationMode.business
                ? _buildBusinessSelector()
                : _buildManualLocation(),
          ),
        ],
      ),
    );
  }

  Widget _buildBusinessSelector() {
    return Column(
      key: const ValueKey('business'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Chọn cơ sở kinh doanh bạn muốn phản ánh',
          style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 13),
        ),
        const SizedBox(height: 12),
        GestureDetector(
          onTap: () => _showBusinessSearchSheet(context),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.surfaceBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: _selectedBusinessId != null
                    ? AppTheme.primary.withValues(alpha: 0.4)
                    : AppTheme.dividerColor,
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _selectedBusinessId != null
                        ? AppTheme.primary.withValues(alpha: 0.1)
                        : AppTheme.dividerColor.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    _selectedBusinessId != null
                        ? Icons.store_rounded
                        : Icons.search_rounded,
                    color: _selectedBusinessId != null
                        ? AppTheme.primary
                        : AppTheme.textSecondary,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _selectedBusinessId != null
                            ? _businessCtrl.text
                            : 'Nhấn để tìm và chọn cơ sở',
                        style: GoogleFonts.inter(
                          color: _selectedBusinessId != null
                              ? AppTheme.textPrimary
                              : AppTheme.textSecondary,
                          fontSize: 14,
                          fontWeight: _selectedBusinessId != null
                              ? FontWeight.w600
                              : FontWeight.w400,
                        ),
                      ),
                      if (_selectedBusinessId != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          'Mã: $_selectedBusinessId',
                          style: GoogleFonts.inter(
                            color: AppTheme.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                if (_selectedBusinessId != null)
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedBusinessId = null;
                        _businessCtrl.clear();
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppTheme.error.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close_rounded,
                        size: 16,
                        color: AppTheme.error,
                      ),
                    ),
                  )
                else
                  const Icon(
                    Icons.arrow_forward_ios_rounded,
                    size: 16,
                    color: AppTheme.textSecondary,
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildManualLocation() {
    return Column(
      key: const ValueKey('manual'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Nhập địa chỉ hoặc mô tả vị trí',
          style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 13),
        ),
        const SizedBox(height: 12),
        AppTextField(
          label: '',
          hint: 'Ví dụ: 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
          controller: _locationCtrl,
          maxLines: 2,
          prefixIcon: const Icon(
            Icons.location_on_outlined,
            color: AppTheme.textSecondary,
            size: 20,
          ),
        ),
      ],
    );
  }

  Widget _buildAttachmentCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadow.level1,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Action buttons row
          Row(
            children: [
              _AttachActionChip(
                icon: Icons.photo_library_outlined,
                label: 'Ảnh',
                onTap: _pickGalleryImages,
              ),
              const SizedBox(width: 8),
              _AttachActionChip(
                icon: Icons.camera_alt_outlined,
                label: 'Chụp',
                onTap: _pickCameraImage,
              ),
              const SizedBox(width: 8),
              _AttachActionChip(
                icon: Icons.videocam_outlined,
                label: 'Video',
                onTap: _pickVideo,
              ),
              const SizedBox(width: 8),
              _AttachActionChip(
                icon: Icons.attach_file_rounded,
                label: 'Tệp',
                onTap: _pickFiles,
              ),
            ],
          ),
          if (_pickedFiles.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Divider(color: AppTheme.dividerColor),
            const SizedBox(height: 12),
            Text(
              'Đã chọn ${_pickedFiles.length} tệp',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 10),
            // File grid
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: _pickedFiles.map((file) {
                final isImage = _isImageFile(file.path);
                final isVideo = _isVideoFile(file.path);

                return Stack(
                  children: [
                    Container(
                      width: 92,
                      height: 92,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppTheme.dividerColor,
                          width: 1,
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(11),
                        child: isImage && !kIsWeb
                            ? Image.file(
                                File(file.path),
                                width: 92,
                                height: 92,
                                fit: BoxFit.cover,
                              )
                            : isImage && kIsWeb
                            ? Image.network(
                                file.path,
                                width: 92,
                                height: 92,
                                fit: BoxFit.cover,
                              )
                            : Container(
                                color: AppTheme.surfaceBg,
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      _getFileIcon(file.path),
                                      color: isVideo
                                          ? AppTheme.accent
                                          : AppTheme.primary,
                                      size: 28,
                                    ),
                                    const SizedBox(height: 4),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 4,
                                      ),
                                      child: Text(
                                        _getFileName(file.path),
                                        style: GoogleFonts.inter(
                                          fontSize: 9,
                                          color: AppTheme.textSecondary,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        textAlign: TextAlign.center,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                      ),
                    ),
                    // Video overlay icon
                    if (isVideo && !kIsWeb)
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            color: Colors.black.withValues(alpha: 0.3),
                          ),
                          child: const Icon(
                            Icons.play_circle_outline,
                            color: Colors.white,
                            size: 32,
                          ),
                        ),
                      ),
                    // Remove button
                    Positioned(
                      top: 4,
                      right: 4,
                      child: GestureDetector(
                        onTap: () => setState(() => _pickedFiles.remove(file)),
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppTheme.error,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.2),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.close_rounded,
                            size: 12,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ] else ...[
            const SizedBox(height: 20),
            Center(
              child: Column(
                children: [
                  Icon(
                    Icons.cloud_upload_outlined,
                    size: 40,
                    color: AppTheme.textSecondary.withValues(alpha: 0.5),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Chưa có tệp đính kèm',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Hỗ trợ: ảnh, video, PDF, Word',
                    style: GoogleFonts.inter(
                      color: AppTheme.textTertiary,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
          ],
        ],
      ),
    );
  }
}

// --- Helper Widgets ---

class _SectionHeader extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;

  const _SectionHeader({
    required this.icon,
    required this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppTheme.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: AppTheme.primary, size: 18),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              if (subtitle != null)
                Text(
                  subtitle!,
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _LocationModeTab extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _LocationModeTab({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected ? AppShadow.level1 : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? AppTheme.primary : AppTheme.textSecondary,
            ),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                label,
                style: GoogleFonts.inter(
                  color: isSelected ? AppTheme.primary : AppTheme.textSecondary,
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AttachActionChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _AttachActionChip({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: AppTheme.primary.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, color: AppTheme.primary, size: 20),
              const SizedBox(height: 4),
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
      ),
    );
  }
}

class _BusinessSearchSheet extends StatefulWidget {
  const _BusinessSearchSheet();

  @override
  State<_BusinessSearchSheet> createState() => _BusinessSearchSheetState();
}

class _BusinessSearchSheetState extends State<_BusinessSearchSheet> {
  final _searchCtrl = TextEditingController();
  late BusinessRepository _repository;
  List<BusinessSearchModel> _results = [];
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _repository = BusinessRepository(
      remoteDataSource: BusinessRemoteDataSource(dio: DioClient().dio),
    );
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    final keyword = _searchCtrl.text.trim();
    if (keyword.isEmpty) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _repository.searchBusinesses(
        keyword: keyword,
        size: 50,
      );
      setState(() {
        _results = response.content;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Có lỗi xảy ra khi tìm kiếm.';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppTheme.dividerColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.store_rounded,
                    color: AppTheme.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  'Tìm cơ sở kinh doanh',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: AppTheme.dividerColor),
          // Search bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceBg,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: TextField(
                      controller: _searchCtrl,
                      style: GoogleFonts.inter(fontSize: 14),
                      decoration: InputDecoration(
                        hintText: 'Nhập tên, mã cơ sở...',
                        hintStyle: GoogleFonts.inter(
                          color: AppTheme.textTertiary,
                          fontSize: 14,
                        ),
                        prefixIcon: const Icon(
                          Icons.search,
                          color: AppTheme.textSecondary,
                          size: 20,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          vertical: 14,
                        ),
                      ),
                      onSubmitted: (_) => _search(),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                AppButton(text: 'Tìm', width: 80, onPressed: _search),
              ],
            ),
          ),
          // Results
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppTheme.primary),
                  )
                : _error != null
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          color: AppTheme.error,
                          size: 40,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _error!,
                          style: GoogleFonts.inter(color: AppTheme.error),
                        ),
                      ],
                    ),
                  )
                : _results.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.store_outlined,
                          size: 48,
                          color: AppTheme.textSecondary.withValues(alpha: 0.4),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _searchCtrl.text.isEmpty
                              ? 'Nhập từ khóa để tìm kiếm'
                              : 'Không tìm thấy cơ sở nào',
                          style: GoogleFonts.inter(
                            color: AppTheme.textSecondary,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 8,
                    ),
                    itemCount: _results.length,
                    separatorBuilder: (_, __) =>
                        const Divider(color: AppTheme.dividerColor),
                    itemBuilder: (context, index) {
                      final item = _results[index];
                      return ListTile(
                        contentPadding: const EdgeInsets.symmetric(vertical: 4),
                        leading: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primary.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.store_rounded,
                            color: AppTheme.primary,
                            size: 20,
                          ),
                        ),
                        title: Text(
                          item.tenCoSo,
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                            fontSize: 14,
                          ),
                        ),
                        subtitle: Text(
                          item.tenPhuongXa ?? item.maCoSo,
                          style: GoogleFonts.inter(
                            color: AppTheme.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                        trailing: const Icon(
                          Icons.arrow_forward_ios_rounded,
                          size: 14,
                          color: AppTheme.textSecondary,
                        ),
                        onTap: () => Navigator.pop(context, item),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
