import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';

class NotificationDetailPage extends StatelessWidget {
  final String title;

  const NotificationDetailPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.bookmark_border_rounded),
            onPressed: () {},
          ),
          IconButton(icon: const Icon(Icons.share_outlined), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFEF5350).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Khẩn cấp',
                style: GoogleFonts.inter(
                  color: const Color(0xFFEF5350),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title.isNotEmpty
                  ? title
                  : 'Thu hồi sản phẩm nước mắm ABC không đạt chuẩn',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 22,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  Icons.calendar_today_outlined,
                  size: 14,
                  color: AppTheme.textSecondary,
                ),
                const SizedBox(width: 6),
                Text(
                  '22/03/2026',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(width: 16),
                Icon(
                  Icons.visibility_outlined,
                  size: 14,
                  color: AppTheme.textSecondary,
                ),
                const SizedBox(width: 6),
                Text(
                  '1,245 lượt xem',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Divider(color: AppTheme.dividerColor),
            const SizedBox(height: 20),

            // Image placeholder
            Container(
              height: 180,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppTheme.surfaceBg,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.image_outlined,
                    color: AppTheme.textSecondary,
                    size: 40,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Hình ảnh minh họa',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text(
              'Ngày 22/03/2026, Cục An toàn thực phẩm (Bộ Y tế) ra thông báo thu hồi toàn bộ lô hàng nước mắm nhãn hiệu ABC, mã lô SX-2026-03-15.\n\n'
              'Qua kiểm nghiệm, lô hàng này có hàm lượng histamine vượt 3 lần ngưỡng cho phép theo QCVN 8-2:2011/BYT, tiềm ẩn nguy cơ gây ngộ độc thực phẩm.\n\n'
              'Người tiêu dùng đang sở hữu sản phẩm thuộc lô này vui lòng ngừng sử dụng và liên hệ nơi mua để đổi trả.\n\n'
              'Các cơ sở kinh doanh cần rà soát và thu hồi sản phẩm theo đúng quy định.',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 15,
                height: 1.7,
              ),
            ),
            const SizedBox(height: 24),

            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.surfaceBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.dividerColor),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.attach_file_rounded,
                    color: AppTheme.primary,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'QD-ThuHoi-2026-03-22.pdf',
                          style: GoogleFonts.inter(
                            color: AppTheme.textPrimary,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          '1.2 MB',
                          style: GoogleFonts.inter(
                            color: AppTheme.textSecondary,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    Icons.download_outlined,
                    color: AppTheme.primary,
                    size: 20,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
