from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from django.http import HttpResponse

FRONTEND_BUILD_DIR = settings.BASE_DIR / 'frontend_build'

def spa_view(request, resource=""):
    """
    Catch-all view to serve the React Single Page Application (SPA).
    - If a specific static file (CSS, JS, images) exists in frontend_build, serve it.
    - Otherwise, serve index.html to allow React Router to handle client-side routing.
    """
    if resource:
        target_file = FRONTEND_BUILD_DIR / resource
        if target_file.is_file():
            return serve(request, resource, document_root=str(FRONTEND_BUILD_DIR))
    
    index_path = FRONTEND_BUILD_DIR / 'index.html'
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    
    return HttpResponse("<h1>Satvikana Store is updating... Please refresh in a moment.</h1>", status=200)

urlpatterns = [
    # 1. Django Admin
    path('admin/', admin.site.urls),
    
    # 2. REST API endpoints
    path('api/', include('api.urls')),
    
    # 3. Media uploads (product images)
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    
    # 4. React Frontend Store (Catch-all for homepage, products, cart, etc.)
    re_path(r'^(?P<resource>.*)$', spa_view, name='spa-frontend'),
]
