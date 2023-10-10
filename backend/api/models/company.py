from django.db import models
from api.models.base import BaseModel


class Company(BaseModel):
    """
    Simple company structure containing only a name, relationships held by in both
    satellite and user
    """

    # max_length should come from requirements, i've just chosen a random value. unique enforced
    # for simplicity in ownership model
    name = models.CharField(max_length=100, unique=True)
