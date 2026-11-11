import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineArrowBack,
  MdOutlinePersonAdd,
  MdOutlineCheckCircle,
} from 'react-icons/md';

export const Add = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    employeeId: '',
    gender: '',
    maritalStatus: '',
    designation: '',
    department: '',
    salary: '',
    password: '',
    role: '',
    image: null,
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/department');
      if (res.data.success) {
        setDepartments(res.data.departments || []);
      }
    } catch (err) {
      console.error('Fetch departments error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        form.append(key, formData[key]);
      }
    });

    // Ensure salary is always sent as valid number string (defaults to 0 if left blank)
    form.set('salary', formData.salary ? String(formData.salary) : '0');

    // Ensure system role is always sent
    form.set('role', formData.role || 'Employee');

    try {
      const response = await api.post('/employee/add', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        navigate('/admin-dashboard/employees');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to register employee'
      );
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
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      color: '#334155',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: 800,
      color: '#0f172a',
      letterSpacing: '-0.5px',
      margin: 0,
    },
    subtitle: {
      color: '#64748b',
      fontSize: '0.9rem',
      marginTop: '0.2rem',
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '2.5rem',
      maxWidth: '920px',
      boxShadow: '0 4px 25px -4px rgba(15, 23, 42, 0.06)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.45rem',
    },
    label: {
      color: '#334155',
      fontWeight: 600,
      fontSize: '0.88rem',
    },
    input: {
      padding: '0.75rem 1rem',
      background: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      fontSize: '0.92rem',
      color: '#0f172a',
      outline: 'none',
      transition: 'border 0.15s, box-shadow 0.15s',
    },
    select: {
      padding: '0.75rem 1rem',
      background: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      fontSize: '0.92rem',
      color: '#0f172a',
      outline: 'none',
      cursor: 'pointer',
      transition: 'border 0.15s, box-shadow 0.15s',
    },
    btnGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.8rem',
      marginTop: '2rem',
    },
    cancelBtn: {
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '0.7rem 1.4rem',
      color: '#475569',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
    },
    submitBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
      border: 'none',
      borderRadius: '10px',
      padding: '0.7rem 1.6rem',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
    },
    errorBox: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.85rem 1.2rem',
      borderRadius: '12px',
      fontSize: '0.88rem',
      fontWeight: 500,
      marginBottom: '1.5rem',
    },
  };

  return (
    <div>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard/employees')}>
          <MdOutlineArrowBack size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Onboard New Employee</h1>
          <p style={styles.subtitle}>Create profile, assign department, and configure account access.</p>
        </div>
      </div>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {/* Full Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Full Name <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Work Email <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. jane@company.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Employee ID */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Employee ID <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                type="text"
                name="employeeId"
                placeholder="e.g. EMP-001"
                value={formData.employeeId}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Date of Birth */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Gender */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Marital Status */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Marital Status</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            {/* Department */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Department <span style={{ color: '#f87171' }}>*</span>
              </label>
              <select
                name="department"
                value={formData.department}
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
                placeholder="e.g. Senior Software Engineer"
                value={formData.designation}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Salary */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Starting Monthly Salary ($)</label>
              <input
                type="number"
                name="salary"
                placeholder="e.g. 5000"
                value={formData.salary}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Portal Role */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                System Role <span style={{ color: '#f87171' }}>*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Portal Password <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Image Upload */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Profile Picture</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{ ...styles.input, padding: '0.5rem' }}
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
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              <MdOutlineCheckCircle size={18} />
              <span>{loading ? 'Registering...' : 'Save Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;