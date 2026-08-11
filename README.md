# Course Planner Module for Career 360

A dedicated, role-scoped **Course Planner** add-on module integrated into the **Career 360** host application (React frontend, Node.js/Express Prisma backend).

---

## 🏗 Integration Overview

This module is designed to mount cleanly inside Career 360's existing application shell without duplicating existing authentication, session handling, user tables, or layout wrappers.

### 1. Auth & Session Layer Integration
- **Host User Model**: Extended host `User` table (`users`) with role Enum (`ADMIN`, `STUDENT`, `TUTOR`).
- **Module Profiles**: Course-planner specific fields are stored in namespaced child models (`course_planner_student_profiles`, `course_planner_tutor_profiles`), referencing `User.id` as a foreign key (`userId`).
- **API Middleware**: Uses host `authenticate` and `authorizeRole` middlewares (`src/middleware/auth.ts`).
- **Namespace**: All new API endpoints live strictly under `/api/course-planner/*`.

### 2. Database Schema & Namespaces
All module entities are namespaced with `course_planner_` in SQL / Prisma:
- `course_planner_categories`
- `course_planner_courses`
- `course_planner_topics`
- `course_planner_materials`
- `course_planner_tutoring_requests`
- `course_planner_payments`
- `course_planner_student_profiles`
- `course_planner_tutor_profiles`

### 3. UI & Layout Integration
- **Host Shell Layout**: Integrates into `HostShellLayout.tsx` as a primary sidebar navigation group.
- **Role-Scoped Views**:
  - **Admin**: Executive Dashboard, Course Management, Course Materials & Topics, Categories CRUD, Payments Ledger, Tutoring Requests, User Directory.
  - **Student**: Available Courses, Ongoing Courses, Catalog, Payments History, My Profile.
  - **Tutor**: Open Courses (claim to teach), Direct Tutoring Requests, Assigned Courses, My Profile.
- **Add Course Form**: Includes Rich Text Editor for summaries, category selector, and `dd-MMM-yyyy` date formatting (e.g. `01-Sep-2026`).
- **Role Switcher**: Includes a top-bar instant role switcher for previewing and testing all three roles seamlessly during evaluation.

---

## 🚀 Running the Application Locally

### Backend Setup (Node.js / Express / Prisma SQLite)

```bash
cd backend
npm install
npm run prisma:db-push
npm run prisma:seed
npm run dev
```
*Backend runs on `http://localhost:5000`*

### Frontend Setup (React / Vite / TypeScript)

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password | Default Path |
| --- | --- | --- | --- |
| **Admin** | `admin@career360.com` | `admin123` | `/course-planner/admin/dashboard` |
| **Student** | `student.alex@career360.com` | `student123` | `/course-planner/student/available-courses` |
| **Tutor** | `tutor.john@career360.com` | `tutor123` | `/course-planner/tutor/open-courses` |
