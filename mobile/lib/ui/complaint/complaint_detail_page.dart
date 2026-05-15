import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_state.dart';

class ComplaintDetailPage extends StatelessWidget {
  final String complaintId;

  const ComplaintDetailPage({super.key, required this.complaintId});

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
      body: BlocBuilder<ComplaintCubit, ComplaintState>(
        builder: (context, state) {
          final detail = state.selectedComplaint;
          if (state.status == ComplaintStatus.loading || detail == null) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: _ComplaintDetailContent(detail: detail),
          );
        },
      ),
    );
  }
}

class _ComplaintDetailContent extends StatelessWidget {
  final ComplaintSummary detail;

  const _ComplaintDetailContent({required this.detail});

  @override
  Widget build(BuildContext context) {
    final location = detail.location ?? detail.businessName ?? 'Chưa cập nhật';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        StatusBadge(
          status: _mapStatus(detail.status),
          customLabel: detail.status,
        ),
        const SizedBox(height: 12),
        Text(
          detail.title,
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.bold,
            height: 1.3,
          ),
        ),
        const SizedBox(height: 16),
        _DetailRow(label: 'Ngày gửi', value: _formatDate(detail.submittedAt)),
        _DetailRow(label: 'Loại vi phạm', value: detail.typeName),
        _DetailRow(label: 'Địa điểm', value: location),
        _DetailRow(label: 'Mã phản ánh', value: detail.id),
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
          detail.content,
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
        if (detail.fileUrls.isEmpty)
          Text(
            'Chưa có tệp đính kèm',
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 13,
            ),
          )
        else
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: detail.fileUrls.map((url) {
              return ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: CachedNetworkImage(
                  imageUrl: url,
                  width: 92,
                  height: 92,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    width: 92,
                    height: 92,
                    color: AppTheme.surfaceBg,
                  ),
                  errorWidget: (context, url, error) => Container(
                    width: 92,
                    height: 92,
                    color: AppTheme.surfaceBg,
                    child: const Icon(
                      Icons.broken_image_outlined,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ),
              );
            }).toList(),
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
          date: _formatDate(detail.submittedAt),
          description: 'Hệ thống đã tiếp nhận phản ánh của bạn.',
          isCompleted: true,
          isFirst: true,
        ),
        _TimelineItem(
          title: detail.status,
          date: '',
          description: 'Phản ánh đang được xử lý theo quy trình.',
          isCompleted: _mapStatus(detail.status) != SafetyStatus.warning,
          isLast: true,
        ),
        const SizedBox(height: 40),
      ],
    );
  }
}

SafetyStatus _mapStatus(String status) {
  final normalized = status.toLowerCase();
  if (normalized.contains('đã') || normalized.contains('da')) {
    return SafetyStatus.safe;
  }
  if (normalized.contains('chưa') || normalized.contains('chua')) {
    return SafetyStatus.warning;
  }
  if (normalized.contains('vi phạm') || normalized.contains('vi pham')) {
    return SafetyStatus.violated;
  }
  return SafetyStatus.processing;
}

String _formatDate(DateTime? date) {
  if (date == null) return '--/--/----';
  final day = date.day.toString().padLeft(2, '0');
  final month = date.month.toString().padLeft(2, '0');
  return '$day/$month/${date.year}';
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
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
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
                    color: isCompleted
                        ? AppTheme.primary
                        : AppTheme.textSecondary,
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
