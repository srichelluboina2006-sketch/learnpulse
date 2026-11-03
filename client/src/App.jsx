import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './layouts/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import Classroom from './pages/Classroom';
import Dashboard from './pages/Dashboard';
import InstructorStudio from './pages/InstructorStudio';
import Login from './pages/Login';
import Register from './pages/Register';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public & Student Layout Pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Protected Student Pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Protected Instructor / Admin Pages */}
          <Route element={<ProtectedRoute requiredRole="instructor" />}>
            <Route path="/instructor" element={<InstructorStudio />} />
          </Route>
        </Route>

        {/* Fullscreen Distraction-Free Classroom (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/learn/:courseId" element={<Classroom />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
