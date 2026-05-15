import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:mobile_ui/core/theme/app_theme.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';
import 'package:mobile_ui/routes/routes.dart';
import 'package:mobile_ui/viewmodel/profile/profile_cubit.dart';
import 'package:mobile_ui/viewmodel/profile/profile_state.dart';

class MyComplaintsPage extends StatefulWidget {
  const MyComplaintsPage({super.key});

  @override
  State<MyComplaintsPage> createState() => _MyComplaintsPageState();
}

class _MyComplaintsPageState extends State<MyComplaintsPage> {
  @override
  void initState() {
    super.initState();
    context.read<ProfileCubit>().loadMyComplaints();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.scaffoldBg,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios_rounded, size: 20), onPressed: () => Navigator.pop(context)),
        title: Text('Phản ánh của tôi', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600)),
      ),
      body: BlocBuilder<ProfileCubit, ProfileState>(
        buildWhen: (p, c) => p.myComplaints != c.myComplaints || p.complaintsLoading != c.complaintsLoading,
        builder: (context, state) {
          if (state.complaintsLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.myComplaints.isEmpty) {
            return _buildEmpty();
          }
          return RefreshIndicator(
            onRefresh: () => context.read<ProfileCubit>().loadMyComplaints(),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: state.myComplaints.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (ctx, i) => _ComplaintCard(complaint: state.myComplaints[i]),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: 80, height: 80,
          decoration: BoxDecoration(color: AppTheme.primary.withValues(alpha: 0.1), shape: BoxShape.circle),
          child: const Icon(Icons.feedback_outlined, color: AppTheme.primary, size: 40),
        ),
        const SizedBox(height: 16),
        Text('Chưa có phản ánh nào', style: GoogleFonts.inter(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Text('Các phản ánh ATVSTP của bạn sẽ\nhiển thị tại đây', textAlign: TextAlign.center, style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 13)),
      ]),
    );
  }
}

class _ComplaintCard extends StatelessWidget {
  final ComplaintSummary complaint;
  const _ComplaintCard({required this.complaint});

  Color _statusColor(String s) {
    switch (s.toLowerCase()) {
      case 'đã xử lý': return AppTheme.success;
      case 'đang xử lý': return AppTheme.info;
      case 'từ chối': return AppTheme.error;
      default: return AppTheme.warning;
    }
  }

  Color _statusBg(String s) {
    switch (s.toLowerCase()) {
      case 'đã xử lý': return AppTheme.successLight;
      case 'đang xử lý': return AppTheme.infoLight;
      case 'từ chối': return AppTheme.errorLight;
      default: return AppTheme.warningLight;
    }
  }

  IconData _statusIcon(String s) {
    switch (s.toLowerCase()) {
      case 'đã xử lý': return Icons.check_circle_rounded;
      case 'đang xử lý': return Icons.hourglass_top_rounded;
      case 'từ chối': return Icons.cancel_rounded;
      default: return Icons.schedule_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateStr = complaint.submittedAt != null ? DateFormat('dd/MM/yyyy HH:mm').format(complaint.submittedAt!) : '';
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, Routes.complaintDetail, arguments: {'id': complaint.id}),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.dividerColor, width: 0.5),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Header: status + date
          Row(children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(color: _statusBg(complaint.status), borderRadius: BorderRadius.circular(20)),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                Icon(_statusIcon(complaint.status), color: _statusColor(complaint.status), size: 14),
                const SizedBox(width: 4),
                Text(complaint.status, style: GoogleFonts.inter(color: _statusColor(complaint.status), fontSize: 11, fontWeight: FontWeight.w600)),
              ]),
            ),
            const Spacer(),
            Text(dateStr, style: GoogleFonts.inter(color: AppTheme.textTertiary, fontSize: 11)),
          ]),
          const SizedBox(height: 10),

          // Title
          Text(complaint.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w600)),
          if (complaint.content.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(complaint.content, maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 13, height: 1.4)),
          ],

          const SizedBox(height: 10),
          // Footer
          Row(children: [
            if (complaint.typeName.isNotEmpty)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: AppTheme.surfaceBg, borderRadius: BorderRadius.circular(6), border: Border.all(color: AppTheme.dividerColor)),
                child: Text(complaint.typeName, style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 11)),
              ),
            const Spacer(),
            if (complaint.businessName != null && complaint.businessName!.isNotEmpty)
              Row(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.store_outlined, color: AppTheme.textTertiary, size: 14),
                const SizedBox(width: 4),
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 140),
                  child: Text(complaint.businessName!, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 11)),
                ),
              ]),
          ]),
        ]),
      ),
    );
  }
}
