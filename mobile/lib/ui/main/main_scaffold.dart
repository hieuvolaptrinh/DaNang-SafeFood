import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/ui/home/home_page.dart';
import 'package:mobile_ui/ui/search/search_page.dart';
import 'package:mobile_ui/ui/business_management/business_management_page.dart';
import 'package:mobile_ui/ui/complaint/complaint_page.dart';
import 'package:mobile_ui/ui/profile/profile_page.dart';
import 'package:mobile_ui/ui/business_status/business_status_page.dart';
import 'package:mobile_ui/viewmodel/auth/auth_cubit.dart';
import 'package:mobile_ui/viewmodel/auth/auth_state.dart';
import 'package:mobile_ui/viewmodel/home/home_cubit.dart';
import 'package:mobile_ui/viewmodel/search/search_cubit.dart';
import 'package:mobile_ui/viewmodel/business_management/business_management_cubit.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_cubit.dart';
import 'package:mobile_ui/viewmodel/business_status/business_status_cubit.dart';
import 'package:mobile_ui/core/utils/dio_client.dart';
import 'package:mobile_ui/data/remote/datasource/home_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/notification_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/business_remote_datasource.dart';
import 'package:mobile_ui/data/remote/datasource/complaint_remote_datasource.dart';
import 'package:mobile_ui/data/remote/repository/home_repository.dart';
import 'package:mobile_ui/data/remote/repository/business_repository.dart';
import 'package:mobile_ui/data/remote/repository/complaint_repository.dart';

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

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthCubit>().state;
    final tabs = _buildTabs(authState);

    // Đảm bảo index không vượt quá số tab
    if (_currentIndex >= tabs.length) {
      _currentIndex = 0;
    }

    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) => HomeCubit(homeRepository: _homeRepository)..loadData(),
        ),
        BlocProvider(
          create: (_) => SearchCubit(businessRepository: _businessRepository),
        ),
        BlocProvider(create: (_) => BusinessManagementCubit()..loadData()),
        BlocProvider(
          create: (_) => ComplaintCubit(repository: _complaintRepository)
            ..loadComplaints()
            ..loadTypes(),
        ),
        BlocProvider(create: (_) => ProfileCubit()..loadProfile()),
        BlocProvider(create: (_) => BusinessStatusCubit()..loadDocuments()),
      ],
      child: Scaffold(
        backgroundColor: AppTheme.scaffoldBg,
        body: IndexedStack(
          index: _currentIndex,
          children: tabs.map((t) => t.page).toList(),
        ),
        bottomNavigationBar: _ModernBottomNav(
          currentIndex: _currentIndex,
          items: tabs.map((t) => t.navItem).toList(),
          onTap: (i) => setState(() => _currentIndex = i),
        ),
      ),
    );
  }

  /// Build danh sách tab tùy theo role
  List<_TabInfo> _buildTabs(AuthState authState) {
    final commonHome = _TabInfo(
      page: const HomePage(),
      navItem: _NavItem(
        icon: Icons.home_outlined,
        activeIcon: Icons.home_rounded,
        label: 'Trang chủ',
      ),
    );

    final commonProfile = _TabInfo(
      page: const ProfilePage(),
      navItem: _NavItem(
        icon: Icons.person_outline_rounded,
        activeIcon: Icons.person_rounded,
        label: 'Cá nhân',
      ),
    );

    final commonSearch = _TabInfo(
      page: const SearchPage(),
      navItem: _NavItem(
        icon: Icons.search_outlined,
        activeIcon: Icons.search_rounded,
        label: 'Tra cứu',
      ),
    );

    if (authState.isCSKD) {
      // ── CSKD: Trang chủ | Tra cứu | Kinh doanh | Pháp lý | Cá nhân ──
      return [
        commonHome,
        commonSearch,
        _TabInfo(
          page: const BusinessManagementPage(),
          navItem: _NavItem(
            icon: Icons.store_outlined,
            activeIcon: Icons.store_rounded,
            label: 'Kinh doanh',
          ),
        ),
        _TabInfo(
          page: const BusinessStatusPage(),
          navItem: _NavItem(
            icon: Icons.description_outlined,
            activeIcon: Icons.description_rounded,
            label: 'Pháp lý',
          ),
        ),
        commonProfile,
      ];
    }

    // ── NTD (default): Trang chủ | Tra cứu | Phản ánh | Cá nhân ──
    return [
      commonHome,
      commonSearch,
      _TabInfo(
        page: const ComplaintPage(),
        navItem: _NavItem(
          icon: Icons.campaign_outlined,
          activeIcon: Icons.campaign_rounded,
          label: 'Phản ánh',
        ),
      ),
      commonProfile,
    ];
  }
}

class _TabInfo {
  final Widget page;
  final _NavItem navItem;

  const _TabInfo({required this.page, required this.navItem});
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}

/// Modern Bottom Navigation with smooth animations
class _ModernBottomNav extends StatelessWidget {
  final int currentIndex;
  final List<_NavItem> items;
  final ValueChanged<int> onTap;

  const _ModernBottomNav({
    required this.currentIndex,
    required this.items,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: AppShadow.level3,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Container(
          height: 72,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(
              items.length,
              (index) => _NavButton(
                item: items[index],
                isSelected: currentIndex == index,
                onTap: () => onTap(index),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavButton extends StatelessWidget {
  final _NavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavButton({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: AppDuration.normal,
          curve: AppCurves.emphasized,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? AppTheme.primary.withOpacity(0.12)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedSwitcher(
                duration: AppDuration.fast,
                transitionBuilder: (child, animation) {
                  return ScaleTransition(scale: animation, child: child);
                },
                child: Icon(
                  isSelected ? item.activeIcon : item.icon,
                  key: ValueKey(isSelected),
                  color: isSelected ? AppTheme.primary : AppTheme.textTertiary,
                  size: isSelected ? 26 : 24,
                ),
              ),
              const SizedBox(height: 4),
              AnimatedDefaultTextStyle(
                duration: AppDuration.normal,
                curve: AppCurves.standard,
                style: GoogleFonts.inter(
                  fontSize: isSelected ? 12 : 11,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  color: isSelected ? AppTheme.primary : AppTheme.textTertiary,
                  height: 1.2,
                ),
                child: Text(
                  item.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
