import React from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import { MdApps, MdBusiness, MdOutlinePointOfSale } from 'react-icons/md';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const orgName = user?.organization?.name || 'Primary Enterprise';

  const styles = {
    navbar: {
      background: 'rgb(76, 29, 149)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0.7rem 0',
      boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      fontFamily: 'Inter, sans-serif',
      position: 'fixed',
      width: '81%',
      zIndex: 1000,
    },
    navbarContent: {
      width: '100%',
      maxWidth: '1400px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
    },
    leftGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
    },
    launcherBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      background: 'rgba(255, 255, 255, 0.15)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '8px',
      padding: '0.45rem 0.85rem',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    orgBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.35rem',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '0.35rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.82rem',
      color: '#ddd6fe',
      fontWeight: 500,
    },
    welcome: {
      color: '#f5f3ff',
      fontWeight: 600,
      fontSize: '1.05rem',
    },
    rightGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    switchSalesBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      background: 'linear-gradient(to right, #059669, #0284c7)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
    },
    logoutBtn: {
      background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 1.2rem',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
      boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
    },
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.navbarContent}>
        <div style={styles.leftGroup}>
          <button
            style={styles.launcherBtn}
            onClick={() => navigate('/apps')}
            title="Return to Application Launcher"
          >
            <MdApps size={20} />
            <span>App Launcher</span>
          </button>

          <div style={styles.orgBadge}>
            <MdBusiness size={15} />
            <span>{orgName}</span>
          </div>

          <p style={styles.welcome}>Welcome, {user?.name || 'User'}</p>
        </div>

        <div style={styles.rightGroup}>
          <button
            style={styles.switchSalesBtn}
            onClick={() => navigate('/sales')}
            title="Switch to Sales & Inventory Module"
          >
            <MdOutlinePointOfSale size={18} />
            <span>Sales & Inventory</span>
          </button>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
