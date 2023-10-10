from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from api.models.custom_user import CustomUser


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        """
        Get the user based on username and password
        :param attrs: username and password object that implements __getitem__
        :return: the user matching the provided credentials
        :rtype django.contrib.auth.models.User
        :raises ValidationError: If invalid credentials or user is disabled
        """
        user: CustomUser = authenticate(
            username=attrs["username"], password=attrs["password"]
        )
        if not user:
            raise ValidationError("Incorrect username or password.")
        if not user.is_active:
            raise ValidationError("User is disabled.")
        return user
