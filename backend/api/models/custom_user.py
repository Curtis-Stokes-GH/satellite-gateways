from django.contrib.auth.models import AbstractUser
from django.db import models

# flake8: noqa: E501


class CustomUser(AbstractUser):
    company = models.ForeignKey("Company", on_delete=models.CASCADE, null=True)

    # Add custom related names for groups and permissions
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_users",
        blank=True,
        verbose_name="groups",
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_users",
        blank=True,
        verbose_name="user permissions",
        help_text="Specific permissions for this user.",
    )
