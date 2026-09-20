from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User, Patient, Caregiver


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role', 'phone', 'created_at']
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    """
    Handles both patient and caregiver self-registration. Admin accounts
    are not created through this endpoint (see Phase 1: admin has no
    public registration flow) — they're provisioned via createsuperuser
    or the Django admin.
    """
    full_name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    # Frontend sends this for client-side matching; not persisted.
    confirm_password = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(choices=['patient', 'caregiver'])
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    # Optional patient-only fields
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    gender = serializers.ChoiceField(
        choices=['male', 'female', 'other', 'unspecified'], required=False
    )

    # Optional caregiver-only field
    relationship_type = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate(self, attrs):
        confirm = attrs.get('confirm_password')
        if confirm is not None and confirm != attrs['password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        role = validated_data['role']

        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            role=role,
            phone=validated_data.get('phone') or None,
        )

        if role == 'patient':
            Patient.objects.create(
                user=user,
                date_of_birth=validated_data.get('date_of_birth'),
                gender=validated_data.get('gender', 'unspecified'),
            )
        elif role == 'caregiver':
            Caregiver.objects.create(
                user=user,
                relationship_type=validated_data.get('relationship_type') or None,
            )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs['email'], password=attrs['password']  # USERNAME_FIELD = email
        )
        if user is None:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')
        attrs['user'] = user
        return attrs


class ProfileSerializer(serializers.Serializer):
    """
    Full profile view/edit — merges User fields with the role-specific
    Patient/Caregiver fields into one flat shape for the frontend.
    """
    id = serializers.IntegerField(read_only=True)
    full_name = serializers.CharField(max_length=120, required=False)
    email = serializers.EmailField(read_only=True)
    role = serializers.CharField(read_only=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    created_at = serializers.DateTimeField(read_only=True)

    # Patient-only
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    gender = serializers.ChoiceField(
        choices=['male', 'female', 'other', 'unspecified'], required=False
    )

    # Caregiver-only
    relationship_type = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)

    def to_representation(self, user):
        data = {
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'role': user.role,
            'phone': user.phone,
            'created_at': user.created_at,
        }
        if user.role == 'patient' and hasattr(user, 'patient_profile'):
            data['date_of_birth'] = user.patient_profile.date_of_birth
            data['gender'] = user.patient_profile.gender
        if user.role == 'caregiver' and hasattr(user, 'caregiver_profile'):
            data['relationship_type'] = user.caregiver_profile.relationship_type
        return data

    def update(self, user, validated_data):
        if 'full_name' in validated_data:
            user.full_name = validated_data['full_name']
        if 'phone' in validated_data:
            user.phone = validated_data['phone']
        user.save()

        if user.role == 'patient' and hasattr(user, 'patient_profile'):
            patient = user.patient_profile
            if 'date_of_birth' in validated_data:
                patient.date_of_birth = validated_data['date_of_birth']
            if 'gender' in validated_data:
                patient.gender = validated_data['gender']
            patient.save()
        elif user.role == 'caregiver' and hasattr(user, 'caregiver_profile'):
            caregiver = user.caregiver_profile
            if 'relationship_type' in validated_data:
                caregiver.relationship_type = validated_data['relationship_type']
            caregiver.save()

        return user
