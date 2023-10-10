from django.contrib.auth import logout
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(["POST"])
def logout_view(request: Request):
    """
    Logout the session user
    """
    logout(request)
    return Response({"message": "Successfully logged out"})
