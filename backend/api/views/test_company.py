from rest_framework.test import APITestCase
from rest_framework import status
from api.models import CustomUser
from api.models.company import Company


class CompanyTests(APITestCase):
    def setUp(self):
        self.superuser = CustomUser.objects.create_superuser(
            username="admin", password="admin_password"
        )
        self.operator = CustomUser.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.client.force_authenticate(user=self.superuser)
        self.url = "/api/companies"

    def tearDown(self):
        self.superuser.delete()
        self.operator.delete()

    def test_list_companies(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_forbid_operator_user_list_view(self):
        self.client.force_authenticate(user=self.operator)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_company(self):
        data = {"name": "Test Company"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Company.objects.count(), 1)

    def test_retrieve_company(self):
        company = Company.objects.create(name="Test Company")
        url = f"/api/companies/{company.pk}"  # Specify the URL with the company's primary key
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_company(self):
        company = Company.objects.create(name="Test Company")
        url = f"/api/companies/{company.pk}"
        data = {"name": "Updated Company Name"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        company.refresh_from_db()
        self.assertEqual(company.name, "Updated Company Name")

    def test_delete_company(self):
        company = Company.objects.create(name="Test Company")
        url = f"/api/companies/{company.pk}"  # Specify the URL with the company's primary key
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Company.objects.count(), 0)
