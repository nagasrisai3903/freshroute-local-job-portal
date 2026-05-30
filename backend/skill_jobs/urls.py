from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list_create, name='job-list-create'),
    path('import/freshroute/', views.import_freshroute_jobs, name='import-freshroute-jobs'),
    path('<int:pk>/', views.job_detail, name='job-detail'),
]