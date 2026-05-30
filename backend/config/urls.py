from django.contrib import admin
from django.urls import path, include

admin.site.site_header = "FreshRoute Admin"
admin.site.site_title = "FreshRoute Portal"
admin.site.index_title = "FreshRoute Dashboard"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/jobs/', include('skill_jobs.urls')),
]