from rest_framework import serializers


class PredictInputSerializer(serializers.Serializer):
    N           = serializers.FloatField(min_value=0,   max_value=140,  help_text="Nitrogen (mg/kg)")
    P           = serializers.FloatField(min_value=5,   max_value=145,  help_text="Phosphorus (mg/kg)")
    K           = serializers.FloatField(min_value=5,   max_value=205,  help_text="Potassium (mg/kg)")
    temperature = serializers.FloatField(min_value=0,   max_value=50,   help_text="Temperature (°C)")
    humidity    = serializers.FloatField(min_value=0,   max_value=100,  help_text="Humidity (%)")
    ph          = serializers.FloatField(min_value=0,   max_value=14,   help_text="Soil pH")
    rainfall    = serializers.FloatField(min_value=0,   max_value=300,  help_text="Rainfall (mm)")