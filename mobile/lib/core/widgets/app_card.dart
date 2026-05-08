import 'package:flutter/material.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';

class AppCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? color;
  final double borderRadius;

  const AppCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.margin,
    this.color,
    this.borderRadius = 16,
  });

  @override
  State<AppCard> createState() => _AppCardState();
}

class _AppCardState extends State<AppCard> {
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
    final hasTap = widget.onTap != null;
    final shadowColor = Colors.black.withValues(alpha: _pressed ? 0.08 : 0.05);
    final shadowBlur = _pressed ? 16.0 : 10.0;
    final shadowOffset = Offset(0, _pressed ? 4 : 2);

    return GestureDetector(
      onTap: widget.onTap,
      onTapDown: hasTap ? (_) => _setPressed(true) : null,
      onTapCancel: hasTap ? () => _setPressed(false) : null,
      onTapUp: hasTap ? (_) => _setPressed(false) : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        curve: Curves.easeOut,
        margin: widget.margin ?? const EdgeInsets.only(bottom: 12),
        padding: widget.padding ?? const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: widget.color ?? AppTheme.cardColor,
          borderRadius: BorderRadius.circular(widget.borderRadius),
          boxShadow: [
            BoxShadow(
              color: shadowColor,
              blurRadius: shadowBlur,
              offset: shadowOffset,
            ),
          ],
        ),
        child: widget.child,
      ),
    );
  }
}
