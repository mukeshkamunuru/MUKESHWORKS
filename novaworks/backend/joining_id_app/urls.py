from django.urls import path
from .views import JoiningIDListCreate, JoiningIDDelete

urlpatterns = [
    path('joining-ids/',                 JoiningIDListCreate.as_view()),
    path('joining-ids/<int:pk>/delete/', JoiningIDDelete.as_view()),
]
