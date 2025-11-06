# libraryapp/exception_handler.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom global exception handler for DRF.
    """
    # Let DRF handle the exception first
    response = exception_handler(exc, context)

    # Log the exception (useful for debugging)
    logger.error(f"Exception: {exc} | Context: {context}")

    # If DRF handled it, modify the response
    if response is not None:
        return Response({
            "success": False,
            "status_code": response.status_code,
            "error": str(exc),
            "details": response.data
        }, status=response.status_code)

    # Handle uncaught exceptions (like KeyError, ValueError, etc.)
    return Response({
        "success": False,
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        "error": "Internal server error",
        "message": "Something went wrong on the server. Please contact support."
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
