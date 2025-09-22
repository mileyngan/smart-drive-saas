import './App.css';
import React from 'react';
import {Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Instructors from "./pages/Instructors";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointments from "./pages/Appointments";
import Lesson from './pages/Lesson';
import LandingPage from './pages/LandingPage';
import StudentProgramSelection from './pages/StudentProgramSelection';
import Register from './pages/Register';
import InstructorDash from './pages/InstructorDash';
import StudentDash from './pages/StudentDash';
import Library from './pages/Library';
import CourseManagementDash from './pages/CourseManagementDash';
import CourseDetails from './pages/CourseDetails';
import QuizPage from './pages/QuizPage';
import StudentSupport from './pages/StudentSupport';
import Announcements from './pages/Announcements';
import ScrollToTopButton from './components/ScrollToTopButton';
import CourseSelection from './pages/CourseSelection';
import Notifications from './components/Notifications';
import Profile from './pages/Profile';
import Journey from './pages/Journey';
import BookSession from './pages/BookSession';
import AdminUsers from './pages/AdminUsers';
import RegisterSchool from './pages/RegisterSchool';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Checkout from "./pages/Checkout";

function App() {

  return (
    <>
      <div className="w-full">
            <Routes>
                <Route path='/smartdrive-frontend/' element={<LandingPage/>} />
                <Route path='/smartdrive-frontend/Home' element={<Home/>} />
                <Route path='/smartdrive-frontend/instructors' element={<Instructors/>} />
                <Route path='/smartdrive-frontend/login' element={<Login/>} />
                <Route path='/smartdrive-frontend/contact' element={<Contact/>} />
                <Route path='/smartdrive-frontend/my-profile' element={<MyProfile/>} />
                <Route path='/smartdrive-frontend/my-appointments' element={<MyAppointments/>} />
                <Route path='/smartdrive-frontend/appointment' element={<Appointments/>} />
                <Route path='/smartdrive-frontend/admin' element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SchoolAdminDashboard />
                  </ProtectedRoute>
                }/>
                <Route path='/smartdrive-frontend/instructor' element={<InstructorDash/>} />
                <Route path='/smartdrive-frontend/student' element={<StudentDash/>} />
                 <Route path="/smartdrive-frontend/superadmin" element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path='/smartdrive-frontend/lesson' element={<Lesson />} />
                <Route path='/smartdrive-frontend/register' element={<Register />} />
                <Route path="/smartdrive-frontend/student/library" element={<Library />} />
                <Route path="/smartdrive-frontend/admin/course-management" element={<CourseManagementDash />} />
                <Route path="/smartdrive-frontend/student/course/:courseId" element={<CourseDetails />} />
                <Route path="/smartdrive-frontend/student/course/:courseId/quiz/:quizId" element={<QuizPage />} />
                <Route path="/smartdrive-frontend/student/support" element={<StudentSupport />} />
                <Route path="/smartdrive-frontend/student/announcements" element={<Announcements />} />
                <Route path="/smartdrive-frontend/course-selection" element={<CourseSelection />} />
                <Route path="/smartdrive-frontend/student/notifications" element={<Notifications/>}/>
                <Route path="/smartdrive-frontend/student/profile" element={<Profile />} />
                <Route path="/smartdrive-frontend/student/journey" element={<Journey />} />
                <Route path="/smartdrive-frontend/student/book-session" element={<BookSession />} />
                <Route path="/smartdrive-frontend/admin/users" element={<AdminUsers/>} />
                <Route path="/smartdrive-frontend/checkout" element={<Checkout />} />
                <Route path="/smartdrive-frontend/register-school" element={<RegisterSchool />} />
                <Route path="/smartdrive-frontend/student/program-selection" element={
  <ProtectedRoute allowedRoles={['student']}>
    <StudentProgramSelection />
  </ProtectedRoute>
}/>
                <Route path="/smartdrive-frontend/unauthorized" element={<div>Not allowed</div>} />
              </Routes> 
            <ScrollToTopButton />
      </div>
    </>
  )
}

export default App;
