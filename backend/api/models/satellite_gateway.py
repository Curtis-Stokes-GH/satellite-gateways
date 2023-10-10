from django.db import models

from api.models.base import BaseModel


class SatelliteGateway(BaseModel):
    LOCATION_DECIMAL_PLACES = 6
    """
    Satellite model holding facts about the satellite in question. Precision
    is estimated but should be driven by requirements/domain
    """
    company = models.ForeignKey("Company", on_delete=models.CASCADE)
    location_name = models.CharField(max_length=100)
    antenna_diameter = models.DecimalField(decimal_places=3, max_digits=10)
    latitude = models.DecimalField(
        decimal_places=LOCATION_DECIMAL_PLACES, max_digits=LOCATION_DECIMAL_PLACES + 3
    )
    longitude = models.DecimalField(
        decimal_places=LOCATION_DECIMAL_PLACES, max_digits=LOCATION_DECIMAL_PLACES + 3
    )
