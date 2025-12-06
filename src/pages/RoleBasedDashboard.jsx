// src/pages/RoleBasedDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import MentorDashboard from './MentorDashboard';
import MenteeDashboard from './MenteeDashboard';

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user.role === 'MENTOR') {
    return <MentorDashboard />;
  }

  if (user.role === 'MENTEE') {
    return <MenteeDashboard />;
  }

  return <div style={{ padding: '24px' }}>알 수 없는 역할입니다.</div>;
}
