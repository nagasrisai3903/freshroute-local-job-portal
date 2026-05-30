from django.db import models


class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('Full-time', 'Full-time'),
        ('Internship', 'Internship'),
        ('Trainee', 'Trainee'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Closed', 'Closed'),
    ]

    CITY_CHOICES = [
        ('Hyderabad', 'Hyderabad'),
        ('Bangalore', 'Bangalore'),
    ]

    title = models.CharField(max_length=120)
    company = models.CharField(max_length=120)
    location = models.CharField(max_length=100, choices=CITY_CHOICES)
    salary = models.CharField(max_length=50)
    job_type = models.CharField(max_length=30, choices=JOB_TYPE_CHOICES)
    experience = models.CharField(max_length=50)
    skills_required = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    posted_at = models.DateTimeField(auto_now_add=True)

    source = models.CharField(max_length=100, default="Manual")
    external_url = models.URLField(blank=True, null=True)
    external_id = models.CharField(max_length=200, blank=True, null=True)
    is_external = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.company}"