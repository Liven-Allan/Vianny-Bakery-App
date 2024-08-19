# inventory/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (InventoryItem, 
                     InventoryTransaction, 
                     ProductionRecord, 
                     SaleStocks, 
                     Sales,
                     SalesStockTransactions,
                     UserProfile,
                     AuditLog)

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'category', 'unit_price', 'reorder_level', 'username']

class InventoryTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryTransaction
        fields = ['id', 'product', 'transaction_type', 'quantity', 'transaction_date', 'remarks', 'unit_price', 'username']

# Production Management
class ProductionRecordSerializer(serializers.ModelSerializer):
    rawMaterials = serializers.PrimaryKeyRelatedField(queryset=InventoryItem.objects.all(), many=True, required=False)  # Handle list of IDs
    quantityUsed = serializers.ListField(child=serializers.IntegerField(), required=False)  # Handle list of integers

    class Meta:
        model = ProductionRecord
        fields = ['id', 'productName', 'rawMaterials', 'quantityProduced', 'quantityDamaged', 'quantityUsed', 'productionDate', 'unit_price', 'username']

# Sales Managment
class StockSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = SaleStocks
        fields = ['id', 'product_id', 'quantity_obtained', 'stock_amount', 'stock_date', 'username']

class SalesSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Sales
        fields = ['id', 'product_id', 'quantity_sold', 'sales_amount', 'sales_date', 'username']

class SalesStockTransactionsSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = SalesStockTransactions
        fields = ['id', 'sale_stock', 'transaction_type', 'product_id', 'quantity_obtained', 'stock_amount', 'stock_date', 'remarks', 'username']

# Admin management
# Serializer for the UserProfile model
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id','role', 'status']

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'userprofile']

    def create(self, validated_data):
        userprofile_data = validated_data.pop('userprofile', None)
        user = User.objects.create(**validated_data)
        
        # If additional fields in UserProfile need to be set
        if userprofile_data:
            user.userprofile.role = userprofile_data.get('role', user.userprofile.role)
            user.userprofile.status = userprofile_data.get('status', user.userprofile.status)
            user.userprofile.save()
        
        return user

    def update(self, instance, validated_data):
        userprofile_data = validated_data.pop('userprofile', None)
        userprofile = instance.userprofile

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        if userprofile_data:
            userprofile.role = userprofile_data.get('role', userprofile.role)
            userprofile.status = userprofile_data.get('status', userprofile.status)
            userprofile.save()

        return instance


# Serializer for the AuditLog model
class AuditLogSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Include user details

    class Meta:
        model = AuditLog
        fields = ['log_id', 'timestamp', 'user', 'action', 'details']


