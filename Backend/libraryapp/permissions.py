from rest_framework.permissions import BasePermission

class IsAdminOrLibrarian(BasePermission):
    """
    Custom permission to allow only admins and librarians to modify books.
    """

    def has_permission(self, request, view):
        # Safe methods (GET, HEAD, OPTIONS) allowed for all authenticated users
        """
        HEAD -> works exactly like a GET Request, except it doesn't return the response body
        only the Headers. It's mainly used to check whether a resource exists or to get Metadata

        OPTIONS -> it is used to discover what actions are available on an endpoint. It tells 
        the client which HTTP methods(Like GET, POST, PUT) are allowed what fields a required,
        and which content type are supported.
        """
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return request.user and request.user.is_authenticated
        
        # Write methods allowed for admins and librarians
        """
        When we use Django REST Framework with authentication, DRF automatically sets
        request.user
        request.auth
        for every incoming request
        This happens before ViewSet or permission class is even called

        When a request comes in with Authorization: Bearer <token>, 
        -> JWTAuthentication decodes the token, identifies the user and sets
        -> The JWTAuthentication class
            - Decodes the token
            - fetches the corresponding user from your database
            - Sets request.user to that instance
        
        """
        return (
            request.user
            #is_authenticated obtained from AbstractUser which our User model class inherited
            and request.user.is_authenticated
            #Python built in function used to safely access an attribute
            #Syntax -> getattr(object,attribute_name,default_value)
            #Get the value of request.user.role if it exists; Otherwise return None instead
            # of throwing an error
            and getattr(request.user, 'role', None) in ['admin', 'librarian']
        )
