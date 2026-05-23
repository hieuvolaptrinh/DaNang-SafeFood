import 'package:mobile_ui/data/remote/datasource/log_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/log_models.dart';

class LogRepository {
  final LogRemoteDataSource remoteDataSource;

  LogRepository({required this.remoteDataSource});

  Future<List<LoginLog>> getMyLoginHistory() {
    return remoteDataSource.getMyLoginHistory();
  }
}
