import 'package:equatable/equatable.dart';
import 'package:mobile_ui/data/remote/model/profile_models.dart';
import 'package:mobile_ui/data/remote/model/complaint_models.dart';

enum ProfileStatus { initial, loading, loaded, error }

enum ProfileActionStatus { idle, loading, success, error }

class ProfileState extends Equatable {
  final ProfileStatus status;
  final ProfileActionStatus actionStatus;
  final String name;
  final String email;
  final String phone;
  final String role;
  final String? errorMessage;
  final String? successMessage;

  /// Danh sách phản ánh của tôi
  final List<ComplaintSummary> myComplaints;
  final bool complaintsLoading;

  const ProfileState({
    this.status = ProfileStatus.initial,
    this.actionStatus = ProfileActionStatus.idle,
    this.name = '',
    this.email = '',
    this.phone = '',
    this.role = '',
    this.errorMessage,
    this.successMessage,
    this.myComplaints = const [],
    this.complaintsLoading = false,
  });

  ProfileState copyWith({
    ProfileStatus? status,
    ProfileActionStatus? actionStatus,
    String? name,
    String? email,
    String? phone,
    String? role,
    String? errorMessage,
    String? successMessage,
    List<ComplaintSummary>? myComplaints,
    bool? complaintsLoading,
  }) {
    return ProfileState(
      status: status ?? this.status,
      actionStatus: actionStatus ?? this.actionStatus,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      errorMessage: errorMessage,
      successMessage: successMessage,
      myComplaints: myComplaints ?? this.myComplaints,
      complaintsLoading: complaintsLoading ?? this.complaintsLoading,
    );
  }

  @override
  List<Object?> get props => [
        status,
        actionStatus,
        name,
        email,
        phone,
        role,
        errorMessage,
        successMessage,
        myComplaints,
        complaintsLoading,
      ];
}
