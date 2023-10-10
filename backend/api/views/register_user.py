from rest_framework import generics
from api.models import CustomUser
from api.serializers.user_registration import UserRegistrationSerializer
from api.superuser_required import IsSuperUser


class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [IsSuperUser]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(serializer.validated_data["password"])
        user.save()
