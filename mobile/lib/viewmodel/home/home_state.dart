import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/notification_model.dart';

enum HomeStatus { initial, loading, loaded, error }

class HomeState extends Equatable {
  final HomeStatus status;
  final String greeting;
  final String? errorMessage;
  final int recentViolations;
  final int newComplaints;
  final int inspectedPlaces;
  final NotificationModel? banner;
  final List<NotificationModel> news;
  final List<NotificationModel> alerts;

  const HomeState({
    this.status = HomeStatus.initial,
    this.greeting = '',
    this.errorMessage,
    this.recentViolations = 0,
    this.newComplaints = 0,
    this.inspectedPlaces = 0,
    this.banner,
    this.news = const [],
    this.alerts = const [],
  });

  HomeState copyWith({
    HomeStatus? status,
    String? greeting,
    String? errorMessage,
    int? recentViolations,
    int? newComplaints,
    int? inspectedPlaces,
    NotificationModel? banner,
    List<NotificationModel>? news,
    List<NotificationModel>? alerts,
  }) {
    return HomeState(
      status: status ?? this.status,
      greeting: greeting ?? this.greeting,
      errorMessage: errorMessage,
      recentViolations: recentViolations ?? this.recentViolations,
      newComplaints: newComplaints ?? this.newComplaints,
      inspectedPlaces: inspectedPlaces ?? this.inspectedPlaces,
      banner: banner ?? this.banner,
      news: news ?? this.news,
      alerts: alerts ?? this.alerts,
    );
  }

  @override
  List<Object?> get props => [
    status,
    greeting,
    errorMessage,
    recentViolations,
    newComplaints,
    inspectedPlaces,
    banner,
    news,
    alerts,
  ];
}
