import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/core/widgets/app_card.dart';
import 'package:mobile_ui/core/widgets/status_badge.dart';
import 'package:mobile_ui/core/widgets/app_button.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_cubit.dart';
import 'package:mobile_ui/viewmodel/complaint/complaint_state.dart';

class ComplaintPage extends StatelessWidget {
  const ComplaintPage({super.key});

  static final _mockComplaints = [
    {
      'title': 'Quán ăn sử dụng dầu ăn tái chế',
      'status': SafetyStatus.processing,
      'statusLabel': 'Đang xử lý',
      'date': '20/03/2026',
      'location': 'Quán ăn ABC, 45 Trần Phú',
    },
    {
      'title': 'Phát hiện côn trùng trong thức ăn',
      'status': SafetyStatus.safe,
      'statusLabel': 'Đã giải quyết',
      'date': '15/03/2026',
      'location': 'Nhà hàng XYZ, 12 Nguyễn Văn Linh',
    },
    {
      'title': 'Thực phẩm hết hạn bày bán',
      'status': SafetyStatus.warning,
      'statusLabel': 'Đã tiếp nhận',
      'date': '10/03/2026',
      'location': 'Siêu thị Mini, 78 Điện Biên Phủ',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: BlocBuilder<ComplaintCubit, ComplaintState>(
        builder: (context, state) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Phản ánh',
                      style: GoogleFonts.inter(
                        color: AppTheme.spotifyWhite,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    AppButton(
                      text: 'Tạo mới',
                      icon: Icons.add_rounded,
                      width: 130,
                      onPressed: () =>
                          Navigator.pushNamed(context, Routes.complaintForm),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Danh sách phản ánh của bạn',
                  style: GoogleFonts.inter(
                    color: AppTheme.spotifySubtle,
                    fontSize: 13,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: state.status == ComplaintStatus.loading
                    ? const Center(
                        child: CircularProgressIndicator(
                            color: AppTheme.primary))
                    : RefreshIndicator(
                        onRefresh: () =>
                            context.read<ComplaintCubit>().refresh(),
                        color: AppTheme.primary,
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          itemCount: _mockComplaints.length,
                          itemBuilder: (context, index) {
                            final item = _mockComplaints[index];
                            return AppCard(
                              onTap: () => Navigator.pushNamed(
                                context,
                                Routes.complaintDetail,
                                arguments: {'title': item['title']},
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          item['title'] as String,
                                          style: GoogleFonts.inter(
                                            color: AppTheme.spotifyWhite,
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                          ),
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      StatusBadge(
                                        status: item['status'] as SafetyStatus,
                                        customLabel:
                                            item['statusLabel'] as String,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),
                                  Row(
                                    children: [
                                      Icon(Icons.location_on_outlined,
                                          size: 14,
                                          color: AppTheme.spotifySubtle),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          item['location'] as String,
                                          style: GoogleFonts.inter(
                                            color: AppTheme.spotifySubtle,
                                            fontSize: 12,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      Text(
                                        item['date'] as String,
                                        style: GoogleFonts.inter(
                                          color: AppTheme.spotifySubtle,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}
