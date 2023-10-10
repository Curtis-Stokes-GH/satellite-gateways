from rest_framework import serializers

from api.models.company import Company
from api.models.custom_user import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        required=False,
    )

    class Meta:
        model = CustomUser
        fields = ("username", "password", "is_superuser", "company")

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

    def validate(self, data):
        """
        Custom validation method to ensure 'customer' is set if 'is_superuser' is not true.
        """
        is_superuser = data.get("is_superuser", False)
        company = data.get("company")

        if not is_superuser and company is None:
            raise serializers.ValidationError(
                "Company must be specified for non-superuser users."
            )

        return data
