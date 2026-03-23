import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';

class ComplaintDetailPage extends StatelessWidget {
  final String complaintTitle;

  const ComplaintDetailPage({super.key, required this.complaintTitle});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Chi tiết phản ánh',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const StatusBadge(status: SafetyStatus.processing),
            const SizedBox(height: 12),
            Text(
              complaintTitle.isNotEmpty
                  ? complaintTitle
                  : 'Quán ăn sử dụng dầu ăn tái chế',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 16),

            _DetailRow(label: 'Ngày gửi', value: '20/03/2026'),
            _DetailRow(label: 'Loại vi phạm', value: 'Vệ sinh kém'),
            _DetailRow(label: 'Địa điểm', value: 'Quán ăn ABC, 45 Trần Phú, Hải Châu'),
            _DetailRow(label: 'Mã phản ánh', value: 'PA-2026-00123'),

            const SizedBox(height: 20),
            const Divider(color: AppTheme.dividerColor),
            const SizedBox(height: 20),

            Text(
              'Mô tả chi tiết',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Quán ăn tại địa chỉ trên sử dụng dầu ăn tái chế nhiều lần, dầu đã đen và có mùi khét. Phát hiện vào lúc 11h trưa ngày 20/03/2026 khi đến ăn tại quán. Nhân viên phục vụ xác nhận dầu được sử dụng lại từ hôm trước.',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary.withValues(alpha: 0.85),
                fontSize: 14,
                height: 1.6,
              ),
            ),

            const SizedBox(height: 20),
            Text(
              'Hình ảnh đính kèm',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
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
                  child: const Icon(Icons.image_outlined, color: AppTheme.textSecondary),
                );
              }),
            ),

            const SizedBox(height: 24),
            Text(
              'Tiến trình xử lý',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            _TimelineItem(
              title: 'Đã tiếp nhận',
              date: '20/03/2026 - 14:30',
              description: 'Hệ thống đã tiếp nhận phản ánh của bạn.',
              isCompleted: true,
              isFirst: true,
            ),
            _TimelineItem(
              title: 'Đang xác minh',
              date: '21/03/2026 - 09:00',
              description: 'Đoàn kiểm tra đang xác minh thông tin.',
              isCompleted: true,
            ),
            _TimelineItem(
              title: 'Đang xử lý',
              date: '22/03/2026',
              description: 'Đang tiến hành xử lý vi phạm.',
              isCompleted: false,
            ),
            _TimelineItem(
              title: 'Hoàn thành',
              date: '',
              description: 'Chưa hoàn thành',
              isCompleted: false,
              isLast: true,
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 13),
            ),
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

class _TimelineItem extends StatelessWidget {
  final String title;
  final String date;
  final String description;
  final bool isCompleted;
  final bool isFirst;
  final bool isLast;

  const _TimelineItem({
    required this.title,
    required this.date,
    required this.description,
    required this.isCompleted,
    this.isFirst = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: isCompleted ? AppTheme.primary : Colors.grey[300],
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isCompleted ? AppTheme.primary : AppTheme.textSecondary,
                    width: 2,
                  ),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: isCompleted
                        ? AppTheme.primary.withValues(alpha: 0.4)
                        : Colors.grey[300],
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      color: isCompleted
                          ? AppTheme.textPrimary
                          : AppTheme.textSecondary,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (date.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      date,
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary.withValues(alpha: 0.8),
                      fontSize: 12,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
