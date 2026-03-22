import 'package:equatable/equatable.dart';

enum HomeStatus { initial, loading, loaded, error }

class HomeState extends Equatable {
  final HomeStatus status;
  final String greeting;
  final String? errorMessage;
  final int recentViolations;
  final int newComplaints;
  final int inspectedPlaces;

  const HomeState({
    this.status = HomeStatus.initial,
    this.greeting = '',
    this.errorMessage,
    this.recentViolations = 0,
    this.newComplaints = 0,
    this.inspectedPlaces = 0,
  });

  HomeState copyWith({
    HomeStatus? status,
    String? greeting,
    String? errorMessage,
    int? recentViolations,
    int? newComplaints,
    int? inspectedPlaces,
  }) {
    return HomeState(
      status: status ?? this.status,
      greeting: greeting ?? this.greeting,
      errorMessage: errorMessage,
      recentViolations: recentViolations ?? this.recentViolations,
      newComplaints: newComplaints ?? this.newComplaints,
      inspectedPlaces: inspectedPlaces ?? this.inspectedPlaces,
    );
  }

  @override
  List<Object?> get props => [status, greeting, errorMessage, recentViolations, newComplaints, inspectedPlaces];
}
