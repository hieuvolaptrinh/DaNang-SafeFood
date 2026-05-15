import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/section_header.dart';
import 'package:mobile_ui/data/remote/model/business_models.dart';
import 'package:mobile_ui/viewmodel/search/business_detail_cubit.dart';
import 'package:mobile_ui/viewmodel/search/business_detail_state.dart';

class BusinessDetailPage extends StatelessWidget {
  final String maCoSo;

  const BusinessDetailPage({super.key, required this.maCoSo});

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
    return Scaffold(
      body: BlocBuilder<BusinessDetailCubit, BusinessDetailState>(
        builder: (context, state) {
          if (state.status == BusinessDetailStatus.loading ||
              state.status == BusinessDetailStatus.initial) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }

          if (state.status == BusinessDetailStatus.error) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline_rounded,
                      size: 56,
                      color: AppTheme.error.withValues(alpha: 0.7),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Không thể tải thông tin',
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      state.errorMessage ?? 'Vui lòng thử lại',
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 14,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => context
                          .read<BusinessDetailCubit>()
                          .loadDetail(maCoSo),
                      icon: const Icon(Icons.refresh_rounded, size: 18),
                      label: Text(
                        'Thử lại',
                        style: GoogleFonts.inter(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          final detail = state.detail!;
          final coSo = detail.coSo;
          final status = _mapStatus(coSo.trangThai, detail.soViPham);

          return CustomScrollView(
            slivers: [
              // Hero image app bar
              SliverAppBar(
                expandedHeight: 220,
                pinned: true,
                stretch: true,
                backgroundColor: Colors.white,
                leading: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CircleAvatar(
                    backgroundColor: Colors.black.withValues(alpha: 0.3),
                    child: IconButton(
                      icon: const Icon(
                        Icons.arrow_back_ios_rounded,
                        size: 18,
                        color: Colors.white,
                      ),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ),
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      // Cover image
                      detail.anhBia != null && detail.anhBia!.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: detail.anhBia!,
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
                                  _buildDefaultHero(),
                            )
                          : _buildDefaultHero(),

                      // Gradient overlay
                      Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.black.withValues(alpha: 0.1),
                                Colors.black.withValues(alpha: 0.5),
                              ],
                              stops: const [0.3, 1.0],
                            ),
                          ),
                        ),
                      ),

                      // Business name overlay
                      Positioned(
                        bottom: 16,
                        left: 20,
                        right: 20,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              coSo.tenCoSo,
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                shadows: [
                                  Shadow(
                                    blurRadius: 8,
                                    color: Colors.black.withValues(alpha: 0.4),
                                  ),
                                ],
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                StatusBadge(status: status),
                                if (detail.soViPham > 0) ...[
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color:
                                          AppTheme.error.withValues(alpha: 0.9),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      '${detail.soViPham} vi phạm',
                                      style: GoogleFonts.inter(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Business types tags
                      if (detail.loaiHinhKinhDoanh.isNotEmpty) ...[
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: detail.loaiHinhKinhDoanh
                              .map(
                                (type) => Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color:
                                        AppTheme.primary.withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: AppTheme.primary
                                          .withValues(alpha: 0.2),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.restaurant_rounded,
                                        size: 14,
                                        color: AppTheme.primary,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        type,
                                        style: GoogleFonts.inter(
                                          color: AppTheme.primary,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                        const SizedBox(height: 20),
                      ],

                      // General Info Section
                      const SectionHeader(
                        title: 'Thông tin chung',
                        padding: EdgeInsets.symmetric(vertical: 8),
                      ),
                      _buildInfoCard([
                        _InfoItem(
                          icon: Icons.badge_outlined,
                          label: 'Mã cơ sở',
                          value: coSo.maCoSo,
                        ),
                        if (coSo.tenPhuongXa != null)
                          _InfoItem(
                            icon: Icons.location_on_outlined,
                            label: 'Phường / Xã',
                            value: coSo.tenPhuongXa!,
                          ),
                        if (coSo.tenChuSoHuu != null)
                          _InfoItem(
                            icon: Icons.person_outline_rounded,
                            label: 'Chủ sở hữu',
                            value: coSo.tenChuSoHuu!,
                          ),
                        if (coSo.soGiayPhep != null)
                          _InfoItem(
                            icon: Icons.description_outlined,
                            label: 'Số giấy phép',
                            value: coSo.soGiayPhep!,
                          ),
                        if (coSo.ngayHetHanGiayPhep != null)
                          _InfoItem(
                            icon: Icons.calendar_today_outlined,
                            label: 'Hết hạn GP',
                            value: coSo.ngayHetHanGiayPhep!,
                          ),
                      ]),

                      const SizedBox(height: 20),

                      // Certificates Section
                      if (detail.chungNhan.isNotEmpty) ...[
                        SectionHeader(
                          title: 'Chứng nhận ATVSTP',
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          actionText: '${detail.chungNhan.length} chứng nhận',
                        ),
                        ...detail.chungNhan.map(
                          (cn) => _CertificateCard(certificate: cn),
                        ),
                        const SizedBox(height: 20),
                      ],

                      // Licenses Section
                      if (detail.giayPhep.isNotEmpty) ...[
                        SectionHeader(
                          title: 'Giấy phép',
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          actionText: '${detail.giayPhep.length} giấy phép',
                        ),
                        ...detail.giayPhep.map(
                          (gp) => _LicenseCard(license: gp),
                        ),
                        const SizedBox(height: 20),
                      ],

                      // Empty state for no certificates or licenses
                      if (detail.chungNhan.isEmpty &&
                          detail.giayPhep.isEmpty) ...[
                        const SizedBox(height: 8),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceBg,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppTheme.dividerColor),
                          ),
                          child: Column(
                            children: [
                              Icon(
                                Icons.folder_open_rounded,
                                size: 40,
                                color: AppTheme.textSecondary
                                    .withValues(alpha: 0.4),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Chưa có chứng nhận hoặc giấy phép',
                                style: GoogleFonts.inter(
                                  color: AppTheme.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],

                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildDefaultHero() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primary.withValues(alpha: 0.2),
            AppTheme.primaryLight.withValues(alpha: 0.3),
            AppTheme.primary.withValues(alpha: 0.15),
          ],
        ),
      ),
      child: Center(
        child: Icon(
          Icons.store_rounded,
          color: AppTheme.primary.withValues(alpha: 0.4),
          size: 72,
        ),
      ),
    );
  }

  Widget _buildInfoCard(List<_InfoItem> items) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: items.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          final isLast = index == items.length - 1;

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        item.icon,
                        color: AppTheme.primary,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Text(
                      item.label,
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 13,
                      ),
                    ),
                    const Spacer(),
                    Flexible(
                      child: Text(
                        item.value,
                        style: GoogleFonts.inter(
                          color: AppTheme.textPrimary,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                        textAlign: TextAlign.end,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              if (!isLast)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Divider(
                    height: 1,
                    color: AppTheme.dividerColor.withValues(alpha: 0.5),
                  ),
                ),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class _InfoItem {
  final IconData icon;
  final String label;
  final String value;

  const _InfoItem({
    required this.icon,
    required this.label,
    required this.value,
  });
}

class _CertificateCard extends StatelessWidget {
  final CertificateModel certificate;

  const _CertificateCard({required this.certificate});

  bool get _isExpired {
    try {
      final parts = certificate.ngayHetHan.split('-');
      if (parts.length == 3) {
        final date = DateTime(
          int.parse(parts[0]),
          int.parse(parts[1]),
          int.parse(parts[2]),
        );
        return date.isBefore(DateTime.now());
      }
    } catch (_) {}
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final expired = _isExpired;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: expired
              ? AppTheme.error.withValues(alpha: 0.3)
              : AppTheme.dividerColor,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: expired
                  ? AppTheme.error.withValues(alpha: 0.1)
                  : AppTheme.success.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.verified_rounded,
              color: expired ? AppTheme.error : AppTheme.success,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  certificate.tenChungNhan,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '${certificate.ngayBanHanh} → ${certificate.ngayHetHan}',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          StatusBadge(
            status: expired ? SafetyStatus.violated : SafetyStatus.safe,
            customLabel: expired ? 'Hết hạn' : (certificate.trangThai ?? 'Hiệu lực'),
          ),
        ],
      ),
    );
  }
}

class _LicenseCard extends StatelessWidget {
  final LicenseModel license;

  const _LicenseCard({required this.license});

  bool get _isExpired {
    try {
      final parts = license.ngayHetHan.split('-');
      if (parts.length == 3) {
        final date = DateTime(
          int.parse(parts[0]),
          int.parse(parts[1]),
          int.parse(parts[2]),
        );
        return date.isBefore(DateTime.now());
      }
    } catch (_) {}
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final expired = _isExpired;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: expired
              ? AppTheme.error.withValues(alpha: 0.3)
              : AppTheme.dividerColor,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: expired
                  ? AppTheme.error.withValues(alpha: 0.1)
                  : AppTheme.accent.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.description_rounded,
              color: expired ? AppTheme.error : AppTheme.accent,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  license.loaiGiayPhep,
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '${license.ngayCap} → ${license.ngayHetHan}',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          StatusBadge(
            status: expired ? SafetyStatus.violated : SafetyStatus.safe,
            customLabel: expired ? 'Hết hạn' : (license.trangThai ?? 'Hiệu lực'),
          ),
        ],
      ),
    );
  }
}
