import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineArrowBack,
  MdOutlineCheckCircle,
  MdOutlineCancel,
  MdOutlineBeachAccess,
  MdOutlineCalendarToday,
  MdOutlinePerson,
  MdOutlineDescription,
} from 'react-icons/md';

export const Detail = () => {
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeave();
  }, [id]);

  const fetchLeave = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/leave/detail/${id}`);
      if (response.data.success) {
        setLeave(response.data.leave);
      }
    } catch (err) {
      console.error('Error fetching leave details:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (status) => {
    setUpdating(true);
    try {
      const response = await api.put(`/leave/${id}`, { status });
      if (response.data.success) {
        navigate('/admin-dashboard/leaves');
      }
    } catch (err) {
      console.error('Error changing leave status:', err);
    } finally {
      setUpdating(false);
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
      padding: '2rem',
      maxWidth: '750px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.9rem',
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '1rem',
    },
    iconBox: (bg, color) => ({
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: bg,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      flexShrink: 0,
    }),
    infoLabel: {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    infoValue: {
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#f8fafc',
      marginTop: '0.15rem',
    },
    reasonBox: {
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '1.2rem',
      marginBottom: '2rem',
    },
    actionsRow: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '1.5rem',
    },
    approveBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      border: 'none',
      borderRadius: '10px',
      padding: '0.7rem 1.4rem',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
    },
    rejectBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      border: 'none',
      borderRadius: '10px',
      padding: '0.7rem 1.4rem',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
    },
    emptyState: {
      padding: '4rem 1rem',
      textAlign: 'center',
      color: '#94a3b8',
    },
  };

  if (loading) {
    return <div style={styles.emptyState}>Loading application details...</div>;
  }

  if (!leave) {
    return <div style={styles.emptyState}>Leave application not found.</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard/leaves')}>
          <MdOutlineArrowBack size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Review Leave Application</h1>
          <p style={styles.subtitle}>Authorize or decline employee absence request.</p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.detailGrid}>
          <div style={styles.infoItem}>
            <div style={styles.iconBox('rgba(124, 58, 237, 0.15)', '#c4b5fd')}>
              <MdOutlinePerson />
            </div>
            <div>
              <div style={styles.infoLabel}>Applicant</div>
              <div style={styles.infoValue}>
                {leave.employeeId?.userId?.name || 'Staff Member'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                ID: {leave.employeeId?.employeeId}
              </div>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox('rgba(14, 165, 233, 0.15)', '#7dd3fc')}>
              <MdOutlineBeachAccess />
            </div>
            <div>
              <div style={styles.infoLabel}>Leave Type</div>
              <div style={styles.infoValue}>{leave.leaveType}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Department: {leave.employeeId?.department?.dep_name || 'General'}
              </div>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox('rgba(245, 158, 11, 0.15)', '#fcd34d')}>
              <MdOutlineCalendarToday />
            </div>
            <div>
              <div style={styles.infoLabel}>Leave Dates</div>
              <div style={styles.infoValue}>
                {new Date(leave.startDate).toLocaleDateString()} &rarr;{' '}
                {new Date(leave.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox('rgba(255, 255, 255, 0.1)', '#fff')}>
              <MdOutlineDescription />
            </div>
            <div>
              <div style={styles.infoLabel}>Current Decision</div>
              <div style={styles.infoValue}>{leave.status || 'Pending'}</div>
            </div>
          </div>
        </div>

        <div style={styles.reasonBox}>
          <div style={{ ...styles.infoLabel, marginBottom: '0.5rem' }}>
            Reason Provided by Employee
          </div>
          <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {leave.reason || 'No written explanation provided.'}
          </div>
        </div>

        {leave.status === 'Pending' && (
          <div style={styles.actionsRow}>
            <button
              style={styles.rejectBtn}
              onClick={() => changeStatus('Rejected')}
              disabled={updating}
            >
              <MdOutlineCancel size={18} />
              <span>Reject Request</span>
            </button>
            <button
              style={styles.approveBtn}
              onClick={() => changeStatus('Approved')}
              disabled={updating}
            >
              <MdOutlineCheckCircle size={18} />
              <span>Approve Leave</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
