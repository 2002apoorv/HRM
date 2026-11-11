import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineAttachMoney,
  MdOutlineCheckCircle,
  MdOutlineArrowBack,
} from 'react-icons/md';

export const AddSalary = () => {
  const [salaryData, setSalaryData] = useState({
    departmentId: '',
    employeeId: '',
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: '',
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      console.error('Error fetching departments:', err);
    }
  };

  const handleDepartmentChange = async (e) => {
    const depId = e.target.value;
    setSalaryData((prev) => ({ ...prev, departmentId: depId, employeeId: '' }));

    if (!depId) {
      setEmployees([]);
      return;
    }

    try {
      const res = await api.get(`/employee/department/${depId}`);
      if (res.data.success) {
        setEmployees(res.data.employees || []);
      }
    } catch (err) {
      console.error('Error fetching department employees:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prev) => ({ ...prev, [name]: value }));
  };

  const netSalary =
    Number(salaryData.basicSalary || 0) +
    Number(salaryData.allowances || 0) -
    Number(salaryData.deductions || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salaryData.employeeId) {
      setError('Please select an employee.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/salary/add', salaryData);
      if (res.data.success) {
        setSuccess('Salary record added successfully!');
        setTimeout(() => navigate('/admin-dashboard/employees'), 1200);
      }
    } catch (err) {
      console.error('Error recording salary:', err);
      setError(err.response?.data?.error || 'Failed to record salary');
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
    summaryBanner: {
      background: 'rgba(124, 58, 237, 0.15)',
      border: '1px solid rgba(124, 58, 237, 0.3)',
      borderRadius: '12px',
      padding: '1.2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    netLabel: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: '#c4b5fd',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    netAmount: {
      fontSize: '1.6rem',
      fontWeight: 800,
      color: '#fff',
    },
    btnGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.8rem',
      marginTop: '1.5rem',
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
        <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard/employees')}>
          <MdOutlineArrowBack size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Payroll & Salary Setup</h1>
          <p style={styles.subtitle}>Configure compensation packages, allowances, and deductions.</p>
        </div>
      </div>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {/* Department */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Department <span style={{ color: '#f87171' }}>*</span>
              </label>
              <select
                name="departmentId"
                value={salaryData.departmentId}
                onChange={handleDepartmentChange}
                style={styles.select}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.dep_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Employee <span style={{ color: '#f87171' }}>*</span>
              </label>
              <select
                name="employeeId"
                value={salaryData.employeeId}
                onChange={handleChange}
                style={styles.select}
                required
                disabled={!salaryData.departmentId}
              >
                <option value="">
                  {salaryData.departmentId ? 'Select Employee' : 'Choose Department First'}
                </option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.userId?.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Salary */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Basic Monthly Salary ($)</label>
              <input
                type="number"
                name="basicSalary"
                value={salaryData.basicSalary}
                onChange={handleChange}
                style={styles.input}
                min="0"
                required
              />
            </div>

            {/* Allowances */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Allowances / Bonuses ($)</label>
              <input
                type="number"
                name="allowances"
                value={salaryData.allowances}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
            </div>

            {/* Deductions */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Deductions / Taxes ($)</label>
              <input
                type="number"
                name="deductions"
                value={salaryData.deductions}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
            </div>

            {/* Pay Date */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Disbursement / Pay Date</label>
              <input
                type="date"
                name="payDate"
                value={salaryData.payDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.summaryBanner}>
            <div>
              <div style={styles.netLabel}>Estimated Net Pay</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Basic + Allowances - Deductions
              </div>
            </div>
            <div style={styles.netAmount}>
              ${Math.max(0, netSalary).toLocaleString()}
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
              <span>{submitting ? 'Saving...' : 'Record Salary'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;