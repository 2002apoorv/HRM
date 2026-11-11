import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineArrowBack,
  MdOutlineAttachMoney,
} from 'react-icons/md';

export const ViewSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalaries();
  }, [id]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/salary/${id}`);
      if (response.data.success) {
        setSalaries(response.data.salary || []);
      }
    } catch (err) {
      console.error('Error fetching salaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      color: '#fff',
      cursor: 'pointer',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#fff',
      letterSpacing: '-0.5px',
      margin: 0,
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '0.9rem',
      marginTop: '0.2rem',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
    },
    th: {
      padding: '0.8rem 1rem',
      color: '#94a3b8',
      fontSize: '0.82rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(15, 23, 42, 0.4)',
    },
    td: {
      padding: '0.85rem 1rem',
      fontSize: '0.92rem',
      color: '#e2e8f0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    },
    emptyState: {
      padding: '3rem 1rem',
      textAlign: 'center',
      color: '#64748b',
    },
  };

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard/employees')}>
          <MdOutlineArrowBack size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Salary & Compensation History</h1>
          <p style={styles.subtitle}>Historical breakdown of monthly pay disbursements.</p>
        </div>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={styles.emptyState}>Loading compensation history...</div>
        ) : salaries.length === 0 ? (
          <div style={styles.emptyState}>
            <MdOutlineAttachMoney size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <div>No salary records found for this employee.</div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.No</th>
                  <th style={styles.th}>Pay Date</th>
                  <th style={styles.th}>Basic Salary</th>
                  <th style={styles.th}>Allowances</th>
                  <th style={styles.th}>Deductions</th>
                  <th style={styles.th}>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s, idx) => (
                  <tr key={s._id || idx}>
                    <td style={styles.td}>{idx + 1}</td>
                    <td style={styles.td}>
                      {s.payDate ? new Date(s.payDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={styles.td}>${Number(s.basicSalary || 0).toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={{ color: '#6ee7b7' }}>
                        +${Number(s.allowances || 0).toLocaleString()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#fca5a5' }}>
                        -${Number(s.deductions || 0).toLocaleString()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: '#fff' }}>
                        ${Number(s.netSalary || 0).toLocaleString()}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSalary;
