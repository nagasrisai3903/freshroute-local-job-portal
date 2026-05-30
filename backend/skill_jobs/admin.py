from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'company',
        'location',
        'job_type',
        'experience',
        'source',
        'status',
        'posted_at',
    )
    list_filter = ('location', 'job_type', 'source', 'status')
    search_fields = ('title', 'company', 'skills_required', 'location')