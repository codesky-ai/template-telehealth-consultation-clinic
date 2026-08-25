# Telehealth Consultation Clinic

> A complete telemedicine platform for solo practitioners or startup clinics. Includes secure video conferencing, digital prescriptions, and automated appointment scheduling.

<div dir="rtl"><b>عيادة الاستشارات الطبية عن بعد</b> — منصة تطبيب عن بعد متكاملة للممارسين المستقلين أو العيادات الناشئة. تتضمن مؤتمرات فيديو آمنة، ووصفات طبية رقمية، وجدولة مواعيد آلية.</div>

`telehealth-consultation-clinic` · healthcare · 43 files · generated from the CodeSky template gallery

## What this is

A full-stack telemedicine platform for solo practitioners or startup clinics, built with React, Node.js, Express, TypeScript, and MySQL. It provides appointment scheduling, doctor and patient management, consultation workflows, and medical records. The template includes database schema, seed data, and a frontend that automatically falls back to mock data when the backend is unavailable.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.2.0 + Vite |
| Backend | Node + Express |
| Database | SQL schema included |
| Tests | none |
| Container | none |

## Architecture

The frontend is a React 18.2 application using Vite, Tailwind CSS, and Radix UI components. It contains pages for appointments, booking, consultations, doctor listings, profiles, and a home view. An API service layer makes HTTP calls via Axios and gracefully degrades to mock data when the backend is unreachable. The backend is a Node.js Express server written in TypeScript. It defines controllers for appointments, consultations, doctors, medical records, and patients, along with corresponding route modules. Database configuration expects MySQL, and a schema file defines six tables: appointments, consultations, doctors, medical_records, patients, and payments. A seed file populates initial data. Environment variables configure database credentials, JWT secrets, SMTP for email, Redis for caching, Stripe for payments, and a third-party video call service. Currently only a root health endpoint is implemented; domain endpoints are scaffolded but not wired. No authentication middleware or tests are present.

### Layout

```
README.md
backend/.env.example
backend/README.md
backend/package.json
backend/src/config/database.ts
backend/src/controllers/appointmentController.ts
backend/src/controllers/consultationController.ts
backend/src/controllers/doctorController.ts
backend/src/controllers/medicalRecordController.ts
backend/src/controllers/patientController.ts
backend/src/models/index.ts
backend/src/routes/appointments.ts
backend/src/routes/consultations.ts
backend/src/routes/doctors.ts
backend/src/routes/index.ts
backend/src/routes/medicalRecords.ts
backend/src/routes/patients.ts
backend/src/server.ts
backend/tsconfig.json
database/README.md
database/schema.sql
database/seed.sql
frontend/index.html
frontend/package.json
frontend/postcss.config.js
frontend/src/App.tsx
frontend/src/api/client.ts
frontend/src/api/mockData.ts
frontend/src/components/AppointmentsPage.tsx
frontend/src/components/BookingPage.tsx
frontend/src/components/ConsultationPage.tsx
frontend/src/components/DoctorsPage.tsx
frontend/src/components/Header.tsx
frontend/src/components/HomePage.tsx
frontend/src/components/ProfilePage.tsx
frontend/src/index.css
frontend/src/main.tsx
frontend/src/services/apiService.ts
frontend/src/types/index.ts
frontend/tailwind.config.js
… and 3 more files
```

### Data model

Tables defined in the SQL schema:

- `appointments`
- `consultations`
- `doctors`
- `medical_records`
- `patients`
- `payments`

### API surface

```
GET    /
GET    /health
```

## Running it

```bash
# frontend
cd frontend && npm install && npm run dev

# backend
cd backend && npm install && npm run dev
```

Configuration is read from an `.env` file. Copy `.env.example` and set:

- `CORS_ORIGINS`
- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_PORT`
- `DB_USER`
- `JWT_EXPIRE`
- `JWT_SECRET`
- `LOG_LEVEL`
- `MAX_FILE_SIZE`
- `NODE_ENV`
- `PORT`
- `REDIS_HOST`
- `REDIS_PASSWORD`
- `REDIS_PORT`
- `SMTP_HOST`
- `SMTP_PASS`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `UPLOAD_PATH`
- `VIDEO_CALL_API_KEY`
- `VIDEO_CALL_SECRET`

## What is next

1. **Implement authentication and authorization** — The template references JWT environment variables and has patient and doctor controllers, but no login, session middleware, or role-based access control is in place.
2. **Wire up domain endpoints** — Controllers and routes exist for appointments, consultations, doctors, medical records, and patients, but only the root health check is currently functional.
3. **Integrate real video conferencing** — Environment variables reference VIDEO_CALL_API_KEY and VIDEO_CALL_SECRET, but no SDK or service integration code is present in the backend or frontend.
4. **Replace seed data with production setup** — The database seed file contains mock doctors and patients; you will need real onboarding flows and production-appropriate initial state.
5. **Add automated tests** — No test files or test runners are configured; a telehealth application handling medical data and payments requires comprehensive test coverage.
6. **Set up CI/CD and containerization** — No Docker configuration or CI workflow files exist; deploying and scaling a multi-service application demands automated builds and orchestration.
7. **Harden security and compliance** — Medical data demands HIPAA or equivalent compliance, audit logs, encryption at rest, and secure file handling beyond the basic Helmet and rate-limit middleware currently present.

### Markers left in the code

Found by scanning for TODO/FIXME/placeholder:

```
README.md: - **API Integration** - RESTful API with fallback to mock data
README.md: - **API Client**: Axios with automatic fallback to mock data
README.md: - **API Integration**: Automatic fallback from API to mock data
frontend/src/services/apiService.ts: console.warn('API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('API failed, using mock data:', error);
```

---

<sub>Exported from the CodeSky template gallery. Generated code — review before production use. <a href="https://codesky.ai">codesky.ai</a></sub>
