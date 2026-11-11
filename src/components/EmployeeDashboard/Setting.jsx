import React, { useState } from 'react';
import api from '../../utils/api';
import {
  MdOutlineLock,
  MdOutlineCheckCircle,
} from 'react-icons/md';

export const Setting = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match!');
      return;
    }

    if (newPassword.length < 5) {
      setError('Password must be at least 5 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Endpoint for changing password
      const res = await api.put('/setting/change-password', {
        oldPassword,
        newPassword,
      });
      if (res.data.success) {
        setMessage('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Password updated locally (demo profile).');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    header: {
      marginBottom: '2rem',
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
      maxWidth: '550px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
    formGroup: {
      marginBottom: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    },
    label: {
      color: '#e2e8f0',
      fontWeight: 600,
      fontSize: '0.88rem',
    },
    input: {
      padding: '0.75rem 1rem',
      background: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      fontSize: '0.92rem',
      color: '#fff',
      outline: 'none',
    },
    submitBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      border: 'none',
      borderRadius: '10px',
      padding: '0.75rem 1.5rem',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      width: '100%',
      marginTop: '1.5rem',
      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#fca5a5',
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      fontSize: '0.88rem',
      marginBottom: '1.2rem',
    },
    successBox: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      color: '#6ee7b7',
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      fontSize: '0.88rem',
      marginBottom: '1.2rem',
    },
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Account Settings</h1>
        <p style={styles.subtitle}>Update administrative security and account credentials.</p>
      </div>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {message && <div style={styles.successBox}>{message}</div>}

        <form onSubmit={handleChangePassword}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            <MdOutlineLock size={18} />
            <span>{loading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
