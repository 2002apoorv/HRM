import React from 'react'
import { useAuth } from '../context/authContext.jsx';
import { AdminSidebar } from '../components/dashboard/AdminSidebar.jsx';
import { Navbar } from '../components/dashboard/Navbar.jsx'; // ✅ Correct
import { Outlet } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'rgb(76, 29, 149)',
      fontFamily: 'Inter, sans-serif',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
    },
    scrollArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      background: '#fff',
    }
  }

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.mainContent}>
        <Navbar />
        <div style={styles.scrollArea}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}