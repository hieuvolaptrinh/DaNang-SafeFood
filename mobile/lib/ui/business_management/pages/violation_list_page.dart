import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/routes/routes.dart';

class ViolationListPage extends StatelessWidget {
  const ViolationListPage({super.key});

  static final _mockViolations = [
    {
      'title': 'Vi phạm vệ sinh khu chế biến',
      'business': 'Nhà hàng Biển Xanh',
      'date': '18/03/2026',
      'fine': '5.000.000 VNĐ',
      'status': SafetyStatus.violated,
      'statusLabel': 'Chưa nộp',
    },
    {
      'title': 'Không có giấy khám sức khỏe nhân viên',
      'business': 'Quán Phở Bà Năm',
      'date': '10/03/2026',
      'fine': '3.000.000 VNĐ',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đã nộp',
    },
    {
      'title': 'Bảo quản thực phẩm không đúng quy định',
      'business': 'Tiệm Bánh Mì Hội An',
      'date': '01/03/2026',
      'fine': '8.000.000 VNĐ',
      'status': SafetyStatus.processing,
      'statusLabel': 'Khiếu nại',
    },
    {
      'title': 'Không niêm yết giá thực phẩm',
      'business': 'Nhà hàng Biển Xanh',
      'date': '15/02/2026',
      'fine': '2.000.000 VNĐ',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đã nộp',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Xử phạt vi phạm',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: _mockViolations.length,
        itemBuilder: (context, index) {
          final v = _mockViolations[index];
          return AppCard(
            onTap: () => Navigator.pushNamed(
              context,
              Routes.violationDetail,
              arguments: {'title': v['title']},
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color:
                        const Color(0xFFEF5350).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.gavel_rounded,
                      color: Color(0xFFEF5350), size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        v['title'] as String,
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${v['business']} — ${v['date']}',
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 11,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Phạt: ${v['fine']}',
                        style: GoogleFonts.inter(
                          color: const Color(0xFFEF5350),
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                StatusBadge(
                  status: v['status'] as SafetyStatus,
                  customLabel: v['statusLabel'] as String,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
