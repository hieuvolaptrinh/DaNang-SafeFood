class ApiResponseWrapper<T> {
  final int code;
  final String message;
  final T? data;
  final int? timestamp;

  const ApiResponseWrapper({
    required this.code,
    required this.message,
    this.data,
    this.timestamp,
  });

  bool get isSuccess => code >= 200 && code < 300;

  factory ApiResponseWrapper.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) parseData,
  ) {
    return ApiResponseWrapper(
      code: (json['code'] as num?)?.toInt() ?? 500,
      message: json['message'] as String? ?? 'Unknown error',
      data: json['data'] == null ? null : parseData(json['data']),
      timestamp: (json['timestamp'] as num?)?.toInt(),
    );
  }
}
