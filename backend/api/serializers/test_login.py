import dataclasses
import unittest
from unittest.mock import patch
from rest_framework.exceptions import ValidationError

from api.serializers.login import LoginSerializer


@dataclasses.dataclass
class MockUser:
    is_active: bool


def mock_authenticate(username: str, password: str):
    if username == "active" and password == "test":
        return MockUser(is_active=True)
    elif username == "inactive" and password == "test":
        return MockUser(is_active=False)

    return None


@patch("api.serializers.login.authenticate", mock_authenticate)
class LoginSerializerTest(unittest.TestCase):
    def setUp(self):
        self.serializer = LoginSerializer()

    def test_returns_user_for_valid_credentials(self):
        user = self.serializer.validate({"username": "active", "password": "test"})
        self.assertEquals(user, MockUser(is_active=True))

    def test_raises_invalid_details_validation_error(self):
        with self.assertRaises(ValidationError) as error:
            self.serializer.validate({"username": "does-not-exist", "password": "test"})
        self.assertEquals(error.exception.detail[0], "Incorrect username or password.")

    def test_raises_user_disabled_validation_error(self):
        with self.assertRaises(ValidationError) as error:
            self.serializer.validate({"username": "inactive", "password": "test"})
        self.assertEquals(str(error.exception.detail[0]), "User is disabled.")
