import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

import Landing from './pages/auth/Landing';
import AdminLogin from './pages/auth/AdminLogin';
import ParentLogin from './pages/auth/ParentLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentList from './pages/admin/StudentList';
import StudentForm from './pages/admin/StudentForm';
import StudentView from './pages/admin/StudentView';
import ParentChat from './pages/parent/ParentChat';

function AdminRoute({ children }) {
  const token = localStorage.getItem('ec_token');
  const role = localStorage.getItem('ec_role');
  if (!token || role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
}

function ParentRoute({ children }) {
  const token = localStorage.getItem('ec_token');
  const role = localStorage.getItem('ec_role');
  if (!token || role !== 'parent') return <Navigate to="/parent/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-root">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<Landing />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/students" element={<AdminRoute><StudentList /></AdminRoute>} />
            <Route path="/admin/students/add" element={<AdminRoute><StudentForm /></AdminRoute>} />
            <Route path="/admin/students/:id" element={<AdminRoute><StudentView /></AdminRoute>} />
            <Route path="/admin/students/:id/edit" element={<AdminRoute><StudentForm /></AdminRoute>} />

            {/* Parent */}
            <Route path="/parent/login" element={<ParentLogin />} />
            <Route path="/parent/chat" element={<ParentRoute><ParentChat /></ParentRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
