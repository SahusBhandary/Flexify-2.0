from django.urls import path
from .views import hello_world, google_auth, GoogleLogin

urlpatterns = [
    path('hello/', hello_world),
    path('auth/google/', google_auth),
    path('auth/google/connect/', GoogleLogin.as_view()),
]