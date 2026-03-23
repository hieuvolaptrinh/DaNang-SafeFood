import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';

/// ThemeCubit - currently only light theme is used.
/// Kept for potential future multi-theme support.
class ThemeCubit extends Cubit<ThemeMode> {
  ThemeCubit() : super(ThemeMode.light);
}
