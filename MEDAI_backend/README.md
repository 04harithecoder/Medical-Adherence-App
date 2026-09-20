# MEDAI Backend — Django

Django + DRF + Simple JWT backend for MEDAI.

## Phases delivered
- **Phase 3**: Project setup, full schema as Django models, JWT auth (register/login/me/refresh)
- **Phase 5**: Medication management + dose tracking APIs
- **Phase 6**: Adherence analytics, trends, medication-wise breakdown, rule-based pattern detection, Adherence Pattern Risk

## Setup

```bash
cd MEDAI_backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # Windows — then edit DB_PASSWORD etc.
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Set `DB_ENGINE=sqlite` in `.env` instead of `mysql` for zero-setup local testing.

## API endpoints

### Auth (Phase 3)
| Method | Endpoint |
|---|---|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |
| POST | `/api/auth/refresh` |

### Medications (Phase 5)
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/medications` | Patient's own medications |
| POST | `/api/medications` | Create; auto-generates schedule + upcoming dose records |
| GET | `/api/medications/:id` | |
| PUT | `/api/medications/:id` | |
| DELETE | `/api/medications/:id` | |
| POST | `/api/medications/:id/schedules` | Add an extra time slot to an existing medication |

### Doses (Phase 5)
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/doses/today` | Powers the Patient Dashboard |
| GET | `/api/doses/history?from=&to=` | Powers the History page |
| POST | `/api/doses/:id/taken` | |
| POST | `/api/doses/:id/missed` | |

All patient-scoped endpoints only ever return/modify the logged-in patient's own data
(enforced in `accounts/permissions.py` + queryset filtering by `request.user`).

### Adherence (Phase 6)
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/adherence/summary?period=weekly` | `period`: daily / weekly / monthly |
| GET | `/api/adherence/trends?period=weekly` | Daily adherence-% points, feeds the line chart |
| GET | `/api/adherence/medication-wise` | Per-medication adherence %, last 30 days |
| GET | `/api/adherence/patterns` | Rule-based behavioral patterns (see `analytics/services.py`) |
| GET | `/api/adherence/risk` | `{risk_level, label: "Adherence Pattern Risk", missed_count, period_days}` |

All thresholds (what counts as HIGH risk, what counts as a "repeated evening
miss", etc.) live in one dict at the top of `analytics/services.py` —
tune them there. Everything is plain rule-based arithmetic, no ML, per
the Phase 1 spec.

## App structure
- `accounts` — User, Patient, Caregiver, CaregiverPatientLink
- `medications` — Medication, MedicationSchedule + schedule-generation service
- `doses` — DoseRecord
- `analytics` / `alerts` / `notifications` — models in place, APIs come in later phases
