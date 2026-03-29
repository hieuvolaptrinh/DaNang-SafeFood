import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/routes/routes.dart';

class ViolationListPage extends StatefulWidget {
  const ViolationListPage({super.key});

  @override
  State<ViolationListPage> createState() => _ViolationListPageState();
}

class _ViolationListPageState extends State<ViolationListPage> {
  String _selectedFilter = 'Tất cả';

  static final _mockViolations = [
    {
      'type': 'Thanh tra',
      'title': 'Vi phạm vệ sinh khu chế biến',
      'business': 'Nhà hàng Biển Xanh',
      'date': '18/03/2026',
      'detail': 'Phạt: 5.000.000 VNĐ',
      'status': SafetyStatus.violated,
      'statusLabel': 'Không đạt',
    },
    {
      'type': 'Thanh tra',
      'title': 'Không có giấy khám sức khỏe nhân viên',
      'business': 'Quán Phở Bà Năm',
      'date': '10/03/2026',
      'detail': 'Phạt: 3.000.000 VNĐ',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đạt',
    },
    {
      'type': 'Kiểm định',
      'title': 'Mẫu chả lụa chéo (M-102)',
      'business': 'Cơ sở SX Chả Lụa Cô Ba',
      'date': '25/03/2026',
      'detail': 'Kết quả: Vi phạm (Hàn the > Tiêu chuẩn)',
      'status': SafetyStatus.violated,
      'statusLabel': 'Không đạt',
    },
    {
      'type': 'Thanh tra',
      'title': 'Bảo quản thực phẩm không đúng quy định',
      'business': 'Tiệm Bánh Mì Hội An',
      'date': '01/03/2026',
      'detail': 'Phạt: 8.000.000 VNĐ',
      'status': SafetyStatus.warning,
      'statusLabel': 'Cảnh báo',
    },
    {
      'type': 'Kiểm định',
      'title': 'Nước giải khát đóng chai (M-455)',
      'business': 'Cơ sở SX Nước Giải Khát ABC',
      'date': '15/02/2026',
      'detail': 'Kết quả: Đạt tiêu chuẩn an toàn',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đạt',
    },
    {
      'type': 'Kiểm định',
      'title': 'Mẫu tương ớt xịt (M-911)',
      'business': 'Nhà hàng Biển Xanh',
      'date': '20/03/2026',
      'detail': 'Kết quả: Đang xử lý',
      'status': SafetyStatus.processing,
      'statusLabel': 'Chờ kết quả',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredList = _mockViolations.where((item) {
      if (_selectedFilter == 'Tất cả') return true;
      return item['type'] == _selectedFilter;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Thanh tra & Kiểm định',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Row(
              children: ['Tất cả', 'Thanh tra', 'Kiểm định'].map((filter) {
                final isSelected = filter == _selectedFilter;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(filter),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        if (selected) _selectedFilter = filter;
                      });
                    },
                    backgroundColor: AppTheme.surfaceBg,
                    selectedColor: AppTheme.primary.withValues(alpha: 0.2),
                    checkmarkColor: AppTheme.primary,
                    labelStyle: GoogleFonts.inter(
                      color: isSelected ? AppTheme.primary : AppTheme.textSecondary,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                      fontSize: 13,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected ? AppTheme.primary : AppTheme.dividerColor,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          
          Expanded(
            child: filteredList.isEmpty
                ? Center(
                    child: Text(
                      'Chưa có dữ liệu cho mục này.',
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    itemCount: filteredList.length,
                    itemBuilder: (context, index) {
                      final item = filteredList[index];
                      final isInspection = item['type'] == 'Thanh tra';

                      return AppCard(
                        onTap: () {
                          if (isInspection) {
                            Navigator.pushNamed(
                              context,
                              Routes.inspectionDetail,
                              arguments: {'title': item['title']},
                            );
                          } else {
                            Navigator.pushNamed(
                              context,
                              Routes.testingDetail,
                              arguments: {'title': item['title']},
                            );
                          }
                        },
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: (isInspection
                                        ? const Color(0xFFEF5350)
                                        : AppTheme.accent)
                                    .withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                isInspection
                                    ? Icons.gavel_rounded
                                    : Icons.science_outlined,
                                color: isInspection
                                    ? const Color(0xFFEF5350)
                                    : AppTheme.accent,
                                size: 22,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: AppTheme.surfaceBg,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          item['type'] as String,
                                          style: GoogleFonts.inter(
                                            color: AppTheme.textSecondary,
                                            fontSize: 10,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    item['title'] as String,
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
                                    '${item['business']} — ${item['date']}',
                                    style: GoogleFonts.inter(
                                      color: AppTheme.textSecondary,
                                      fontSize: 11,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    item['detail'] as String,
                                    style: GoogleFonts.inter(
                                      color: AppTheme.textPrimary,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            StatusBadge(
                              status: item['status'] as SafetyStatus,
                              customLabel: item['statusLabel'] as String,
                            ),
                          ],
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

