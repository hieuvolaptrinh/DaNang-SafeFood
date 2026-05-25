import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/business_models.dart';

enum SearchStatus { initial, loading, loaded, empty, error, aiLoading, aiLoaded }

class SearchState extends Equatable {
  final String query;
  final String selectedDistrict;
  final String selectedStatus;
  final SearchStatus status;
  final List<BusinessSearchModel> results;
  final int totalElements;
  final int currentPage;
  final bool hasMore;
  final String? errorMessage;

  // AI Search fields
  final bool isAiMode;
  final String? aiResponse;

  const SearchState({
    this.query = '',
    this.selectedDistrict = 'Tất cả',
    this.selectedStatus = 'Tất cả',
    this.status = SearchStatus.initial,
    this.results = const [],
    this.totalElements = 0,
    this.currentPage = 0,
    this.hasMore = true,
    this.errorMessage,
    this.isAiMode = false,
    this.aiResponse,
  });

  SearchState copyWith({
    String? query,
    String? selectedDistrict,
    String? selectedStatus,
    SearchStatus? status,
    List<BusinessSearchModel>? results,
    int? totalElements,
    int? currentPage,
    bool? hasMore,
    String? errorMessage,
    bool? isAiMode,
    String? aiResponse,
  }) {
    return SearchState(
      query: query ?? this.query,
      selectedDistrict: selectedDistrict ?? this.selectedDistrict,
      selectedStatus: selectedStatus ?? this.selectedStatus,
      status: status ?? this.status,
      results: results ?? this.results,
      totalElements: totalElements ?? this.totalElements,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      errorMessage: errorMessage ?? this.errorMessage,
      isAiMode: isAiMode ?? this.isAiMode,
      aiResponse: aiResponse ?? this.aiResponse,
    );
  }

  @override
  List<Object?> get props => [
    query,
    selectedDistrict,
    selectedStatus,
    status,
    results,
    totalElements,
    currentPage,
    hasMore,
    errorMessage,
    isAiMode,
    aiResponse,
  ];
}
