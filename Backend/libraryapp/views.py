from rest_framework import viewsets

from django.shortcuts import render
from .models import User, Book, BorrowRecord, Category
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .utils import send_due_notification
from django.utils import timezone
from .serializers import UserSerializer, BookSerializer, BorrowRecordSerializer, CategorySerializer
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from .permissions import IsAdminOrLibrarian
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
"""
ModelViewSet is a powerful abstraction in Django REST Framework that automatically
provides all CRUD Operations (Create , Retrieve, Update, Delete ) for a model using a single class

Why are these better than generic views
 a) Full CRUD API for a model where as Generic views provide only one or few specific operation
 b) Minimal Boiler Plate
 c) No need to explicitly define URLs these are automatically handled via DRF's router
 d)Supported by @action decorator


"""



# Fixed UserViewSet - removed duplicate class definition
# Chandan - UserViewSet  controls how users are created,listed,updated and retrieved with different 
# permissions for each action.
class UserViewSet(viewsets.ModelViewSet):
 """
 Chandan
 Inherits from ModelViewSet, which automatically provides CRUD endpoints
   - list() -> GET /users/
   - retrieve() -> GET /users/{id}/
   - create() -> POST /users/
   - update() / partial_update() -> PUT/PATCH /users/{id}/
   - destroy() -> DELETE /users/{id}/
 """
   # The data this views works (User model objects)
    queryset = User.objects.all()
   # serializer_class -> Converts between python objects and JSON (UserSerializer defines how
   # user data looks in the API)
    serializer_class = UserSerializer
   # This sets a default permission, Only admin can access.
   # IsAdminUser obtained from rest_framework.permissions
    permission_classes= [IsAdminUser]
# for current profile   

   """
   Creates a custom endpoint /users/me/ (thanks to DRF's @action decorator)
   details = False -> It doesn't need a user ID (because it obtains the currently logged in User)
   Method: GET only
   """

  """
FLOW for GET /users/me/
  
  Frontend → /users/me/ 
   ↓
UserViewSet.me() called
   ↓
get_permissions() sets [IsAuthenticated]
   ↓
Checks JWT token → valid user
   ↓
Serializes request.user → JSON
   ↓
Returns {"username": "chandan", "email": "...", "role": "member"}


FLOW for POST /users/

Frontend → POST /users/ with username/password
   ↓
UserViewSet.create() triggered
   ↓
get_permissions() sets [AllowAny]
   ↓
Serializer validates and creates new user
   ↓
Returns created user JSON


  """
    @action(detail = False, methods = ['get'] , permission_classes = [IsAuthenticated])
    def me(self,request):
     # it is a way to create a serializer object that automatically uses the correct serializer
     # and passes the correct context
     # self.get_serializer - creates an instance of that serializer when processing a request
     # (runtime instance)
     # serializes that user - UserSerializer(request.user)
     # Returns user's profile in JSON format
        serializer = self.get_serializer(request.user)
        return Response(serializer.data) 
    
    def get_permissions(self):
        if self.action == 'create':
            # Allow registration without authentication
            permission_classes = [AllowAny]
        elif self.action == 'list':
            permission_classes = [IsAdminOrLibrarian]
        elif self.action in ['retrieve', 'update', 'partial_update','me']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'destroy':
            permission_classes = [IsAdminOrLibrarian]
        else:
            permission_classes = [IsAdminUser]
         # permission() = instantiates a permission class -> becomes an object
         # Creates a list of permission instances so DRF can call .has_permissions() on each one
        return [permission() for permission in permission_classes]


"""
BookViewSet is a ViewSet — a special kind of class-based view provided by DRF.

It’s built on top of ModelViewSet, which automatically gives us CRUD operations:

list() → GET /books/ → all books

retrieve() → GET /books/<id>/ → single book

create() → POST /books/ → add new book

update() → PUT /books/<id>/ → full update

partial_update() → PATCH /books/<id>/ → partial update

destroy() → DELETE /books/<id>/ → delete book
"""

class BookViewSet(viewsets.ModelViewSet):
 # data on which our views will work ( all the Books records in your database)
    queryset = Book.objects.all()
 # tells DRF how to convert the Book model in to JSON ( and vice versa)
    serializer_class = BookSerializer
 # SearchFilter -> Allows Keyword Search on specified fields
 # DjangoFilterBackend -> Allows exact filtering on specific fields
 # OrderingFilter -> Lets you order results by specific fields
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
 # used by the SearchFilter
 # Let's us search across these fields using the ?search= parameter
    search_fields = ['title', 'author', 'ISBN']
 # Used by the DjangoFilterBackend, Let's us filter based on exact field matches
    filterset_fields = ['status', 'category']
 # Used by the OrderingFilter. Let's client control the order of results
    ordering_fields = ['title', 'author']
    permission_classes = [IsAdminOrLibrarian]



