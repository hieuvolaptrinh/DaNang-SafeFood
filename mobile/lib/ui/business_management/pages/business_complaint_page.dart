import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/app_text_field.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';

class BusinessComplaintPage extends StatefulWidget {
  const BusinessComplaintPage({super.key});

  @override
  State<BusinessComplaintPage> createState() => _BusinessComplaintPageState();
}

class _BusinessComplaintPageState extends State<BusinessComplaintPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    super.dispose();
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
          'Khiếu nại',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
        bottom: TabBar(
          controller: _tabCtrl,
          labelColor: AppTheme.primary,
          unselectedLabelColor: AppTheme.textSecondary,
          indicatorColor: AppTheme.primary,
          labelStyle: GoogleFonts.inter(
              fontSize: 14, fontWeight: FontWeight.w600),
          tabs: const [
            Tab(text: 'Gửi khiếu nại'),
            Tab(text: 'Đã gửi'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabCtrl,
        children: [
          const _ComplaintForm(),
          _ComplaintList(),
        ],
      ),
    );
  }
}

// ──── Form tab ────

class _ComplaintForm extends StatefulWidget {
  const _ComplaintForm();

  @override
  State<_ComplaintForm> createState() => _ComplaintFormState();
}

class _ComplaintFormState extends State<_ComplaintForm> {
  final _reasonCtrl = TextEditingController();
  String _selectedViolation = 'Vi phạm vệ sinh khu chế biến';
  final List<String> _evidence = [];
  bool _isSubmitting = false;

  static const _violations = [
    'Vi phạm vệ sinh khu chế biến',
    'Không có giấy khám sức khỏe nhân viên',
    'Bảo quản thực phẩm không đúng quy định',
    'Không niêm yết giá thực phẩm',
  ];

  @override
  void dispose() {
    _reasonCtrl.dispose();
    super.dispose();
  }

  void _addEvidence() {
    setState(() {
      _evidence.add('bang_chung_${_evidence.length + 1}.jpg');
    });
  }

  Future<void> _submit() async {
    if (_reasonCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập lý do khiếu nại')),
      );
      return;
    }
    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _isSubmitting = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã gửi khiếu nại thành công!')),
      );
      _reasonCtrl.clear();
      setState(() => _evidence.clear());
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Select violation
          Text(
            'Chọn vi phạm cần khiếu nại',
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
                value: _selectedViolation,
                isExpanded: true,
                dropdownColor: AppTheme.cardColor,
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 14,
                ),
                icon: const Icon(Icons.keyboard_arrow_down_rounded,
                    color: AppTheme.textSecondary),
                items: _violations.map((v) {
                  return DropdownMenuItem(value: v, child: Text(v));
                }).toList(),
                onChanged: (v) {
                  if (v != null) setState(() => _selectedViolation = v);
                },
              ),
            ),
          ),
          const SizedBox(height: 16),

          AppTextField(
            label: 'Lý do khiếu nại',
            hint: 'Trình bày lý do khiếu nại của bạn...',
            controller: _reasonCtrl,
            maxLines: 5,
            keyboardType: TextInputType.multiline,
          ),
          const SizedBox(height: 16),

          // Evidence upload
          Text(
            'Bằng chứng đính kèm',
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
              ..._evidence.map((e) => Stack(
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
                            const Icon(Icons.image_outlined,
                                color: AppTheme.textSecondary, size: 24),
                            const SizedBox(height: 4),
                            Text(e,
                                style: GoogleFonts.inter(
                                    color: AppTheme.textSecondary,
                                    fontSize: 8),
                                overflow: TextOverflow.ellipsis),
                          ],
                        ),
                      ),
                      Positioned(
                        top: 4,
                        right: 4,
                        child: GestureDetector(
                          onTap: () =>
                              setState(() => _evidence.remove(e)),
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Color(0xFFEF5350),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.close,
                                size: 12, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  )),
              GestureDetector(
                onTap: _addEvidence,
                child: Container(
                  width: 80,
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
                      const Icon(Icons.add_a_photo_outlined,
                          color: AppTheme.primary, size: 22),
                      const SizedBox(height: 4),
                      Text('Thêm',
                          style: GoogleFonts.inter(
                              color: AppTheme.primary, fontSize: 10)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),

          AppButton(
            text: 'Gửi khiếu nại',
            isLoading: _isSubmitting,
            onPressed: _submit,
            icon: Icons.send_rounded,
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

// ──── List tab ────

class _ComplaintList extends StatelessWidget {
  static final _mockComplaints = [
    {
      'title': 'Khiếu nại quyết định xử phạt',
      'violation': 'Vi phạm vệ sinh khu chế biến',
      'date': '20/03/2026',
      'status': SafetyStatus.processing,
      'statusLabel': 'Đang xử lý',
    },
    {
      'title': 'Khiếu nại mức phạt không hợp lý',
      'violation': 'Không niêm yết giá thực phẩm',
      'date': '15/03/2026',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đã giải quyết',
    },
    {
      'title': 'Yêu cầu xem xét lại biên bản kiểm tra',
      'violation': 'Bảo quản thực phẩm không đúng quy định',
      'date': '01/03/2026',
      'status': SafetyStatus.warning,
      'statusLabel': 'Chờ duyệt',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _mockComplaints.length,
      itemBuilder: (context, index) {
        final item = _mockComplaints[index];
        return AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      item['title'] as String,
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  StatusBadge(
                    status: item['status'] as SafetyStatus,
                    customLabel: item['statusLabel'] as String,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.gavel_rounded,
                      size: 14, color: AppTheme.textSecondary),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      item['violation'] as String,
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Text(
                    item['date'] as String,
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
