from django.urls import path
from .views import openai_chat, google_auth, GoogleLogin, get_user, register_user, login_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/google/', google_auth),
    path('auth/google/connect/', GoogleLogin.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('getUser/', get_user, name='get_user'),
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('openai-chat/', openai_chat, name='openai_chat'),
]