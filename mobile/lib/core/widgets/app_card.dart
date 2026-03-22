import 'package:flutter/material.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';

class AppCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: margin ?? const EdgeInsets.only(bottom: 12),
        padding: padding ?? const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color ?? AppTheme.spotifyDarkGray,
          borderRadius: BorderRadius.circular(borderRadius),
          border: Border.all(
            color: AppTheme.spotifyLightGray.withOpacity(0.5),
            width: 0.5,
          ),
        ),
        child: child,
      ),
    );
  }
}
