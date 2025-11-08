from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.utils import timezone
from unittest.mock import patch
from datetime import timedelta
from libraryapp.models import User, Book, Category, BorrowRecord


class LibraryAPITests(APITestCase):

    def setUp(self):
        # Create users
        self.admin = User.objects.create_user(username="admin", password="admin123", role="admin")
        self.admin.is_staff = True
        self.admin.save()
        self.librarian = User.objects.create_user(username="lib", password="lib123", role="librarian")
        self.member = User.objects.create_user(username="mem", password="mem123", role="member")

        # Create categories
        self.category = Category.objects.create(name="Science")

        # Create book
        self.book = Book.objects.create(
            title="Physics 101", author="Einstein", category=self.category, ISBN="1234567890123"
        )

        # Token authentication
        self.admin_token = self.get_token("admin", "admin123")
        self.librarian_token = self.get_token("lib", "lib123")
        self.member_token = self.get_token("mem", "mem123")

    def get_token(self, username, password):
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {'username': username, 'password': password})
        return response.data['access']

    def auth(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_user_registration(self):
        """✅ Anyone can register"""
        url = reverse('user-list')
        data = {
            "username": "newuser",
            "email": "new@user.com",
            "password": "test1234",
            "role": "member"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_admin_can_list_users(self):
        """✅ Admin can list users"""
        self.auth(self.admin_token)
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_member_cannot_list_users(self):
    #     """ Member cannot list all users"""
    #     self.auth(self.member_token)
    #     url = reverse('user-list')
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_librarian_can_add_book(self):
        """✅ Librarian can add book"""
        self.auth(self.librarian_token)
        url = reverse('book-list')
        data = {
            "title": "Chemistry 101",
            "author": "Curie",
            "category": self.category.id,
            "ISBN": "9876543210987",
            "status": "available"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_member_cannot_add_book(self):
        """ Member cannot add book"""
        self.auth(self.member_token)
        url = reverse('book-list')
        data = {
            "title": "Biology 101",
            "author": "Darwin",
            "category": self.category.id,
            "ISBN": "1122334455667"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_borrow_book_flow(self):
        """✅ Member can borrow and return a book"""
        self.auth(self.member_token)
        url = reverse('borrowrecord-list')
        data = {
            "book_id": self.book.id,
            "due_date": (timezone.now() + timedelta(days=3)).isoformat()
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.book.refresh_from_db()
        self.assertEqual(self.book.status, "borrowed")

        record = BorrowRecord.objects.get(user=self.member, book=self.book)
        return_url = reverse('borrowrecord-return-book', args=[record.id])
        response = self.client.post(return_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.book.refresh_from_db()
        self.assertEqual(self.book.status, "available")

    def test_borrow_unavailable_book(self):
        """ Cannot borrow a non-available book"""
        self.book.status = "borrowed"
        self.book.save()
        self.auth(self.member_token)
        url = reverse('borrowrecord-list')
        data = {
            "book_id": self.book.id,
            "due_date": (timezone.now() + timedelta(days=2)).isoformat()
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("libraryapp.views.send_mail")
    def test_librarian_can_send_email(self, mock_send_mail):
        """✅ Librarian can send email to a borrower"""
        record = BorrowRecord.objects.create(
            user=self.member,
            book=self.book,
            due_date=timezone.now() + timedelta(days=2)
        )
        self.auth(self.librarian_token)
        url = reverse('borrowrecord-send-email', args=[record.id])
        data = {"subject": "Reminder", "message": "Return the book soon."}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_send_mail.assert_called_once()

    @patch("libraryapp.views.send_due_notification")
    def test_admin_can_check_due_books(self, mock_notify):
        """✅ Admin can trigger due book notifications"""
        BorrowRecord.objects.create(
            user=self.member,
            book=self.book,
            due_date=timezone.now() - timedelta(days=2)
        )
        self.auth(self.admin_token)
        url = reverse('borrowrecord-check-due-books')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_notify.assert_called()

    def test_fine_calculation_on_return(self):
        """✅ Fine calculated correctly when returned late"""
        record = BorrowRecord.objects.create(
            user=self.member,
            book=self.book,
            due_date=timezone.now() - timedelta(days=2)
        )
        self.auth(self.member_token)
        url = reverse('borrowrecord-return-book', args=[record.id])
        response = self.client.post(url)
        record.refresh_from_db()
        self.assertGreater(record.fine_amount, 0)

    def test_admin_can_view_unpaid_fines(self):
        """✅ Admin can see unpaid fines"""
        BorrowRecord.objects.create(
            user=self.member,
            book=self.book,
            due_date=timezone.now() - timedelta(days=2),
            return_date=timezone.now(),
            fine_amount=20,
            fine_paid=False
        )
        self.auth(self.admin_token)
        url = reverse('borrowrecord-unpaid-fines')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_mark_fine_paid(self):
        """✅ Admin can mark fine as paid"""
        record = BorrowRecord.objects.create(
            user=self.member,
            book=self.book,
            due_date=timezone.now() - timedelta(days=2),
            return_date=timezone.now(),
            fine_amount=30,
            fine_paid=False
        )
        self.auth(self.admin_token)
        url = reverse('borrowrecord-mark-fine-paid', args=[record.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        record.refresh_from_db()
        self.assertTrue(record.fine_paid)
