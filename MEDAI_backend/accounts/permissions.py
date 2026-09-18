from rest_framework.permissions import BasePermission


class IsPatientUser(BasePermission):
    """
    Only patients manage their own medications and doses.
    Caregivers must NOT be able to modify a patient's prescription
    (see Phase 1: Medical Safety Boundary / role permission matrix).
    """
    message = 'Only patients can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'patient'
            and hasattr(request.user, 'patient_profile')
        )


class IsCaregiverUser(BasePermission):
    message = 'Only caregivers can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'caregiver'
            and hasattr(request.user, 'caregiver_profile')
        )
