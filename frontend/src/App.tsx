import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HostShellLayout } from './layouts/HostShellLayout';
import { LoginPage } from './pages/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/course-planner/admin/AdminDashboard';
import { AdminCourses } from './pages/course-planner/admin/AdminCourses';
import { AdminMaterials } from './pages/course-planner/admin/AdminMaterials';
import { AdminCategories } from './pages/course-planner/admin/AdminCategories';
import { AdminPayments } from './pages/course-planner/admin/AdminPayments';
import { AdminTutoringRequests } from './pages/course-planner/admin/AdminTutoringRequests';
import { AdminUsers } from './pages/course-planner/admin/AdminUsers';

// Student Pages
import { StudentAvailableCourses } from './pages/course-planner/student/StudentAvailableCourses';
import { StudentOngoingCourses } from './pages/course-planner/student/StudentOngoingCourses';
import { StudentAllCourses } from './pages/course-planner/student/StudentAllCourses';
import { StudentPayments } from './pages/course-planner/student/StudentPayments';
import { StudentProfilePage } from './pages/course-planner/student/StudentProfile';

// Tutor Pages
import { TutorOpenCourses } from './pages/course-planner/tutor/TutorOpenCourses';
import { TutorRequests } from './pages/course-planner/tutor/TutorRequests';
import { TutorMyCourses } from './pages/course-planner/tutor/TutorMyCourses';
import { TutorProfilePage } from './pages/course-planner/tutor/TutorProfile';

// Shared Detail Page
import { CourseDetailPage } from './pages/course-planner/CourseDetailPage';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();
  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Career 360 session...</div>;
  }
  return token ? children : <Navigate to="/login" replace />;
}

function RoleDefaultRedirect() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') {
    return <Navigate to="/course-planner/admin/dashboard" replace />;
  } else if (user?.role === 'TUTOR') {
    return <Navigate to="/course-planner/tutor/open-courses" replace />;
  } else {
    return <Navigate to="/course-planner/student/available-courses" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <HostShellLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<RoleDefaultRedirect />} />

            {/* Admin Routes */}
            <Route path="course-planner/admin/dashboard" element={<AdminDashboard />} />
            <Route path="course-planner/admin/courses" element={<AdminCourses />} />
            <Route path="course-planner/admin/materials" element={<AdminMaterials />} />
            <Route path="course-planner/admin/categories" element={<AdminCategories />} />
            <Route path="course-planner/admin/payments" element={<AdminPayments />} />
            <Route path="course-planner/admin/requests" element={<AdminTutoringRequests />} />
            <Route path="course-planner/admin/users" element={<AdminUsers />} />

            {/* Student Routes */}
            <Route path="course-planner/student/available-courses" element={<StudentAvailableCourses />} />
            <Route path="course-planner/student/ongoing-courses" element={<StudentOngoingCourses />} />
            <Route path="course-planner/student/all-courses" element={<StudentAllCourses />} />
            <Route path="course-planner/student/payments" element={<StudentPayments />} />
            <Route path="course-planner/student/profile" element={<StudentProfilePage />} />

            {/* Tutor Routes */}
            <Route path="course-planner/tutor/open-courses" element={<TutorOpenCourses />} />
            <Route path="course-planner/tutor/requests" element={<TutorRequests />} />
            <Route path="course-planner/tutor/my-courses" element={<TutorMyCourses />} />
            <Route path="course-planner/tutor/profile" element={<TutorProfilePage />} />

            {/* Shared Detail Route */}
            <Route path="course-planner/courses/:id" element={<CourseDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
