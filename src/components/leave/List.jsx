import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineArrowBack,
  MdOutlineBeachAccess,
  MdOutlineCheckCircle,
  MdOutlineCancel,
  MdOutlineHourglassBottom,
} from 'react-icons/md';

export const Listt = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeLeaves();
  }, [id]);

  const fetchEmployeeLeaves = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/leave/${id}`);
      if (response.data.success) {
        setLeaves(response.data.leaves || []);
      }
    } catch (err) {
      console.error('Error fetching employee leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') {
      return (
        <span
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#6ee7b7',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Approved
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Rejected
        </span>
      );
    }
    return (
      <span
        style={{
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#fcd34d',
          padding: '0.2rem 0.6rem',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}
      >
        Pending
      </span>
    );
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
          <h1 style={styles.title}>Employee Leave History</h1>
          <p style={styles.subtitle}>Historical record of leave requests and manager actions.</p>
        </div>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={styles.emptyState}>Loading records...</div>
        ) : leaves.length === 0 ? (
          <div style={styles.emptyState}>
            <MdOutlineBeachAccess size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <div>No leave records found for this employee.</div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.No</th>
                  <th style={styles.th}>Leave Type</th>
                  <th style={styles.th}>Dates</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l, idx) => (
                  <tr key={l._id || idx}>
                    <td style={styles.td}>{idx + 1}</td>
                    <td style={styles.td}>{l.leaveType}</td>
                    <td style={styles.td}>
                      {new Date(l.startDate).toLocaleDateString()} &rarr;{' '}
                      {new Date(l.endDate).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{l.reason || 'N/A'}</td>
                    <td style={styles.td}>{getStatusBadge(l.status)}</td>
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

export default Listt;
