# inventory/urls.py

from django.urls import path
from .views import (InventoryItemListCreate, 
                    InventoryTransactionListCreate,  
                    InventoryItemDetailView, 
                    ProductionRecordListCreate, 
                    ProductionRecordDetailView, 
                    StockListCreateView,
                    StockDetailView,
                    SalesListCreateView,
                    SalesDetailView,
                    SalesStockTransactionsListCreateView,
                    SalesStockTransactionsDetailView,
                    historical_data,
                    UserListCreate, 
                    UserDetailView, 
                    AuditLogListCreate, 
                    AuditLogDetailView,
                    UserProfileListCreate,
                    UserProfileDetailView,
                    CustomAuthToken,
                    index
                    )


urlpatterns = [
   path('inventory/', InventoryItemListCreate.as_view(), name='inventory-list-create'),
   path('inventory/<int:pk>/', InventoryItemDetailView.as_view(), name='inventory-detail'),  # Added URL pattern for delete view
   path('transactions/', InventoryTransactionListCreate.as_view(), name='transactions-list-create'),
   path('historical-data/', historical_data, name='historical-data'),
   path('productions/', ProductionRecordListCreate.as_view(), name='productions-list-create'),
   path('productions/<int:pk>/', ProductionRecordDetailView.as_view(), name='productions-detail'),
   path('salestocks/', StockListCreateView.as_view(), name='stock-list-create'),
   path('salestocks/<int:pk>/', StockDetailView.as_view(), name='stock-detail'),
   path('sales/', SalesListCreateView.as_view(), name='sales-list-create'),
   path('sales/<int:pk>/', SalesDetailView.as_view(), name='sales-detail'),
   path('salesstocktransactions/', SalesStockTransactionsListCreateView.as_view(), name='salesstocktransactions-list-create'),
   path('salesstocktransactions/<int:pk>/', SalesStockTransactionsDetailView.as_view(), name='salesstocktransactions-detail'),
   # User Management
   path('users/', UserListCreate.as_view(), name='user-list-create'),
   path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

   # User profile
   path('user-profiles/', UserProfileListCreate.as_view(), name='userprofile-list-create'),
   path('user-profiles/<int:pk>/', UserProfileDetailView.as_view(), name='userprofile-detail'),

    # Audit Logs
   path('auditlogs/', AuditLogListCreate.as_view(), name='auditlog-list-create'),
   path('auditlogs/<int:pk>/', AuditLogDetailView.as_view(), name='auditlog-detail'),

   # Token
   path('api-token-auth/', CustomAuthToken.as_view(), name='api_token_auth'),
   
   # render view
   

]