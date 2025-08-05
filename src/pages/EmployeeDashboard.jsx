import React from 'react'
import {Sidebar} from '../components/EmployeeDashboard/Sidebar'
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/dashboard/Navbar';

export const EmployeeDashboard = () => {

  
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
      <Sidebar />
      <div style={styles.mainContent}>
        <Navbar />
        <div style={styles.scrollArea}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
