import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/utils/dio_client.dart';
import 'package:mobile_ui/data/local/token_storage.dart';
import 'package:mobile_ui/data/remote/datasource/auth_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/auth_repository.dart';
import 'package:mobile_ui/routes/app_router.dart';
import 'package:mobile_ui/ui/login/login_page.dart';
import 'package:mobile_ui/ui/main/main_scaffold.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';
import 'package:mobile_ui/viewmodel/auth/auth_state.dart';
import 'package:mobile_ui/viewmodel/login/login_cubit.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    final tokenStorage = TokenStorage();
    final authRepository = AuthRepository(
      remoteDataSource: AuthRemoteDataSource(dio: DioClient().dio),
      tokenStorage: tokenStorage,
    );

    return BlocProvider(
      create: (_) => AuthCubit(tokenStorage: tokenStorage)..checkAuthStatus(),
      child: BlocBuilder<AuthCubit, AuthState>(
        buildWhen: (prev, curr) => prev.status != curr.status,
        builder: (context, authState) {
          // Đang kiểm tra token → hiển thị splash
          if (authState.status == AuthStatus.unknown) {
            return MaterialApp(
              debugShowCheckedModeBanner: false,
              theme: AppTheme.lightTheme,
              home: const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              ),
            );
          }

          final isLoggedIn = authState.isAuthenticated;

          return MaterialApp(
            title: 'ATTP Đà Nẵng',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            themeMode: ThemeMode.light,
            // Key thay đổi theo status → Flutter tạo mới Navigator
            key: ValueKey(isLoggedIn),
            onGenerateRoute: AppRouter.onGenerateRoute,
            home: isLoggedIn
                ? const MainScaffold()
                : BlocProvider(
                    create: (_) =>
                        LoginCubit(authRepository: authRepository),
                    child: const LoginPage(),
                  ),
          );
        },
      ),
    );
  }
}
