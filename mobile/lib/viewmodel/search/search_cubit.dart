import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/search/search_state.dart';

class SearchCubit extends Cubit<SearchState> {
  SearchCubit() : super(const SearchState());

  void queryChanged(String v) {
    emit(state.copyWith(query: v));
    if (v.trim().isNotEmpty) {
      search();
    } else {
      emit(state.copyWith(status: SearchStatus.initial));
    }
  }

  void districtChanged(String v) {
    emit(state.copyWith(selectedDistrict: v));
    if (state.query.trim().isNotEmpty) search();
  }

  void statusFilterChanged(String v) {
    emit(state.copyWith(selectedStatus: v));
    if (state.query.trim().isNotEmpty) search();
  }

  Future<void> search() async {
    emit(state.copyWith(status: SearchStatus.loading));
    await Future.delayed(const Duration(milliseconds: 600));
    emit(state.copyWith(status: SearchStatus.loaded));
  }
}
