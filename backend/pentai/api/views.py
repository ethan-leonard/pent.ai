# filepath: /root/Projects/pent.ai/backend/pentai/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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