import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/section_header.dart';
import 'package:mobile_ui/routes/routes.dart';

class TestingDetailPage extends StatelessWidget {
  final String title;

  const TestingDetailPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    // E1 logic checking can be done in Cubit. Since this is UI, we just display the mock data.
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Kết quả kiểm định',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const StatusBadge(
              status: SafetyStatus.violated,
              customLabel: 'Mẫu Không Đạt',
            ),
            const SizedBox(height: 12),
            Text(
              title.isNotEmpty ? title : 'Mẫu chả lụa (M-102)',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 16),
            _InfoRow(label: 'Mã số mẫu', value: 'KD-2026-M102'),
            _InfoRow(label: 'Ngày lấy mẫu', value: '25/03/2026'),
            _InfoRow(label: 'Ngày trả kết quả', value: '28/03/2026'),
            _InfoRow(label: 'Trung tâm kiểm định', value: 'TT Kiểm chuẩn ATTP Đà Nẵng'),
            
            const SizedBox(height: 20),
            Divider(color: AppTheme.dividerColor),
            const SizedBox(height: 20),

            SectionHeader(
              title: 'Các chỉ tiêu đánh giá',
              padding: const EdgeInsets.symmetric(vertical: 8),
            ),
            // Table of criteria
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: AppTheme.dividerColor),
                borderRadius: BorderRadius.circular(12),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Column(
                  children: [
                    Container(
                      color: AppTheme.surfaceBg,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      child: Row(
                        children: [
                          Expanded(flex: 2, child: _HeaderCell('Chỉ tiêu')),
                          Expanded(flex: 1, child: _HeaderCell('Ngưỡng')),
                          Expanded(flex: 1, child: _HeaderCell('Kết quả')),
                        ],
                      ),
                    ),
                    const Divider(height: 1),
                    _DataRow(
                      criterion: 'Vi khuẩn E.coli',
                      threshold: '< 10',
                      result: '2',
                      isViolated: false,
                    ),
                    const Divider(height: 1),
                    _DataRow(
                      criterion: 'Samonella',
                      threshold: '0',
                      result: '0',
                      isViolated: false,
                    ),
                    const Divider(height: 1),
                    _DataRow(
                      criterion: 'Hàm lượng Hàn the (Borax)',
                      threshold: '0 mg/kg',
                      result: '12 mg/kg',
                      isViolated: true,
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFEF5350).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning_amber_rounded, color: Color(0xFFEF5350)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Kết luận: Phát hiện dư chất Hàn the vượt ngưỡng an toàn. Yêu cầu thu hồi toàn bộ lô sản phẩm trùng đợt sản xuất.',
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

            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => Navigator.pushNamed(
                  context,
                  Routes.updateEvidence,
                  arguments: {'title': title, 'isExpired': false},
                ),
                icon: const Icon(Icons.upload_file_rounded, size: 18),
                label: Text('Cập nhật minh chứng',
                    style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.success,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => Navigator.pushNamed(context, Routes.businessComplaint),
                icon: const Icon(Icons.feedback_outlined, size: 18),
                label: Text('Khiếu nại kết quả',
                    style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.accent,
                  side: const BorderSide(color: AppTheme.accent),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _HeaderCell extends StatelessWidget {
  final String text;
  const _HeaderCell(this.text);
  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.inter(
        color: AppTheme.textSecondary,
        fontSize: 12,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}

class _DataRow extends StatelessWidget {
  final String criterion;
  final String threshold;
  final String result;
  final bool isViolated;

  const _DataRow({
    required this.criterion,
    required this.threshold,
    required this.result,
    required this.isViolated,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: isViolated ? const Color(0xFFEF5350).withValues(alpha: 0.05) : null,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              criterion,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 13,
                fontWeight: isViolated ? FontWeight.w600 : FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Text(
              threshold,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 12,
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Text(
              result,
              style: GoogleFonts.inter(
                color: isViolated ? const Color(0xFFEF5350) : AppTheme.primary,
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(label,
                style: GoogleFonts.inter(
                    color: AppTheme.textSecondary, fontSize: 13)),
          ),
          Expanded(
            child: Text(
              value,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
