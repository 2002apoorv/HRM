import React, { useEffect, useState } from 'react'
import { SummaryCard } from './SummaryCard'
import { FaUsers } from 'react-icons/fa';
import api from '../../utils/api';

export const AdminSummary = () => {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        if (res.data.success) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to load summary in AdminSummary:', err);
      }
    };
    fetchSummary();
  }, []);

  const styles = {
    container: {
      padding: '2rem',
      marginTop: '30px',
      fontFamily: 'Inter, sans-serif',
    },
    heading: {
      color: '#23272F',
      fontWeight: 700,
      fontSize: '1.6rem',
      marginBottom: '1.5rem',
      letterSpacing: '0.5px',
      fontFamily: "'Playfair Display', sans-serif",
    },
    subHeading: {
      color: '#23272F',
      fontWeight: 600,
      fontSize: '1.4rem',
      marginTop: '2.5rem',
      marginBottom: '1rem',
      fontFamily: "'Playfair Display', sans-serif",
    },
    cards: {
      display: 'flex',
      gap: '1.5rem',
      flexWrap: 'wrap',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Dashboard Overview</h3>
      <div style={styles.cards}>
        <SummaryCard icon={<FaUsers />} text="Total Employees" number={summary.totalEmployees} bgColor="rgba(59, 130, 246, 0.3)" />
        <SummaryCard icon={<FaUsers />} text="Active Employees" number={summary.totalEmployees} bgColor="rgba(34, 197, 94, 0.3)" />
        <SummaryCard icon={<FaUsers />} text="Departments" number={summary.totalDepartments} bgColor="rgba(249, 115, 22, 0.3)" />
      </div>

      <div>
        <h4 style={styles.subHeading}>Leave Details</h4>
        <div style={styles.cards}>
          <SummaryCard icon={<FaUsers />} text="Leave Applied" number={summary.pendingLeaves} bgColor="rgba(20, 184, 166, 0.3)" />
          <SummaryCard icon={<FaUsers />} text="Leave Approved" number={0} bgColor="rgba(34, 197, 94, 0.3)" />
          <SummaryCard icon={<FaUsers />} text="Leave Pending" number={summary.pendingLeaves} bgColor="rgba(249, 115, 22, 0.3)" />
          <SummaryCard icon={<FaUsers />} text="Leave Rejected" number={0} bgColor="rgba(239, 68, 68, 0.3)" />
        </div>
      </div>
    </div>
  )
}