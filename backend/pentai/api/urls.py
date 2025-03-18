from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import HelloWorldView

# Create a router for ViewSets
router = DefaultRouter()
# We'll add ViewSets here later when we have them

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello-world'),
    # Include router URLs
    *router.urls,
]