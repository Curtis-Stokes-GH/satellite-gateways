from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login
from api.serializers.login import LoginSerializer
from rest_framework.permissions import AllowAny


class LoginView(APIView):
    """
    Very simple login view to either get the current user or to authenticate a user via session.
    Better methods of course exist and CSRF protection is omitted for simplicity’s sake but
    could be implemented easily
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request) -> Response:
        """
        Post request expecting username and password as body data. Logs in and returns the user
        associated with the credentials or raises an exception as appropriate.
        :return: Response containing username and readonly based on is_superuser
        :rtype rest_framework.response.Response
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        return Response({"username": user.username, "readonly": not user.is_superuser})
