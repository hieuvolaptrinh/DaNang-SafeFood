import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

/// Hiển thị toàn bộ cơ sở kinh doanh của người dùng đang đăng nhập.
class AllBusinessesPage extends StatefulWidget {
  const AllBusinessesPage({super.key});

  @override
  State<AllBusinessesPage> createState() => _AllBusinessesPageState();
}

class _AllBusinessesPageState extends State<AllBusinessesPage> {
  final _searchCtrl = TextEditingController();

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
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
          'Cơ sở của tôi',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: BlocBuilder<BusinessManagementCubit, BusinessMgmtState>(
        builder: (context, state) {
          if (state.status == BusinessMgmtStatus.error &&
              state.businesses.isEmpty) {
            return ErrorStateView(
              message: state.errorMessage ?? 'Không thể tải dữ liệu',
              onRetry: () => context.read<BusinessManagementCubit>().loadData(),
            );
          }
          if (state.status == BusinessMgmtStatus.loading &&
              state.businesses.isEmpty) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }

          final keyword = _searchCtrl.text.trim().toLowerCase();
          final filtered = keyword.isEmpty
              ? state.businesses
              : state.businesses
                    .where(
                      (b) =>
                          b.tenCoSo.toLowerCase().contains(keyword) ||
                          (b.soGiayPhep ?? '').toLowerCase().contains(keyword),
                    )
                    .toList();

          return RefreshIndicator(
            onRefresh: () => context.read<BusinessManagementCubit>().refresh(),
            color: AppTheme.primary,
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: TextField(
                        controller: _searchCtrl,
                        onChanged: (_) => setState(() {}),
                        decoration: InputDecoration(
                          hintText: 'Tìm theo tên / số giấy phép',
                          hintStyle: GoogleFonts.inter(
                            color: AppTheme.textTertiary,
                            fontSize: 14,
                          ),
                          prefixIcon: const Icon(
                            Icons.search_rounded,
                            color: AppTheme.textSecondary,
                          ),
                          suffixIcon: _searchCtrl.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(
                                    Icons.close_rounded,
                                    size: 18,
                                  ),
                                  onPressed: () {
                                    _searchCtrl.clear();
                                    setState(() {});
                                  },
                                )
                              : null,
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Text(
                      '${filtered.length} cơ sở',
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
                if (filtered.isEmpty)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(40),
                      child: Column(
                        children: [
                          Icon(
                            Icons.business_outlined,
                            size: 56,
                            color: AppTheme.textTertiary.withValues(alpha: 0.5),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            keyword.isEmpty
                                ? 'Bạn chưa có cơ sở kinh doanh nào'
                                : 'Không tìm thấy cơ sở phù hợp',
                            style: GoogleFonts.inter(
                              color: AppTheme.textSecondary,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (keyword.isEmpty)
                            FilledButton.icon(
                              onPressed: () => Navigator.pushNamed(
                                context,
                                Routes.businessRegistration,
                              ),
                              icon: const Icon(Icons.add_business_rounded),
                              label: const Text('Đăng ký kinh doanh'),
                            ),
                        ],
                      ),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) =>
                            _BusinessCard(business: filtered[index]),
                        childCount: filtered.length,
                      ),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () =>
            Navigator.pushNamed(context, Routes.businessRegistration),
        backgroundColor: AppTheme.primary,
        icon: const Icon(Icons.add_business_rounded, color: Colors.white),
        label: Text(
          'Đăng ký mới',
          style: GoogleFonts.inter(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

class _BusinessCard extends StatelessWidget {
  final MyBusinessModel business;
  const _BusinessCard({required this.business});

  @override
  Widget build(BuildContext context) {
    final SafetyStatus badge;
    switch (business.trangThaiKinhDoanh) {
      case 'DANG_HOAT_DONG':
        badge = SafetyStatus.safe;
        break;
      case 'BI_CAM':
        badge = SafetyStatus.violated;
        break;
      case 'CANH_CAO_VI_PHAM':
        badge = SafetyStatus.warning;
        break;
      default:
        badge = SafetyStatus.processing;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadow.level1,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => Navigator.pushNamed(
            context,
            Routes.bizDetail,
            arguments: {'name': business.maCoSo},
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    color: AppTheme.primary.withValues(alpha: 0.1),
                    image: business.anhBia != null
                        ? DecorationImage(
                            image: NetworkImage(business.anhBia!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: business.anhBia == null
                      ? const Icon(
                          Icons.store_rounded,
                          color: AppTheme.primary,
                          size: 24,
                        )
                      : null,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        business.tenCoSo,
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on_outlined,
                            size: 13,
                            color: AppTheme.textSecondary,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              business.tenPhuongXa ?? 'Chưa cập nhật',
                              style: GoogleFonts.inter(
                                color: AppTheme.textSecondary,
                                fontSize: 12,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      if (business.soGiayPhep != null &&
                          business.soGiayPhep!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          'GP: ${business.soGiayPhep}',
                          style: GoogleFonts.inter(
                            color: AppTheme.textTertiary,
                            fontSize: 11,
                          ),
                        ),
                      ],
                      const SizedBox(height: 6),
                      StatusBadge(
                        status: badge,
                        customLabel:
                            business.trangThaiKinhDoanhLabel ??
                            business.trangThai,
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.chevron_right_rounded,
                  color: AppTheme.textTertiary,
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
