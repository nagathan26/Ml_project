from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status

from .serializers import PredictInputSerializer
from . import ml_model



class PredictView(APIView):

    def post(self,request):
        serializer = PredictInputSerializer(data = request.data)

        if not serializer.is_valid():
            return Response(
                {"error":"Invalid input","details":serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        results = ml_model.predict_all(serializer.validated_data)


        votes = {}

        for r in results:
            votes[r["prediction"]] = votes.get(r["prediction"],0) + 1

        majority_crop = max(votes,key=votes.get)
        majority_count = votes[majority_crop]

        return  Response({
            "majority_vote": majority_crop,
            "vote_count":    majority_count,
            "total_models":  len(results),
            "results":       results,
        })
    

class MetricsView(APIView):
    
    def get(self,request):
        return Response({
            "metrics": ml_model.get_metrics()
        })
    
class CropsView(APIView):

    def get(self,request):
        crops = ml_model.get_crops()
        return Response({"crops": crops, "count": len(crops)})

class HealthView(APIView):
    
    def get(self, request):
        return Response({
            "status":        "ok",
            "models_loaded": len(ml_model._models)
        })