from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ConnectionRequestSerializer
from vulnerability_scanner.services.zap_service import ZAPService

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

class ZAPConnectionView(APIView):
    """API view for testing connection to ZAP and a target URL"""
    
    def post(self, request, *args, **kwargs):
        """Test connection to ZAP and target URL"""
        # Validate request data
        serializer = ConnectionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the target URL
        target_url = serializer.validated_data['target_url']
        
        # Test connection to ZAP
        zap_service = ZAPService()
        result = zap_service.verify_connection(target_url)
        
        # Return the result
        return Response(result, status=status.HTTP_200_OK if result['success'] else status.HTTP_500_INTERNAL_SERVER_ERROR)