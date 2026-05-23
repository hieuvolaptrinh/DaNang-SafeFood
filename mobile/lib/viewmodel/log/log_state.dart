import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/log_models.dart';

enum LogStatus { initial, loading, loaded, error }

class LogState extends Equatable {
  final LogStatus status;
  final List<LoginLog> logs;
  final String? errorMessage;

  const LogState({
    this.status = LogStatus.initial,
    this.logs = const [],
    this.errorMessage,
  });

  int get abnormalCount => logs.where((log) => log.abnormal).length;

  LogState copyWith({
    LogStatus? status,
    List<LoginLog>? logs,
    String? errorMessage,
  }) {
    return LogState(
      status: status ?? this.status,
      logs: logs ?? this.logs,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, logs, errorMessage];
}
