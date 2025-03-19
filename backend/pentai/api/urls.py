from django.urls import path
from .views import (
    ZAPConnectionView, ZAPActiveScanView, 
    ZAPTraditionalSpiderScanView, ZAPAjaxSpiderScanView
)

urlpatterns = [
    path('zap-connection/', ZAPConnectionView.as_view(), name='zap-connection'),
    path('active-scan/', ZAPActiveScanView.as_view(), name='active-scan'),
    path('traditional-spider-scan/', ZAPTraditionalSpiderScanView.as_view(), name='traditional-spider-scan'),
    path('ajax-spider-scan/', ZAPAjaxSpiderScanView.as_view(), name='ajax-spider-scan'),
]