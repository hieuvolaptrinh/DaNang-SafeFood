import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/section_header.dart';
import 'package:mobile_ui/routes/routes.dart';

class ViolationDetailPage extends StatelessWidget {
  final String violationTitle;

  const ViolationDetailPage({super.key, required this.violationTitle});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Chi tiết vi phạm',
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
              customLabel: 'Chưa nộp phạt',
            ),
            const SizedBox(height: 12),
            Text(
              violationTitle.isNotEmpty
                  ? violationTitle
                  : 'Vi phạm vệ sinh khu chế biến',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 16),

            // Info rows
            _InfoRow(label: 'Cơ sở', value: 'Nhà hàng Biển Xanh'),
            _InfoRow(label: 'Địa chỉ', value: '123 Nguyễn Văn Linh, Hải Châu'),
            _InfoRow(label: 'Ngày vi phạm', value: '18/03/2026'),
            _InfoRow(label: 'Mã biên bản', value: 'BB-2026-0312'),
            const SizedBox(height: 16),

            // Fine amount
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFEF5350).withValues(alpha: 0.06),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                    color: const Color(0xFFEF5350).withValues(alpha: 0.2)),
              ),
              child: Column(
                children: [
                  Text(
                    'Số tiền phạt',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '5.000.000 VNĐ',
                    style: GoogleFonts.inter(
                      color: const Color(0xFFEF5350),
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Hạn nộp: 18/04/2026',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            Divider(color: AppTheme.dividerColor),
            const SizedBox(height: 20),

            // Description
            SectionHeader(
              title: 'Nội dung vi phạm',
              padding: const EdgeInsets.symmetric(vertical: 8),
            ),
            Text(
              'Khu vực chế biến thực phẩm không đảm bảo vệ sinh: sàn bếp có vũng nước đọng, thùng rác không có nắp đậy, bề mặt chế biến có vết bẩn. Vi phạm Điều 7, Khoản 2, Nghị định 115/2024/NĐ-CP.',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 14,
                height: 1.6,
              ),
            ),

            const SizedBox(height: 20),
            SectionHeader(
              title: 'Bằng chứng',
              padding: const EdgeInsets.symmetric(vertical: 8),
            ),
            Row(
              children: List.generate(3, (i) {
                return Container(
                  width: 80,
                  height: 80,
                  margin: const EdgeInsets.only(right: 10),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.dividerColor),
                  ),
                  child: const Icon(Icons.image_outlined,
                      color: AppTheme.textSecondary),
                );
              }),
            ),

            const SizedBox(height: 20),
            // Document
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.surfaceBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.dividerColor),
              ),
              child: Row(
                children: [
                  Icon(Icons.attach_file_rounded,
                      color: AppTheme.primary, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'BienBan-BB-2026-0312.pdf',
                          style: GoogleFonts.inter(
                            color: AppTheme.textPrimary,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          '856 KB',
                          style: GoogleFonts.inter(
                            color: AppTheme.textSecondary,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.download_outlined,
                      color: AppTheme.primary, size: 20),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Actions
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.payment_rounded, size: 18),
                    label: Text('Nộp phạt',
                        style:
                            GoogleFonts.inter(fontWeight: FontWeight.w600)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.pushNamed(
                      context,
                      Routes.businessComplaint,
                    ),
                    icon: const Icon(Icons.feedback_outlined, size: 18),
                    label: Text('Khiếu nại',
                        style:
                            GoogleFonts.inter(fontWeight: FontWeight.w600)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.accent,
                      side: BorderSide(color: AppTheme.accent),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
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
            width: 110,
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
