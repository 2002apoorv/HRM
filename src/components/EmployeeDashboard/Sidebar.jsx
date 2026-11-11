import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MdOutlineDashboard, MdOutlinePeople, MdOutlineApartment, MdOutlineBeachAccess, MdOutlineAttachMoney, MdOutlineSettings } from 'react-icons/md'
import { useAuth } from '../../context/authContext'

export const Sidebar = () => {

    const { user } = useAuth();

    const [showLottie, setShowLottie] = useState(false);

    const handleNavClick = () => {
        setShowLottie(true);
        setTimeout(() => setShowLottie(false), 900);
    };

    // Inline styles
    const styles = {
        sidebar: {
            width: '260px',
            background: 'rgb(76, 29, 149)',
            boxShadow: '2px 0 15px rgba(0,0,0,0.2)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1rem',
            fontFamily: 'Inter, sans-serif',
        },
        header: {
            color: '#f5f3ff', // Lighter violet tint
            fontWeight: 700,
            fontSize: '1.5rem',
            marginBottom: '2.5rem',
            textAlign: 'center',
            letterSpacing: '1px',
            fontFamily: "'Playfair Display', sans-serif",
        },
        nav: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
        },
        navLink: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: '#ddd6fe', // Lighter violet tint
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '1.08rem',
            transition: 'background 0.18s, color 0.18s',
        },
        navLinkActive: {
            background: 'linear-gradient(to right, #8b5cf6, #6366f1)', // from-violet-500 to-indigo-500
            color: '#fff',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
        },
        icon: {
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.1rem',
        },
        lottieOverlay: {
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7,
        },
        spinner: {
            width: '70px',
            height: '70px',
            border: '7px solid #e0e7ff',
            borderTop: '7px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            background: 'transparent',
        },
    };

    // Helper to set active style
    const getNavLinkStyle = ({ isActive }) =>
        isActive
            ? { ...styles.navLink, ...styles.navLinkActive }
            : styles.navLink;

    return (
        <>
            {showLottie && (
                <div style={styles.lottieOverlay}>
                    <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
                    <div style={styles.spinner}></div>
                </div>
            )}
            <div style={styles.sidebar}>
                <div style={styles.header}>
                    VORNIQ HRM
                </div>
                <div style={styles.nav}>
                    <NavLink to="/employee-dashboard" style={getNavLinkStyle} end onClick={handleNavClick}>
                        <div style={styles.icon}><MdOutlineDashboard size={24} color="#fff" /></div>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to={`/employee-dashboard/profile/${user._id}`} style={getNavLinkStyle} onClick={handleNavClick}>
                        <div style={styles.icon}><MdOutlinePeople size={24} color="#fff" /></div>
                        <span>My Profile</span>
                    </NavLink>

                    <NavLink to={`/employee-dashboard/leaves/${user._id}`} style={getNavLinkStyle} onClick={handleNavClick}>
                        <div style={styles.icon}><MdOutlineBeachAccess size={24} color="#fff" /></div>
                        <span>Leaves</span>
                    </NavLink>

                    <NavLink to={`/employee-dashboard/salary/${user._id}`} style={getNavLinkStyle} onClick={handleNavClick}>
                        <div style={styles.icon}><MdOutlineAttachMoney size={24} color="#fff" /></div>
                        <span>Salary</span>
                    </NavLink>
                    <NavLink to="/employee-dashboard/setting" style={getNavLinkStyle} onClick={handleNavClick}>
                        <div style={styles.icon}><MdOutlineSettings size={24} color="#fff" /></div>
                        <span>Setting</span>
                    </NavLink>
                </div>
            </div>
        </>
    )
}
