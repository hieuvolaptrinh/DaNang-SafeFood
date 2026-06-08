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

class _SearchPageState extends State<SearchPage>
    with SingleTickerProviderStateMixin {
  final _searchCtrl = TextEditingController();
  final _scrollController = ScrollController();
  late AnimationController _pulseController;

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
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
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
    _pulseController.dispose();
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
      child: BlocBuilder<SearchCubit, SearchState>(
        builder: (context, state) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Tra cứu cơ sở',
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    // AI Mode toggle
                    _AiToggleButton(
                      isAiMode: state.isAiMode,
                      onTap: () =>
                          context.read<SearchCubit>().toggleAiMode(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Search bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    Expanded(
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: state.isAiMode
                                ? const Color(0xFF8B5CF6)
                                : AppTheme.dividerColor,
                            width: state.isAiMode ? 1.5 : 1,
                          ),
                          color: AppTheme.surfaceBg,
                        ),
                        child: TextField(
                          controller: _searchCtrl,
                          onChanged: (v) =>
                              context.read<SearchCubit>().queryChanged(v),
                          onSubmitted: (v) {
                            if (state.isAiMode && v.trim().isNotEmpty) {
                              context.read<SearchCubit>().searchWithAI();
                            }
                          },
                          style: GoogleFonts.inter(
                            color: AppTheme.textPrimary,
                            fontSize: 15,
                          ),
                          decoration: InputDecoration(
                            hintText: state.isAiMode
                                ? 'Mô tả sở thích ăn uống của bạn...'
                                : 'Tìm kiếm nhà hàng, quán ăn...',
                            hintStyle: GoogleFonts.inter(
                              color: AppTheme.textSecondary
                                  .withValues(alpha: 0.6),
                              fontSize: 15,
                            ),
                            prefixIcon: Icon(
                              state.isAiMode
                                  ? Icons.auto_awesome_rounded
                                  : Icons.search_rounded,
                              color: state.isAiMode
                                  ? const Color(0xFF8B5CF6)
                                  : AppTheme.textSecondary,
                            ),
                            filled: false,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                    // Nút Tìm khi ở AI mode
                    if (state.isAiMode) ...[
                      const SizedBox(width: 10),
                      _AiSearchButton(
                        isLoading: state.status == SearchStatus.aiLoading,
                        onTap: () {
                          if (state.query.trim().isNotEmpty) {
                            context.read<SearchCubit>().searchWithAI();
                          }
                        },
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // AI mode hint banner
              if (state.isAiMode)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFF3E8FF), Color(0xFFEDE9FE)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: const Color(0xFFD8B4FE),
                        width: 0.5,
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.tips_and_updates_rounded,
                          color: Color(0xFF7C3AED),
                          size: 18,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Ví dụ: "Tôi muốn ăn bún bò ngon", "Quán trà sữa gần biển"...',
                            style: GoogleFonts.inter(
                              color: const Color(0xFF6D28D9),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Filter chips - chỉ hiện ở chế độ search thường
              if (!state.isAiMode) ...[
                const SizedBox(height: 4),
                SizedBox(
                  height: 36,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    children: [
                      ..._districts.map(
                        (d) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: _FilterChip(
                            label: d,
                            selected: state.selectedDistrict == d,
                            onTap: () => context
                                .read<SearchCubit>()
                                .districtChanged(d),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 36,
                  child: ListView(
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
                  ),
                ),
              ],
              const SizedBox(height: 12),

              // Results area
              Expanded(child: _buildResultsArea(context, state)),
            ],
          );
        },
      ),
    );
  }

  Widget _buildResultsArea(BuildContext context, SearchState state) {
    // ─── AI Mode ───
    if (state.isAiMode) {
      if (state.status == SearchStatus.initial) {
        return const EmptyStateView(
          icon: Icons.auto_awesome_rounded,
          title: 'Tìm kiếm bằng AI',
          subtitle:
              'Mô tả sở thích ăn uống, AI sẽ gợi ý cơ sở phù hợp nhất cho bạn',
        );
      }

      if (state.status == SearchStatus.aiLoading) {
        return _AiLoadingView(pulseController: _pulseController);
      }

      if (state.status == SearchStatus.aiLoaded &&
          state.aiResponse != null) {
        return ListView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          itemCount: state.results.length + 1,
          itemBuilder: (context, index) {
            if (index == 0) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _AiResponseView(response: state.aiResponse!),
              );
            }

            final item = state.results[index - 1];
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
        );
      }

      if (state.status == SearchStatus.error) {
        return EmptyStateView(
          icon: Icons.error_outline_rounded,
          title: 'AI gặp lỗi',
          subtitle: state.errorMessage ?? 'Vui lòng thử lại',
        );
      }

      return const SizedBox.shrink();
    }

    // ─── Normal Search Mode ───
    if (state.status == SearchStatus.initial) {
      return const EmptyStateView(
        icon: Icons.search_rounded,
        title: 'Nhập tên cơ sở để tìm kiếm',
        subtitle:
            'Tra cứu thông tin ATTP của nhà hàng, quán ăn tại Đà Nẵng',
      );
    }

    if (state.status == SearchStatus.loading && state.results.isEmpty) {
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
        itemCount: state.results.length +
            (state.hasMore && state.status == SearchStatus.loading ? 1 : 0),
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
  }
}

// ═══════════════════════════════════════════════════
//  AI Toggle Button
// ═══════════════════════════════════════════════════
class _AiToggleButton extends StatelessWidget {
  final bool isAiMode;
  final VoidCallback onTap;

  const _AiToggleButton({required this.isAiMode, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          gradient: isAiMode
              ? const LinearGradient(
                  colors: [Color(0xFF8B5CF6), Color(0xFFA78BFA)],
                )
              : null,
          color: isAiMode ? null : AppTheme.surfaceBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isAiMode
                ? const Color(0xFF8B5CF6)
                : AppTheme.dividerColor,
            width: 1,
          ),
          boxShadow: isAiMode
              ? [
                  BoxShadow(
                    color: const Color(0xFF8B5CF6).withValues(alpha: 0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.auto_awesome_rounded,
              size: 16,
              color: isAiMode ? Colors.white : AppTheme.textSecondary,
            ),
            const SizedBox(width: 6),
            Text(
              'AI',
              style: GoogleFonts.inter(
                color: isAiMode ? Colors.white : AppTheme.textSecondary,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════
//  AI Search Button
// ═══════════════════════════════════════════════════
class _AiSearchButton extends StatelessWidget {
  final bool isLoading;
  final VoidCallback onTap;

  const _AiSearchButton({required this.isLoading, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLoading ? null : onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF8B5CF6), Color(0xFF7C3AED)],
          ),
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF8B5CF6).withValues(alpha: 0.35),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2,
                ),
              )
            : const Icon(
                Icons.send_rounded,
                color: Colors.white,
                size: 20,
              ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════
//  AI Loading View
// ═══════════════════════════════════════════════════
class _AiLoadingView extends StatelessWidget {
  final AnimationController pulseController;

  const _AiLoadingView({required this.pulseController});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Animated AI icon
            AnimatedBuilder(
              animation: pulseController,
              builder: (context, child) {
                return Transform.scale(
                  scale: 0.9 + (pulseController.value * 0.2),
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF8B5CF6)
                              .withValues(alpha: 0.15 + pulseController.value * 0.15),
                          const Color(0xFFA78BFA)
                              .withValues(alpha: 0.1 + pulseController.value * 0.1),
                        ],
                      ),
                    ),
                    child: const Icon(
                      Icons.auto_awesome_rounded,
                      size: 36,
                      color: Color(0xFF8B5CF6),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            Text(
              'AI đang phân tích...',
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 17,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Đang tìm cơ sở phù hợp với sở thích của bạn',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            // Loading dots shimmer
            SizedBox(
              width: 60,
              child: LinearProgressIndicator(
                backgroundColor: const Color(0xFFEDE9FE),
                valueColor: const AlwaysStoppedAnimation<Color>(
                  Color(0xFF8B5CF6),
                ),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════
//  AI Response View (Chat Bubble)
// ═══════════════════════════════════════════════════
class _AiResponseView extends StatelessWidget {
  final String response;

  const _AiResponseView({required this.response});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // AI header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF8B5CF6), Color(0xFFA78BFA)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.auto_awesome_rounded,
                  color: Colors.white,
                  size: 18,
                ),
              ),
              const SizedBox(width: 10),
              Text(
                'Gợi ý từ AI',
                style: GoogleFonts.inter(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Response bubble
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(4),
                topRight: Radius.circular(20),
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.06),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
              border: Border.all(
                color: const Color(0xFFEDE9FE),
                width: 1,
              ),
            ),
            child: SelectableText(
              response,
              style: GoogleFonts.inter(
                color: AppTheme.textPrimary,
                fontSize: 14,
                height: 1.65,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Disclaimer
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF7ED),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: const Color(0xFFFED7AA),
                width: 0.5,
              ),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.info_outline_rounded,
                  color: Color(0xFFEA580C),
                  size: 15,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Kết quả gợi ý từ AI mang tính tham khảo. Vui lòng kiểm tra thông tin chi tiết.',
                    style: GoogleFonts.inter(
                      color: const Color(0xFFEA580C),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════
//  Business Card (unchanged from original)
// ═══════════════════════════════════════════════════
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
                  if (business.diaChiChiNhanh.isNotEmpty)
                    ...business.diaChiChiNhanh.map((diaChi) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(4),
                            margin: const EdgeInsets.only(top: 2),
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
                              diaChi + (business.tenPhuongXa != null ? ', ${business.tenPhuongXa}' : ''),
                              style: GoogleFonts.inter(
                                color: AppTheme.textSecondary,
                                fontSize: 13,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ))
                  else if (business.tenPhuongXa != null)
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
