import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/error_state_view.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/ui/business_management/widgets/ho_so_form_sheet.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

/// Trang Quản lý kinh doanh dành cho CSKD.
///
/// - Hiển thị các cơ sở của tôi (API: GET /api/user/my-business)
/// - Tab "Hồ sơ": filter theo cơ sở, CRUD (POST/PUT/DELETE /api/user/my-business/ho-so)
class BusinessManagementPage extends StatefulWidget {
  const BusinessManagementPage({super.key});

  @override
  State<BusinessManagementPage> createState() => _BusinessManagementPageState();
}

class _BusinessManagementPageState extends State<BusinessManagementPage>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<BusinessManagementCubit, BusinessMgmtState>(
      listenWhen: (p, c) =>
          p.mutateMessage != c.mutateMessage || p.mutateError != c.mutateError,
      listener: (context, state) {
        if (state.mutateMessage != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.mutateMessage!),
              backgroundColor: AppTheme.success,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
        if (state.mutateError != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.mutateError!),
              backgroundColor: AppTheme.error,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      },
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

        return SafeArea(
          child: Column(
            children: [
              _Header(businessCount: state.businesses.length),
              TabBar(
                controller: _tab,
                labelColor: AppTheme.primary,
                unselectedLabelColor: AppTheme.textSecondary,
                indicatorColor: AppTheme.primary,
                indicatorSize: TabBarIndicatorSize.label,
                labelStyle: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
                tabs: const [
                  Tab(text: 'Cơ sở của tôi'),
                  Tab(text: 'Hồ sơ đăng kí'),
                ],
              ),
              Expanded(
                child: TabBarView(
                  controller: _tab,
                  children: [
                    _BusinessListTab(businesses: state.businesses),
                    _HoSoTab(state: state),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Header extends StatelessWidget {
  final int businessCount;
  const _Header({required this.businessCount});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Quản lý kinh doanh',
                  style: GoogleFonts.inter(
                    color: AppTheme.textPrimary,
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$businessCount cơ sở đang hoạt động',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => context.read<BusinessManagementCubit>().refresh(),
            icon: const Icon(
              Icons.refresh_rounded,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Tab 1: Cơ sở của tôi
// ─────────────────────────────────────────────────────────

class _BusinessListTab extends StatelessWidget {
  final List<MyBusinessModel> businesses;
  const _BusinessListTab({required this.businesses});

  @override
  Widget build(BuildContext context) {
    if (businesses.isEmpty) {
      return _EmptyState(
        icon: Icons.store_outlined,
        title: 'Bạn chưa có cơ sở nào',
        subtitle: 'Đăng ký kinh doanh để bắt đầu',
        actionLabel: 'Đăng ký kinh doanh',
        onAction: () =>
            Navigator.pushNamed(context, Routes.businessRegistration),
      );
    }

    return RefreshIndicator(
      onRefresh: () => context.read<BusinessManagementCubit>().refresh(),
      color: AppTheme.primary,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
        itemCount: businesses.length + 1,
        itemBuilder: (_, i) {
          if (i == 0) return const _QuickActionsRow();
          final b = businesses[i - 1];
          return _BusinessCard(business: b);
        },
      ),
    );
  }
}

class _QuickActionsRow extends StatelessWidget {
  const _QuickActionsRow();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Expanded(
            child: _QuickAction(
              icon: Icons.add_business_rounded,
              label: 'Đăng ký kinh doanh',
              color: AppTheme.primary,
              onTap: () =>
                  Navigator.pushNamed(context, Routes.businessRegistration),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _QuickAction(
              icon: Icons.gavel_rounded,
              label: 'Vi phạm & xử phạt',
              color: AppTheme.error,
              onTap: () => Navigator.pushNamed(context, Routes.violationList),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({
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
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withValues(alpha: 0.25)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
            ),
          ],
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
    final isActive =
        business.trangThai.toLowerCase().contains('hoat dong') ||
        business.trangThai.toLowerCase().contains('hoạt động');

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadow.level1,
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.pushNamed(
          context,
          Routes.businessDetail,
          arguments: {'maCoSo': business.maCoSo},
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.store_rounded,
                  color: AppTheme.primary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
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
                    Text(
                      'Mã: ${business.maCoSo} '
                      '${business.tenPhuongXa != null ? '• ${business.tenPhuongXa}' : ''}',
                      style: GoogleFonts.inter(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (business.soGiayPhep != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        'GP: ${business.soGiayPhep}',
                        style: GoogleFonts.inter(
                          color: AppTheme.textTertiary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(width: 8),
              StatusBadge(
                status: isActive ? SafetyStatus.safe : SafetyStatus.warning,
                customLabel: isActive ? 'Hoạt động' : business.trangThai,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Tab 2: Hồ sơ đăng kí
// ─────────────────────────────────────────────────────────

class _HoSoTab extends StatelessWidget {
  final BusinessMgmtState state;
  const _HoSoTab({required this.state});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _CoSoFilter(
          businesses: state.businesses,
          selectedId: state.selectedCoSoId,
          onChanged: (id) =>
              context.read<BusinessManagementCubit>().selectCoSo(id),
        ),
        Expanded(
          child: state.hoSoList.isEmpty
              ? _EmptyState(
                  icon: Icons.description_outlined,
                  title: 'Chưa có hồ sơ',
                  subtitle: 'Tạo hồ sơ đăng kí kinh doanh mới',
                  actionLabel: 'Thêm hồ sơ',
                  onAction: () => _openForm(context, null),
                )
              : RefreshIndicator(
                  onRefresh: () => context
                      .read<BusinessManagementCubit>()
                      .selectCoSo(state.selectedCoSoId),
                  color: AppTheme.primary,
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
                    itemCount: state.hoSoList.length,
                    itemBuilder: (_, i) => _HoSoCard(
                      hoSo: state.hoSoList[i],
                      onEdit: () => _openForm(context, state.hoSoList[i]),
                      onDelete: () =>
                          _confirmDelete(context, state.hoSoList[i]),
                    ),
                  ),
                ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: state.businesses.isEmpty
                  ? null
                  : () => _openForm(context, null),
              icon: const Icon(Icons.add_rounded, size: 20),
              label: Text(
                'Thêm hồ sơ mới',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _openForm(BuildContext context, HoSoDangKiModel? hoSo) async {
    final cubit = context.read<BusinessManagementCubit>();
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BlocProvider.value(
        value: cubit,
        child: HoSoFormSheet(initial: hoSo),
      ),
    );
  }

  Future<void> _confirmDelete(
    BuildContext context,
    HoSoDangKiModel hoSo,
  ) async {
    final cubit = context.read<BusinessManagementCubit>();
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        title: Text(
          'Xoá hồ sơ?',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        content: Text(
          'Bạn chắc chắn muốn xoá hồ sơ ${hoSo.maHoSo}?',
          style: GoogleFonts.inter(fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Huỷ'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Xoá', style: GoogleFonts.inter(color: AppTheme.error)),
          ),
        ],
      ),
    );
    if (ok == true) {
      await cubit.deleteHoSo(hoSo.maHoSo);
    }
  }
}

class _CoSoFilter extends StatelessWidget {
  final List<MyBusinessModel> businesses;
  final String? selectedId;
  final ValueChanged<String?> onChanged;

  const _CoSoFilter({
    required this.businesses,
    required this.selectedId,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
      child: Row(
        children: [
          _Chip(
            label: 'Tất cả',
            selected: selectedId == null,
            onTap: () => onChanged(null),
          ),
          ...businesses.map(
            (b) => Padding(
              padding: const EdgeInsets.only(left: 8),
              child: _Chip(
                label: b.tenCoSo,
                selected: selectedId == b.maCoSo,
                onTap: () => onChanged(b.maCoSo),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _Chip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected
              ? AppTheme.primary.withValues(alpha: 0.15)
              : AppTheme.surfaceBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? AppTheme.primary : AppTheme.dividerColor,
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
            color: selected ? AppTheme.primary : AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }
}

class _HoSoCard extends StatelessWidget {
  final HoSoDangKiModel hoSo;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _HoSoCard({
    required this.hoSo,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final approved =
        (hoSo.trangThai ?? '').toLowerCase().contains('da duyet') ||
        (hoSo.trangThai ?? '').toLowerCase().contains('đã duyệt');
    final rejected =
        (hoSo.trangThai ?? '').toLowerCase().contains('tu choi') ||
        (hoSo.trangThai ?? '').toLowerCase().contains('từ chối');

    final SafetyStatus s;
    final String label = hoSo.trangThai ?? 'Chưa duyệt';
    if (approved) {
      s = SafetyStatus.safe;
    } else if (rejected) {
      s = SafetyStatus.violated;
    } else {
      s = SafetyStatus.processing;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
        boxShadow: AppShadow.level1,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.description_rounded,
                  color: AppTheme.primary,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hồ sơ ${hoSo.maHoSo}',
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (hoSo.tenCoSo != null)
                      Text(
                        hoSo.tenCoSo!,
                        style: GoogleFonts.inter(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ),
              StatusBadge(status: s, customLabel: label),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                size: 14,
                color: AppTheme.textSecondary,
              ),
              const SizedBox(width: 6),
              Text(
                'Ngày nộp: ${_formatDate(hoSo.ngayNop)}',
                style: GoogleFonts.inter(
                  color: AppTheme.textSecondary,
                  fontSize: 12,
                ),
              ),
              const Spacer(),
              IconButton(
                onPressed: onEdit,
                icon: const Icon(
                  Icons.edit_outlined,
                  size: 20,
                  color: AppTheme.primary,
                ),
                visualDensity: VisualDensity.compact,
              ),
              IconButton(
                onPressed: onDelete,
                icon: const Icon(
                  Icons.delete_outline_rounded,
                  size: 20,
                  color: AppTheme.error,
                ),
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

String _formatDate(DateTime? d) {
  if (d == null) return '--/--/----';
  final dd = d.day.toString().padLeft(2, '0');
  final mm = d.month.toString().padLeft(2, '0');
  return '$dd/$mm/${d.year}';
}

// ─────────────────────────────────────────────────────────

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String actionLabel;
  final VoidCallback onAction;

  const _EmptyState({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.actionLabel,
    required this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 56,
              color: AppTheme.textTertiary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: onAction,
              icon: const Icon(Icons.add_rounded, size: 18),
              label: Text(actionLabel),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
