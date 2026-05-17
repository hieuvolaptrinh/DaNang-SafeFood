import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/data/remote/model/violation_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/violation/violation_cubit.dart';
import 'package:mobile_ui/viewmodel/violation/violation_state.dart';

/// Danh sách vi phạm của CSKD đăng nhập.
/// Dữ liệu lấy từ API: GET /api/user/vi-pham
class ViolationListPage extends StatefulWidget {
  const ViolationListPage({super.key});

  @override
  State<ViolationListPage> createState() => _ViolationListPageState();
}

class _ViolationListPageState extends State<ViolationListPage> {
  String _selectedFilter = 'Tất cả';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ViolationCubit>().loadMyViolations();
    });
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
          'Vi phạm & Xử phạt',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: BlocBuilder<ViolationCubit, ViolationState>(
        builder: (context, state) {
          if (state.status == ViolationStatus.loading) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }

          if (state.status == ViolationStatus.error) {
            return _ErrorView(
              message: state.errorMessage ?? 'Không thể tải dữ liệu',
              onRetry: () => context.read<ViolationCubit>().loadMyViolations(),
            );
          }

          final all = state.violations;
          final filtered = all.where((v) {
            switch (_selectedFilter) {
              case 'Đã khắc phục':
                return v.daKhacPhuc;
              case 'Đang khắc phục':
                return v.dangKhacPhuc;
              case 'Chưa khắc phục':
                return !v.daKhacPhuc && !v.dangKhacPhuc;
              default:
                return true;
            }
          }).toList();

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _Filters(
                selected: _selectedFilter,
                onChanged: (v) => setState(() => _selectedFilter = v),
              ),
              Expanded(
                child: filtered.isEmpty
                    ? _EmptyView(filter: _selectedFilter)
                    : RefreshIndicator(
                        color: AppTheme.primary,
                        onRefresh: () =>
                            context.read<ViolationCubit>().loadMyViolations(),
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 10,
                          ),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) =>
                              _ViolationCard(violation: filtered[i]),
                        ),
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _Filters extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onChanged;
  const _Filters({required this.selected, required this.onChanged});

  static const _options = [
    'Tất cả',
    'Chưa khắc phục',
    'Đang khắc phục',
    'Đã khắc phục',
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Row(
        children: _options.map((opt) {
          final isSelected = opt == selected;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(opt),
              selected: isSelected,
              onSelected: (s) {
                if (s) onChanged(opt);
              },
              backgroundColor: AppTheme.surfaceBg,
              selectedColor: AppTheme.primary.withValues(alpha: 0.18),
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
    );
  }
}

class _ViolationCard extends StatelessWidget {
  final ViolationModel violation;
  const _ViolationCard({required this.violation});

  @override
  Widget build(BuildContext context) {
    final daKhacPhuc = violation.daKhacPhuc;
    final dangKhacPhuc = violation.dangKhacPhuc;

    final Color iconColor;
    final IconData iconData;
    final SafetyStatus badgeStatus;
    if (daKhacPhuc) {
      iconColor = AppTheme.success;
      iconData = Icons.check_circle_rounded;
      badgeStatus = SafetyStatus.safe;
    } else if (dangKhacPhuc) {
      iconColor = AppTheme.info;
      iconData = Icons.hourglass_top_rounded;
      badgeStatus = SafetyStatus.processing;
    } else {
      iconColor = AppTheme.error;
      iconData = Icons.gavel_rounded;
      badgeStatus = SafetyStatus.violated;
    }

    return AppCard(
      onTap: () => Navigator.pushNamed(
        context,
        Routes.violationDetail,
        arguments: {'id': violation.maViPham},
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(iconData, color: iconColor, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  violation.tenLoaiViPham ?? 'Vi phạm',
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
                  violation.tenCoSo ?? '',
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 11,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  _formatVnd(violation.tongTienPhat),
                  style: GoogleFonts.inter(
                    color: AppTheme.error,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          StatusBadge(
            status: badgeStatus,
            customLabel: violation.tinhTrangKhacPhucLabel,
          ),
        ],
      ),
    );
  }
}

class _EmptyView extends StatelessWidget {
  final String filter;
  const _EmptyView({required this.filter});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.inbox_outlined,
              size: 56,
              color: AppTheme.textSecondary.withValues(alpha: 0.4),
            ),
            const SizedBox(height: 12),
            Text(
              filter == 'Tất cả'
                  ? 'Chưa có vi phạm nào'
                  : 'Không có dữ liệu phù hợp',
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorView({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 56, color: AppTheme.error),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }
}

String _formatVnd(double amount) {
  final str = amount.toInt().toString();
  final buf = StringBuffer();
  int count = 0;
  for (int i = str.length - 1; i >= 0; i--) {
    buf.write(str[i]);
    count++;
    if (count % 3 == 0 && i != 0) buf.write('.');
  }
  return '${buf.toString().split('').reversed.join()} VNĐ';
}
