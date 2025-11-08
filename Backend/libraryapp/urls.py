#Aman:- it wires your whole REST API, the browsable login, and JWT auth endpoints.
#rest_framework_simplejwt must be installed and configured in settings.py for these endpoints to work.

from django.urls import path,include
# Default Router -> Automatically generates all the standard CRUD URL routes for the ModelViewSets
from rest_framework.routers import DefaultRouter
from .import views
# They generate and refresh JSON web tokens( JWTs) for secure login and authentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

"""
Chandan
-> Creates a Router object that will automatically generate URL patterns for registered viewsets
-> Each register() call connects a ModelViewSet to a URL prefix

some examples

viewset -> UserViewSet
URL Prefix -> /users/
Automatically Generated Endpoints -> GET,POST,PUT,PATCH,DELETE

We didn't have to manually define these URLs - DRF's DefaultRouter did it for us automatically
"""
"""
Aman
->prefix becomes the URL path segment (e.g., /users/).
->The router inspects the viewset and creates routes for actions (list, retrieve, etc.). 
->It also maps custom @action decorators to users/me/ or users/{pk}/custom_action/ automatically.
"""
router = DefaultRouter()
router.register(r'users',views.UserViewSet)
router.register(r'books',views.BookViewSet)
router.register(r'borrow-records',views.BorrowRecordViewSet)
router.register(r'categories',views.CategoryViewSet)

urlpatterns = [
    #Chandan
    #Includes all automatically generated URLS from our router
    path('',include(router.urls)),
    path('api-auth/',include('rest_framework.urls',namespace='rest_framework')),
    """
    Chandan
    This endpoint is for JWT Authentication (login)

    We send a POST request with:
    {
        "username":"username",
        "password":"password"
    }

    and it responds with 
    {
        "access":"access token"
        "refresh":"refresh token"
    }
    """
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    """
    Chandan
    Used to refresh your access token

    We send
    {
        "refresh":"refresh_token"
    }
    We get back a new
    {
        "access":"new_access_token"
    }

    This way we don't have to login again
    """
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
