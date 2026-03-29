import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/section_header.dart';
import 'package:mobile_ui/routes/routes.dart';

class InspectionDetailPage extends StatelessWidget {
  final String title;

  const InspectionDetailPage({super.key, required this.title});

  void _downloadFile(BuildContext context) {
    // E2: Lỗi tải file -> show popup or snackbar
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Chức năng đang phát triển. Không thể tải file lúc này.'),
      ),
    );
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
          'Kết quả thanh tra',
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
              customLabel: 'Không đạt',
            ),
            const SizedBox(height: 12),
            Text(
              title.isNotEmpty ? title : 'Biên bản thanh tra cơ sở',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 16),
            _InfoRow(label: 'Cơ sở', value: 'Nhà hàng Biển Xanh'),
            _InfoRow(label: 'Mã biên bản', value: 'BB-TT-2026-003'),
            _InfoRow(label: 'Ngày thanh tra', value: '18/03/2026'),
            _InfoRow(label: 'Đoàn kiểm tra', value: 'Chi cục ATVSTP Đà Nẵng'),
            _InfoRow(label: 'Trưởng đoàn', value: 'Ông Nguyễn Văn A'),
            
            const SizedBox(height: 20),
            Divider(color: AppTheme.dividerColor),
            const SizedBox(height: 20),

            SectionHeader(
              title: 'Kết luận & Vi phạm',
              padding: const EdgeInsets.symmetric(vertical: 8),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFEF5350).withValues(alpha: 0.06),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                    color: const Color(0xFFEF5350).withValues(alpha: 0.2)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Vi phạm vệ sinh khu chế biến',
                    style: GoogleFonts.inter(
                      color: const Color(0xFFEF5350),
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Khu vực chế biến đọng nước, không có nắp đậy thùng rác, vi phạm điều kiện vệ sinh ATTP. Yêu cầu khắc phục trong vòng 15 ngày.',
                    style: GoogleFonts.inter(
                      color: AppTheme.textPrimary,
                      fontSize: 13,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            SectionHeader(
              title: 'File đính kèm',
              padding: const EdgeInsets.symmetric(vertical: 8),
            ),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.surfaceBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.dividerColor),
              ),
              child: InkWell(
                onTap: () => _downloadFile(context),
                child: Row(
                  children: [
                    Icon(Icons.picture_as_pdf_outlined,
                        color: const Color(0xFFEF5350), size: 24),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Bien_ban_18032026.pdf',
                            style: GoogleFonts.inter(
                              color: AppTheme.textPrimary,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            '2.4 MB',
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.download_rounded,
                        color: AppTheme.primary, size: 20),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => Navigator.pushNamed(
                  context,
                  Routes.updateEvidence,
                  arguments: {'title': title, 'isExpired': false}, // Thử isExpired = true để check báo lỗi chữ đỏ.
                ),
                icon: const Icon(Icons.upload_file_rounded, size: 18),
                label: Text('Cập nhật minh chứng',
                    style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.success, // Xanh lá
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
                  foregroundColor: AppTheme.accent, // Cam
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
            width: 120,
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
