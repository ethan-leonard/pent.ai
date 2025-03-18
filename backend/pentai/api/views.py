from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import ScanSerializer, ScanRequestSerializer
from vulnerability_scanner.models import Scan
from vulnerability_scanner.services.zap_service import ZAPScanService
import threading

class HelloWorldView(APIView):
    """
    A simple API view that returns a hello world message.
    This is just for testing that the API setup works.
    """
    def get(self, request, *args, **kwargs):
        """
        Handle GET requests to return a simple message
        """
        return Response({
            'message': 'Hello, World!',
            'status': 'API is working!'
        }, status=status.HTTP_200_OK)

class ScanAPIView(APIView):
    """API view for starting scans and retrieving scan results"""
    
    def post(self, request, *args, **kwargs):
        """Start a new scan"""
        # Validate request data
        serializer = ScanRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new scan object
        scan = Scan.objects.create(target_url=serializer.validated_data['target_url'])
        
        # Start scan in a background thread
        def run_scan_in_background():
            service = ZAPScanService()
            service.scan_url(scan)
        
        # Start the background thread
        thread = threading.Thread(target=run_scan_in_background)
        thread.daemon = True
        thread.start()
        
        # Return the scan object
        return Response(ScanSerializer(scan).data, status=status.HTTP_201_CREATED)
    
    def get(self, request, *args, **kwargs):
        """Get all scans"""
        scans = Scan.objects.all().order_by('-start_time')
        return Response(ScanSerializer(scans, many=True).data)

class ScanDetailAPIView(APIView):
    """API view for retrieving details of a specific scan"""
    
    def get(self, request, scan_id, *args, **kwargs):
        """Get details of a specific scan"""
        try:
            scan = Scan.objects.get(pk=scan_id)
            return Response(ScanSerializer(scan).data)
        except Scan.DoesNotExist:
            return Response({"error": "Scan not found"}, status=status.HTTP_404_NOT_FOUND)