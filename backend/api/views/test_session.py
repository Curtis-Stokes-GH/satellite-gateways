from rest_framework.test import APITestCase
from rest_framework import status
from api.models import CustomUser


class SessionViewTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.admin_user = CustomUser.objects.create_superuser(
            username="testadmin", password="testpassword"
        )
        self.url = "/api/session"

    def tearDown(self):
        self.user.delete()
        self.admin_user.delete()

    def test_get_readonly_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            response.data, {"username": self.user.username, "readonly": True}
        )

    def test_get_admin_user(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            response.data, {"username": self.admin_user.username, "readonly": False}
        )

    def test_forbidden_no_auth(self):
        # As route is protected, we will get a 403. Will need to change the tests if we change this
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
