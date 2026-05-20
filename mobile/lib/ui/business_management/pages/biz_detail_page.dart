import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

/// Chi tiết 1 cơ sở kinh doanh.
/// Hiển thị: thông tin cơ sở, trạng thái kinh doanh, danh sách giấy tờ (đủ/thiếu),
/// và các nút hành động (xem vi phạm, nộp phạt, khiếu nại).
class BizDetailPage extends StatelessWidget {
  final String businessName;

  const BizDetailPage({super.key, required this.businessName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Chi tiết cơ sở',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: BlocBuilder<BusinessManagementCubit, BusinessMgmtState>(
        builder: (context, state) {
          // Tìm cơ sở theo tên (hoặc maCoSo nếu truyền qua arguments)
          final biz = state.businesses.firstWhere(
            (b) => b.tenCoSo == businessName || b.maCoSo == businessName,
            orElse: () => state.businesses.isNotEmpty
                ? state.businesses.first
                : MyBusinessModel(
                    maCoSo: '',
                    tenCoSo: businessName,
                    trangThai: 'Hoat dong',
                  ),
          );

          // Lọc hồ sơ thuộc cơ sở này
          final hoSoList = state.hoSoList
              .where((h) => h.maCoSo == biz.maCoSo)
              .toList();

          // 4 loại giấy tờ cần có
          const requiredDocs = [
            'HOP_DONG_THUE_MAT_BANG',
            'GIAY_PHEP_ATTP',
            'GIAY_TO_PCCC',
            'GIAY_PHEP_KINH_DOANH',
          ];
          const docLabels = {
            'HOP_DONG_THUE_MAT_BANG': 'Hợp đồng thuê mặt bằng',
            'GIAY_PHEP_ATTP': 'Giấy phép ATTP',
            'GIAY_TO_PCCC': 'Giấy tờ PCCC',
            'GIAY_PHEP_KINH_DOANH': 'Giấy phép kinh doanh',
          };

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header card
                _BizHeaderCard(biz: biz),
                const SizedBox(height: 20),

                // Quick actions
                _SectionTitle(title: 'Thao tác'),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _ActionChip(
                        icon: Icons.gavel_rounded,
                        label: 'Vi phạm',
                        color: AppTheme.error,
                        onTap: () =>
                            Navigator.pushNamed(context, Routes.violationList),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _ActionChip(
                        icon: Icons.upload_file_rounded,
                        label: 'Giấy tờ',
                        color: AppTheme.info,
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.documentUpload,
                          arguments: {'maCoSo': biz.maCoSo},
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _ActionChip(
                        icon: Icons.feedback_outlined,
                        label: 'Khiếu nại',
                        color: AppTheme.accent,
                        onTap: () => Navigator.pushNamed(
                          context,
                          Routes.businessComplaint,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Giấy tờ section
                _SectionTitle(title: 'Giấy tờ kinh doanh'),
                const SizedBox(height: 4),
                Text(
                  'Cần đủ 4 loại giấy tờ để được phép kinh doanh',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 12),

                ...requiredDocs.map((docType) {
                  final existing = hoSoList.where(
                    (h) => h.maLoaiGiayTo == docType,
                  );
                  final hasDoc = existing.isNotEmpty;
                  final doc = hasDoc ? existing.first : null;
                  final isExpired =
                      doc?.trangThai?.toLowerCase().contains('hết hạn') ??
                      false;
                  final canSubmit = !hasDoc || isExpired;

                  return _DocumentStatusCard(
                    label: docLabels[docType] ?? docType,
                    hasDoc: hasDoc,
                    isExpired: isExpired,
                    trangThai: doc?.trangThai,
                    ngayHetHan: doc?.ngayHetHan,
                    onTap: canSubmit
                        ? () => Navigator.pushNamed(
                            context,
                            Routes.documentUpload,
                            arguments: {
                              'maCoSo': biz.maCoSo,
                              'maLoaiGiayTo': docType,
                            },
                          )
                        : null,
                  );
                }),

                const SizedBox(height: 24),

                // Hồ sơ chi tiết
                if (hoSoList.isNotEmpty) ...[
                  _SectionTitle(title: 'Danh sách hồ sơ'),
                  const SizedBox(height: 12),
                  ...hoSoList.map((hs) => _HoSoDetailCard(hoSo: hs)),
                ],

                const SizedBox(height: 40),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _BizHeaderCard extends StatelessWidget {
  final MyBusinessModel biz;
  const _BizHeaderCard({required this.biz});

  @override
  Widget build(BuildContext context) {
    final isActive = biz.trangThaiKinhDoanh == 'DANG_HOAT_DONG';
    final isBanned = biz.trangThaiKinhDoanh == 'BI_CAM';
    final isWarning = biz.trangThaiKinhDoanh == 'CANH_CAO_VI_PHAM';

    final SafetyStatus badge;
    if (isActive) {
      badge = SafetyStatus.safe;
    } else if (isBanned) {
      badge = SafetyStatus.violated;
    } else if (isWarning) {
      badge = SafetyStatus.warning;
    } else {
      badge = SafetyStatus.processing;
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: AppShadow.level1,
      ),
      child: Column(
        children: [
          // Avatar
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              color: AppTheme.primary.withValues(alpha: 0.1),
              image: biz.anhBia != null
                  ? DecorationImage(
                      image: NetworkImage(biz.anhBia!),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: biz.anhBia == null
                ? const Icon(
                    Icons.store_rounded,
                    color: AppTheme.primary,
                    size: 30,
                  )
                : null,
          ),
          const SizedBox(height: 14),
          Text(
            biz.tenCoSo,
            style: GoogleFonts.inter(
              color: AppTheme.textPrimary,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          if (biz.tenPhuongXa != null)
            Text(
              biz.tenPhuongXa!,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
            ),
          const SizedBox(height: 10),
          StatusBadge(
            status: badge,
            customLabel: biz.trangThaiKinhDoanhLabel ?? biz.trangThai,
          ),
          const SizedBox(height: 14),
          // Info row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _MiniInfo(label: 'Mã', value: biz.maCoSo),
              _MiniInfo(label: 'GP', value: biz.soGiayPhep ?? '—'),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniInfo extends StatelessWidget {
  final String label;
  final String value;
  const _MiniInfo({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label,
          style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 11),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: GoogleFonts.inter(
            color: AppTheme.textPrimary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

class _DocumentStatusCard extends StatelessWidget {
  final String label;
  final bool hasDoc;
  final bool isExpired;
  final String? trangThai;
  final DateTime? ngayHetHan;
  final VoidCallback? onTap;

  const _DocumentStatusCard({
    required this.label,
    required this.hasDoc,
    required this.isExpired,
    this.trangThai,
    this.ngayHetHan,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color color;
    final IconData icon;
    final String statusText;

    if (!hasDoc) {
      color = AppTheme.textTertiary;
      icon = Icons.remove_circle_outline;
      statusText = 'Bổ sung sau';
    } else if (isExpired) {
      color = AppTheme.error;
      icon = Icons.warning_amber_rounded;
      statusText = 'Hết hạn';
    } else {
      color = AppTheme.success;
      icon = Icons.check_circle_rounded;
      statusText = trangThai ?? 'Đã duyệt';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                Icon(icon, color: color, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    label,
                    style: GoogleFonts.inter(
                      color: AppTheme.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                Text(
                  statusText,
                  style: GoogleFonts.inter(
                    color: color,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (onTap != null) ...[
                  const SizedBox(width: 6),
                  Icon(
                    Icons.add_circle_outline_rounded,
                    color: color,
                    size: 18,
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _HoSoDetailCard extends StatelessWidget {
  final HoSoDangKiModel hoSo;
  const _HoSoDetailCard({required this.hoSo});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.dividerColor, width: 0.5),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.description_outlined,
              color: AppTheme.primary,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  hoSo.tenLoaiGiayTo ?? 'Hồ sơ ${hoSo.maHoSo}',
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (hoSo.ngayHetHan != null)
                  Text(
                    'Hết hạn: ${_fmt(hoSo.ngayHetHan!)}',
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 11,
                    ),
                  ),
              ],
            ),
          ),
          Text(
            hoSo.trangThai ?? '',
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  String _fmt(DateTime d) {
    return '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
  }
}

class _ActionChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionChip({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(
              label,
              style: GoogleFonts.inter(
                color: color,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: GoogleFonts.inter(
        color: AppTheme.textPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}
