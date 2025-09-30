import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import InstructorLayout from './components/layout/InstructorLayout';
import SuperAdminLayout from './components/layout/SuperAdminLayout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRedirect from './components/auth/RoleBasedRedirect';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import CourseBuilder from './pages/admin/CourseBuilder';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ProgramView from './pages/student/ProgramView';
import ChapterView from './pages/student/ChapterView';
import QuizInterface from './pages/student/QuizInterface';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import StudentFileViewer from './pages/instructor/StudentFileViewer';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Redirect to the correct dashboard based on role */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="courses" element={<CourseBuilder />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="program" element={<ProgramView />} />
              <Route path="chapter/:chapterId" element={<ChapterView />} />
              <Route path="chapter/:chapterId/quiz" element={<QuizInterface />} />
          </Route>

          {/* Instructor Routes */}
          <Route path="/instructor" element={<InstructorLayout />}>
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="students" element={<InstructorDashboard />} />
              <Route path="student/:studentId" element={<StudentFileViewer />} />
          </Route>

          {/* Super Admin Routes */}
          <Route path="/superadmin" element={<SuperAdminLayout />}>
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="pending-schools" element={<SuperAdminDashboard />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;