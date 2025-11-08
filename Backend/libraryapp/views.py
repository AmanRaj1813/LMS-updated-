# -------------------------------------------------------------------------
# Django REST Framework ViewSets for User, Book, BorrowRecord, and Category
# -------------------------------------------------------------------------
# This module defines all the main API logic for your Library Management System.
# Each ViewSet class provides CRUD operations and custom actions for its model.
# -------------------------------------------------------------------------

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

# -------------------------------------------------------------------------
# ModelViewSet is a powerful abstraction in Django REST Framework that automatically
# provides all CRUD operations (Create, Retrieve, Update, Delete) for a model using a single class.
#
# Advantages over generic views:
# a) Full CRUD API for a model (generic views provide only limited operations)
# b) Minimal boilerplate
# c) No need to explicitly define URLs — handled automatically via DRF's router
# d) Supports @action decorator for custom endpoints
# -------------------------------------------------------------------------


# -------------------------------------------------------------------------
# USER VIEWSET
# -------------------------------------------------------------------------
# Chandan:
# UserViewSet controls how users are created, listed, updated, and retrieved,
# with different permissions for each action.
# -------------------------------------------------------------------------
class UserViewSet(viewsets.ModelViewSet):
    # Chandan:
    # Inherits from ModelViewSet, which automatically provides CRUD endpoints:
    #   - list() -> GET /users/
    #   - retrieve() -> GET /users/{id}/
    #   - create() -> POST /users/
    #   - update() / partial_update() -> PUT/PATCH /users/{id}/
    #   - destroy() -> DELETE /users/{id}/

    queryset = User.objects.all()  # The data this view works on (User model objects)
    serializer_class = UserSerializer  # Defines JSON representation of user data
    permission_classes = [IsAdminUser]  # Default: only admin can access

    # ---------------------------------------------------------------------
    # Creates a custom endpoint /users/me/
    # details=False → doesn't need user ID (it uses the logged-in user)
    # Method: GET only
    # ---------------------------------------------------------------------
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        # Serializes and returns the logged-in user's profile
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    # ---------------------------------------------------------------------
    # Dynamic permissions based on the action being performed
    # ---------------------------------------------------------------------
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]  # Registration allowed for anyone
        elif self.action == 'list':
            permission_classes = [IsAdminOrLibrarian]
        elif self.action in ['retrieve', 'update', 'partial_update', 'me']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'destroy':
            permission_classes = [IsAdminOrLibrarian]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


# -------------------------------------------------------------------------
# BOOK VIEWSET
# -------------------------------------------------------------------------
# BookViewSet automatically handles CRUD for books:
#   list() → GET /books/ → all books
#   retrieve() → GET /books/<id>/ → single book
#   create() → POST /books/ → add new book
#   update() → PUT /books/<id>/ → full update
#   partial_update() → PATCH /books/<id>/ → partial update
#   destroy() → DELETE /books/<id>/ → delete book
# -------------------------------------------------------------------------
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title', 'author', 'ISBN']  # Enables ?search=
    filterset_fields = ['status', 'category']  # Enables filtering
    ordering_fields = ['title', 'author']  # Enables ordering
    permission_classes = [IsAdminOrLibrarian]


# -------------------------------------------------------------------------
# BORROW RECORD VIEWSET
# -------------------------------------------------------------------------
# Handles all borrow/return operations, fine calculations, and notifications.
# -------------------------------------------------------------------------
class BorrowRecordViewSet(viewsets.ModelViewSet):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        # Pass request context to serializer
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    # ---------------------------------------------------------------------
    # Controls which records a user can see:
    # - Admin or librarian → all records
    # - Member → only their own records
    # ---------------------------------------------------------------------
    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'librarian']:
            return BorrowRecord.objects.all()
        return BorrowRecord.objects.filter(user=user)

    # ---------------------------------------------------------------------
    # Custom create logic:
    # Checks if the book is available before borrowing.
    # If available:
    #   - Saves record with logged-in user
    #   - Marks the book as 'borrowed'
    # ---------------------------------------------------------------------
    def perform_create(self, serializer):
        book = serializer.validated_data['book']
        if book.status != 'available':
            raise ValidationError("This book is not available for borrowing")

        serializer.save(user=self.request.user)
        book.status = 'borrowed'
        book.save()

    # ---------------------------------------------------------------------
    # Admin-only endpoint to send due notifications
    # GET /borrow-records/check_due_books/
    # ---------------------------------------------------------------------
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def check_due_books(self, request):
        count = 0
        records = BorrowRecord.objects.filter(
            return_date__isnull=True,
            due_date__lte=timezone.now()
        )
        for record in records:
            send_due_notification(record.user.email, record.book.title, record.due_date.strftime('%Y-%m-%d'))
            count += 1
        return Response({'message': f'Sent {count} notifications for overdue books'})

    # ---------------------------------------------------------------------
    # POST /borrow-records/{id}/return_book/
    # Marks book as returned, calculates fine if overdue
    # ---------------------------------------------------------------------
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        borrow_record = self.get_object()
        if borrow_record.return_date:
            return Response({'error': 'Book already returned'}, status=400)

        borrow_record.return_date = timezone.now()
        borrow_record.save()

        now = timezone.now()
        if now.date() >= borrow_record.due_date.date():
            days_late = (now.date() - borrow_record.due_date.date()).days + 1
            borrow_record.fine_amount = days_late * 10  # ₹10/day fine
            borrow_record.fine_paid = True
            borrow_record.save()

        book = borrow_record.book
        book.status = 'available'
        book.save()

        message = "Book returned successfully"
        if borrow_record.fine_amount > 0:
            message += f" with a fine of ₹{borrow_record.fine_amount}"

        return Response({'message': message})

    # ---------------------------------------------------------------------
    # GET /borrow-records/unpaid_fines/
    # Librarian/Admin — view all unpaid fines
    # ---------------------------------------------------------------------
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def unpaid_fines(self, request):
        fines = BorrowRecord.objects.filter(fine_amount__gt=0, fine_paid=False)
        serializer = self.get_serializer(fines, many=True)
        return Response(serializer.data)

    # ---------------------------------------------------------------------
    # POST /borrow-records/{id}/mark_fine_paid/
    # Librarian/Admin — mark fine as paid manually
    # ---------------------------------------------------------------------
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_fine_paid(self, request, pk=None):
        record = self.get_object()
        if record.fine_paid:
            return Response({'message': 'Fine already marked as paid'}, status=status.HTTP_400_BAD_REQUEST)
        record.fine_paid = True
        record.save()
        return Response({'message': f'Fine of ₹{record.fine_amount} for {record.book.title} marked as paid'})

    # ---------------------------------------------------------------------
    # POST /borrow-records/{id}/send_email/
    # Librarian/Admin — send custom email to borrower
    # ---------------------------------------------------------------------
    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrLibrarian])
    def send_email(self, request, pk=None):
        borrow_record = self.get_object()
        user = borrow_record.user
        subject = request.data.get('subject')
        message = request.data.get('message')

        if not subject or not message:
            return Response({'error': 'Subject and message are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )
            return Response({'message': 'Email sent successfully.'})
        except Exception as e:
            return Response({'error': f'Failed to send email: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# -------------------------------------------------------------------------
# CATEGORY VIEWSET
# -------------------------------------------------------------------------
# Categories (book categories) can be read by any logged-in user;
# creation/deletion reserved for admin/librarian.
# -------------------------------------------------------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrLibrarian]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminOrLibrarian]
        return [permission() for permission in permission_classes]
