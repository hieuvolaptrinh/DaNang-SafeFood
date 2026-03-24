import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';

class BusinessRegistrationPage extends StatefulWidget {
  const BusinessRegistrationPage({super.key});

  @override
  State<BusinessRegistrationPage> createState() =>
      _BusinessRegistrationPageState();
}

class _BusinessRegistrationPageState extends State<BusinessRegistrationPage> {
  final _bizNameCtrl = TextEditingController();
  final _ownerCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  String _selectedType = 'Nhà hàng';
  final List<String> _uploadedDocs = [];
  bool _isSubmitting = false;

  static const _bizTypes = [
    'Nhà hàng',
    'Quán ăn',
    'Quán cà phê',
    'Cửa hàng thực phẩm',
    'Sản xuất thực phẩm',
    'Chế biến thực phẩm',
    'Khác',
  ];

  @override
  void dispose() {
    _bizNameCtrl.dispose();
    _ownerCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    super.dispose();
  }

  void _pickDocument() {
    setState(() {
      _uploadedDocs.add('giay_phep_${_uploadedDocs.length + 1}.pdf');
    });
  }

  Future<void> _submit() async {
    if (_bizNameCtrl.text.trim().isEmpty ||
        _ownerCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng điền đầy đủ thông tin')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _isSubmitting = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đăng ký thành công! Chờ phê duyệt.')),
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
          'Đăng ký kinh doanh',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
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
                    color: AppTheme.primary.withValues(alpha: 0.15)),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline_rounded,
                      color: AppTheme.primary, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Điền đầy đủ thông tin để đăng ký kinh doanh thực phẩm.',
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

            AppTextField(
              label: 'Tên cơ sở kinh doanh',
              hint: 'Nhập tên cơ sở',
              controller: _bizNameCtrl,
              prefixIcon: const Icon(Icons.store_outlined,
                  color: AppTheme.textSecondary, size: 20),
            ),
            const SizedBox(height: 16),

            AppTextField(
              label: 'Tên chủ sở hữu',
              hint: 'Nhập họ tên chủ sở hữu',
              controller: _ownerCtrl,
              prefixIcon: const Icon(Icons.person_outline_rounded,
                  color: AppTheme.textSecondary, size: 20),
            ),
            const SizedBox(height: 16),

            AppTextField(
              label: 'Số điện thoại',
              hint: 'Nhập số điện thoại liên hệ',
              controller: _phoneCtrl,
              keyboardType: TextInputType.phone,
              prefixIcon: const Icon(Icons.phone_outlined,
                  color: AppTheme.textSecondary, size: 20),
            ),
            const SizedBox(height: 16),

            AppTextField(
              label: 'Địa chỉ',
              hint: 'Nhập địa chỉ kinh doanh',
              controller: _addressCtrl,
              prefixIcon: const Icon(Icons.location_on_outlined,
                  color: AppTheme.textSecondary, size: 20),
            ),
            const SizedBox(height: 16),

            // Business type dropdown
            Text(
              'Loại hình kinh doanh',
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
                  dropdownColor: AppTheme.cardColor,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 15,
                  ),
                  icon: const Icon(Icons.keyboard_arrow_down_rounded,
                      color: AppTheme.textSecondary),
                  items: _bizTypes.map((t) {
                    return DropdownMenuItem(value: t, child: Text(t));
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _selectedType = v);
                  },
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Upload documents
            Text(
              'Giấy tờ liên quan',
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
                ..._uploadedDocs.map((doc) => Stack(
                      children: [
                        Container(
                          width: 100,
                          height: 80,
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceBg,
                            borderRadius: BorderRadius.circular(12),
                            border:
                                Border.all(color: AppTheme.dividerColor),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.description_outlined,
                                  color: AppTheme.textSecondary, size: 24),
                              const SizedBox(height: 4),
                              Text(
                                doc,
                                style: GoogleFonts.inter(
                                    color: AppTheme.textSecondary,
                                    fontSize: 9),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        Positioned(
                          top: 4,
                          right: 4,
                          child: GestureDetector(
                            onTap: () =>
                                setState(() => _uploadedDocs.remove(doc)),
                            child: Container(
                              padding: const EdgeInsets.all(2),
                              decoration: const BoxDecoration(
                                color: Color(0xFFEF5350),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.close,
                                  size: 14, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    )),
                GestureDetector(
                  onTap: _pickDocument,
                  child: Container(
                    width: 100,
                    height: 80,
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: AppTheme.primary.withValues(alpha: 0.25)),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.upload_file_rounded,
                            color: AppTheme.primary, size: 24),
                        const SizedBox(height: 4),
                        Text(
                          'Tải lên',
                          style: GoogleFonts.inter(
                              color: AppTheme.primary, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            AppButton(
              text: 'Nộp đơn đăng ký',
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
