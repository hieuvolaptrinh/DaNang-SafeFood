import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

enum SafetyStatus { safe, warning, violated, processing }

class StatusBadge extends StatelessWidget {
  final SafetyStatus status;
  final String? customLabel;

  const StatusBadge({
    super.key,
    required this.status,
    this.customLabel,
  });

  Color get _backgroundColor {
    switch (status) {
      case SafetyStatus.safe:
        return const Color(0xFF4CAF50).withOpacity(0.15);
      case SafetyStatus.warning:
        return const Color(0xFFFF9800).withOpacity(0.15);
      case SafetyStatus.violated:
        return const Color(0xFFEF5350).withOpacity(0.15);
      case SafetyStatus.processing:
        return const Color(0xFF42A5F5).withOpacity(0.15);
    }
  }

  Color get _textColor {
    switch (status) {
      case SafetyStatus.safe:
        return const Color(0xFF4CAF50);
      case SafetyStatus.warning:
        return const Color(0xFFFF9800);
      case SafetyStatus.violated:
        return const Color(0xFFEF5350);
      case SafetyStatus.processing:
        return const Color(0xFF42A5F5);
    }
  }

  String get _label {
    if (customLabel != null) return customLabel!;
    switch (status) {
      case SafetyStatus.safe:
        return 'An toàn';
      case SafetyStatus.warning:
        return 'Cảnh báo';
      case SafetyStatus.violated:
        return 'Vi phạm';
      case SafetyStatus.processing:
        return 'Đang xử lý';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _backgroundColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        _label,
        style: GoogleFonts.inter(
          color: _textColor,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
