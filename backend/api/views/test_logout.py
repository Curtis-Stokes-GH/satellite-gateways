from django.contrib import auth
from rest_framework import status
from rest_framework.test import APITestCase


from api.models import CustomUser


class LogoutViewTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.url = r"/api/logout"
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        self.user.delete()

    def test_logout(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Successfully logged out"})
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated)
