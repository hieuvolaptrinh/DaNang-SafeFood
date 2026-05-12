import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/ui/login/login_page.dart';
import 'package:mobile_ui/ui/register/register_page.dart';
import 'package:mobile_ui/ui/forgot_password/forgot_password_page.dart';
import 'package:mobile_ui/ui/main/main_scaffold.dart';
import 'package:mobile_ui/ui/(user)/account/account_page.dart';
import 'package:mobile_ui/ui/search/business_detail_page.dart';
import 'package:mobile_ui/ui/notification/notification_detail_page.dart';
import 'package:mobile_ui/ui/notification/notification_page.dart';
import 'package:mobile_ui/ui/complaint/complaint_form_page.dart';
import 'package:mobile_ui/ui/complaint/complaint_detail_page.dart';
import 'package:mobile_ui/ui/business_management/pages/biz_detail_page.dart';
import 'package:mobile_ui/ui/business_management/pages/business_registration_page.dart';
import 'package:mobile_ui/ui/business_management/pages/violation_list_page.dart';
import 'package:mobile_ui/ui/business_management/pages/violation_detail_page.dart';
import 'package:mobile_ui/ui/business_management/pages/inspection_detail_page.dart';
import 'package:mobile_ui/ui/business_management/pages/testing_detail_page.dart';
import 'package:mobile_ui/ui/business_management/pages/business_complaint_page.dart';
import 'package:mobile_ui/ui/business_management/pages/update_evidence_page.dart';
import 'package:mobile_ui/ui/business_status/business_status_page.dart';
import 'package:mobile_ui/viewmodel/login/login_cubit.dart';
import 'package:mobile_ui/viewmodel/register/register_cubit.dart';
import 'package:mobile_ui/viewmodel/forgot_password/forgot_password_cubit.dart';
import 'package:mobile_ui/viewmodel/account/account_cubit.dart';
import 'package:mobile_ui/viewmodel/notification/notification_cubit.dart';
import 'package:mobile_ui/viewmodel/business_status/business_status_cubit.dart';
import 'package:mobile_ui/core/utils/dio_client.dart';
import 'package:mobile_ui/data/local/token_storage.dart';
import 'package:mobile_ui/data/remote/datasource/auth_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/notification_datasource.dart';
import 'package:mobile_ui/data/remote/repository/auth_repository.dart';
import 'package:mobile_ui/data/remote/repository/notification_repository.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';

class AppRouter {
  static final _dio = DioClient().dio;

  static final AuthRepository _authRepository = AuthRepository(
    remoteDataSource: AuthRemoteDataSource(dio: _dio),
    tokenStorage: TokenStorage(),
  );

  static final NotificationRepository _notificationRepository =
      NotificationRepository(
    remoteDataSource: NotificationRemoteDataSource(dio: _dio),
  );

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case Routes.login:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => LoginCubit(authRepository: _authRepository),
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
            create: (_) =>
                ForgotPasswordCubit(authRepository: _authRepository),
            child: const ForgotPasswordPage(),
          ),
        );

      case Routes.main:
        return MaterialPageRoute(builder: (_) => const MainScaffold());

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
          builder: (_) =>
              BusinessDetailPage(businessName: args?['name'] ?? ''),
        );

      case Routes.notificationDetail:
        final notification = settings.arguments as NotificationModel;
        return MaterialPageRoute(
          builder: (_) =>
              NotificationDetailPage(notification: notification),
        );

      case Routes.notifications:
        return MaterialPageRoute(
          builder: (_) {
            return BlocProvider(
              create: (_) => NotificationCubit(
                repository: _notificationRepository,
              )..loadAll(),
              child: const NotificationPage(),
            );
          },
        );

      case Routes.complaintForm:
        return MaterialPageRoute(
            builder: (_) => const ComplaintFormPage());

      case Routes.complaintDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) =>
              ComplaintDetailPage(complaintTitle: args?['title'] ?? ''),
        );

      // Business Management routes
      case Routes.bizDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) =>
              BizDetailPage(businessName: args?['name'] ?? ''),
        );

      case Routes.businessRegistration:
        return MaterialPageRoute(
          builder: (_) => const BusinessRegistrationPage(),
        );

      case Routes.violationList:
        return MaterialPageRoute(
            builder: (_) => const ViolationListPage());

      case Routes.violationDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) =>
              ViolationDetailPage(violationTitle: args?['title'] ?? ''),
        );

      case Routes.businessComplaint:
        return MaterialPageRoute(
            builder: (_) => const BusinessComplaintPage());

      case Routes.updateEvidence:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => UpdateEvidencePage(
            title: args?['title'] ?? '',
            isExpired: args?['isExpired'] ?? false,
          ),
        );

      case Routes.inspectionDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) =>
              InspectionDetailPage(title: args?['title'] ?? ''),
        );

      case Routes.testingDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) =>
              TestingDetailPage(title: args?['title'] ?? ''),
        );

      case Routes.businessStatus:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => BusinessStatusCubit()..loadDocuments(),
            child: const BusinessStatusPage(),
          ),
        );

      default:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => LoginCubit(authRepository: _authRepository),
            child: const LoginPage(),
          ),
        );
    }
  }
}
