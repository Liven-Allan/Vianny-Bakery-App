# inventory/models.py

from django.db import models

class InventoryItem(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, default='rawmaterial')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_level = models.IntegerField()

    def __str__(self):
        return self.name

class InventoryTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('Addition', 'Addition'),
        ('Removal', 'Removal'),
        ('Update', 'Update'),
    ]

    product = models.ForeignKey('InventoryItem', on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField()
    transaction_date = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # New field

    def __str__(self):
        return f'{self.transaction_type} - {self.product.name}'

# Production Management
class ProductionRecord(models.Model):
    productName = models.CharField(max_length=255, null=True)  # New field for product name
    rawMaterials = models.ManyToManyField(InventoryItem, related_name='production_records', blank=True)  # Changed field
    quantityProduced = models.PositiveIntegerField()
    quantityUsed = models.JSONField(default=list, blank=True)  # Change to JSONField
    productionDate = models.DateTimeField(auto_now_add=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New field for unit price

    def __str__(self):
        return f'Production Record {self.productName} - {self.productionDate}'
    
# Sales Management
class SaleStocks(models.Model):
    product_id = models.CharField(max_length=255, null=True)
    quantity_obtained = models.PositiveIntegerField()
    stock_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stock ID: {self.id} - Product ID: {self.product_id}"    
    
class Sales(models.Model):
    product_id = models.CharField(max_length=255, null=True)
    quantity_sold = models.PositiveIntegerField()
    sales_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sales_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stock ID: {self.id} - Product ID: {self.product_id}"        

class SalesStockTransactions(models.Model):
    TRANSACTION_TYPES = [
        ('Addition', 'Addition'),
        ('Update', 'Update'),
    ]

    sale_stock = models.ForeignKey('SaleStocks', on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    product_id = models.CharField(max_length=255, null=True)
    quantity_obtained = models.PositiveIntegerField()
    stock_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_date = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"{self.transaction_type} - SaleStock ID: {self.sale_stock.id} - Date: {self.stock_date}"
