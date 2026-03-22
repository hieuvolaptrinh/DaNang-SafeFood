import 'package:equatable/equatable.dart';

enum SearchStatus { initial, loading, loaded, empty, error }

class SearchState extends Equatable {
  final String query;
  final String selectedDistrict;
  final String selectedStatus;
  final SearchStatus status;

  const SearchState({
    this.query = '',
    this.selectedDistrict = 'Tất cả',
    this.selectedStatus = 'Tất cả',
    this.status = SearchStatus.initial,
  });

  SearchState copyWith({
    String? query,
    String? selectedDistrict,
    String? selectedStatus,
    SearchStatus? status,
  }) {
    return SearchState(
      query: query ?? this.query,
      selectedDistrict: selectedDistrict ?? this.selectedDistrict,
      selectedStatus: selectedStatus ?? this.selectedStatus,
      status: status ?? this.status,
    );
  }

  @override
  List<Object?> get props => [query, selectedDistrict, selectedStatus, status];
}
