from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from api.models import CustomUser


class LoginViewTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.admin_user = CustomUser.objects.create_superuser(
            username="testadmin", password="testpassword"
        )
        self.url = "/api/login"

    def tearDown(self):
        self.user.delete()
        self.admin_user.delete()

    @patch("api.views.login.login")
    def test_readonly_login_with_valid_credentials(self, mock_login):
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"username": "testuser", "readonly": True})
        # Would prefer to check the params but having issues with the concrete type
        # response.request does not have the full information expected
        mock_login.assert_called_once()

    @patch("api.views.login.login")
    def test_admin_login_with_valid_credentials(self, mock_login):
        data = {"username": "testadmin", "password": "testpassword"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"username": "testadmin", "readonly": False})
        mock_login.assert_called_once()

    @patch("django.contrib.auth.login")
    def test_login_with_invalid_credentials(self, mock_login):
        data = {"username": "invaliduser", "password": "invalidpassword"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)
        mock_login.assert_not_called()  # Ensure login is not called

    @patch("django.contrib.auth.login")
    def test_login_without_credentials(self, mock_login):
        data = {}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_login.assert_not_called()
