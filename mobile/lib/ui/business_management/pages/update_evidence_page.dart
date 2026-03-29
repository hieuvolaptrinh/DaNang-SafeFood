import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';

class UpdateEvidencePage extends StatefulWidget {
  final String title;
  final bool isExpired; // Cờ mô phỏng Exception E1

  const UpdateEvidencePage({
    super.key,
    required this.title,
    this.isExpired = false,
  });

  @override
  State<UpdateEvidencePage> createState() => _UpdateEvidencePageState();
}

class _UpdateEvidencePageState extends State<UpdateEvidencePage> {
  final _descCtrl = TextEditingController();
  final List<String> _attachedMedia = []; // Danh sách file mô phỏng
  bool _isSubmitting = false;

  @override
  void dispose() {
    _descCtrl.dispose();
    super.dispose();
  }

  void _addMedia(String type) {
    if (widget.isExpired) return; // Chặn nếu quá hạn

    setState(() {
      if (type == 'image') {
        _attachedMedia.add('minh_chung_anh_${_attachedMedia.length + 1}.jpg');
      } else {
        _attachedMedia.add('minh_chung_video_${_attachedMedia.length + 1}.mp4');
      }
    });
  }

  Future<void> _submitEvidence() async {
    // E1: Bị chặn quá hạn
    if (widget.isExpired) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFEF5350),
          content: Text(
              'Đã quá hạn nộp minh chứng, vui lòng liên hệ trực tiếp cơ quan quản lý.'),
        ),
      );
      return;
    }

    // E2: Không có file đính kèm
    if (_attachedMedia.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFEF5350),
          content: Text('Bắt buộc phải tải lên hình ảnh hoặc tài liệu minh chứng.'),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _isSubmitting = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.success,
          content: Text('Đã cập nhật minh chứng thành công! Đang chờ duyệt.'),
        ),
      );
      Navigator.pop(context, true); // Pop out và báo hiệu cập nhật thành công (true)
    }
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
          'Báo cáo khắc phục',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cảnh báo E1
            if (widget.isExpired)
              Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFEF5350).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                      color: const Color(0xFFEF5350).withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.access_time_filled_rounded,
                        color: Color(0xFFEF5350)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Đã quá hạn nộp minh chứng. Vui lòng liên hệ trực tiếp đến Đội Quản lý An toàn thực phẩm.',
                        style: GoogleFonts.inter(
                          color: const Color(0xFFEF5350),
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

            // Target Info
            Text(
              'Xử lý vi phạm đối với:',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              widget.title.isNotEmpty ? widget.title : 'Vi phạm chưa rõ',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),

            // Description
            AppTextField(
              label: 'Mô tả quá trình khắc phục',
              hint: 'Nhập chi tiết các bước đã xử lý (VD: Đã dọn dẹp vệ sinh bếp, lắp mới kệ để thực phẩm,...)',
              controller: _descCtrl,
              maxLines: 4,
              keyboardType: TextInputType.multiline,
              enabled: !widget.isExpired,
            ),
            const SizedBox(height: 24),

            // Media attachment
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Hình ảnh & Video minh chứng (*)',
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  'Tối đa 5 file',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                ..._attachedMedia.map((file) => _MediaThumbnail(
                      fileName: file,
                      onRemove: widget.isExpired
                          ? null
                          : () => setState(() => _attachedMedia.remove(file)),
                    )),
                // Upload buttons
                if (_attachedMedia.length < 5 && !widget.isExpired) ...[
                  GestureDetector(
                    onTap: () => _addMedia('image'),
                    child: _UploadBox(
                      icon: Icons.add_a_photo_outlined,
                      label: 'Thêm ảnh',
                    ),
                  ),
                  GestureDetector(
                    onTap: () => _addMedia('video'),
                    child: _UploadBox(
                      icon: Icons.video_call_outlined,
                      label: 'Thêm video',
                    ),
                  ),
                ],
              ],
            ),

            const SizedBox(height: 48),

            // Submit Button
            AppButton(
              text: 'Gửi minh chứng',
              icon: Icons.check_circle_outline_rounded,
              isLoading: _isSubmitting,
              onPressed: widget.isExpired ? () => _submitEvidence() : _submitEvidence,
              // Background xám nếu quá hạn
              backgroundColor: widget.isExpired ? AppTheme.dividerColor : AppTheme.success,
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _MediaThumbnail extends StatelessWidget {
  final String fileName;
  final VoidCallback? onRemove;

  const _MediaThumbnail({required this.fileName, this.onRemove});

  @override
  Widget build(BuildContext context) {
    final isVideo = fileName.endsWith('.mp4');

    return Stack(
      children: [
        Container(
          width: 86,
          height: 86,
          decoration: BoxDecoration(
            color: AppTheme.surfaceBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.dividerColor),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                isVideo ? Icons.play_circle_outline_rounded : Icons.image_outlined,
                color: isVideo ? AppTheme.accent : AppTheme.primary,
                size: 28,
              ),
              const SizedBox(height: 6),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: Text(
                  fileName,
                  style: GoogleFonts.inter(
                      color: AppTheme.textSecondary, fontSize: 8),
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
        if (onRemove != null)
          Positioned(
            top: 4,
            right: 4,
            child: GestureDetector(
              onTap: onRemove,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  color: Color(0xFFEF5350),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.close, size: 12, color: Colors.white),
              ),
            ),
          ),
      ],
    );
  }
}

class _UploadBox extends StatelessWidget {
  final IconData icon;
  final String label;

  const _UploadBox({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 86,
      height: 86,
      decoration: BoxDecoration(
        color: AppTheme.primary.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.primary.withValues(alpha: 0.3),
          style: BorderStyle.solid,
        ),
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
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
