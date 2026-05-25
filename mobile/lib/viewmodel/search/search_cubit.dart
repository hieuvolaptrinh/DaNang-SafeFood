import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/ai_service.dart';
import 'package:mobile_ui/data/remote/repository/business_repository.dart';
import 'package:mobile_ui/viewmodel/search/search_state.dart';

class SearchCubit extends Cubit<SearchState> {
  final BusinessRepository businessRepository;
  final AiService aiService;

  SearchCubit({
    required this.businessRepository,
    required this.aiService,
  }) : super(const SearchState());

  // Map district names to maPX
  final Map<String, String?> _districtMap = {
    'Tất cả': null,
    'Hải Châu 1': 'PX001',
    'Hải Châu 2': 'PX002',
    'Thanh Khê': 'PX003',
    'Sơn Trà': 'PX004',
    'Ngũ Hành Sơn': 'PX005',
  };

  // Map status display names to backend values
  final Map<String, String?> _statusMap = {
    'Tất cả': null,
    'Hoạt động': 'Hoat dong',
    'Vi phạm': 'Vi pham',
    'Tạm dừng': 'Tam dung',
  };

  void queryChanged(String v) {
    emit(state.copyWith(query: v, currentPage: 0));
    if (!state.isAiMode) {
      if (v.trim().isNotEmpty) {
        search();
      } else {
        emit(
          state.copyWith(
            status: SearchStatus.initial,
            results: [],
            totalElements: 0,
          ),
        );
      }
    }
  }

  void districtChanged(String v) {
    emit(state.copyWith(selectedDistrict: v, currentPage: 0));
    search();
  }

  void statusFilterChanged(String v) {
    emit(state.copyWith(selectedStatus: v, currentPage: 0));
    search();
  }

  /// Toggle giữa search thường và AI search
  void toggleAiMode() {
    final newMode = !state.isAiMode;
    emit(state.copyWith(
      isAiMode: newMode,
      status: SearchStatus.initial,
      results: [],
      aiResponse: null,
      totalElements: 0,
      errorMessage: null,
    ));
  }

  /// Tìm kiếm bằng AI
  Future<void> searchWithAI() async {
    if (state.query.trim().isEmpty) return;
    if (state.status == SearchStatus.aiLoading) return;

    emit(state.copyWith(
      status: SearchStatus.aiLoading,
      aiResponse: null,
      errorMessage: null,
    ));

    try {
      // Bước 1: Lấy toàn bộ cơ sở từ backend
      final businesses = await businessRepository.fetchAllBusinessesForAI();

      // Bước 2: Xây dựng prompt chứa danh sách cơ sở + yêu cầu user
      final businessList = businesses.map((b) {
        final parts = <String>[
          'Tên: ${b.tenCoSo}',
          'Loại hình: ${b.loaiHinhKinhDoanh.join(", ")}',
          if (b.tenPhuongXa != null) 'Phường/Xã: ${b.tenPhuongXa}',
          'Trạng thái: ${b.trangThai}',
          'Số vi phạm: ${b.soViPham}',
          if (b.soGiayPhep != null) 'Giấy phép: ${b.soGiayPhep}',
        ];
        return parts.join(' | ');
      }).join('\n');

      final prompt = '''
Dưới đây là danh sách ${businesses.length} cơ sở kinh doanh thực phẩm tại Đà Nẵng:

$businessList

---
Yêu cầu của người dùng: "${state.query.trim()}"

Hãy gợi ý các cơ sở phù hợp nhất với yêu cầu trên. Ưu tiên cơ sở đang hoạt động, ít vi phạm.
''';

      // Bước 3: Gọi AI
      final aiResult = await aiService.askAI(prompt);

      emit(state.copyWith(
        status: SearchStatus.aiLoaded,
        aiResponse: aiResult,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: SearchStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }

  Future<void> search({bool loadMore = false}) async {
    if (state.status == SearchStatus.loading) return;

    final page = loadMore ? state.currentPage + 1 : 0;

    if (loadMore && !state.hasMore) return;

    emit(state.copyWith(status: SearchStatus.loading, currentPage: page));

    try {
      final maPX = _districtMap[state.selectedDistrict];
      final trangThai = _statusMap[state.selectedStatus];

      final response = await businessRepository.searchBusinesses(
        keyword: state.query.trim().isEmpty ? null : state.query.trim(),
        trangThai: trangThai,
        maPX: maPX,
        page: page,
        size: 10,
      );

      final newResults = loadMore
          ? [...state.results, ...response.content]
          : response.content;

      if (newResults.isEmpty) {
        emit(
          state.copyWith(
            status: SearchStatus.empty,
            results: [],
            totalElements: 0,
            hasMore: false,
          ),
        );
      } else {
        emit(
          state.copyWith(
            status: SearchStatus.loaded,
            results: newResults,
            totalElements: response.totalElements,
            hasMore: (page + 1) < response.totalPages,
          ),
        );
      }
    } catch (e) {
      emit(
        state.copyWith(status: SearchStatus.error, errorMessage: e.toString()),
      );
    }
  }

  void loadMore() {
    search(loadMore: true);
  }
}
