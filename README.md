# FreshRoute - Hyderabad & Bangalore Entry-Level Tech Jobs Portal

FreshRoute is a Python full-stack job portal built for freshers looking for entry-level tech jobs in Hyderabad and Bangalore.

The platform focuses on Python, Django, SQL, React, Frontend, and full-stack fresher jobs. It supports manual job posting, local fresher job importing, city-based filtering, category filtering, job details, external apply links, and application tracking.

## Features

- Hyderabad and Bangalore fresher job listings
- Python, Django, SQL, React, and Frontend job categories
- Manual job posting for recruiters/admins
- Local fresher job importer
- Job search by title, company, or skill
- City filter for Hyderabad and Bangalore
- Category filter for Python, Django, SQL, React, and Frontend
- Job details view
- External apply links for imported jobs
- Internal application tracking using localStorage
- Django REST API backend
- React frontend

## Screenshots

### Home Page
![Home Page](assets/screenshots/01-home-page.png)

### Job Search and Filters
![Job Filters](assets/screenshots/02-job-filters.png)

### Job Details Page
![Job Details](assets/screenshots/03-job-details.png)

### Recruiter Manual Job Posting
![Post Job Form](assets/screenshots/04-post-job-form.png)

### My Applications
![My Applications](assets/screenshots/05-my-applications.png)

### Local Job Importer
![Import Local Jobs](assets/screenshots/06-import-local-jobs.png)

### Django Admin Panel
![Django Admin](assets/screenshots/07-django-admin.png)

### Django REST API
![Jobs API](assets/screenshots/08-api-jobs.png)

## Project Execution

### 1. Start Backend Server

```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000/
```

### 2. Start Frontend Server

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173/
```

### 3. Import Local Fresher Jobs

Click the **Import Local Fresher Jobs** button.

This imports Hyderabad and Bangalore entry-level jobs into the database.

Backend API used:

```http
POST http://127.0.0.1:8000/api/jobs/import/freshroute/
```

### 4. Search and Filter Jobs

Users can search jobs by:

- Python
- Django
- SQL
- React
- Frontend
- Company name

Users can filter jobs by:

- Hyderabad
- Bangalore
- Python
- Django
- SQL
- React
- Frontend

### 5. View Job Details

Click **View Details** to see complete job information, required skills, salary, location, experience, and apply option.

### 6. Apply for Jobs

For imported jobs, **Apply on Source** redirects to the original job source.

For manually posted jobs, **Apply Now** stores the application in My Applications.

### 7. Recruiter Manual Job Posting

Click **Post Job** to manually add Hyderabad or Bangalore fresher job openings.

### 8. Track Applications

Click **My Applications** to view applied jobs and their status.

## Demo Workflow

1. Run Django backend server.
2. Run React frontend server.
3. Open FreshRoute in the browser.
4. Click **Import Local Fresher Jobs**.
5. View imported Hyderabad and Bangalore fresher jobs.
6. Use search and filters to find Python, SQL, React, Django, or Frontend jobs.
7. Open job details using **View Details**.
8. Apply using **Apply on Source** or **Apply Now**.
9. Track applied jobs in **My Applications**.
10. Recruiters can add new jobs using **Post Job**.