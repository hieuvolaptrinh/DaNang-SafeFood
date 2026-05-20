import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_ui/core/utils/app_exception.dart';
import 'package:mobile_ui/data/remote/repository/log_repository.dart';
import 'package:mobile_ui/viewmodel/log/log_state.dart';

class LogCubit extends Cubit<LogState> {
  final LogRepository repository;

  LogCubit({required this.repository}) : super(const LogState());

  Future<void> loadLogs() async {
    emit(state.copyWith(status: LogStatus.loading, errorMessage: null));
    try {
      final logs = await repository.getMyLoginHistory();
      emit(state.copyWith(status: LogStatus.loaded, logs: logs));
    } on ApiException catch (e) {
      emit(state.copyWith(status: LogStatus.error, errorMessage: e.message));
    } catch (_) {
      emit(
        state.copyWith(
          status: LogStatus.error,
          errorMessage: 'Không thể tải lịch sử đăng nhập',
        ),
      );
    }
  }

  Future<void> refresh() => loadLogs();
}
