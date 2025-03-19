from django.urls import path
from .views import HelloWorldView, ZAPConnectionView

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello-world'),
    path('zap-connection/', ZAPConnectionView.as_view(), name='zap-connection'),
]