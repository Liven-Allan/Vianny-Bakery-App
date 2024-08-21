# inventory/models.py

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models.signals import post_migrate

class InventoryItem(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, default='rawmaterial')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_level = models.IntegerField()
    username = models.CharField(max_length=100, null=True, blank=True)

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
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    username = models.CharField(max_length=100, null=True, blank=True) 

    def __str__(self):
        return f'{self.transaction_type} - {self.product.name}'

# Production Management
class ProductionRecord(models.Model):
    productName = models.CharField(max_length=255, null=True)  # New field for product name
    rawMaterials = models.ManyToManyField(InventoryItem, related_name='production_records', blank=True)  # Changed field
    quantityProduced = models.PositiveIntegerField()
    quantityDamaged = models.PositiveIntegerField(null=True)
    quantityUsed = models.JSONField(default=list, blank=True)  # Change to JSONField
    productionDate = models.DateTimeField(auto_now_add=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New field for unit price
    username = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f'Production Record {self.productName} - {self.productionDate}'
    
# Sales Management
class SaleStocks(models.Model):
    product_id = models.CharField(max_length=255, null=True)
    quantity_obtained = models.PositiveIntegerField()
    stock_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_date = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Stock ID: {self.id} - Product ID: {self.product_id}"    
    
class Sales(models.Model):
    product_id = models.CharField(max_length=255, null=True)
    quantity_sold = models.PositiveIntegerField()
    sales_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sales_date = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=100, null=True, blank=True)

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
    username = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.transaction_type} - SaleStock ID: {self.sale_stock.id} - Date: {self.stock_date}"

# Administration Management
# User profile model
class UserProfile(models.Model):
    ADMIN = 'admin'
    SALES_REP = 'sales_representative'
    PRODUCTION_REP = 'production_representative'
    INVENTORY_REP = 'inventory_representative'

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (SALES_REP, 'Sales Representative'),
        (PRODUCTION_REP, 'Production Representative'),
        (INVENTORY_REP, 'Inventory Representative'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=255, choices=ROLE_CHOICES, default=ADMIN)
    status = models.CharField(max_length=255, null=True, default='active')

    def __str__(self):
        return self.user.username

# Signal to add a default user and user profile after migration
@receiver(post_migrate)
def create_default_user(sender, **kwargs):
    if not User.objects.filter(username='Allan').exists():
        user = User.objects.create_user(
            id=1,
            username='Allan',
            first_name='Lutalo',
            last_name='Allan',
            email='lutaloallan6@gmail.com',
        )
        UserProfile.objects.create(
            user=user,
            role=UserProfile.ADMIN,
            status='active'
        )

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.userprofile.save()  

# Audit Log model
class AuditLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.timestamp} - {self.action}"
