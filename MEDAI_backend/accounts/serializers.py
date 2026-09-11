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
