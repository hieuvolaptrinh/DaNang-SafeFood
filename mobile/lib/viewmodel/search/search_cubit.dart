import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/data/remote/repository/business_repository.dart';
import 'package:mobile_ui/viewmodel/search/search_state.dart';

class SearchCubit extends Cubit<SearchState> {
  final BusinessRepository businessRepository;

  SearchCubit({required this.businessRepository}) : super(const SearchState());

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

  void districtChanged(String v) {
    emit(state.copyWith(selectedDistrict: v, currentPage: 0));
    search();
  }

  void statusFilterChanged(String v) {
    emit(state.copyWith(selectedStatus: v, currentPage: 0));
    search();
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
