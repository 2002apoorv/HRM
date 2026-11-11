import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineArrowBack,
  MdOutlineCheckCircle,
} from 'react-icons/md';

export const Edit = () => {
  const [employee, setEmployee] = useState({
    name: '',
    maritalStatus: '',
    designation: '',
    salary: 0,
    department: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [depRes, empRes] = await Promise.all([
        api.get('/department'),
        api.get(`/employee/${id}`),
      ]);

      if (depRes.data.success) {
        setDepartments(depRes.data.departments || []);
      }

      if (empRes.data.success) {
        const emp = empRes.data.employee;
        setEmployee({
          name: emp.userId?.name || '',
          maritalStatus: emp.maritalStatus || '',
          designation: emp.designation || '',
          salary: emp.salary || 0,
          department: emp.department?._id || emp.department || '',
        });
      }
    } catch (err) {
      console.error('Error fetching employee edit data:', err);
      setError('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.put(`/employee/${id}`, employee);
      if (res.data.success) {
        navigate('/admin-dashboard/employees');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err.response?.data?.error || 'Failed to update employee details');
    } finally {
      setSubmitting(false);
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.5rem',
    },
    formGroup: {
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
    select: {
      padding: '0.75rem 1rem',
      background: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      fontSize: '0.92rem',
      color: '#fff',
      outline: 'none',
      cursor: 'pointer',
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
    emptyState: {
      padding: '4rem 1rem',
      textAlign: 'center',
      color: '#94a3b8',
    },
  };

  if (loading) {
    return <div style={styles.emptyState}>Loading employee details...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard/employees')}>
          <MdOutlineArrowBack size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Edit Employee</h1>
          <p style={styles.subtitle}>Update designation, department, and salary allocation.</p>
        </div>
      </div>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {/* Full Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Department */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Department</label>
              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Designation / Role Title</label>
              <input
                type="text"
                name="designation"
                value={employee.designation}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Marital Status */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Marital Status</label>
              <select
                name="maritalStatus"
                value={employee.maritalStatus}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            {/* Salary */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Monthly Salary ($)</label>
              <input
                type="number"
                name="salary"
                value={employee.salary}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.btnGroup}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/admin-dashboard/employees')}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              <MdOutlineCheckCircle size={18} />
              <span>{submitting ? 'Saving...' : 'Update Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;