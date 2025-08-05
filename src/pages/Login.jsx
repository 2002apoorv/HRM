import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader'; // ✅ Import Preloader

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ✅ Controls Preloader

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #4c1d95, #3730a3, #1e3a8a)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
    },
    card: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 60%, rgba(139,92,246,0.08) 100%)',
      padding: '2.5rem',
      borderRadius: '20px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      minWidth: '340px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      backdropFilter: 'blur(12px)',
      width: '100%',
      maxWidth: '400px',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1.2rem',
    },
    logoImg: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
    },
    heading: {
      color: '#f5f3ff',
      textAlign: 'center',
      marginBottom: '2rem',
      fontFamily: "'Playfair Display', serif",
      fontSize: '2rem',
      letterSpacing: '0.5px',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#ddd6fe',
      marginBottom: '0.5rem',
      fontWeight: 500,
    },
    input: {
      width: '92%',
      padding: '0.75rem 1rem',
      border: '1px solid #c4b5fd',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#ede9fe',
      background: 'rgba(255, 255, 255, 0.05)',
      outline: 'none',
      marginBottom: '0.5rem',
      transition: 'border 0.2s',
    },
    button: {
      width: '100%',
      padding: '0.75rem 0',
      background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '1rem',
      transition: 'background 0.2s, box-shadow 0.2s',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.10)',
    },
    buttonHover: {
      background: 'linear-gradient(to right, #7c3aed, #8b5cf6)',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.18)',
    },
    link: {
      color: '#c4b5fd',
      textDecoration: 'none',
      fontSize: '0.98rem',
    },
    rememberMeLabel: {
      color: '#ddd6fe',
      fontWeight: 500,
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '1.5rem 0',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(139, 92, 246, 0.15)',
      border: 'none',
    },
    dividerText: {
      margin: '0 1rem',
      color: '#a78bfa',
      fontWeight: 500,
      fontSize: '0.95rem',
    },
    footer: {
      marginTop: '2rem',
      textAlign: 'center',
      color: '#ede9fe',
      fontSize: '0.95rem',
      opacity: 0.8,
    },
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show Preloader
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem('token', response.data.token);

        setTimeout(() => {
          if (response.data.user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/employee-dashboard');
          }
        }, 2000); // Wait 2s for loader to play
      }
    } catch (error) {
      console.error(error);
      setLoading(false); // hide loader on error
      alert('Invalid credentials or server error.');
    }
  };

  return (
    <>
      {loading && <Preloader />} {/* ✅ Show Preloader on login */}

      {!loading && (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.logo}>
              <img src="/vite.svg" alt="Logo" style={styles.logoImg} />
            </div>
            <h2 style={styles.heading}>Employee Management</h2>
            <form onSubmit={handleSubmit} autoComplete="on">
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="*******"
                  required
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}>
                <label style={styles.rememberMeLabel}>
                  <input type="checkbox" name="remember" style={{ marginRight: '0.5rem' }} />
                  Remember me
                </label>
                <div>
                  <a href="#" style={styles.link}>Forgot password?</a>
                </div>
              </div>
              <button
                type="submit"
                style={isButtonHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                Login
              </button>
            </form>
            
            <div style={styles.footer}>
              &copy; {new Date().getFullYear()} Employee Management. Need help?{' '}
              <a href="#" style={styles.link}>Contact support</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
