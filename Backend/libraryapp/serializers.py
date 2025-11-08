from rest_framework import serializers
from .models import User, Book, BorrowRecord, Category
"""
Aman:- 
This file defines how User, Book, BorrowRecord, and Category objects are converted to/from JSON and 
enforces validation and creation/update logic that’s safer than letting raw model fields be written directly.
"""

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}} #makes password accepted on input but excluded from output JSON. Good for security.

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'member')
        )
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id','title','author','category','ISBN','status']


class BorrowRecordSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)  # ✅ For reading
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), 
        source='book', 
        write_only=True  # ✅ For writing
    )
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = BorrowRecord
        fields = ['id', 'user', 'book', 'book_id', 'borrow_date', 'due_date', 'return_date', 'user_info','fine_amount','fine_paid']
        read_only_fields = ['user', 'borrow_date', 'return_date','fine_amount','fine_paid']
    
    def get_user_info(self, obj): #Only users with role admin or librarian will see borrower details. Normal users get null in user_info.
        """Return user information for admin/librarian"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user.role in ['admin', 'librarian']:
                return {
                    'id': obj.user.id,
                    'username': obj.user.username,
                    'email': obj.user.email
                }
        return None


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
