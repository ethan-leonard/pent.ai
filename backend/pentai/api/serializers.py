from rest_framework import serializers
import re

class ConnectionRequestSerializer(serializers.Serializer):
    target_url = serializers.CharField(
        error_messages={
            'invalid': 'Please enter a valid URL including http:// or https://'
        }
    )
    
    def validate_target_url(self, value):
        """Validate the URL format"""
        # Basic URL validation
        if not re.match(r'^https?://.+', value):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value