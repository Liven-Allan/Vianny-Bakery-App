# inventory/views.py

from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import transaction, IntegrityError
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from .models import (InventoryItem, 
                     InventoryTransaction, 
                     ProductionRecord, 
                     SaleStocks, Sales, 
                     SalesStockTransactions, 
                     UserProfile, 
                     AuditLog)
from .serializers import (InventoryItemSerializer, 
                          InventoryTransactionSerializer, 
                          ProductionRecordSerializer, 
                          StockSerializer, 
                          SalesSerializer, 
                          SalesStockTransactionsSerializer, 
                          UserSerializer, 
                          UserProfileSerializer,
                          AuditLogSerializer,
                          )
#chart
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes

# add item to inventory
class InventoryItemListCreate(generics.ListCreateAPIView):
    serializer_class = InventoryItemSerializer
    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = InventoryItem.objects.all()
        username = self.request.query_params.get('username', None)
        if username:
            queryset = queryset.filter(username=username)
        return queryset

# add transaction record
class InventoryTransactionListCreate(generics.ListCreateAPIView):
    queryset = InventoryTransaction.objects.all()
    serializer_class = InventoryTransactionSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]


# Handle item retrieval, update, and deletion
class InventoryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

#chart
@api_view(['GET'])
@permission_classes([AllowAny])
def historical_data(request):
    # Get all transactions with related inventory items
    transactions = InventoryTransaction.objects.select_related('product').all()


    # Format data for each transaction
    result = []
    for transaction in transactions:
        date = transaction.transaction_date.date()
        quantity = transaction.quantity
        unit_price = transaction.product.unit_price
        
        # Add data to the result list
        result.append({
            'date': date.strftime('%Y-%m-%d'),
            'product': transaction.product.name,
            'quantity': quantity,
            'unit_price': str(unit_price)  # Ensure unit_price is a string
        })

    return JsonResponse(result, safe=False)

# Production Management
# Add production record
# Update ProductionRecordListCreate view
class ProductionRecordListCreate(generics.ListCreateAPIView):
    queryset = ProductionRecord.objects.all()
    serializer_class = ProductionRecordSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username', None)
        if username:
            queryset = queryset.filter(username=username)
        return queryset

    def perform_create(self, serializer):
        serializer.save(username=self.request.data.get('username', ''))

# Update ProductionRecordDetailView view
class ProductionRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductionRecord.objects.all()
    serializer_class = ProductionRecordSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

    def perform_update(self, serializer):
        serializer.save()

# Sales Management

class StockListCreateView(generics.ListCreateAPIView):
    serializer_class = StockSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = SaleStocks.objects.all()
        username = self.request.query_params.get('username', None)
        if username:
            queryset = queryset.filter(username=username)
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        SalesStockTransactions.objects.create(
            sale_stock=instance,
            transaction_type='Addition',
            product_id=instance.product_id,
            quantity_obtained=instance.quantity_obtained,
            stock_amount=instance.stock_amount,
            stock_date=instance.stock_date,
            remarks='Stock added',
            username=instance.username
        )

class StockDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SaleStocks.objects.all()
    serializer_class = StockSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

    def perform_update(self, serializer):
        instance = serializer.save()
        SalesStockTransactions.objects.create(
            sale_stock=instance,
            transaction_type='Update',  # Set to 'Update' when an existing record is updated
            product_id=instance.product_id,
            quantity_obtained=instance.quantity_obtained,
            stock_amount=instance.stock_amount,
            stock_date=instance.stock_date,
            remarks='Updated stock',  # Remarks for updated stock
            username=instance.username
        )

class SalesListCreateView(generics.ListCreateAPIView):
    serializer_class = SalesSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Sales.objects.all()
        username = self.request.query_params.get('username', None)
        if username:
            queryset = queryset.filter(username=username)
        return queryset

    def perform_create(self, serializer):
        # Ensure the username is associated with the sale
        serializer.save(username=self.request.data.get('username', ''))

class SalesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer    

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]        

class SalesStockTransactionsListCreateView(generics.ListCreateAPIView):
    queryset = SalesStockTransactions.objects.all()
    serializer_class = SalesStockTransactionsSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

class SalesStockTransactionsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalesStockTransactions.objects.all()
    serializer_class = SalesStockTransactionsSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

# Admin Management 
# User Management Views
class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Allow public access (no authentication required)
    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]  # Allows any user (authenticated or not) to access this view


    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()
        except IntegrityError as e:
            raise serializers.ValidationError({
                "detail": f"IntegrityError: {str(e)}"
            })

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

# UserProfile Management Views
class UserProfileListCreate(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

class UserProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    authentication_classes = []  # Disables authentication for this view
    permission_classes = [AllowAny]

# Audit Log Views
class AuditLogListCreate(generics.ListCreateAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer

class AuditLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer

class CustomAuthToken(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('password')  # Treating 'password' as 'email'

        try:
            # Check for a user with both the matching username and email
            user = User.objects.get(username=username, email=email)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
