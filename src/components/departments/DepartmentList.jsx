import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineApartment,
  MdOutlineAddBusiness,
  MdOutlineSearch,
  MdOutlineEdit,
  MdOutlineDelete,
} from 'react-icons/md';

export const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/department');
      if (response.data.success) {
        setDepartments(response.data.departments || []);
      }
    } catch (err) {
      console.error('Fetch departments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = departments.filter((d) =>
    (d.dep_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      padding: '0.9rem 1rem',
      fontSize: '0.92rem',
      color: '#1e293b',
      borderBottom: '1px solid #f1f5f9',
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
        <div>
          <h1 style={styles.title}>Department Directory</h1>
          <p style={styles.subtitle}>
            Organize staff, manage departmental hierarchies, and division structures.
          </p>
        </div>

        <button style={styles.addBtn} onClick={() => navigate('/admin-dashboard/add-department')}>
          <MdOutlineAddBusiness size={18} />
          <span>Add Department</span>
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.searchBar}>
          <MdOutlineSearch size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by department name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading departments...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <MdOutlineApartment size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <div>No departments found.</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: '#94a3b8' }}>
              Click "Add Department" to create your first organizational unit.
            </div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.No</th>
                  <th style={styles.th}>Department Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((dep, index) => (
                  <tr key={dep._id || index}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'rgba(124, 58, 237, 0.2)',
                            color: '#c4b5fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MdOutlineApartment size={18} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{dep.dep_name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: dep.description ? '#cbd5e1' : '#64748b' }}>
                        {dep.description || 'No description provided'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {dep.createdAt ? new Date(dep.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
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

export default DepartmentList;