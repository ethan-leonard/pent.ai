from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import HelloWorldView, ScanAPIView, ScanDetailAPIView

# Create a router for ViewSets
router = DefaultRouter()
# We'll add ViewSets here later when we have them

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello-world'),
    path('scans/', ScanAPIView.as_view(), name='scans'),
    path('scans/<uuid:scan_id>/', ScanDetailAPIView.as_view(), name='scan-detail'),
    # Include router URLs
    *router.urls,
]