import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';

class AppButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isOutlined;
  final Color? backgroundColor;
  final Color? textColor;
  final IconData? icon;
  final double? width;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isOutlined = false,
    this.backgroundColor,
    this.textColor,
    this.icon,
    this.width,
  });

  @override
  State<AppButton> createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton> {
  bool _pressed = false;

  void _setPressed(bool value) {
    if (_pressed == value) {
      return;
    }
    setState(() {
      _pressed = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = widget.backgroundColor ?? AppTheme.primary;
    final fgColor = widget.textColor ?? Colors.white;
    final isDisabled = widget.isLoading || widget.onPressed == null;
    final shadowColor = widget.isOutlined
        ? Colors.black.withValues(alpha: 0.06)
        : Colors.black.withValues(alpha: 0.15);
    final buttonShadow = BoxShadow(
      color: shadowColor,
      blurRadius: widget.isOutlined ? 10 : 12,
      offset: const Offset(0, 6),
    );
    final shape = const StadiumBorder();

    Widget buttonChild;
    if (widget.isOutlined) {
      buttonChild = OutlinedButton(
        onPressed: isDisabled ? null : widget.onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: fgColor,
          backgroundColor: Colors.white,
          side: BorderSide.none,
          shape: shape,
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
        ),
        child: _buildChild(fgColor),
      );
    } else {
      buttonChild = ElevatedButton(
        onPressed: isDisabled ? null : widget.onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: bgColor,
          foregroundColor: fgColor,
          elevation: 0,
          shape: shape,
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 28),
        ),
        child: _buildChild(fgColor),
      );
    }

    return GestureDetector(
      onTapDown: isDisabled ? null : (_) => _setPressed(true),
      onTapUp: isDisabled ? null : (_) => _setPressed(false),
      onTapCancel: isDisabled ? null : () => _setPressed(false),
      child: AnimatedScale(
        scale: _pressed ? 0.98 : 1,
        duration: const Duration(milliseconds: 120),
        curve: Curves.easeOut,
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            boxShadow: isDisabled ? [] : [buttonShadow],
          ),
          child: SizedBox(
            width: widget.width ?? double.infinity,
            child: buttonChild,
          ),
        ),
      ),
    );
  }

  Widget _buildChild(Color fgColor) {
    if (widget.isLoading) {
      return SizedBox(
        height: 11,
        width: 11,
        child: CircularProgressIndicator(strokeWidth: 2.5, color: fgColor),
      );
    }

    if (widget.icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(widget.icon, size: 20),
          const SizedBox(width: 8),
          Text(
            widget.text,
            style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600),
          ),
        ],
      );
    }

    return Text(
      widget.text,
      style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600),
    );
  }
}
