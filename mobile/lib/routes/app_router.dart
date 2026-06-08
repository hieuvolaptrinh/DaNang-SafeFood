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
import 'package:mobile_ui/ui/business_management/pages/all_businesses_page.dart';
import 'package:mobile_ui/ui/business_registration/business_registration_page.dart';
import 'package:mobile_ui/ui/document_upload/document_upload_page.dart';
import 'package:mobile_ui/viewmodel/business_registration/business_registration_cubit.dart';
import 'package:mobile_ui/viewmodel/document_upload/document_upload_cubit.dart';
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
import 'package:mobile_ui/viewmodel/search/business_detail_cubit.dart';
import 'package:mobile_ui/core/utils/dio_client.dart';
import 'package:mobile_ui/data/local/token_storage.dart';
import 'package:mobile_ui/data/remote/datasource/auth_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/notification_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/complaint_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/violation_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/profile_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/auth_repository.dart';
import 'package:mobile_ui/data/remote/repository/notification_repository.dart';
import 'package:mobile_ui/data/remote/repository/business_repository.dart';
import 'package:mobile_ui/data/remote/repository/complaint_repository.dart';
import 'package:mobile_ui/data/remote/repository/violation_repository.dart';
import 'package:mobile_ui/data/remote/repository/profile_repository.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/violation/violation_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/data/remote/datasource/my_business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/my_business_repository.dart';
import 'package:mobile_ui/ui/profile/edit_profile_page.dart';
import 'package:mobile_ui/ui/profile/change_password_page.dart';
import 'package:mobile_ui/ui/profile/my_complaints_page.dart';
import 'package:mobile_ui/ui/(user)/log/log_page.dart';
import 'package:mobile_ui/data/remote/datasource/log_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/log_repository.dart';
import 'package:mobile_ui/viewmodel/log/log_cubit.dart';

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

  static final ComplaintRepository _complaintRepository = ComplaintRepository(
    remoteDataSource: ComplaintRemoteDataSource(dio: _dio),
  );

  static final ViolationRepository _violationRepository = ViolationRepository(
    remote: ViolationRemoteDataSource(dio: _dio),
  );

  static final ProfileRepository _profileRepository = ProfileRepository(
    remoteDataSource: ProfileRemoteDataSource(dio: _dio),
  );

  static final LogRepository _logRepository = LogRepository(
    remoteDataSource: LogRemoteDataSource(dio: _dio),
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
            create: (_) => RegisterCubit(authRepository: _authRepository),
            child: const RegisterPage(),
          ),
        );

      case Routes.forgotPassword:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => ForgotPasswordCubit(authRepository: _authRepository),
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
        final maCoSo = args?['maCoSo'] as String? ?? '';
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) {
              final repo = BusinessRepository(
                remoteDataSource: BusinessRemoteDataSource(dio: _dio),
              );
              return BusinessDetailCubit(businessRepository: repo)
                ..loadDetail(maCoSo);
            },
            child: BusinessDetailPage(maCoSo: maCoSo),
          ),
        );

      case Routes.notificationDetail:
        final notification = settings.arguments as NotificationModel;
        return MaterialPageRoute(
          builder: (_) => NotificationDetailPage(notification: notification),
        );

      case Routes.notifications:
        return MaterialPageRoute(
          builder: (_) {
            return BlocProvider(
              create: (_) =>
                  NotificationCubit(repository: _notificationRepository)
                    ..loadAll(),
              child: const NotificationPage(),
            );
          },
        );

      case Routes.complaintForm:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) =>
                ComplaintCubit(repository: _complaintRepository)..loadTypes(),
            child: const ComplaintFormPage(),
          ),
        );

      case Routes.complaintDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        final complaintId = args?['id'] as String? ?? '';
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) =>
                ComplaintCubit(repository: _complaintRepository)
                  ..loadDetail(complaintId),
            child: ComplaintDetailPage(complaintId: complaintId),
          ),
        );

      // Business Management routes
      case Routes.bizDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => BusinessManagementCubit(
              repository: MyBusinessRepository(
                remote: MyBusinessRemoteDataSource(dio: _dio),
              ),
            )..loadData(),
            child: BizDetailPage(businessName: args?['name'] ?? ''),
          ),
        );

      case Routes.allBusinesses:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => BusinessManagementCubit(
              repository: MyBusinessRepository(
                remote: MyBusinessRemoteDataSource(dio: _dio),
              ),
            )..loadData(),
            child: const AllBusinessesPage(),
          ),
        );

      case Routes.businessRegistration:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => BusinessRegistrationCubit(
              repository: MyBusinessRepository(
                remote: MyBusinessRemoteDataSource(dio: _dio),
              ),
            )..loadInitial(),
            child: const BusinessRegistrationPage(),
          ),
        );

      case Routes.documentUpload:
        final args = settings.arguments as Map<String, dynamic>?;
        final preMaCoSo = args?['maCoSo'] as String?;
        final focusLoai = args?['maLoaiGiayTo'] as String?;
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => DocumentUploadCubit(
              repository: MyBusinessRepository(
                remote: MyBusinessRemoteDataSource(dio: _dio),
              ),
            )..loadInitial(preSelectMaCoSo: preMaCoSo),
            child: DocumentUploadPage(
              preSelectMaCoSo: preMaCoSo,
              focusLoaiGiayTo: focusLoai,
            ),
          ),
        );

      case Routes.violationList:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => ViolationCubit(repository: _violationRepository),
            child: const ViolationListPage(),
          ),
        );

      case Routes.violationDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        final maViPham = args?['id'] as String? ?? '';
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => ViolationCubit(repository: _violationRepository),
            child: ViolationDetailPage(maViPham: maViPham),
          ),
        );

      case Routes.businessComplaint:
        return MaterialPageRoute(builder: (_) => const BusinessComplaintPage());

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
          builder: (_) => InspectionDetailPage(title: args?['title'] ?? ''),
        );

      case Routes.testingDetail:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => TestingDetailPage(title: args?['title'] ?? ''),
        );

      case Routes.businessStatus:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => BusinessStatusCubit()..loadDocuments(),
            child: const BusinessStatusPage(),
          ),
        );

      case Routes.editProfile:
        return MaterialPageRoute(
          builder: (ctx) => BlocProvider(
            create: (_) => ProfileCubit(
              profileRepository: _profileRepository,
              complaintRepository: _complaintRepository,
            )..loadProfile(),
            child: const EditProfilePage(),
          ),
        );

      case Routes.changePassword:
        return MaterialPageRoute(
          builder: (ctx) => BlocProvider(
            create: (_) => ProfileCubit(
              profileRepository: _profileRepository,
              complaintRepository: _complaintRepository,
            ),
            child: const ChangePasswordPage(),
          ),
        );

      case Routes.myComplaints:
        return MaterialPageRoute(
          builder: (ctx) => BlocProvider(
            create: (_) => ProfileCubit(
              profileRepository: _profileRepository,
              complaintRepository: _complaintRepository,
            )..loadMyComplaints(),
            child: const MyComplaintsPage(),
          ),
        );

      case Routes.loginHistory:
        return MaterialPageRoute(
          builder: (_) => BlocProvider(
            create: (_) => LogCubit(repository: _logRepository)..loadLogs(),
            child: const LogPage(),
          ),
        );

      default:
        // Route không tồn tại — quay về MainScaffold thay vì đẩy ra LoginPage
        // (tránh trường hợp user đang đăng nhập bị "đá" về login mà không vào lại được).
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(title: const Text('Không tìm thấy trang')),
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 56,
                      color: Colors.grey,
                    ),
                    const SizedBox(height: 12),
                    Text('Đường dẫn ${settings.name ?? ''} chưa được hỗ trợ'),
                    const SizedBox(height: 16),
                    Builder(
                      builder: (ctx) => FilledButton(
                        onPressed: () =>
                            Navigator.popUntil(ctx, (r) => r.isFirst),
                        child: const Text('Quay lại trang chính'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
    }
  }
}
