from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class SessionView(APIView):
    def get(self, request: Request):
        if request.user:
            return Response(
                {
                    "username": request.user.username,
                    "readonly": not request.user.is_superuser,
                }
            )
