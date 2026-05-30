from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Job
from .serializers import JobSerializer


ALLOWED_CITIES = ["Hyderabad", "Bangalore"]


@api_view(['GET', 'POST'])
def job_list_create(request):
    if request.method == 'GET':
        city = request.query_params.get("city")

        jobs = Job.objects.filter(
            location__in=ALLOWED_CITIES,
            status="Active"
        ).order_by('-posted_at')

        if city and city in ALLOWED_CITIES:
            jobs = jobs.filter(location=city)

        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Job created successfully",
                    "job": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(
            {"error": "Job not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Job updated successfully",
                    "job": serializer.data
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        job.delete()
        return Response(
            {"message": "Job deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
def import_freshroute_jobs(request):
    freshroute_jobs = [
        {
            "external_id": "freshroute_hyd_python_001",
            "title": "Python Developer Fresher",
            "company": "Local Tech Hiring Feed",
            "location": "Hyderabad",
            "salary": "3-5 LPA",
            "job_type": "Full-time",
            "experience": "Fresher / 0-1 years",
            "skills_required": "Python, SQL, OOP, Git",
            "description": "Entry-level Python developer role for freshers with strong Python fundamentals, SQL basics, OOP knowledge, and willingness to learn backend development.",
            "external_url": "https://www.naukri.com/python-fresher-jobs-in-hyderabad"
        },
        {
            "external_id": "freshroute_hyd_django_002",
            "title": "Django Backend Developer Trainee",
            "company": "Local Tech Hiring Feed",
            "location": "Hyderabad",
            "salary": "3.5-5.5 LPA",
            "job_type": "Trainee",
            "experience": "0-1 years",
            "skills_required": "Python, Django, Django REST Framework, SQL, Postman",
            "description": "Trainee backend role focused on Django APIs, database models, REST API development, and API testing using Postman.",
            "external_url": "https://www.naukri.com/django-fresher-jobs-in-hyderabad"
        },
        {
            "external_id": "freshroute_hyd_fullstack_003",
            "title": "Python Full Stack Developer Intern",
            "company": "Local Tech Hiring Feed",
            "location": "Hyderabad",
            "salary": "15K-25K per month",
            "job_type": "Internship",
            "experience": "Fresher",
            "skills_required": "Python, Django, React, HTML, CSS, JavaScript",
            "description": "Internship for freshers interested in Python full stack development using Django backend and React frontend.",
            "external_url": "https://www.naukri.com/python-full-stack-fresher-jobs-in-hyderabad"
        },
        {
            "external_id": "freshroute_hyd_react_004",
            "title": "React Frontend Developer Fresher",
            "company": "Local Tech Hiring Feed",
            "location": "Hyderabad",
            "salary": "3-5 LPA",
            "job_type": "Full-time",
            "experience": "Fresher / 0-1 years",
            "skills_required": "React, JavaScript, HTML, CSS, Git",
            "description": "Frontend fresher role for candidates with React basics, JavaScript fundamentals, responsive UI development, and Git knowledge.",
            "external_url": "https://www.naukri.com/react-js-fresher-jobs-in-hyderabad"
        },
        {
            "external_id": "freshroute_hyd_sql_005",
            "title": "Python SQL Developer Fresher",
            "company": "Local Tech Hiring Feed",
            "location": "Hyderabad",
            "salary": "3-4.5 LPA",
            "job_type": "Full-time",
            "experience": "Fresher",
            "skills_required": "Python, SQL, Pandas, Excel",
            "description": "Entry-level role for candidates with Python, SQL, and basic data handling knowledge.",
            "external_url": "https://www.naukri.com/python-sql-fresher-jobs-in-hyderabad"
        },
        {
            "external_id": "freshroute_blr_python_001",
            "title": "Junior Python Developer",
            "company": "Local Tech Hiring Feed",
            "location": "Bangalore",
            "salary": "4-6 LPA",
            "job_type": "Full-time",
            "experience": "0-1 years",
            "skills_required": "Python, SQL, APIs, OOP",
            "description": "Junior Python developer role for freshers with strong Python basics, SQL knowledge, and interest in backend API development.",
            "external_url": "https://www.naukri.com/python-fresher-jobs-in-bangalore"
        },
        {
            "external_id": "freshroute_blr_django_002",
            "title": "Django Developer Intern",
            "company": "Local Tech Hiring Feed",
            "location": "Bangalore",
            "salary": "12K-25K per month",
            "job_type": "Internship",
            "experience": "Fresher",
            "skills_required": "Python, Django, SQLite, GitHub",
            "description": "Django internship for freshers to work on database-driven web applications and backend APIs.",
            "external_url": "https://www.naukri.com/django-fresher-jobs-in-bangalore"
        },
        {
            "external_id": "freshroute_blr_fullstack_003",
            "title": "Associate Python Full Stack Developer",
            "company": "Local Tech Hiring Feed",
            "location": "Bangalore",
            "salary": "4.5-7 LPA",
            "job_type": "Full-time",
            "experience": "0-2 years",
            "skills_required": "Python, Django, React, SQL, Git",
            "description": "Associate full stack developer role involving Django backend APIs, React UI development, SQL database work, and Git-based collaboration.",
            "external_url": "https://www.naukri.com/python-full-stack-fresher-jobs-in-bangalore"
        },
        {
            "external_id": "freshroute_blr_frontend_004",
            "title": "Frontend Developer Fresher",
            "company": "Local Tech Hiring Feed",
            "location": "Bangalore",
            "salary": "3.5-5.5 LPA",
            "job_type": "Full-time",
            "experience": "Fresher",
            "skills_required": "HTML, CSS, JavaScript, React",
            "description": "Frontend fresher role for candidates with HTML, CSS, JavaScript, and React basics.",
            "external_url": "https://www.naukri.com/frontend-developer-fresher-jobs-in-bangalore"
        },
        {
            "external_id": "freshroute_blr_webdev_005",
            "title": "Web Developer Fresher",
            "company": "Local Tech Hiring Feed",
            "location": "Bangalore",
            "salary": "3-5 LPA",
            "job_type": "Full-time",
            "experience": "Fresher / 0-1 years",
            "skills_required": "HTML, CSS, JavaScript, React, Python",
            "description": "Entry-level web developer role for freshers with frontend basics and Python knowledge.",
            "external_url": "https://www.naukri.com/web-developer-fresher-jobs-in-bangalore"
        },
    ]

    imported_count = 0
    skipped_count = 0

    for job_data in freshroute_jobs:
        if Job.objects.filter(external_id=job_data["external_id"]).exists():
            skipped_count += 1
            continue

        Job.objects.create(
            title=job_data["title"],
            company=job_data["company"],
            location=job_data["location"],
            salary=job_data["salary"],
            job_type=job_data["job_type"],
            experience=job_data["experience"],
            skills_required=job_data["skills_required"],
            description=job_data["description"],
            status="Active",
            source="FreshRoute Local Feed",
            external_url=job_data["external_url"],
            external_id=job_data["external_id"],
            is_external=True
        )

        imported_count += 1

    return Response(
        {
            "message": "FreshRoute local fresher jobs imported successfully",
            "imported": imported_count,
            "skipped_duplicates": skipped_count,
            "cities": ["Hyderabad", "Bangalore"],
            "categories": ["Python", "Django", "SQL", "Frontend", "React"]
        },
        status=status.HTTP_201_CREATED
    )