from django.db import models


class BaseModel(models.Model):
    """
    Small wrapper to make community edition of pycharm happy
    -- otherwise it does not know about the manager
    """

    objects = models.Manager()

    class Meta:
        abstract = True
