import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineApartment,
  MdOutlineArrowBack,
  MdOutlineCheckCircle,
} from 'react-icons/md';

export const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department.dep_name.trim()) {
      setError('Please provide a department name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/department/add', department);
      if (response.data.success) {
        navigate('/admin-dashboard/departments');
      }
    } catch (err) {
      console.error('Error adding department:', err);
      setError(err.response?.data?.error || 'Failed to create department');
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
      padding: '2rem',
      maxWidth: '650px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
    formGroup: {
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      color: '#e2e8f0',
      fontWeight: 600,
      fontSize: '0.9rem',
    },
    input: {
      padding: '0.75rem 1rem',
      background: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      fontSize: '0.95rem',
      color: '#fff',
      outline: 'none',
      transition: 'border 0.2s',
    },
    textarea: {
      padding: '0.75rem 1rem',
      background: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      fontSize: '0.95rem',
      color: '#fff',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    btnGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.8rem',
      marginTop: '2rem',
    },
    cancelBtn: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '10px',
      padding: '0.7rem 1.4rem',
      color: '#e2e8f0',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
    },
    submitBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      border: 'none',
      borderRadius: '10px',
      padding: '0.7rem 1.5rem',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
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
  };

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard/departments')}>
          <MdOutlineArrowBack size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Add Department</h1>
          <p style={styles.subtitle}>Create a new departmental division in your organization.</p>
        </div>
      </div>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="dep_name" style={styles.label}>
              Department Name <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              type="text"
              id="dep_name"
              name="dep_name"
              value={department.dep_name}
              placeholder="e.g. Engineering, Sales, Human Resources, Finance"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={department.description}
              onChange={handleChange}
              placeholder="Describe department roles and operational focus..."
              style={styles.textarea}
            />
          </div>

          <div style={styles.btnGroup}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/admin-dashboard/departments')}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              <MdOutlineCheckCircle size={18} />
              <span>{loading ? 'Creating...' : 'Save Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;