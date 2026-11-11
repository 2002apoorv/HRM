import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlineBeachAccess,
  MdOutlineSearch,
  MdOutlineVisibility,
  MdOutlineCheckCircle,
  MdOutlineCancel,
  MdOutlineHourglassBottom,
} from 'react-icons/md';

export const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, Pending, Approved, Rejected
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leave');
      if (response.data.success) {
        setLeaves(response.data.leaves || []);
      }
    } catch (err) {
      console.error('Fetch leaves error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const statusMatch =
      activeTab === 'ALL' ||
      (leave.status || '').toLowerCase() === activeTab.toLowerCase();

    const empName = leave.employeeId?.userId?.name || '';
    const empId = leave.employeeId?.employeeId || '';
    const leaveType = leave.leaveType || '';
    const q = searchTerm.toLowerCase();

    const searchMatch =
      empName.toLowerCase().includes(q) ||
      empId.toLowerCase().includes(q) ||
      leaveType.toLowerCase().includes(q);

    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') {
      return (
        <span
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#6ee7b7',
            padding: '0.25rem 0.65rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <MdOutlineCheckCircle size={14} />
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
            padding: '0.25rem 0.65rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <MdOutlineCancel size={14} />
          Rejected
        </span>
      );
    }
    return (
      <span
        style={{
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#fcd34d',
          padding: '0.25rem 0.65rem',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
      >
        <MdOutlineHourglassBottom size={14} />
        Pending
      </span>
    );
  };

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
    tabBar: {
      display: 'flex',
      gap: '0.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      paddingBottom: '1rem',
      marginBottom: '1.5rem',
    },
    tabBtn: (active) => ({
      padding: '0.5rem 1.1rem',
      borderRadius: '10px',
      border: 'none',
      background: active ? 'rgba(124, 58, 237, 0.3)' : 'transparent',
      color: active ? '#c4b5fd' : '#94a3b8',
      fontWeight: active ? 700 : 500,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }),
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      background: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      padding: '0.6rem 1rem',
      marginBottom: '1.5rem',
      maxWidth: '450px',
    },
    searchInput: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#fff',
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
    reviewBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.35rem',
      background: 'rgba(124, 58, 237, 0.2)',
      color: '#c4b5fd',
      border: '1px solid rgba(167, 139, 250, 0.3)',
      borderRadius: '8px',
      padding: '0.4rem 0.8rem',
      fontSize: '0.82rem',
      fontWeight: 600,
      cursor: 'pointer',
    },
  };

  const tabs = [
    { id: 'ALL', label: 'All Requests' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Approved', label: 'Approved' },
    { id: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Leave Management</h1>
          <p style={styles.subtitle}>Review time-off requests, sick leaves, and annual vacations.</p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={styles.tabBtn(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.searchBar}>
          <MdOutlineSearch size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by employee name, ID, or leave type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading leave applications...</div>
        ) : filteredLeaves.length === 0 ? (
          <div style={styles.emptyState}>
            <MdOutlineBeachAccess size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <div>No leave applications found for this filter.</div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.No</th>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Leave Type</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Period</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave, index) => (
                  <tr key={leave._id || index}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>
                          {leave.employeeId?.userId?.name || 'Staff Member'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {leave.employeeId?.employeeId}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                        }}
                      >
                        {leave.leaveType}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {leave.employeeId?.department?.dep_name || 'General'}
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontSize: '0.85rem' }}>
                        {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : ''} -{' '}
                        {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : ''}
                      </span>
                    </td>
                    <td style={styles.td}>{getStatusBadge(leave.status)}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.reviewBtn}
                        onClick={() => navigate(`/admin-dashboard/leaves/${leave._id}`)}
                      >
                        <MdOutlineVisibility size={14} />
                        <span>Review</span>
                      </button>
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

export default Table;
