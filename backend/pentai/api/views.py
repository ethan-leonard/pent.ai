from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ConnectionRequestSerializer
from vulnerability_scanner.services.zap_service import ZAPService

class ZAPConnectionView(APIView):
    """
    API view to verify connection to ZAP.
    """
    def post(self, request, *args, **kwargs):
        serializer = ConnectionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        target_url = serializer.validated_data['target_url']
        zap_service = ZAPService()
        result = zap_service.verify_connection(target_url)
        return Response(result)

class ZAPTraditionalSpiderScanView(APIView):
    """
    API view to trigger a traditional spider scan and return its results.
    """
    def post(self, request, *args, **kwargs):
        serializer = ConnectionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        target_url = serializer.validated_data['target_url']
        zap_service = ZAPService()
        result = zap_service.traditional_spider_scan(target_url)
        return Response(result)

class ZAPAjaxSpiderScanView(APIView):
    """
    API view to trigger an Ajax spider scan and return its results.
    """
    def post(self, request, *args, **kwargs):
        serializer = ConnectionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        target_url = serializer.validated_data['target_url']
        zap_service = ZAPService()
        result = zap_service.ajax_spider_scan(target_url)
        return Response(result)

class ZAPActiveScanView(APIView):
    """
    API view to trigger an active scan and return its results.
    """
    def post(self, request, *args, **kwargs):
        serializer = ConnectionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        target_url = serializer.validated_data['target_url']
        zap_service = ZAPService()
        result = zap_service.active_scan_all(target_url)
        return Response(result)