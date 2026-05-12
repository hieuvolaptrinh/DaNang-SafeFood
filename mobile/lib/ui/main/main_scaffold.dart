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

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;

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
        BlocProvider(create: (_) => HomeCubit()..loadData()),
        BlocProvider(create: (_) => SearchCubit()),
        BlocProvider(create: (_) => BusinessManagementCubit()..loadData()),
        BlocProvider(create: (_) => ComplaintCubit()..loadComplaints()),
        BlocProvider(create: (_) => ProfileCubit()..loadProfile()),
        BlocProvider(create: (_) => BusinessStatusCubit()..loadDocuments()),
      ],
      child: Scaffold(
        body: IndexedStack(
          index: _currentIndex,
          children: tabs.map((t) => t.page).toList(),
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 16,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: SafeArea(
            child: BottomNavigationBar(
              currentIndex: _currentIndex,
              onTap: (i) => setState(() => _currentIndex = i),
              type: BottomNavigationBarType.fixed,
              backgroundColor: Colors.transparent,
              elevation: 0,
              selectedItemColor: AppTheme.primary,
              unselectedItemColor: AppTheme.textSecondary.withOpacity(0.5),
              selectedFontSize: 12,
              unselectedFontSize: 11,
              iconSize: 24,
              selectedLabelStyle: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                height: 1.5,
              ),
              unselectedLabelStyle: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                height: 1.5,
              ),
              items: tabs.map((t) => t.navItem).toList(),
            ),
          ),
        ),
      ),
    );
  }

  /// Build danh sách tab tùy theo role
  List<_TabInfo> _buildTabs(AuthState authState) {
    final commonHome = _TabInfo(
      page: const HomePage(),
      navItem: const BottomNavigationBarItem(
        icon: Padding(
          padding: EdgeInsets.only(bottom: 4),
          child: Icon(Icons.home_outlined, size: 24),
        ),
        activeIcon: Padding(
          padding: EdgeInsets.only(bottom: 4),
          child: Icon(Icons.home_rounded, size: 26),
        ),
        label: 'Trang chủ',
      ),
    );

    final commonProfile = _TabInfo(
      page: const ProfilePage(),
      navItem: const BottomNavigationBarItem(
        icon: Padding(
          padding: EdgeInsets.only(bottom: 4),
          child: Icon(Icons.person_outline_rounded, size: 24),
        ),
        activeIcon: Padding(
          padding: EdgeInsets.only(bottom: 4),
          child: Icon(Icons.person_rounded, size: 26),
        ),
        label: 'Cá nhân',
      ),
    );

    if (authState.isCSKD) {
      // ── CSKD: Trang chủ | Kinh doanh | Hồ sơ | Cá nhân ──
      return [
        commonHome,
        _TabInfo(
          page: const BusinessManagementPage(),
          navItem: const BottomNavigationBarItem(
            icon: Padding(
              padding: EdgeInsets.only(bottom: 4),
              child: Icon(Icons.store_outlined, size: 24),
            ),
            activeIcon: Padding(
              padding: EdgeInsets.only(bottom: 4),
              child: Icon(Icons.store_rounded, size: 26),
            ),
            label: 'Kinh doanh',
          ),
        ),
        _TabInfo(
          page: const BusinessStatusPage(),
          navItem: const BottomNavigationBarItem(
            icon: Padding(
              padding: EdgeInsets.only(bottom: 4),
              child: Icon(Icons.description_outlined, size: 24),
            ),
            activeIcon: Padding(
              padding: EdgeInsets.only(bottom: 4),
              child: Icon(Icons.description_rounded, size: 26),
            ),
            label: 'Pháp lý',
          ),
        ),
        commonProfile,
      ];
    }

    // ── NTD (default): Trang chủ | Tra cứu | Phản ánh | Cá nhân ──
    return [
      commonHome,
      _TabInfo(
        page: const SearchPage(),
        navItem: const BottomNavigationBarItem(
          icon: Padding(
            padding: EdgeInsets.only(bottom: 4),
            child: Icon(Icons.search_outlined, size: 24),
          ),
          activeIcon: Padding(
            padding: EdgeInsets.only(bottom: 4),
            child: Icon(Icons.search_rounded, size: 26),
          ),
          label: 'Tra cứu',
        ),
      ),
      _TabInfo(
        page: const ComplaintPage(),
        navItem: const BottomNavigationBarItem(
          icon: Padding(
            padding: EdgeInsets.only(bottom: 4),
            child: Icon(Icons.campaign_outlined, size: 24),
          ),
          activeIcon: Padding(
            padding: EdgeInsets.only(bottom: 4),
            child: Icon(Icons.campaign_rounded, size: 26),
          ),
          label: 'Phản ánh',
        ),
      ),
      commonProfile,
    ];
  }
}

class _TabInfo {
  final Widget page;
  final BottomNavigationBarItem navItem;

  const _TabInfo({required this.page, required this.navItem});
}

