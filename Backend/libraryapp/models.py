
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta,datetime
from django.utils import timezone
class User(AbstractUser):
    ROLES = (
        ('admin', 'Admin'),
        ('librarian', 'Librarian'),
        ('member', 'Member'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='member')

    def __str__(self):
        return self.username


class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Book(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('borrowed', 'Borrowed'),
        ('reserved', 'Reserved'),
    )
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    category = models.ForeignKey(Category, related_name='books', on_delete=models.CASCADE)
    ISBN = models.CharField(max_length=13, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')

    def __str__(self):
        return self.title



class BorrowRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    return_date = models.DateTimeField(null=True, blank=True)
    fine_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    fine_paid = models.BooleanField(default=False)

    def calculate_fine(self):
        """Automatically calculate fine if overdue."""
        if not self.return_date:
            return 0
        days_overdue = (self.return_date.date() - self.due_date.date()).days + 1;
        if days_overdue > 0:
            return days_overdue * 10  # ₹10 per day 
        return 0

    def save(self, *args, **kwargs):
        # Auto-calculate fine when the book is returned
        if self.return_date:
            self.fine_amount = self.calculate_fine()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"