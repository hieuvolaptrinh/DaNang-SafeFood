import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/empty_state_view.dart';
import 'package:mobile_ui/data/remote/model/business_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/search/search_cubit.dart';
import 'package:mobile_ui/viewmodel/search/search_state.dart';
import 'package:cached_network_image/cached_network_image.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _searchCtrl = TextEditingController();
  final _scrollController = ScrollController();

  final _districts = [
    'Tất cả',
    'Hải Châu 1',
    'Hải Châu 2',
    'Thanh Khê',
    'Sơn Trà',
    'Ngũ Hành Sơn',
  ];

  final _statuses = ['Tất cả', 'Hoạt động', 'Vi phạm', 'Tạm dừng'];

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.9) {
      context.read<SearchCubit>().loadMore();
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  SafetyStatus _mapStatus(String trangThai, int soViPham) {
    if (trangThai.toLowerCase().contains('vi pham') || soViPham > 0) {
      return SafetyStatus.violated;
    }
    if (trangThai.toLowerCase().contains('tam dung')) {
      return SafetyStatus.warning;
    }
    if (trangThai.toLowerCase().contains('hoat dong')) {
      return SafetyStatus.safe;
    }
    return SafetyStatus.processing;
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
                prefixIcon: const Icon(
                  Icons.search_rounded,
                  color: AppTheme.textSecondary,
                ),
                filled: true,
                fillColor: AppTheme.surfaceBg,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
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
                  borderSide: const BorderSide(
                    color: AppTheme.primary,
                    width: 1.5,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Filter chips - Districts
          SizedBox(
            height: 36,
            child: BlocBuilder<SearchCubit, SearchState>(
              builder: (context, state) {
                return ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  children: [
                    ..._districts.map(
                      (d) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: _FilterChip(
                          label: d,
                          selected: state.selectedDistrict == d,
                          onTap: () =>
                              context.read<SearchCubit>().districtChanged(d),
                        ),
                      ),
                    ),
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
                    ..._statuses.map(
                      (s) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: _FilterChip(
                          label: s,
                          selected: state.selectedStatus == s,
                          onTap: () => context
                              .read<SearchCubit>()
                              .statusFilterChanged(s),
                        ),
                      ),
                    ),
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
                    subtitle:
                        'Tra cứu thông tin ATTP của nhà hàng, quán ăn tại Đà Nẵng',
                  );
                }

                if (state.status == SearchStatus.loading &&
                    state.results.isEmpty) {
                  return const Center(
                    child: CircularProgressIndicator(color: AppTheme.primary),
                  );
                }

                if (state.status == SearchStatus.empty) {
                  return const EmptyStateView(
                    icon: Icons.search_off_rounded,
                    title: 'Không tìm thấy kết quả',
                    subtitle: 'Thử thay đổi từ khóa hoặc bộ lọc',
                  );
                }

                if (state.status == SearchStatus.error) {
                  return EmptyStateView(
                    icon: Icons.error_outline_rounded,
                    title: 'Có lỗi xảy ra',
                    subtitle: state.errorMessage ?? 'Vui lòng thử lại',
                  );
                }

                return RefreshIndicator(
                  onRefresh: () => context.read<SearchCubit>().search(),
                  color: AppTheme.primary,
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount:
                        state.results.length +
                        (state.hasMore && state.status == SearchStatus.loading
                            ? 1
                            : 0),
                    itemBuilder: (context, index) {
                      if (index >= state.results.length) {
                        return const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Center(
                            child: CircularProgressIndicator(
                              color: AppTheme.primary,
                            ),
                          ),
                        );
                      }

                      final item = state.results[index];
                      return _BusinessCard(
                        business: item,
                        status: _mapStatus(item.trangThai, item.soViPham),
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.businessDetail,
                          arguments: {'maCoSo': item.maCoSo},
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

class _BusinessCard extends StatelessWidget {
  final BusinessSearchModel business;
  final SafetyStatus status;
  final VoidCallback onTap;

  const _BusinessCard({
    required this.business,
    required this.status,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover image section
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
              child: SizedBox(
                height: 140,
                width: double.infinity,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Image
                    business.anhBia != null && business.anhBia!.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: business.anhBia!,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              color: AppTheme.surfaceBg,
                              child: const Center(
                                child: CircularProgressIndicator(
                                  color: AppTheme.primary,
                                  strokeWidth: 2,
                                ),
                              ),
                            ),
                            errorWidget: (context, url, error) =>
                                _DefaultCoverImage(),
                          )
                        : _DefaultCoverImage(),

                    // Gradient overlay
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.black.withValues(alpha: 0.35),
                            ],
                            stops: const [0.4, 1.0],
                          ),
                        ),
                      ),
                    ),

                    // Status badge on image
                    Positioned(
                      top: 10,
                      right: 10,
                      child: StatusBadge(status: status),
                    ),

                    // Violation count badge
                    if (business.soViPham > 0)
                      Positioned(
                        top: 10,
                        left: 10,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.error.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.warning_amber_rounded,
                                color: Colors.white,
                                size: 14,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '${business.soViPham} vi phạm',
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                    // Business type tags at bottom of image
                    if (business.loaiHinhKinhDoanh.isNotEmpty)
                      Positioned(
                        bottom: 10,
                        left: 12,
                        right: 12,
                        child: Row(
                          children: business.loaiHinhKinhDoanh
                              .take(2)
                              .map(
                                (type) => Container(
                                  margin: const EdgeInsets.only(right: 6),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 3,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.85),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    type,
                                    style: GoogleFonts.inter(
                                      color: AppTheme.textPrimary,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Content section
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Business name
                  Text(
                    business.tenCoSo,
                    style: GoogleFonts.inter(
                      color: AppTheme.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),

                  // Location row
                  if (business.tenPhuongXa != null)
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppTheme.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Icon(
                            Icons.location_on_rounded,
                            size: 14,
                            color: AppTheme.primary,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            business.tenPhuongXa!,
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 13,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),

                  // License info row
                  if (business.soGiayPhep != null &&
                      business.soGiayPhep!.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppTheme.accent.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Icon(
                            Icons.verified_rounded,
                            size: 14,
                            color: AppTheme.accent,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'GP: ${business.soGiayPhep}',
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 12,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(
                          Icons.arrow_forward_ios_rounded,
                          size: 14,
                          color: AppTheme.textSecondary,
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DefaultCoverImage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primary.withValues(alpha: 0.15),
            AppTheme.primaryLight.withValues(alpha: 0.25),
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.store_rounded,
              color: AppTheme.primary.withValues(alpha: 0.5),
              size: 48,
            ),
            const SizedBox(height: 6),
            Text(
              'Chưa có ảnh',
              style: GoogleFonts.inter(
                color: AppTheme.primary.withValues(alpha: 0.5),
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
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
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected
              ? AppTheme.primary.withValues(alpha: 0.1)
              : AppTheme.surfaceBg,
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
