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
# Fixed UserViewSet - removed duplicate class definition
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes= [IsAdminUser]
# for cuurent profile   
    @action(detail = False, methods = ['get'] , permission_classes = [IsAuthenticated])
    def me(self,request):
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
        return [permission() for permission in permission_classes]




class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title', 'author', 'ISBN']
    filterset_fields = ['status', 'category']
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
    
    def get_queryset(self):
        """Filter records based on user role"""
        user = self.request.user
        if user.role == 'admin' or user.role == 'librarian':
            return BorrowRecord.objects.all()
        return BorrowRecord.objects.filter(user=user)
    
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
        borrow_record = self.get_object()
        
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
        borrow_record = self.get_object()
        user = borrow_record.user
        subject = request.data.get('subject')
        message = request.data.get('message')

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
                fail_silently=False,
            )
            return Response({'message': 'Email sent successfully.'})
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