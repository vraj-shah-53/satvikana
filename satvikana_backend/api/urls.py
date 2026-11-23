from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    OrderViewSet, 
    RegisterView, 
    LoginView, 
    LogoutView, 
    ProfileView, 
    seed_db,
    CashfreeCreateOrderView,
    CashfreeVerifyPaymentView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('seed/', seed_db, name='seed_db'),
    path('payment/create-order/', CashfreeCreateOrderView.as_view(), name='cf_create_order'),
    path('payment/verify/', CashfreeVerifyPaymentView.as_view(), name='cf_verify_payment'),
]
