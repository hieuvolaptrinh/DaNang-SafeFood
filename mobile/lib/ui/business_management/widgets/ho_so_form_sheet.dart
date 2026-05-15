import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/data/remote/model/my_business_models.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_state.dart';

/// Bottom sheet để tạo mới hoặc cập nhật hồ sơ đăng kí kinh doanh.
/// Truyền `initial` để chuyển sang chế độ edit.
class HoSoFormSheet extends StatefulWidget {
  final HoSoDangKiModel? initial;
  const HoSoFormSheet({super.key, this.initial});

  @override
  State<HoSoFormSheet> createState() => _HoSoFormSheetState();
}

class _HoSoFormSheetState extends State<HoSoFormSheet> {
  String? _maCoSo;
  DateTime? _ngayNop;
  String _trangThai = 'Chua duyet';

  static const _trangThaiOptions = ['Chua duyet', 'Da duyet', 'Tu choi'];

  static const _trangThaiLabels = {
    'Chua duyet': 'Chưa duyệt',
    'Da duyet': 'Đã duyệt',
    'Tu choi': 'Từ chối',
  };

  bool get isEdit => widget.initial != null;

  @override
  void initState() {
    super.initState();
    if (widget.initial != null) {
      _maCoSo = widget.initial!.maCoSo;
      _ngayNop = widget.initial!.ngayNop;
      _trangThai = widget.initial!.trangThai ?? 'Chua duyet';
      if (!_trangThaiOptions.contains(_trangThai)) {
        _trangThaiOptions.add(_trangThai);
      }
    } else {
      _ngayNop = DateTime.now();
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BusinessManagementCubit, BusinessMgmtState>(
      builder: (context, state) {
        // Mặc định chọn cơ sở đầu tiên cho mode tạo mới
        if (!isEdit && _maCoSo == null && state.businesses.isNotEmpty) {
          _maCoSo = state.businesses.first.maCoSo;
        }

        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: AppTheme.dividerColor,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  Text(
                    isEdit ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ mới',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    isEdit
                        ? 'Mã hồ sơ: ${widget.initial!.maHoSo}'
                        : 'Đăng kí hồ sơ kinh doanh cho cơ sở của bạn',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Cơ sở
                  _Label('Cơ sở kinh doanh'),
                  const SizedBox(height: 6),
                  _Dropdown<String>(
                    value: _maCoSo,
                    items: state.businesses
                        .map(
                          (b) => DropdownMenuItem(
                            value: b.maCoSo,
                            child: Text(
                              b.tenCoSo,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        )
                        .toList(),
                    onChanged: (v) => setState(() => _maCoSo = v),
                    hint: 'Chọn cơ sở',
                  ),

                  const SizedBox(height: 16),

                  // Ngày nộp
                  _Label('Ngày nộp'),
                  const SizedBox(height: 6),
                  GestureDetector(
                    onTap: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: _ngayNop ?? DateTime.now(),
                        firstDate: DateTime(2020),
                        lastDate: DateTime.now(),
                      );
                      if (picked != null) {
                        setState(() => _ngayNop = picked);
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.dividerColor),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.calendar_today_outlined,
                            size: 18,
                            color: AppTheme.textSecondary,
                          ),
                          const SizedBox(width: 10),
                          Text(
                            _ngayNop == null
                                ? 'Chọn ngày'
                                : _formatDate(_ngayNop!),
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: _ngayNop == null
                                  ? AppTheme.textSecondary
                                  : AppTheme.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Trạng thái
                  _Label('Trạng thái'),
                  const SizedBox(height: 6),
                  _Dropdown<String>(
                    value: _trangThai,
                    items: _trangThaiOptions
                        .map(
                          (t) => DropdownMenuItem(
                            value: t,
                            child: Text(_trangThaiLabels[t] ?? t),
                          ),
                        )
                        .toList(),
                    onChanged: (v) =>
                        setState(() => _trangThai = v ?? _trangThai),
                  ),

                  const SizedBox(height: 24),

                  // Submit
                  AppButton(
                    text: isEdit ? 'Cập nhật' : 'Tạo hồ sơ',
                    isLoading: state.isMutating,
                    icon: isEdit
                        ? Icons.save_rounded
                        : Icons.add_circle_outline_rounded,
                    onPressed: state.businesses.isEmpty || _maCoSo == null
                        ? null
                        : () => _submit(context),
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _submit(BuildContext context) async {
    final cubit = context.read<BusinessManagementCubit>();
    final ok = isEdit
        ? await cubit.updateHoSo(
            maHoSo: widget.initial!.maHoSo,
            maCoSo: _maCoSo!,
            ngayNop: _ngayNop,
            trangThai: _trangThai,
          )
        : await cubit.createHoSo(
            maCoSo: _maCoSo!,
            ngayNop: _ngayNop,
            trangThai: _trangThai,
          );
    if (ok && context.mounted) {
      Navigator.pop(context);
    }
  }
}

class _Label extends StatelessWidget {
  // ignore: unused_element_parameter
  final String text;
  // ignore: unused_element
  const _Label(this.text);

  @override
  Widget build(BuildContext context) => Text(
    text,
    style: GoogleFonts.inter(
      fontSize: 13,
      fontWeight: FontWeight.w500,
      color: AppTheme.textPrimary,
    ),
  );
}

class _Dropdown<T> extends StatelessWidget {
  final T? value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?> onChanged;
  final String? hint;

  const _Dropdown({
    required this.value,
    required this.items,
    required this.onChanged,
    this.hint,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: AppTheme.surfaceBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.dividerColor),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<T>(
          value: value,
          isExpanded: true,
          hint: hint != null
              ? Text(
                  hint!,
                  style: GoogleFonts.inter(
                    color: AppTheme.textSecondary,
                    fontSize: 14,
                  ),
                )
              : null,
          items: items,
          onChanged: onChanged,
          style: GoogleFonts.inter(color: AppTheme.textPrimary, fontSize: 14),
          icon: const Icon(
            Icons.keyboard_arrow_down_rounded,
            color: AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }
}

String _formatDate(DateTime d) {
  final dd = d.day.toString().padLeft(2, '0');
  final mm = d.month.toString().padLeft(2, '0');
  return '$dd/$mm/${d.year}';
}
