import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/home/home_state.dart';

class HomeCubit extends Cubit<HomeState> {
  HomeCubit() : super(const HomeState());

  Future<void> loadData() async {
    emit(state.copyWith(status: HomeStatus.loading));
    await Future.delayed(const Duration(milliseconds: 800));

    emit(state.copyWith(
      status: HomeStatus.loaded,
      greeting: 'Xin chào, Nguyễn Văn A',
      recentViolations: 12,
      newComplaints: 5,
      inspectedPlaces: 128,
    ));
  }

  Future<void> refresh() async {
    await loadData();
  }
}
