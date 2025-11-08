# Aman:- it wires your whole REST API, the browsable login, and JWT auth endpoints.
# rest_framework_simplejwt must be installed and configured in settings.py for these endpoints to work.

from django.urls import path, include
# Default Router -> Automatically generates all the standard CRUD URL routes for the ModelViewSets
from rest_framework.routers import DefaultRouter
from . import views
# They generate and refresh JSON web tokens (JWTs) for secure login and authentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# ---------------------------------------------
# Chandan:
# -> Creates a Router object that will automatically generate URL patterns for registered viewsets
# -> Each register() call connects a ModelViewSet to a URL prefix
#
# Some examples:
# viewset -> UserViewSet
# URL Prefix -> /users/
# Automatically Generated Endpoints -> GET, POST, PUT, PATCH, DELETE
#
# We didn't have to manually define these URLs — DRF's DefaultRouter did it for us automatically
# ---------------------------------------------

# Aman:
# -> prefix becomes the URL path segment (e.g., /users/).
# -> The router inspects the viewset and creates routes for actions (list, retrieve, etc.).
# -> It also maps custom @action decorators to users/me/ or users/{pk}/custom_action/ automatically.

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'books', views.BookViewSet)
router.register(r'borrow-records', views.BorrowRecordViewSet)
router.register(r'categories', views.CategoryViewSet)

urlpatterns = [
    # Includes all automatically generated URLs from our router
    path('', include(router.urls)),

    # Enables login/logout views for the browsable DRF API
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # ✅ Chandan: JWT Authentication (Login)
    # Send a POST request:
    # {
    #   "username": "your_username",
    #   "password": "your_password"
    # }
    # Response:
    # {
    #   "access": "access_token",
    #   "refresh": "refresh_token"
    # }
    # This endpoint generates JWT tokens upon successful login
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # ✅ Chandan: Refresh your access token without logging in again
    # Send:
    # {
    #   "refresh": "refresh_token"
    # }
    # Response:
    # {
    #   "access": "new_access_token"
    # }
    # This helps maintain a valid session without re-entering credentials
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
