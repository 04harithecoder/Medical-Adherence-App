from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from medai_backend.responses import success, error

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ProfileSerializer


def _tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {'access_token': str(refresh.access_token), 'refresh_token': str(refresh)}


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return success(
            {'user': UserSerializer(user).data, **_tokens_for(user)},
            message='Account created successfully.',
            status=201,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        return success({'user': UserSerializer(user).data, **_tokens_for(user)})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return success(ProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return success(ProfileSerializer(user).data, message='Profile updated.')


class RefreshView(APIView):
    """
    Thin wrapper around simplejwt's refresh flow so the response still
    matches MEDAI's standard envelope shape.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return error('refresh_token is required.', code='MISSING_REFRESH_TOKEN', status=400)

        try:
            refresh = RefreshToken(refresh_token)
        except Exception:
            return error('Refresh token is invalid or expired.', code='INVALID_REFRESH_TOKEN', status=401)

        return success({'access_token': str(refresh.access_token)})
