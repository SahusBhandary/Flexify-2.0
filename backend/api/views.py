from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import models
from django.contrib.auth.models import User
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests  
import requests  
import os
from .models import UserProfile
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import sys
import openai

# Google OAuth Login View
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000"
    client_class = OAuth2Client

# Google token verification
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    token = request.data.get('token')

    try:
        # Use access token to get user info instead of verifying an ID token
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        if google_response.status_code != 200:
            return Response({'error': 'Invalid token'}, status=400)
            
        user_info = google_response.json()
        
        # Get or create user based on email
        email = user_info['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=user_info.get('given_name', ''),
                last_name=user_info.get('family_name', '')
            )
        
        user_profile, created = UserProfile.objects.update_or_create(
            email=email,
            defaults={
                'username': user_info.get('given_name', '') + " " + user_info.get('family_name', ''),
            }
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {
                'email': user.email,
                'username': user.first_name + " " + user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    except Exception as e:
        import traceback
        print(f"Exception in google_auth: {str(e)}")
        print(traceback.format_exc())
        return Response({'error': str(e)}, status=400)

#Get User From JWT Token
@api_view(['GET'])
@permission_classes([IsAuthenticated])

def get_user(request):
    user = request.user

    try:
        user_profile = UserProfile.objects.get(email=user.email)
        profile_data = {
            'username': user_profile.username
        }
    except UserProfile.DoesNotExist:
        profile_data = {}

    return Response({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'profile': profile_data,
    })

@api_view(['POST'])
@permission_classes([AllowAny])

def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validate fields
    if not username or not email or not password:
        return Response({
            'error': 'All fields are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({
            'email': ['User with this email already exists']
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate Password
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({
            'password': e.messages
        }, status=status.HTTP_400_BAD_REQUEST)

    # Create User
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        # Create user profile
        user_profile, created = UserProfile.objects.update_or_create(
            email=email,
            defaults={
                'username': username,
            }
        )

        # Generate JWT Tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'email': user.email,
                'username': username,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({
            'non_field_errors': ['Email and passowrd are required']
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)


        authenticated_user = authenticate(username=user.username, password=password)

        if authenticated_user is None:
            return Response({
                'non_field_errors': ['Invalid email or password']
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(authenticated_user)

        user_profile, created = UserProfile.objects.get_or_create(
            email=email,
            defaults={
                'username': authenticated_user.username,
            }
        )

        return Response({
            'user': {
                'email': authenticated_user.email,
                'username': authenticated_user.username,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({
            'non_field_errors': ['Invalid email or passowrd']
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({
            'detail': (f'An error occurred during login: {e}')
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def openai_chat(request):
    try:
        user_message = request.data.get('message')

        if not user_message:
            return Response({
                'error': 'Message is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        client = openai.OpenAI(
            ape_key=os.getenv('OPENAI_API_KEY')
        )

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            message=[
                {"role:": "system", "content": "You are an assistant that helps with diet planning, workouts, and overall health."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )

        # Get the response
        ai_response = response.choices[0].message.content

        return Response({
            'response': ai_response,
            'usage': {
                'prompt_tokens': response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
        }, status=status.HTTP_200_OK)
    
    except openai.OpenAIError as e:
        return Response({
            'error': f'OpenAI API error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({
            'error': f'Error processing request: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)