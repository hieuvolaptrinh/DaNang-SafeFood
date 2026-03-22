import 'package:flutter/material.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/routes/app_router.dart';
import 'package:mobile_ui/routes/routes.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ATTP Đà Nẵng',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      initialRoute: Routes.login,
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
