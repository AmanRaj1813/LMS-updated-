# LMS-6 (Library Management System)

Comprehensive Library Management System built with a Django REST backend and a React (Vite) frontend.

This README documents the project structure, setup steps, environment variables, common commands, and troubleshooting tips.

## Table of Contents

- Project overview
- Technologies
- Folder structure (brief)
- Backend (setup & run)
- Frontend (setup & run)
- Environment variables and configuration
- Database
- Running tests
- Development notes & tips
- Contributing
- Contact

## Project overview

This repository contains a Library Management System (LMS) split into two main parts:

- `Backend/` — Django REST API that implements models, serializers, views, authentication, and admin.
- `Frontend/` — React application (Vite) that provides a UI for users and admins.

The project uses SQLite for local development (file: `Backend/db.sqlite3`).

## Technologies

- Backend: Python, Django, Django REST Framework, djangorestframework-simplejwt, corsheaders
- Frontend: React, Vite, MUI (project organized under `Frontend/libraryfrontend`)
- Database: SQLite (development)

## Top-level folder structure

Root files:

- `readme.js` — (present in repo)
- `readme.md` — this file

Main folders:

- `Backend/` — Django project and app
- `Frontend/` — Frontend (contains `libraryfrontend/` subproject)

## Backend folder structure (important files)

`Backend/`

- `manage.py` — Django manage script
- `db.sqlite3` — development SQLite database
- `env/` — virtual environment used for development (contains site-packages)
- `libraryProject/` — Django project settings
  - `settings.py`, `urls.py`, `wsgi.py`, `asgi.py`
- `libraryapp/` — Django app that contains the LMS logic
  - `models.py` — data models (Book, Category, BorrowRecord, etc.)
  - `views.py` — API view logic
  - `serializers.py` — DRF serializers
  - `urls.py` — app routes
  - `permissions.py`, `utils.py`, `exception_handler.py`
  - `migrations/` — DB migrations

Notes:

- The virtual environment `env/` is included in the repository tree (for reference). Prefer creating a fresh venv locally instead of reusing the included `env/`.

## Frontend folder structure (important files)

`Frontend/`

- `package.json` — top-level package file (may contain scripts)
- `libraryfrontend/` — actual Vite + React app
  - `index.html`
  - `vite.config.js`
  - `package.json` — contains project dependencies and scripts for the frontend
  - `src/` — React source
    - `main.jsx`, `App.jsx`, CSS files
    - `api/apiClient.js` — helper to call backend API
    - `components/` — UI components, split by domain
    - `redux/` — Redux store & slices

## Quick start — Backend (local development)

Prerequisites:

- Python 3.10+ (use version compatible with the Django packages present)
- pip

Suggested steps (PowerShell on Windows):

1. Open a PowerShell terminal and change to the backend folder:

   cd "c:\Users\aman.raj\OneDrive - Fractal Analytics Limited\Desktop\CAPSTONE\LMS-5\Backend"

2. Create and activate a virtual environment (recommended):

   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

3. Install dependencies. If there is a `requirements.txt` create one (not included by default) or install commonly used packages:

   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

   (If you have a `requirements.txt`, run `pip install -r requirements.txt`.)

4. Apply database migrations and create a superuser:

   python manage.py migrate
   python manage.py createsuperuser

5. Run the development server:

   python manage.py runserver

By default the API should be reachable at http://127.0.0.1:8000/ (check `libraryProject/urls.py`).

Notes:

- The repository includes `Backend/db.sqlite3`. If you want to start with a fresh database, remove or rename that file and run migrations.
- Check `libraryProject/settings.py` for CORS settings, installed apps, and REST framework configuration.

## Quick start — Frontend (local development)

Prerequisites:

- Node.js (16+ recommended) and npm or yarn

Steps (from project root or switch to frontend folder):

1. Change to the frontend app:

   cd "c:\Users\aman.raj\OneDrive - Fractal Analytics Limited\Desktop\CAPSTONE\LMS-5\Frontend\libraryfrontend"

2. Install dependencies:

   npm install

3. Start the dev server (Vite):

   npm run dev

4. Open the app in browser. Vite will print the local URL (commonly http://localhost:5173).

Notes:

- The frontend expects the backend API to be running. Check `src/api/apiClient.js` for the configured base URL and update it if your backend runs on a custom host or port.

## Environment variables & configuration

Typical environment variables you may need for the backend:

- `DJANGO_SECRET_KEY` — keep secret in production
- `DEBUG` — True/False
- `ALLOWED_HOSTS` — comma-separated hosts
- `DATABASE_URL` — optional, if using a non-SQLite DB
- JWT settings such as token lifetime (if using Simple JWT)

For the frontend:

- Vite uses `import.meta.env` variables. Check `vite.config.js` and the frontend `package.json` for any required env vars. You can create `.env` or `.env.local` files in `libraryfrontend/`.

## Database

- Development DB: `Backend/db.sqlite3` (SQLite), committed to the repo in this workspace snapshot.
- To reset DB:

  1. Stop the server
  2. Remove `db.sqlite3`
  3. Run `python manage.py migrate`

Be careful: removing the DB will erase all data.

## Running tests

Backend Django tests (if test cases are present):

1. Activate your Python environment.
2. Run:

   python manage.py test

Frontend tests (if any) are typically run with the npm test script:

npm test

## Common Commands Quick Reference

- Backend

  - Start server: `python manage.py runserver`
  - Migrate DB: `python manage.py migrate`
  - Create superuser: `python manage.py createsuperuser`
  - Run tests: `python manage.py test`

- Frontend (inside `Frontend/libraryfrontend`)
  - Install deps: `npm install`
  - Start dev server: `npm run dev`
  - Build for production: `npm run build` (if configured)

## Development notes & tips

- Don't commit secret keys or `.env` files containing credentials.
- Prefer creating a fresh virtualenv for local development rather than using the included `env/` folder.
- If CORS errors occur, ensure `django-cors-headers` is installed and configured in `settings.py` and that the frontend origin is added to `CORS_ALLOWED_ORIGINS`.
- If using JWT auth, check login and token-refresh endpoints and update `apiClient.js` accordingly.





---



This is the readme file for the library management system
