import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';

class ComplaintFormPage extends StatefulWidget {
  const ComplaintFormPage({super.key});

  @override
  State<ComplaintFormPage> createState() => _ComplaintFormPageState();
}

class _ComplaintFormPageState extends State<ComplaintFormPage> {
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  String _selectedType = 'Vệ sinh kém';
  final List<String> _imagePaths = [];
  bool _isSubmitting = false;

  final _violationTypes = [
    'Vệ sinh kém',
    'Thực phẩm hết hạn',
    'Không có giấy phép',
    'Sử dụng chất cấm',
    'Ngộ độc thực phẩm',
    'Khác',
  ];

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _locationCtrl.dispose();
    super.dispose();
  }

  void _pickImage() {
    setState(() {
      _imagePaths.add('image_${_imagePaths.length + 1}.jpg');
    });
  }

  Future<void> _submit() async {
    if (_titleCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập tiêu đề')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _isSubmitting = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã gửi phản ánh thành công!')),
      );
      Navigator.pop(context);
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
          'Tạo phản ánh',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
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

            // Violation type dropdown
            Text(
              'Loại vi phạm',
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
                  value: _selectedType,
                  isExpanded: true,
                  dropdownColor: Colors.white,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 15,
                  ),
                  icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.textSecondary),
                  items: _violationTypes.map((t) {
                    return DropdownMenuItem(value: t, child: Text(t));
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _selectedType = v);
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),

            AppTextField(
              label: 'Địa điểm',
              hint: 'Nhập địa chỉ hoặc chọn trên bản đồ',
              controller: _locationCtrl,
              prefixIcon: const Icon(Icons.location_on_outlined, color: AppTheme.textSecondary, size: 20),
              suffixIcon: GestureDetector(
                onTap: () {
                  _locationCtrl.text = '123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng';
                },
                child: const Icon(Icons.my_location_rounded, color: AppTheme.primary, size: 20),
              ),
            ),
            const SizedBox(height: 20),

            // Image upload area
            Text(
              'Hình ảnh / Video',
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
                ..._imagePaths.map((path) => Stack(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceBg,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.dividerColor),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.image_outlined, color: AppTheme.textSecondary, size: 24),
                              const SizedBox(height: 4),
                              Text(
                                path,
                                style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 9),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        Positioned(
                          top: 4,
                          right: 4,
                          child: GestureDetector(
                            onTap: () => setState(() => _imagePaths.remove(path)),
                            child: Container(
                              padding: const EdgeInsets.all(2),
                              decoration: const BoxDecoration(
                                color: Color(0xFFEF5350),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.close, size: 14, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    )),
                GestureDetector(
                  onTap: _pickImage,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppTheme.primary.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.add_a_photo_outlined, color: AppTheme.primary, size: 24),
                        const SizedBox(height: 4),
                        Text(
                          'Thêm ảnh',
                          style: GoogleFonts.inter(color: AppTheme.primary, fontSize: 10),
                        ),
                      ],
                    ),
                  ),
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
      ),
    );
  }
}
