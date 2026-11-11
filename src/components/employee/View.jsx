import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineArrowBack,
  MdOutlineEdit,
  MdOutlineEmail,
  MdOutlineBadge,
  MdOutlineApartment,
  MdOutlineCalendarToday,
  MdOutlineWc,
  MdOutlineAttachMoney,
  MdOutlineAdminPanelSettings,
} from 'react-icons/md';

export const View = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/employee/${id}`);
      if (response.data.success) {
        setEmployee(response.data.employee);
      }
    } catch (err) {
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    backGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
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
    editBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      border: 'none',
      borderRadius: '10px',
      padding: '0.65rem 1.2rem',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '2.5rem 2rem',
      maxWidth: '750px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
    avatarHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      paddingBottom: '2rem',
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: '1rem',
      border: '3px solid #8b5cf6',
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
      background: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      fontWeight: 800,
      color: '#fff',
    },
    name: {
      color: '#f8fafc',
      fontWeight: 800,
      fontSize: '1.7rem',
      margin: 0,
      letterSpacing: '-0.3px',
    },
    designation: {
      color: '#a78bfa',
      fontWeight: 600,
      fontSize: '1rem',
      marginTop: '0.3rem',
    },
    badgeRow: {
      display: 'flex',
      gap: '0.6rem',
      marginTop: '0.8rem',
    },
    badge: (bg, color) => ({
      background: bg,
      color: color,
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.82rem',
      fontWeight: 600,
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.9rem',
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '0.9rem 1.1rem',
    },
    iconBox: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'rgba(124, 58, 237, 0.15)',
      color: '#c4b5fd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      flexShrink: 0,
    },
    infoContent: {
      display: 'flex',
      flexDirection: 'column',
    },
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
      marginTop: '0.1rem',
    },
    emptyState: {
      padding: '4rem 1rem',
      textAlign: 'center',
      color: '#94a3b8',
    },
  };

  if (loading) {
    return <div style={styles.emptyState}>Loading employee profile...</div>;
  }

  if (!employee) {
    return <div style={styles.emptyState}>Employee record not found.</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.backGroup}>
          <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard/employees')}>
            <MdOutlineArrowBack size={20} />
          </button>
          <div>
            <h1 style={styles.title}>Employee Profile</h1>
            <p style={styles.subtitle}>Detailed employee information and credentials.</p>
          </div>
        </div>

        <button
          style={styles.editBtn}
          onClick={() => navigate(`/admin-dashboard/employees/edit/${employee._id}`)}
        >
          <MdOutlineEdit size={18} />
          <span>Edit Profile</span>
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.avatarHeader}>
          {employee.userId?.profileImage ? (
            <img
              src={`http://localhost:5000/uploads/${employee.userId.profileImage}`}
              alt={employee.userId?.name}
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatar}>
              {employee.userId?.name ? employee.userId.name.charAt(0).toUpperCase() : 'E'}
            </div>
          )}
          <h2 style={styles.name}>{employee.userId?.name}</h2>
          <div style={styles.designation}>{employee.designation || 'Staff Member'}</div>

          <div style={styles.badgeRow}>
            <span style={styles.badge('rgba(124, 58, 237, 0.2)', '#c4b5fd')}>
              {employee.department?.dep_name || 'General Department'}
            </span>
            <span style={styles.badge('rgba(59, 130, 246, 0.2)', '#93c5fd')}>
              ID: {employee.employeeId}
            </span>
            <span style={styles.badge('rgba(16, 185, 129, 0.2)', '#6ee7b7')}>
              Role: {employee.userId?.role || 'employee'}
            </span>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.infoItem}>
            <div style={styles.iconBox}>
              <MdOutlineEmail />
            </div>
            <div style={styles.infoContent}>
              <span style={styles.infoLabel}>Work Email</span>
              <span style={styles.infoValue}>{employee.userId?.email}</span>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox}>
              <MdOutlineBadge />
            </div>
            <div style={styles.infoContent}>
              <span style={styles.infoLabel}>Employee Code</span>
              <span style={styles.infoValue}>{employee.employeeId}</span>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox}>
              <MdOutlineApartment />
            </div>
            <div style={styles.infoContent}>
              <span style={styles.infoLabel}>Department</span>
              <span style={styles.infoValue}>{employee.department?.dep_name || 'N/A'}</span>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox}>
              <MdOutlineCalendarToday />
            </div>
            <div style={styles.infoContent}>
              <span style={styles.infoLabel}>Date of Birth</span>
              <span style={styles.infoValue}>
                {employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox}>
              <MdOutlineWc />
            </div>
            <div style={styles.infoContent}>
              <span style={styles.infoLabel}>Gender & Marital Status</span>
              <span style={styles.infoValue}>
                {employee.gender || 'Not specified'} &bull; {employee.maritalStatus || 'Single'}
              </span>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.iconBox}>
              <MdOutlineAttachMoney />
            </div>
            <div style={styles.infoContent}>
              <span style={styles.infoLabel}>Monthly Salary</span>
              <span style={styles.infoValue}>${Number(employee.salary || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
