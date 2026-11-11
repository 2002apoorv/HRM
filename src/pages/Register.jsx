import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Preloader from '../components/Preloader';

export const Register = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #311042, #1e1b4b, #0f172a)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '1.5rem',
    },
    card: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(139,92,246,0.06) 100%)',
      padding: '2.5rem',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px)',
      width: '100%',
      maxWidth: '460px',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    logoBadge: {
      background: 'linear-gradient(135deg, #10b981, #6366f1)',
      width: '54px',
      height: '54px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
    },
    heading: {
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '0.4rem',
      fontSize: '1.85rem',
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    subheading: {
      color: '#c4b5fd',
      textAlign: 'center',
      marginBottom: '1.8rem',
      fontSize: '0.92rem',
    },
    formGroup: {
      marginBottom: '1.2rem',
    },
    label: {
      display: 'block',
      color: '#e2e8f0',
      marginBottom: '0.4rem',
      fontWeight: 500,
      fontSize: '0.88rem',
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.75rem 1rem',
      border: '1px solid rgba(196, 181, 253, 0.3)',
      borderRadius: '10px',
      fontSize: '0.95rem',
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.07)',
      outline: 'none',
      transition: 'border 0.2s, box-shadow 0.2s',
    },
    button: {
      width: '100%',
      padding: '0.85rem 0',
      background: 'linear-gradient(to right, #10b981, #6366f1)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.05rem',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '1.2rem',
      transition: 'transform 0.15s, box-shadow 0.2s',
      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      color: '#fca5a5',
      padding: '0.7rem 1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.88rem',
      textAlign: 'center',
    },
    footerLinks: {
      marginTop: '1.8rem',
      textAlign: 'center',
      color: '#cbd5e1',
      fontSize: '0.9rem',
    },
    link: {
      color: '#a78bfa',
      textDecoration: 'none',
      fontWeight: 600,
    },
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        organizationName,
        name,
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem('token', response.data.token);

        setTimeout(() => {
          navigate('/apps');
        }, 800);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || 'Registration failed. Please check your details.'
      );
    }
  };

  return (
    <>
      {loading && <Preloader />}

      {!loading && (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.logo}>
              <div style={styles.logoBadge}>🏢</div>
            </div>
            <h2 style={styles.heading}>Create Workspace</h2>
            <p style={styles.subheading}>Register your organization & administrator account</p>

            {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

            <form onSubmit={handleRegister} autoComplete="on">
              <div style={styles.formGroup}>
                <label htmlFor="orgName" style={styles.label}>
                  Organization / Company Name
                </label>
                <input
                  type="text"
                  id="orgName"
                  placeholder="e.g. Apex Health Clinics Ltd"
                  required
                  style={styles.input}
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="adminName" style={styles.label}>
                  Administrator Full Name
                </label>
                <input
                  type="text"
                  id="adminName"
                  placeholder="e.g. Dr. Jane Smith"
                  required
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Work Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="admin@apexclinic.com"
                  required
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Master Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  minLength={5}
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" style={styles.button}>
                Create Organization Workspace
              </button>
            </form>

            <div style={styles.footerLinks}>
              <span>Already have an account? </span>
              <Link to="/login" style={styles.link}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
