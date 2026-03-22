import 'package:equatable/equatable.dart';

enum NotificationStatus { initial, loading, loaded, empty, error }

class NotificationState extends Equatable {
  final NotificationStatus status;
  final String selectedCategory;

  const NotificationState({
    this.status = NotificationStatus.initial,
    this.selectedCategory = 'Tất cả',
  });

  NotificationState copyWith({
    NotificationStatus? status,
    String? selectedCategory,
  }) {
    return NotificationState(
      status: status ?? this.status,
      selectedCategory: selectedCategory ?? this.selectedCategory,
    );
  }

  @override
  List<Object?> get props => [status, selectedCategory];
}
