import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/viewmodel/notification/notification_state.dart';

class NotificationCubit extends Cubit<NotificationState> {
  NotificationCubit() : super(const NotificationState());

  Future<void> loadNotifications() async {
    emit(state.copyWith(status: NotificationStatus.loading));
    await Future.delayed(const Duration(milliseconds: 600));
    emit(state.copyWith(status: NotificationStatus.loaded));
  }

  void filterByCategory(String category) {
    emit(state.copyWith(selectedCategory: category));
  }

  Future<void> refresh() async => loadNotifications();
}
