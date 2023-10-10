from django.urls import path

from api.views.company import CompanyListView, CompanyDetailView
from api.views.login import LoginView
from api.views.logout import logout_view
from api.views.satellite_gateway import (
    SatelliteGatewayListView,
    SatelliteGatewayDetailView,
)
from api.views.session import SessionView
from api.views.register_user import UserRegistrationView

urlpatterns = [
    path("login", LoginView.as_view(), name="login"),
    path("logout", logout_view, name="logout"),
    path("session", SessionView.as_view(), name="session"),
    path("gateways", SatelliteGatewayListView.as_view(), name="gateway-list"),
    path(
        "gateways/<int:pk>", SatelliteGatewayDetailView.as_view(), name="gateway-detail"
    ),
    path("register", UserRegistrationView.as_view(), name="user-registration"),
    path("companies", CompanyListView.as_view(), name="company-list"),
    path("companies/<int:pk>", CompanyDetailView.as_view(), name="company-detail"),
]
