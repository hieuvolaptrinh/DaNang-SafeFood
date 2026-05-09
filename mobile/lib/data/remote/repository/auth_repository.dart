import 'package:mobile_ui/data/local/token_storage.dart';
import 'package:mobile_ui/data/remote/datasource/auth_remote_datasource.dart';
import 'package:mobile_ui/data/remote/model/auth_models.dart';

class AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final TokenStorage tokenStorage;

  AuthRepository({required this.remoteDataSource, required this.tokenStorage});

  Future<AuthResponse> login({
    required String identifier,
    required String password,
  }) async {
    final response = await remoteDataSource.login(
      AuthRequest(identifier: identifier, password: password),
    );

    await tokenStorage.saveTokens(
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    );

    return response;
  }
}
