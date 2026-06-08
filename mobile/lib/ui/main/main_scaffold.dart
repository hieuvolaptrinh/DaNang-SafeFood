import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/ui/home/home_page.dart';
import 'package:mobile_ui/ui/search/search_page.dart';
import 'package:mobile_ui/ui/business_management/business_management_page.dart';
import 'package:mobile_ui/ui/complaint/complaint_page.dart';
import 'package:mobile_ui/ui/profile/profile_page.dart';
import 'package:mobile_ui/ui/business_status/business_status_page.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';
import 'package:mobile_ui/viewmodel/home/home_cubit.dart';
import 'package:mobile_ui/viewmodel/search/search_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_cubit.dart';
import 'package:mobile_ui/viewmodel/business_status/business_status_cubit.dart';
import 'package:mobile_ui/core/utils/dio_client.dart';
import 'package:mobile_ui/core/utils/ai_service.dart';
import 'package:mobile_ui/data/remote/datasource/home_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/notification_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/complaint_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/my_business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/home_repository.dart';
import 'package:mobile_ui/data/remote/repository/business_repository.dart';
import 'package:mobile_ui/data/remote/repository/complaint_repository.dart';
import 'package:mobile_ui/data/remote/repository/my_business_repository.dart';
import 'package:mobile_ui/data/remote/datasource/profile_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/profile_repository.dart';

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;
  static final _dio = DioClient().dio;
  static final HomeRepository _homeRepository = HomeRepository(
    homeRemoteDataSource: HomeRemoteDataSource(dio: _dio),
    notificationRemoteDataSource: NotificationRemoteDataSource(dio: _dio),
  );
  static final BusinessRepository _businessRepository = BusinessRepository(
    remoteDataSource: BusinessRemoteDataSource(dio: _dio),
  );
  static final ComplaintRepository _complaintRepository = ComplaintRepository(
    remoteDataSource: ComplaintRemoteDataSource(dio: _dio),
  );
  static final MyBusinessRepository _myBusinessRepository =
      MyBusinessRepository(remote: MyBusinessRemoteDataSource(dio: _dio));
  static final ProfileRepository _profileRepository = ProfileRepository(
    remoteDataSource: ProfileRemoteDataSource(dio: _dio),
  );
  static final AiService _aiService = AiService();

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthCubit>().state;
    final isCSKD = authState.isCSKD;

    final pages = _buildPages(isCSKD);

    if (_currentIndex >= pages.length) {
      _currentIndex = 0;
    }

    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) => HomeCubit(homeRepository: _homeRepository)..loadData(),
        ),
        BlocProvider(
          create: (_) => SearchCubit(
            businessRepository: _businessRepository,
            aiService: _aiService,
          ),
        ),
        BlocProvider(
          create: (_) =>
              BusinessManagementCubit(repository: _myBusinessRepository)
                ..loadData(),
        ),
        BlocProvider(
          create: (_) => ComplaintCubit(repository: _complaintRepository)
            ..loadComplaints()
            ..loadTypes(),
        ),
        BlocProvider(
          create: (_) => ProfileCubit(
            profileRepository: _profileRepository,
            complaintRepository: _complaintRepository,
          )..loadProfile(),
        ),
        BlocProvider(create: (_) => BusinessStatusCubit()..loadDocuments()),
      ],
      child: Scaffold(
        backgroundColor: AppTheme.scaffoldBg,
        body: IndexedStack(index: _currentIndex, children: pages),
        bottomNavigationBar: _BottomNavBar(
          currentIndex: _currentIndex,
          isCSKD: isCSKD,
          onTap: (i) => setState(() => _currentIndex = i),
        ),
        floatingActionButton: isCSKD
            ? _FloatingCenterButton(
                isActive: _currentIndex == 2,
                onTap: () => setState(() => _currentIndex = 2),
              )
            : null,
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      ),
    );
  }

  List<Widget> _buildPages(bool isCSKD) {
    if (isCSKD) {
      return [
        const HomePage(),
        const SearchPage(),
        const BusinessManagementPage(), // FAB center
        const BusinessStatusPage(),
        const ProfilePage(),
      ];
    }
    return [
      const HomePage(),
      const SearchPage(),
      const ComplaintPage(),
      const ProfilePage(),
    ];
  }
}

/// Floating Action Button ở giữa - dành cho CSKD (Quản lý kinh doanh)
class _FloatingCenterButton extends StatelessWidget {
  final bool isActive;
  final VoidCallback onTap;

  const _FloatingCenterButton({required this.isActive, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: AppTheme.primaryGradient,
          boxShadow: [
            BoxShadow(
              color: AppTheme.primary.withValues(alpha: 0.4),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Icon(
          isActive ? Icons.store_rounded : Icons.store_outlined,
          color: Colors.white,
          size: 28,
        ),
      ),
    );
  }
}

/// Bottom Navigation Bar - chỉ icon, không chữ
class _BottomNavBar extends StatelessWidget {
  final int currentIndex;
  final bool isCSKD;
  final ValueChanged<int> onTap;

  const _BottomNavBar({
    required this.currentIndex,
    required this.isCSKD,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final items = isCSKD ? _cskdItems : _ntdItems;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          height: 64,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (index) {
              // CSKD: index 2 là FAB (để trống)
              if (isCSKD && index == 2) {
                return const SizedBox(width: 60); // Khoảng trống cho FAB
              }

              final item = items[index];
              final isSelected = currentIndex == index;

              return _NavIcon(
                icon: isSelected ? item.activeIcon : item.icon,
                isSelected: isSelected,
                onTap: () => onTap(index),
              );
            }),
          ),
        ),
      ),
    );
  }

  /// CSKD: 5 tab (Trang chủ | Tra cứu | [FAB] | Pháp lý | Cá nhân)
  static const _cskdItems = [
    _NavItemData(icon: Icons.home_outlined, activeIcon: Icons.home_rounded),
    _NavItemData(icon: Icons.search_outlined, activeIcon: Icons.search_rounded),
    _NavItemData(
      icon: Icons.store_outlined,
      activeIcon: Icons.store_rounded,
    ), // placeholder cho FAB
    _NavItemData(
      icon: Icons.description_outlined,
      activeIcon: Icons.description_rounded,
    ),
    _NavItemData(
      icon: Icons.person_outline_rounded,
      activeIcon: Icons.person_rounded,
    ),
  ];

  /// NTD: 4 tab (Trang chủ | Tra cứu | Phản ánh | Cá nhân)
  static const _ntdItems = [
    _NavItemData(icon: Icons.home_outlined, activeIcon: Icons.home_rounded),
    _NavItemData(icon: Icons.search_outlined, activeIcon: Icons.search_rounded),
    _NavItemData(
      icon: Icons.campaign_outlined,
      activeIcon: Icons.campaign_rounded,
    ),
    _NavItemData(
      icon: Icons.person_outline_rounded,
      activeIcon: Icons.person_rounded,
    ),
  ];
}

class _NavIcon extends StatelessWidget {
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavIcon({
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 56,
        height: 56,
        child: Center(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppTheme.primary.withValues(alpha: 0.12)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              icon,
              color: isSelected ? AppTheme.primary : AppTheme.textTertiary,
              size: 26,
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItemData {
  final IconData icon;
  final IconData activeIcon;

  const _NavItemData({required this.icon, required this.activeIcon});
}
