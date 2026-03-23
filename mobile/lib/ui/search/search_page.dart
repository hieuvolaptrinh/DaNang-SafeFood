import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/empty_state_view.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/search/search_cubit.dart';
import 'package:mobile_ui/viewmodel/search/search_state.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _searchCtrl = TextEditingController();

  final _districts = [
    'Tất cả', 'Hải Châu', 'Thanh Khê', 'Sơn Trà',
    'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang',
  ];

  final _statuses = ['Tất cả', 'An toàn', 'Vi phạm', 'Đang xử lý'];

  final _mockResults = [
    {'name': 'Nhà hàng Biển Xanh', 'address': '123 Nguyễn Văn Linh, Hải Châu', 'status': SafetyStatus.safe},
    {'name': 'Quán Phở Bà Năm', 'address': '45 Trần Phú, Hải Châu', 'status': SafetyStatus.violated},
    {'name': 'Tiệm Bánh Mì Hội An', 'address': '67 Lê Duẩn, Thanh Khê', 'status': SafetyStatus.safe},
    {'name': 'Quán Bún Chả Cá', 'address': '89 Hoàng Diệu, Hải Châu', 'status': SafetyStatus.processing},
    {'name': 'Nhà hàng Hải Sản Phương Nam', 'address': '12 Võ Nguyên Giáp, Sơn Trà', 'status': SafetyStatus.warning},
    {'name': 'Quán Mì Quảng Bà Vị', 'address': '34 Phan Châu Trinh, Hải Châu', 'status': SafetyStatus.safe},
  ];

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
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
              'Tra cứu cơ sở',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Search bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              controller: _searchCtrl,
              onChanged: (v) => context.read<SearchCubit>().queryChanged(v),
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 15,
              ),
              decoration: InputDecoration(
                hintText: 'Tìm kiếm nhà hàng, quán ăn...',
                hintStyle: GoogleFonts.inter(
                  color: AppTheme.textSecondary.withValues(alpha: 0.6),
                  fontSize: 15,
                ),
                prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.textSecondary),
                filled: true,
                fillColor: AppTheme.surfaceBg,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: AppTheme.dividerColor),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: AppTheme.dividerColor),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Filter chips
          SizedBox(
            height: 36,
            child: BlocBuilder<SearchCubit, SearchState>(
              builder: (context, state) {
                return ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  children: [
                    ..._districts.map((d) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: _FilterChip(
                        label: d,
                        selected: state.selectedDistrict == d,
                        onTap: () => context.read<SearchCubit>().districtChanged(d),
                      ),
                    )),
                  ],
                );
              },
            ),
          ),
          const SizedBox(height: 8),

          // Status filters
          SizedBox(
            height: 36,
            child: BlocBuilder<SearchCubit, SearchState>(
              builder: (context, state) {
                return ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  children: [
                    ..._statuses.map((s) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: _FilterChip(
                        label: s,
                        selected: state.selectedStatus == s,
                        onTap: () => context.read<SearchCubit>().statusFilterChanged(s),
                      ),
                    )),
                  ],
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Results
          Expanded(
            child: BlocBuilder<SearchCubit, SearchState>(
              builder: (context, state) {
                if (state.status == SearchStatus.initial) {
                  return const EmptyStateView(
                    icon: Icons.search_rounded,
                    title: 'Nhập tên cơ sở để tìm kiếm',
                    subtitle: 'Tra cứu thông tin ATTP của nhà hàng, quán ăn tại Đà Nẵng',
                  );
                }

                if (state.status == SearchStatus.loading) {
                  return const Center(
                    child: CircularProgressIndicator(color: AppTheme.primary),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () => context.read<SearchCubit>().search(),
                  color: AppTheme.primary,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: _mockResults.length,
                    itemBuilder: (context, index) {
                      final item = _mockResults[index];
                      return AppCard(
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.businessDetail,
                          arguments: {'name': item['name']},
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: AppTheme.primary.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.store_outlined, color: AppTheme.primary, size: 22),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['name'] as String,
                                    style: GoogleFonts.inter(
                                      color: AppTheme.textPrimary,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    item['address'] as String,
                                    style: GoogleFonts.inter(
                                      color: AppTheme.textSecondary,
                                      fontSize: 12,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            StatusBadge(status: item['status'] as SafetyStatus),
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

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? AppTheme.primary.withValues(alpha: 0.1) : AppTheme.surfaceBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? AppTheme.primary : AppTheme.dividerColor,
            width: 1,
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            color: selected ? AppTheme.primary : AppTheme.textSecondary,
            fontSize: 12,
            fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}
