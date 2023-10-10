from rest_framework import generics, permissions
from api.models.satellite_gateway import SatelliteGateway
from api.serializers.satellite_gateway import SatelliteGatewaySerializer


class PermissionGuard(permissions.BasePermission):
    """
    Custom permission to allow all users to perform GET requests.
    """

    def has_permission(self, request, view):
        if request.method == "GET":
            return request.user and request.user.is_authenticated
        return request.user.is_superuser


def scoped_query_set(instance: generics.GenericAPIView):
    """
    Get all objects for admin users, otherwise apply a filter to ensure an operator only sees
    satellites that belong to their company. Required as django views do not apply object
    permissions for all views so went down this route. I suspect there is a more idiomatic way
    of doing this.
    :return: queryset containing all satellites the user should be able to access
    """
    if instance.request.user.is_superuser:
        return SatelliteGateway.objects.all().order_by("id")

    user_company = instance.request.user.company
    return SatelliteGateway.objects.filter(company=user_company).order_by("id")  #


class SatelliteGatewayListView(generics.ListCreateAPIView):
    serializer_class = SatelliteGatewaySerializer
    permission_classes = [PermissionGuard]

    def get_queryset(self):
        return scoped_query_set(self)


class SatelliteGatewayDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SatelliteGatewaySerializer
    permission_classes = [PermissionGuard]

    def get_queryset(self):
        return scoped_query_set(self)
