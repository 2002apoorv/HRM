import React from 'react'
import { useAuth } from '../../context/authContext.jsx';

export const Navbar = () => {
    const { user, logout, loading } = useAuth();

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
            maxWidth: '1400px', // or any max-width you prefer
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 2rem', // Horizontal padding
        },
        welcome: {
            color: '#f5f3ff',
            fontWeight: 600,
            fontSize: '1.1rem',
        },
        button: {
            background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1.2rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
        }
    };

    return (
        <div style={styles.navbar}>
            <div style={styles.navbarContent}>
                <p style={styles.welcome}>
                    Welcome {user.name}
                </p>
                <button style={styles.button} onClick={logout}>Logout</button>
            </div>
        </div>
    );
};
