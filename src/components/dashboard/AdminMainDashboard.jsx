import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaUserCheck, FaBuilding, FaCalendarTimes, FaMoneyCheckAlt, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { SummaryCard } from './SummaryCard';
const activityIcons = {
  leave: <FaCalendarTimes color="#4c1d95" />,
  add: <FaUserPlus color="#4c1d95" />,
  salary: <FaMoneyCheckAlt color="#4c1d95" />,
};

const recentActivity = [
  { id: 1, type: 'leave', text: 'John Doe applied for leave (2 days)', time: '2 minutes ago' },
  { id: 2, type: 'add', text: 'Jane Smith was added as an employee', time: '10 minutes ago' },
  { id: 3, type: 'salary', text: 'Salary processed for May', time: '1 hour ago' },
];

export const AdminMainDashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await axios.get('http://localhost:5000/api/dashboard/summary', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        
          setSummary(summary.data);
        
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  },[])

  if(!summary) {
    return <div>Loading...</div>;
  }

  const summaryData = [
  { icon: <FaUsers color="#fff" />, label: 'Total Employees', value: summary.totalEmployees, bg: 'rgba(59, 130, 246, 0.7)' },
  { icon: <FaUserCheck color="#fff" />, label: 'Active Employees', value: 38, bg: 'rgba(34, 197, 94, 0.7)' },
  { icon: <FaBuilding color="#fff" />, label: 'Departments', value: summary.totalDepartments, bg: 'rgba(139, 92, 246, 0.7)' },
  { icon: <FaCalendarTimes color="#fff" />, label: 'Leaves Applied For', value: summary.leaveSummary.appliedFor, bg: 'rgba(239, 68, 68, 0.7)' },
  { icon: <FaCalendarTimes color="#fff" />, label: 'Approved Leaves', value: summary.leaveSummary.approved, bg: 'rgba(239, 68, 68, 0.7)' },
  { icon: <FaCalendarTimes color="#fff" />, label: 'Pending Leaves', value: summary.leaveSummary.pending, bg: 'rgba(239, 68, 68, 0.7)' },
  { icon: <FaMoneyCheckAlt color="#fff" />, label: 'Salary Processed', value: summary.totalSalaries, bg: 'rgba(20, 184, 166, 0.7)' },
];

  const quickActions = [
    { icon: <FaUserPlus color="#fff" />, label: 'Add Employee', action: () => navigate('/admin-dashboard/add-employee') },
    { icon: <FaCheckCircle color="#fff" />, label: 'Approve Leave', action: () => {} },
  ];

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: 700,
      color: '#23272F',
      fontFamily: "'Playfair Display', serif",
    },
    updated: {
      color: '#6b7280',
      fontSize: '1rem',
    },
    welcome: {
      fontSize: '1.1rem',
      color: '#4c1d95',
      marginBottom: '2rem',
    },
    summaryRow: {
      display: 'flex',
      gap: '1.2rem',
      flexWrap: 'wrap',
      marginBottom: '2.5rem',
    },
    card: {
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 15px rgba(44,62,80,0.08)',
      padding: '1.2rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.1rem',
      minWidth: '200px',
      minHeight: '90px',
    },
    iconBox: bg => ({
      width: '44px',
      height: '44px',
      borderRadius: '10px',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 700,
      flexShrink: 0,
    }),
    cardText: {
      display: 'flex',
      flexDirection: 'column',
    },
    cardLabel: {
      color: '#23272F',
      fontWeight: 500,
      fontSize: '1.05rem',
      marginBottom: '0.2rem',
    },
    cardValue: {
      color: '#23272F',
      fontWeight: 700,
      fontSize: '1.3rem',
    },
    section: {
      marginBottom: '2.2rem',
    },
    sectionTitle: {
      fontSize: '1.15rem',
      fontWeight: 600,
      color: '#23272F',
      marginBottom: '1rem',
    },
    sectionCard: {
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #ede9fe',
      boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
      padding: '1.2rem 1.5rem',
      marginBottom: '1.5rem',
    },
    activityList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.1rem',
      color: '#374151',
      fontSize: '1rem',
      padding: '0.7rem 0',
      borderBottom: '1px solid #f3f4f6',
    },
    activityIcon: {
      minWidth: '32px',
      minHeight: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ede9fe',
      borderRadius: '8px',
      fontSize: '1.2rem',
    },
    activityText: {
      flex: 1,
    },
    activityTime: {
      color: '#a1a1aa',
      fontSize: '0.95rem',
      marginLeft: '0.5rem',
      fontStyle: 'italic',
    },
    quickActions: {
      display: 'flex',
      gap: '1.2rem',
      marginTop: '0.5rem',
    },
    quickActionBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      background: '#4c1d95',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.7rem 1.2rem',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background 0.18s',
    },
  };

  

  return (
    <div style={{ marginTop: '100px' ,marginLeft: '13px'}}>
      <div style={styles.header}>
        <div style={styles.title}>Dashboard</div>
        <div style={styles.updated}>Last updated: {(() => {
          const d = new Date();
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          return `${day}/${month}/${year}`;
        })()}</div>
      </div>
      <div style={styles.welcome}>Welcome back! Here's what's happening with your HRM today.</div>
      <div style={styles.summaryRow}>
        {summaryData.map((item, idx) => (
          <motion.div
            key={idx}
            style={styles.card}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div style={styles.iconBox(item.bg)}>{item.icon}</div>
            <div style={styles.cardText}>
              <span style={styles.cardLabel}>{item.label}</span>
              <span style={styles.cardValue}>{item.value}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ ...styles.section, flex: 2 }}>
          <div style={styles.sectionTitle}>Recent Activity</div>
          <div style={styles.sectionCard}>
            <ul style={styles.activityList}>
              {recentActivity.map(item => (
                <li key={item.id} style={styles.activityItem}>
                  <span style={styles.activityIcon}>{activityIcons[item.type]}</span>
                  <span style={styles.activityText}>{item.text}</span>
                  <span style={styles.activityTime}>{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ ...styles.section, flex: 1 }}>
          <div style={styles.sectionTitle}>Quick Actions</div>
          <div style={styles.quickActions}>
            {quickActions.map((action, idx) => (
              <button key={idx} style={styles.quickActionBtn} onClick={action.action}>
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 