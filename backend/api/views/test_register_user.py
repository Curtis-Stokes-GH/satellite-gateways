from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import CustomUser
from api.models.company import Company


class UserRegistrationViewTestCase(APITestCase):
    def setUp(self):
        self.superuser = CustomUser.objects.create_superuser(
            username="admin", password="password"
        )
        self.company = Company.objects.create(name="test")
        self.url = reverse("user-registration")
        self.client.force_authenticate(user=self.superuser)

    def tearDown(self):
        self.superuser.delete()

    def test_create_superuser(self):
        """
        Test creating a superuser using UserRegistrationView.
        """
        superuser_data = {
            "username": "superuser",
            "password": "superpassword",
            "is_superuser": True,
        }
        response = self.client.post(self.url, superuser_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = CustomUser.objects.get(username=response.data["username"])
        self.assertTrue(user.is_superuser)
        user.delete()

    def test_create_regular_user(self):
        """
        Test creating a regular user using UserRegistrationView.
        """
        user_data = {
            "username": "user",
            "password": "userpassword",
            "is_superuser": False,
            "company": self.company.id,
        }
        response = self.client.post(self.url, user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = CustomUser.objects.get(username=response.data["username"])
        self.assertFalse(user.is_superuser)
        user.delete()

    def test_create_regular_user_without_superuser_authentication(self):
        """
        Test creating a regular user without superuser authentication.
        This should return a 403 Forbidden status.
        """
        user_data = {
            "username": "user",
            "password": "userpassword",
            "is_superuser": False,
        }
        normal_user = CustomUser.objects.create(
            username="normaluser", password="password"
        )
        self.client.force_authenticate(normal_user)
        response = self.client.post(self.url, user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
