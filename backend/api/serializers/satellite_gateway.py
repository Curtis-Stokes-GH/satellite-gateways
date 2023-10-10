from rest_framework import serializers
from api.models.satellite_gateway import SatelliteGateway


class SatelliteGatewaySerializer(serializers.ModelSerializer):
    """
    Very simple serializer that just returns all fields non-relational fields.
    Test omitted due to simplicity
    """

    class Meta:
        model = SatelliteGateway
        fields = "__all__"
