import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/notification/notification_cubit.dart';
import 'package:mobile_ui/viewmodel/notification/notification_state.dart';

class NotificationPage extends StatelessWidget {
  const NotificationPage({super.key});

  static const _categories = ['Tất cả', 'Khẩn cấp', 'Tin tức', 'Pháp quy'];

  static const _mockNotifications = [
    {
      'title': 'Thu hồi sản phẩm nước mắm ABC không đạt chuẩn',
      'desc':
          'Cục ATTP thông báo thu hồi lô hàng nước mắm nhãn hiệu ABC do phát hiện hàm lượng histamine vượt ngưỡng cho phép.',
      'date': '22/03/2026',
      'category': 'Khẩn cấp',
      'status': 'violated',
    },
    {
      'title': 'Tập huấn kiến thức ATTP cho chủ cơ sở kinh doanh',
      'desc':
          'Sở Y tế tổ chức lớp tập huấn cho các cơ sở kinh doanh thực phẩm trên địa bàn quận Hải Châu.',
      'date': '21/03/2026',
      'category': 'Tin tức',
      'status': 'safe',
    },
    {
      'title': 'Nghị định mới về xử phạt vi phạm ATTP',
      'desc':
          'Chính phủ ban hành Nghị định mới tăng mức xử phạt vi phạm hành chính về an toàn thực phẩm.',
      'date': '20/03/2026',
      'category': 'Pháp quy',
      'status': 'processing',
    },
    {
      'title': 'Cảnh báo thực phẩm chức năng giả trên mạng',
      'desc':
          'Phát hiện nhiều sản phẩm thực phẩm chức năng bán online sử dụng nhãn mác giả.',
      'date': '19/03/2026',
      'category': 'Khẩn cấp',
      'status': 'violated',
    },
    {
      'title': 'Đà Nẵng kiểm tra 500 cơ sở trước mùa du lịch',
      'desc':
          'Đoàn kiểm tra liên ngành tiến hành kiểm tra 500 cơ sở kinh doanh ăn uống trước mùa hè 2026.',
      'date': '18/03/2026',
      'category': 'Tin tức',
      'status': 'safe',
    },
  ];

  SafetyStatus _parseStatus(String s) {
    switch (s) {
      case 'violated':
        return SafetyStatus.violated;
      case 'warning':
        return SafetyStatus.warning;
      case 'processing':
        return SafetyStatus.processing;
      default:
        return SafetyStatus.safe;
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              'Thông báo',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 16),

          SizedBox(
            height: 36,
            child: BlocBuilder<NotificationCubit, NotificationState>(
              builder: (context, state) {
                return ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  children: _categories.map((c) {
                    final selected = state.selectedCategory == c;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => context
                            .read<NotificationCubit>()
                            .filterByCategory(c),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 7,
                          ),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppTheme.primary.withOpacity(0.1)
                                : AppTheme.surfaceBg,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: selected
                                  ? AppTheme.primary
                                  : AppTheme.dividerColor,
                            ),
                          ),
                          child: Text(
                            c,
                            style: GoogleFonts.inter(
                              color: selected
                                  ? AppTheme.primary
                                  : AppTheme.textSecondary,
                              fontSize: 12,
                              fontWeight: selected
                                  ? FontWeight.w600
                                  : FontWeight.w400,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          Expanded(
            child: BlocBuilder<NotificationCubit, NotificationState>(
              builder: (context, state) {
                if (state.status == NotificationStatus.loading) {
                  return const Center(
                    child: CircularProgressIndicator(color: AppTheme.primary),
                  );
                }

                final filtered = state.selectedCategory == 'Tất cả'
                    ? _mockNotifications
                    : _mockNotifications
                          .where((n) => n['category'] == state.selectedCategory)
                          .toList();

                return RefreshIndicator(
                  onRefresh: () => context.read<NotificationCubit>().refresh(),
                  color: AppTheme.primary,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      return AppCard(
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.notificationDetail,
                          arguments: {'title': item['title']},
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                StatusBadge(
                                  status: _parseStatus(item['status']!),
                                  customLabel: item['category'],
                                ),
                                const Spacer(),
                                Text(
                                  item['date']!,
                                  style: GoogleFonts.inter(
                                    color: AppTheme.textSecondary,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              item['title']!,
                              style: GoogleFonts.inter(
                                color: AppTheme.textPrimary,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              item['desc']!,
                              style: GoogleFonts.inter(
                                color: AppTheme.textSecondary,
                                fontSize: 12,
                                height: 1.4,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
