from rest_framework import serializers
from vulnerability_scanner.models import Scan, Vulnerability

class VulnerabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vulnerability
        fields = ['id', 'name', 'description', 'url', 'risk', 'confidence']

class ScanSerializer(serializers.ModelSerializer):
    vulnerabilities = VulnerabilitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Scan
        fields = ['id', 'target_url', 'start_time', 'end_time', 'status', 'vulnerabilities']
        
class ScanRequestSerializer(serializers.Serializer):
    target_url = serializers.URLField()