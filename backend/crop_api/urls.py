from django.urls import path
from .views import PredictView, MetricsView, CropsView, HealthView

urlpatterns = [
    path("predict/", PredictView.as_view(),  name="predict"),
    path("metrics/", MetricsView.as_view(),  name="metrics"),
    path("crops/",   CropsView.as_view(),    name="crops"),
]