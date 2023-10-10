from rest_framework import serializers

from api.models.company import Company


class CompanySerializer(serializers.ModelSerializer):
    """Basic serializer returning the id and name without relations. Used to populate dropdowns"""

    class Meta:
        model = Company
        fields = ["id", "name"]
