# inventory/serializers.py

from rest_framework import serializers
from .models import InventoryItem, InventoryTransaction, ProductionRecord, SaleStocks, Sales, SalesStockTransactions

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'category', 'unit_price', 'reorder_level']

class InventoryTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryTransaction
        fields = ['id', 'product', 'transaction_type', 'quantity', 'transaction_date', 'remarks', 'unit_price']

# Production Management
class ProductionRecordSerializer(serializers.ModelSerializer):
    rawMaterials = serializers.PrimaryKeyRelatedField(queryset=InventoryItem.objects.all(), many=True, required=False)  # Handle list of IDs
    quantityUsed = serializers.ListField(child=serializers.IntegerField(), required=False)  # Handle list of integers

    class Meta:
        model = ProductionRecord
        fields = ['id', 'productName', 'rawMaterials', 'quantityProduced', 'quantityUsed', 'productionDate', 'unit_price']

# Sales Managment
class StockSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = SaleStocks
        fields = ['id', 'product_id', 'quantity_obtained', 'stock_amount', 'stock_date']

class SalesSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Sales
        fields = ['id', 'product_id', 'quantity_sold', 'sales_amount', 'sales_date']

class SalesStockTransactionsSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = SalesStockTransactions
        fields = ['id', 'sale_stock', 'transaction_type', 'product_id', 'quantity_obtained', 'stock_amount', 'stock_date', 'remarks']
