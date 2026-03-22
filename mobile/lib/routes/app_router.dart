import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/ui/login/login_page.dart';
import 'package:mobile_ui/ui/register/register_page.dart';
import 'package:mobile_ui/ui/forgot_password/forgot_password_page.dart';
import 'package:mobile_ui/ui/main/main_scaffold.dart';
import 'package:mobile_ui/ui/account/account_page.dart';
import 'package:mobile_ui/ui/search/business_detail_page.dart';
import 'package:mobile_ui/ui/notification/notification_detail_page.dart';
import 'package:mobile_ui/ui/complaint/complaint_form_page.dart';
import 'package:mobile_ui/ui/complaint/complaint_detail_page.dart';
import 'package:mobile_ui/viewmodel/login/login_cubit.dart';
import 'package:mobile_ui/viewmodel/register/register_cubit.dart';
import 'package:mobile_ui/viewmodel/forgot_password/forgot_password_cubit.dart';
import 'package:mobile_ui/viewmodel/account/account_cubit.dart';

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case Routes.login:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => LoginCubit(),
            child: const LoginPage(),
          ),
        );

      case Routes.register:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => RegisterCubit(),
            child: const RegisterPage(),
          ),
        );

      case Routes.forgotPassword:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => ForgotPasswordCubit(),
            child: const ForgotPasswordPage(),
          ),
        );

      case Routes.main:
        return MaterialPageRoute(
          builder: (_) => const MainScaffold(),
        );

      case Routes.account:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => AccountCubit(),
            child: const AccountPage(),
          ),
        );

      case Routes.businessDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => BusinessDetailPage(
            businessName: args?['name'] ?? '',
          ),
        );

      case Routes.notificationDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => NotificationDetailPage(
            title: args?['title'] ?? '',
          ),
        );

      case Routes.complaintForm:
        return MaterialPageRoute(
          builder: (_) => const ComplaintFormPage(),
        );

      case Routes.complaintDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => ComplaintDetailPage(
            complaintTitle: args?['title'] ?? '',
          ),
        );

      default:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => LoginCubit(),
            child: const LoginPage(),
          ),
        );
    }
  }
}
