import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlinePeople,
  MdOutlinePersonAdd,
  MdOutlineSearch,
  MdOutlineVisibility,
  MdOutlineEdit,
  MdOutlineAttachMoney,
  MdOutlineBeachAccess,
} from 'react-icons/md';

export const List = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employee');
      if (response.data.success) {
        setEmployees(response.data.employees || []);
      }
    } catch (err) {
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const name = emp.userId?.name || '';
    const empId = emp.employeeId || '';
    const dep = emp.department?.dep_name || '';
    const des = emp.designation || '';
    const q = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      empId.toLowerCase().includes(q) ||
      dep.toLowerCase().includes(q) ||
      des.toLowerCase().includes(q)
    );
  });

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.8rem',
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
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      padding: '0.65rem 1.2rem',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '0.6rem 1rem',
      marginBottom: '1.5rem',
      maxWidth: '450px',
    },
    searchInput: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#0f172a',
      fontSize: '0.92rem',
      width: '100%',
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
      color: '#64748b',
      fontSize: '0.82rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #e2e8f0',
      background: '#f8fafc',
    },
    td: {
      padding: '0.85rem 1rem',
      fontSize: '0.92rem',
      color: '#1e293b',
      borderBottom: '1px solid #f1f5f9',
    },
    emptyState: {
      padding: '3rem 1rem',
      textAlign: 'center',
      color: '#64748b',
    },
    actionGroup: {
      display: 'flex',
      gap: '0.4rem',
      alignItems: 'center',
    },
    actionBtn: (bg, color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      background: bg,
      color: color,
      border: 'none',
      borderRadius: '6px',
      padding: '0.35rem 0.65rem',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    }),
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Employee Directory</h1>
          <p style={styles.subtitle}>
            Manage staff profiles, departmental allocations, and compensation records.
          </p>
        </div>

        <button style={styles.addBtn} onClick={() => navigate('/admin-dashboard/add-employee')}>
          <MdOutlinePersonAdd size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.searchBar}>
          <MdOutlineSearch size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name, ID, department, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading employees...</div>
        ) : filteredEmployees.length === 0 ? (
          <div style={styles.emptyState}>
            <MdOutlinePeople size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <div>No employees found.</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: '#94a3b8' }}>
              Click "Add Employee" to onboard your first staff member.
            </div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.No</th>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Designation</th>
                  <th style={styles.th}>DOB</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <tr key={emp._id || index}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#fff',
                            overflow: 'hidden',
                          }}
                        >
                          {emp.userId?.profileImage ? (
                            <img
                              src={`http://localhost:5000/uploads/${emp.userId.profileImage}`}
                              alt={emp.userId?.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            emp.userId?.name ? emp.userId.name.charAt(0).toUpperCase() : 'E'
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{emp.userId?.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{emp.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        {emp.employeeId}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          background: 'rgba(124, 58, 237, 0.15)',
                          color: '#c4b5fd',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {emp.department?.dep_name || 'General'}
                      </span>
                    </td>
                    <td style={styles.td}>{emp.designation || 'Staff'}</td>
                    <td style={styles.td}>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {emp.dob ? new Date(emp.dob).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionGroup}>
                        <button
                          style={styles.actionBtn('rgba(124, 58, 237, 0.2)', '#c4b5fd')}
                          onClick={() => navigate(`/admin-dashboard/employees/${emp._id}`)}
                          title="View Profile"
                        >
                          <MdOutlineVisibility size={14} />
                          <span>View</span>
                        </button>
                        <button
                          style={styles.actionBtn('rgba(245, 158, 11, 0.2)', '#fcd34d')}
                          onClick={() => navigate(`/admin-dashboard/employees/edit/${emp._id}`)}
                          title="Edit Details"
                        >
                          <MdOutlineEdit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          style={styles.actionBtn('rgba(16, 185, 129, 0.2)', '#6ee7b7')}
                          onClick={() => navigate(`/admin-dashboard/employee/salary/${emp._id}`)}
                          title="Salary Breakdown"
                        >
                          <MdOutlineAttachMoney size={14} />
                          <span>Salary</span>
                        </button>
                        <button
                          style={styles.actionBtn('rgba(14, 165, 233, 0.2)', '#7dd3fc')}
                          onClick={() => navigate(`/admin-dashboard/employee/leaves/${emp._id}`)}
                          title="Leave History"
                        >
                          <MdOutlineBeachAccess size={14} />
                          <span>Leaves</span>
                        </button>
                      </div>
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

export default List;