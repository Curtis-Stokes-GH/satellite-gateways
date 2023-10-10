from rest_framework import generics
from api.models.company import Company
from api.serializers.company import CompanySerializer
from api.superuser_required import IsSuperUser


class CompanyListView(generics.ListCreateAPIView):
    queryset = Company.objects.all().order_by("id")
    serializer_class = CompanySerializer
    permission_classes = [IsSuperUser]

    class Meta:
        ordering = ["-id"]


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsSuperUser]