class BorrowRecordViewSet(viewsets.ModelViewSet):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer
    permission_classes = [IsAuthenticated]
    

    def get_serializer_context(self):
        """Pass request to serializer"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

 """
 Controls which records a user can see
 - if the user is admin or librarian -> they see all borrow records
 - if the user is a member -> they see only their own records
 
 """
    def get_queryset(self):
        """Filter records based on user role"""
        user = self.request.user
        if user.role == 'admin' or user.role == 'librarian':
            return BorrowRecord.objects.all()
        return BorrowRecord.objects.filter(user=user)

"""
This runs after serializer validation but before saving to the database.

Flow:
1. It checks if the book is available
2. If available
  - Saves the borrow record with the logged-in user
  - Updates the book's status -> 'borrowed'
"""
    
    def perform_create(self, serializer):
        """Automatically set the user and update book status"""
        book = serializer.validated_data['book']
     
        if book.status != 'available':
            raise ValidationError("This book is not available for borrowing")
        
        # Create borrow record
        serializer.save(user=self.request.user)
        
        # Update book statusit
        book.status = 'borrowed'
        book.save()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def check_due_books(self, request):
        """Send notifications for overdue books"""
        count = 0
        records = BorrowRecord.objects.filter(
            return_date__isnull=True,
            due_date__lte=timezone.now()
        )
        
        for record in records:
            user_email = record.user.email
            book_title = record.book.title
            due_date = record.due_date.strftime('%Y-%m-%d')
            send_due_notification(user_email, book_title, due_date)
            count += 1
        
        return Response({'message': f'Sent {count} notifications for overdue books'})
    
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        """Mark a book as returned"""
     # retrieves the specific BorrowRecord by it's primary key(pk) from the URL
        borrow_record = self.get_object()
     # if the book has already been marked as returned(return_date is not None), we block
     # re-returning and send an error response
        if borrow_record.return_date:
            return Response({'error': 'Book already returned'}, status=400)
        
        # Update return date
        borrow_record.return_date = timezone.now()
        borrow_record.save()
        now = timezone.now()
        # Fine calculation
     
        if now.date() >= borrow_record.due_date.date():
            days_late = (now.date() - borrow_record.due_date.date()).days + 1
            borrow_record.fine_amount = days_late * 10  # ₹10 per day
            borrow_record.fine_paid = True

        borrow_record.save()
        
        # Update book status
        book = borrow_record.book
        book.status = 'available'
        book.save()
        message = "Book returned successfully" 
        
        if borrow_record.fine_amount > 0:
            message += f" with a fine of ₹{borrow_record.fine_amount}"

        return Response({'message': message})
    
    # ✅ Librarian/Admin — view all unpaid fines
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def unpaid_fines(self, request):
        fines = BorrowRecord.objects.filter(fine_amount__gt=0, fine_paid=False)
        serializer = self.get_serializer(fines, many=True)
        return Response(serializer.data)

    # ✅ Librarian/Admin — mark fine as paid manually
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_fine_paid(self, request, pk=None):
        record = self.get_object()
        if record.fine_paid:
            return Response({'message': 'Fine already marked as paid'}, status=status.HTTP_400_BAD_REQUEST)
        record.fine_paid = True
        record.save()
        return Response({'message': f'Fine of ₹{record.fine_amount} for {record.book.title} marked as paid'})

    #email
    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrLibrarian])
    def send_email(self, request, pk=None):
        """Allow librarian/admin to send a custom email to the borrower"""
     # self.get_object() fetches the BorrowRecord instance that corresponds to the given prima-
     # -ry key from the url
        borrow_record = self.get_object()
     # Grabs the user object linked to this borrow record- this is the borrower to whom the
     # email will be sent
        user = borrow_record.user
     # Extracts the email subject and message from the POST body the frontend sends
        subject = request.data.get('subject')
        message = request.data.get('message')

     #Validation
     #If either subject or message is missing, return a 400 (bad request) response with an err-
     # -or message
        if not subject or not message:
            return Response(
                {'error': 'Subject and message are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
             # raises an error if sending fails instead of ignoring it
                fail_silently=False,
            )
            return Response({'message': 'Email sent successfully.'})
         #If something goes wrong (e.g. SMTP error, no email server, invalid recipent), it
         # catches the exception and returns a 500 error with details
        except Exception as e:
            return Response(
                {'error': f'Failed to send email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes=[IsAdminOrLibrarian]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminOrLibrarian]
        return [permission() for permission in permission_classes]
