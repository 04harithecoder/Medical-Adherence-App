# MEDAI Backend — Phase 3 (Django)

Django + Django REST Framework + Simple JWT backend for MEDAI. This phase
covers project setup, the full database schema as Django models, and the
authentication API (register / login / me / refresh). Everything else
(medications, doses, analytics, alerts, notifications APIs) is built out
in later phases — the tables already exist as models so migrations won't
need to change shape later, just gain new views.

## Setup

```bash
cd MEDAI_backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env      # Windows
# cp .env.example .env      # Mac/Linux
```

Edit `.env` with your MySQL credentials (create a `medai` database first:
`CREATE DATABASE medai CHARACTER SET utf8mb4;`). If you just want to try
the API without installing MySQL, set `DB_ENGINE=sqlite` in `.env` instead
— zero setup, uses a local `db.sqlite3` file.

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # for /admin access — role is set to admin automatically
python manage.py runserver
```

API is served at `http://localhost:8000/api/`. Django admin at
`http://localhost:8000/admin/`.

## Auth endpoints (Phase 3)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/auth/register` | `role` must be `patient` or `caregiver` |
| POST | `/api/auth/login` | Returns `access_token` + `refresh_token` |
| GET | `/api/auth/me` | Requires `Authorization: Bearer <access_token>` |
| POST | `/api/auth/refresh` | Body: `{ "refresh_token": "..." }` |

All responses use the envelope shape from the Phase 1 API spec:
```json
{ "success": true, "data": { ... }, "message": "optional" }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

## App structure

Mirrors the Phase 1 ER design 1:1 — one Django app per table group:

- `accounts` — User (custom, email-based), Patient, Caregiver, CaregiverPatientLink
- `medications` — Medication, MedicationSchedule
- `doses` — DoseRecord
- `analytics` — AdherenceAnalysis
- `alerts` — Alert
- `notifications` — Notification

## Connecting the React frontend

In the frontend's `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```
