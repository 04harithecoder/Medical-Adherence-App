from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """Custom manager since MEDAI logs in with email, not username."""

    def create_user(self, email, full_name, password=None, role='patient', **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, full_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Single source of identity truth (see Phase 1 schema). Role-specific
    attributes live on Patient / Caregiver, not here.
    """
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('caregiver', 'Caregiver'),
        ('admin', 'Admin'),
    ]

    full_name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f'{self.full_name} ({self.role})'


class Patient(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('unspecified', 'Unspecified'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=15, choices=GENDER_CHOICES, default='unspecified')
    timezone = models.CharField(max_length=64, default='Asia/Kolkata')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'patients'

    def __str__(self):
        return self.user.full_name


class Caregiver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='caregiver_profile')
    relationship_type = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'caregivers'

    def __str__(self):
        return self.user.full_name


class CaregiverPatientLink(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('revoked', 'Revoked'),
    ]

    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE, related_name='patient_links')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='caregiver_links')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    linked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'caregiver_patient_links'
        unique_together = ('caregiver', 'patient')
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['caregiver']),
        ]

    def __str__(self):
        return f'{self.caregiver} -> {self.patient} ({self.status})'
