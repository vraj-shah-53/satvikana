from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from django.http import JsonResponse

def root_status_view(request):
    return JsonResponse({
        "status": "online",
        "service": "Satvikana Backend API",
        "message": "Welcome to Satvikana API. The server is running smoothly.",
        "endpoints": {
            "admin": "/admin/",
            "products": "/api/products/",
            "orders": "/api/orders/",
            "auth_register": "/api/auth/register/",
            "auth_login": "/api/auth/login/",
            "auth_profile": "/api/auth/profile/"
        }
    })

urlpatterns = [
    path('', root_status_view, name='root-status'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]
