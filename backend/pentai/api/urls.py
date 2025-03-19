from django.urls import path
from .views import HelloWorldView, ZAPConnectionView, ZAPActiveScanView, ZAPSpiderScanView

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello-world'),
    path('zap-connection/', ZAPConnectionView.as_view(), name='zap-connection'),
    path('active-scan/', ZAPActiveScanView.as_view(), name='active-scan'),
    path('spider-scan/', ZAPSpiderScanView.as_view(), name='spider-scan'),
]