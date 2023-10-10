from decimal import Decimal
from django.test import TestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from api.models.company import Company
from api.models.satellite_gateway import SatelliteGateway
from api.models.custom_user import CustomUser


class SatelliteGatewayViewAsAdminTests(TestCase):
    """
    Tests all satellite paths with an admin account. Includes some testing of responses to ensure
    the correct data is returned
    """

    def setUp(self):
        self.company = Company.objects.create(name="Test Company")
        self.superuser = CustomUser.objects.create_superuser(
            username="admin", password="admin_password", company=self.company
        )
        self.data = {
            "location_name": "Test Satellite",
            "company": self.company,
            "antenna_diameter": Decimal(3.235),
            "latitude": Decimal(100.34212),
            "longitude": Decimal(100.53233),
        }
        self.satellite = SatelliteGateway.objects.create(**self.data)
        self.data["id"] = self.satellite.id
        self.list_url = reverse("gateway-list")
        self.satellite_url = f"{self.list_url}/{self.satellite.pk}"

        self.client = APIClient()
        self.client.force_authenticate(user=self.superuser)

    def assertResponseEquals(self, data):
        for k, v in data.items():
            if isinstance(v, Decimal):
                self.assertAlmostEqual(v, self.data[k])
            elif k == "company":
                self.assertEquals(v, self.data[k].id)
            else:
                self.assertEquals(v, self.data[k])

    def tearDown(self):
        self.superuser.delete()
        self.satellite.delete()
        self.company.delete()

    def test_list_satellites(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        satellite = response.data[0]
        self.assertResponseEquals(satellite)

    def test_create_satellite(self):
        data = {
            "location_name": "New Satellite",
            "antenna_diameter": 10.235,
            "latitude": -100.34212,
            "longitude": -30.53233,
            "company": self.company.id,
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            SatelliteGateway.objects.filter(location_name="New Satellite").exists
        )

    def test_retrieve_satellite(self):
        response = self.client.get(self.satellite_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertResponseEquals(response.data)

    def test_update_satellite(self):
        data = self.client.get(self.satellite_url).data
        data["location_name"] = "Updated Satellite Name"
        response = self.client.put(self.satellite_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.satellite.refresh_from_db()
        self.assertEqual(self.satellite.location_name, "Updated Satellite Name")

    def test_delete_satellite(self):
        response = self.client.delete(self.satellite_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SatelliteGateway.objects.filter(pk=self.satellite.pk).exists())


class SatelliteGatewayViewAsOperatorTests(TestCase):
    """
    Tests all satellite paths with an operator user, mostly checks status codes and that system is
    not modified as above test goes into structure.
    """

    def setUp(self):
        self.company = Company.objects.create(name="Test Company")
        self.user = CustomUser.objects.create_user(
            username="operator", password="operator_password", company=self.company
        )
        self.data = {
            "location_name": "Test Satellite",
            "company": self.user.company,
            "antenna_diameter": Decimal(3.235),
            "latitude": Decimal(100.34212),
            "longitude": Decimal(100.53233),
        }
        self.satellite = SatelliteGateway.objects.create(**self.data)
        self.list_url = "/api/gateways"
        self.satellite_url = f"{self.list_url}/{self.satellite.pk}"

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        self.user.delete()
        self.satellite.delete()
        self.company.delete()

    def test_list_satellites(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_can_only_see_own_satellites(self):
        company = Company.objects.create(name="different_company")
        data = self.data.copy()
        data["company"] = company
        new_satellite = SatelliteGateway.objects.create(**data)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for item in response.data:
            self.assertNotEquals(item["id"], new_satellite.id)

    def test_create_satellite(self):
        data = {
            "location_name": "New Satellite",
            "antenna_diameter": 10.235,
            "latitude": -100.34212,
            "longitude": -30.53233,
            "company": self.company.id,
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            SatelliteGateway.objects.filter(location_name="New Satellite").exists()
        )

    def test_retrieve_satellite(self):
        response = self.client.get(self.satellite_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_satellite(self):
        data = self.client.get(self.satellite_url).data
        data["location_name"] = "Updated Satellite Name"
        response = self.client.put(self.satellite_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.satellite.refresh_from_db()
        self.assertEqual(self.satellite.location_name, self.data["location_name"])

    def test_delete_satellite(self):
        response = self.client.delete(self.satellite_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(SatelliteGateway.objects.filter(pk=self.satellite.pk).exists())
