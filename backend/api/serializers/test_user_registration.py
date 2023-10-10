from django.test import TestCase
from api.models import CustomUser
from api.models.company import Company
from api.serializers.user_registration import UserRegistrationSerializer


class UserRegistrationSerializerTestCase(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Test Company")

    def tearDown(self):
        self.company.delete()

    def test_valid_super_user(self):
        valid_data_superuser = {
            "username": "superuser",
            "password": "superpassword",
            "is_superuser": True,
        }
        serializer = UserRegistrationSerializer(
            data=valid_data_superuser
        )  # Create a new serializer instance here
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsInstance(user, CustomUser)
        self.assertTrue(user.is_superuser)

    def test_valid_regular_user(self):
        valid_data_regular_user = {
            "username": "regularuser",
            "password": "regularpassword",
            "is_superuser": False,
            "company": self.company.id,
        }
        serializer = UserRegistrationSerializer(
            data=valid_data_regular_user
        )  # Create a new serializer instance here
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsInstance(user, CustomUser)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.company, self.company)

    def test_invalid_regular_user_missing_company(self):
        invalid_data_missing_company = {
            "username": "regularuser",
            "password": "regularpassword",
            "is_superuser": False,
        }
        serializer = UserRegistrationSerializer(
            data=invalid_data_missing_company
        )  # Create a new serializer instance here
        self.assertFalse(serializer.is_valid())
        self.assertIn(
            "Company must be specified for non-superuser users.",
            str(serializer.errors["non_field_errors"][0]),
        )
