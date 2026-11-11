import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Preloader from '../components/Preloader';
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowLeft, FiShield } from 'react-icons/fi';

export const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickFill = () => {
    setEmail('admin@gmail.com');
    setPassword('admin');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    // Normalize 'admin' username to 'admin@gmail.com' for seamless authentication
    const normalizedInput = email.trim().toLowerCase();
    const emailToSend = normalizedInput === 'admin' ? 'admin@gmail.com' : email.trim();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: emailToSend,
        password,
      });

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem('token', response.data.token);

        // Redirect directly to central Application Launcher
        setTimeout(() => {
          navigate('/apps');
        }, 600);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || 'Invalid credentials or server error. Please try again.'
      );
    }
  };

  return (
    <>
      {loading && <Preloader />}

      {!loading && (
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1f0b2e 0%, #151138 45%, #0b0f19 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Glow Background Orbs */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '20%',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          {/* Central Glassmorphic Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
              padding: '2.5rem 2.2rem',
              borderRadius: '24px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              width: '100%',
              maxWidth: '430px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Top Navigation: Back to Home */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                to="/"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  transition: 'color 0.15s, transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateX(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <FiArrowLeft size={14} />
                <span>Back to Vorniq Home</span>
              </Link>

              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#818cf8',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                }}
              >
                v3.0 Free Core
              </span>
            </div>

            {/* Rocket Icon Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 60%, #6366f1 100%)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.85rem',
                  boxShadow: '0 10px 25px -4px rgba(236, 72, 153, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <span role="img" aria-label="rocket">
                  🚀
                </span>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <h2
              style={{
                color: '#ffffff',
                textAlign: 'center',
                margin: '0 0 0.35rem',
                fontSize: '1.85rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
            >
              Vorniq Business OS
            </h2>
            <p
              style={{
                color: '#c4b5fd',
                textAlign: 'center',
                margin: '0 0 1.5rem',
                fontSize: '0.9rem',
                lineHeight: 1.4,
              }}
            >
              Multi-Tenant HRM + Sales & Inventory Platform
            </p>

            {/* Quick Demo Fill Pill */}
            <div
              onClick={handleQuickFill}
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '10px',
                padding: '8px 12px',
                marginBottom: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
              title="Click to automatically fill default demo admin credentials"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem' }}>⚡</span>
                <span style={{ fontSize: '0.82rem', color: '#e0e7ff', fontWeight: 600 }}>
                  Demo Admin: <span style={{ color: '#a78bfa', fontWeight: 400 }}>admin@gmail.com / admin</span>
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 700 }}>Auto Fill</span>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  fontSize: '0.86rem',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} autoComplete="on">
              {/* Email / Username Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    color: '#e2e8f0',
                    marginBottom: '0.45rem',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="admin@gmail.com"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.85rem 1rem',
                      border: '1px solid rgba(196, 181, 253, 0.3)',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      outline: 'none',
                      transition: 'border 0.2s, box-shadow 0.2s, background-color 0.2s',
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.25)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(196, 181, 253, 0.3)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label
                    htmlFor="password"
                    style={{
                      color: '#e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                    }}
                  >
                    Password
                  </label>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.85rem 2.8rem 0.85rem 1rem',
                      border: '1px solid rgba(196, 181, 253, 0.3)',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      outline: 'none',
                      transition: 'border 0.2s, box-shadow 0.2s, background-color 0.2s',
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.25)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(196, 181, 253, 0.3)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  />
                  {/* Eye toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.9rem 0',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 60%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.2s',
                  boxShadow: '0 8px 24px -4px rgba(139, 92, 246, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(139, 92, 246, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(139, 92, 246, 0.5)';
                }}
              >
                <span>Sign In to Platform</span>
              </button>
            </form>

            {/* Footer Registration Link */}
            <div
              style={{
                marginTop: '1.8rem',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.88rem',
              }}
            >
              <span>New organization? </span>
              <Link
                to="/register"
                style={{
                  color: '#a78bfa',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c084fc')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a78bfa')}
              >
                Register Workspace
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
