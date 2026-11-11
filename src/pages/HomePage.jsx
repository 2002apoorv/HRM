import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import {
  FiArrowRight,
  FiCheck,
  FiSearch,
  FiZap,
  FiShield,
  FiUsers,
  FiBox,
  FiTrendingUp,
  FiActivity,
  FiGlobe,
  FiStar,
  FiLock,
  FiChevronDown,
  FiCheckCircle,
  FiXCircle,
  FiLayers,
  FiCommand,
  FiExternalLink,
} from 'react-icons/fi';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Interactive tab state in Showcase
  const [activeTab, setActiveTab] = useState('all');
  const [emailInput, setEmailInput] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDepot, setActiveDepot] = useState('Rotterdam');

  const handleStartFree = (e) => {
    e?.preventDefault();
    if (user) {
      navigate('/apps');
    } else {
      navigate('/login', { state: { email: emailInput } });
    }
  };

  const handleLoginClick = () => {
    if (user) {
      navigate('/apps');
    } else {
      navigate('/login');
    }
  };

  const handleSandboxClick = () => {
    navigate('/login');
  };

  const quickLinks = [
    { title: 'HRM Suite — Employees & Payroll', route: user ? '/admin-dashboard' : '/login', category: 'Human Resources' },
    { title: 'Sales CRM & Deals Pipeline', route: user ? '/sales' : '/login', category: 'Sales' },
    { title: 'Inventory & Multi-Depot Logistics', route: user ? '/sales/inventory' : '/login', category: 'Operations' },
    { title: 'Point of Sale (POS) Touch Terminal', route: user ? '/sales/pos' : '/login', category: 'Commerce' },
    { title: 'Sign In / Authentication Portal', route: '/login', category: 'Security' },
    { title: 'Register New Workspace', route: '/register', category: 'Setup' },
  ];

  const filteredLinks = quickLinks.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a', overflowX: 'hidden' }}>
      {/* Search Modal */}
      {searchModalOpen && (
        <div
          onClick={() => setSearchModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '10vh',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '560px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 18px',
                borderBottom: '1px solid #f1f5f9',
                gap: '12px',
              }}
            >
              <FiSearch size={20} color="#64748b" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across Vorniq apps, features, or workflows..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#0f172a',
                }}
              />
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '3px 7px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  color: '#64748b',
                }}
              >
                ESC
              </span>
            </div>
            <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '10px 12px' }}>
              {filteredLinks.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchModalOpen(false);
                    navigate(item.route);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1e293b' }}>{item.title}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open <FiArrowRight size={14} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #eef2f6',
          padding: '0.75rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left Brand & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              {/* Brand Logo Cube */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
                }}
              >
                V
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px', color: '#0f172a' }}>
                Vorniq
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  marginLeft: '2px',
                }}
              >
                Vorniq Business OS
              </span>
            </div>

            {/* Navigation links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
              <div
                onClick={() => setSearchModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                Apps <FiChevronDown size={14} />
              </div>
              <a
                href="#suites"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Solutions
              </a>
              <a
                href="#comparison"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                Architecture
              </a>
              <a
                href="#workflow"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                Workflows
              </a>
              <span
                onClick={() => setSearchModalOpen(true)}
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Docs
              </span>
            </nav>
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Input Bar */}
            <div
              onClick={() => setSearchModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 12px',
                gap: '8px',
                cursor: 'pointer',
                width: '180px',
              }}
            >
              <FiSearch size={14} color="#94a3b8" />
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', flex: 1 }}>Search across Vorniq...</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  padding: '1px 5px',
                  color: '#64748b',
                }}
              >
                ⌘K
              </span>
            </div>

            {/* Community Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#f1f5f9',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
              }}
            >
              <FiGlobe size={14} color="#2563eb" />
              <span>Vorniq Community OS</span>
              <FiChevronDown size={12} color="#64748b" />
            </div>

            {/* Authentication Button: Login or Launch Dashboard */}
            {user ? (
              <button
                onClick={() => navigate('/apps')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  {user.name?.[0] || 'U'}
                </div>
                <span>Go to Apps</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleLoginClick}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  Sign In
                </button>

                <button
                  onClick={handleLoginClick}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Deploy Free</span>
                  <FiArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 1.5rem 2.5rem',
          textAlign: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(199, 210, 254, 0.45), rgba(255, 255, 255, 0))',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          {/* Release Badge */}
          <div
            onClick={handleLoginClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '9999px',
              padding: '6px 16px',
              marginBottom: '1.75rem',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
              }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1d4ed8' }}>
              Vorniq Business OS 3.0 • 100% Free & Open Source
            </span>
            <FiArrowRight size={13} color="#1d4ed8" />
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 1.12,
              color: '#0f172a',
              marginBottom: '1.25rem',
              margin: '0 auto 1.25rem',
              maxWidth: '850px',
            }}
          >
            One Unified Platform. Infinite Business Velocity.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: '680px',
              margin: '0 auto 2.2rem',
              fontWeight: 450,
            }}
          >
            Replace fragmented SaaS tools with Vorniq's connected ecosystem. Manage your people (HRM), accelerate
            pipelines (Sales), and optimize supply chains and inventory! completely free forever.
          </p>

          {/* Hero CTA Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            <button
              onClick={handleLoginClick}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4338ca)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.9rem 1.8rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(37, 99, 235, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(37, 99, 235, 0.4)';
              }}
            >
              <span>Deploy Vorniq Free</span>
              <span role="img" aria-label="rocket">
                🚀
              </span>
            </button>

            <button
              onClick={handleSandboxClick}
              style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '0.9rem 1.8rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              <FiActivity size={16} color="#6366f1" />
              <span>Explore Live Sandbox</span>
            </button>
          </div>

          {/* Trust Value Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.8rem',
              flexWrap: 'wrap',
              fontSize: '0.84rem',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiShield size={16} color="#10b981" />
              <span>100% Free Forever</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiLock size={16} color="#3b82f6" />
              <span>No Credit Card Required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiZap size={16} color="#8b5cf6" />
              <span>Unlimited Users & Records</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiUsers size={16} color="#f59e0b" />
              <span>Over 68,000 active organizations</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE CARD: "Live Ecosystem Synced Engine" */}
        <div
          style={{
            maxWidth: '1080px',
            margin: '3rem auto 0',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.9)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Card Top Window Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            {/* Window control dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginLeft: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                Live Ecosystem Synced Engine
              </span>
            </div>

            {/* App Suite Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {[
                { id: 'all', label: 'All Apps Overview' },
                { id: 'sales', label: 'Sales Engine' },
                { id: 'inventory', label: 'Inventory Matrix' },
                { id: 'hrm', label: 'HRM Suite' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    border: 'none',
                    borderRadius: '7px',
                    padding: '4px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sync Engine Flow Banner */}
          <div style={{ padding: '24px 28px', backgroundColor: '#ffffff' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              {/* Step 1: Sales Trigger */}
              <div
                onClick={handleLoginClick}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <FiTrendingUp size={15} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#6d28d9',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      SALES TRIGGER • Just now
                    </span>
                    <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, color: '#1e1b4b' }}>
                      Deal Won: Apex Robotics
                    </h4>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6d28d9' }}>
                  Enterprise contract executed & signed
                </p>
              </div>

              {/* Arrow Connector 1 */}
              <div style={{ textAlign: 'center', color: '#6366f1', fontSize: '0.75rem', fontWeight: 600 }}>
                <span
                  style={{
                    backgroundColor: '#eef2ff',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #c7d2fe',
                  }}
                >
                  0.12s sync →
                </span>
              </div>

              {/* Step 2: Inventory Action */}
              <div
                onClick={handleLoginClick}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <FiBox size={15} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#047857',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      INVENTORY ACTION • Zero-Latency
                    </span>
                    <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, color: '#064e3b' }}>
                      Warehouse 04 Allocation
                    </h4>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#047857' }}>
                  120 units reserved & dispatch slip queued
                </p>
              </div>

              {/* Arrow Connector 2 */}
              <div style={{ textAlign: 'center', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600 }}>
                <span
                  style={{
                    backgroundColor: '#eff6ff',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  Instant push →
                </span>
              </div>

              {/* Step 3: HRM Commission */}
              <div
                onClick={handleLoginClick}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <FiUsers size={15} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#1d4ed8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      HRM COMMISSION • Verified
                    </span>
                    <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, color: '#172554' }}>
                      Sarah Jenkins (AE)
                    </h4>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#1d4ed8' }}>
                  Performance milestone verified & logged to record
                </p>
              </div>
            </div>

            {/* Bottom 4 Feature Indicators */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiZap size={16} color="#6366f1" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  1.2ms <span style={{ color: '#64748b', fontWeight: 400 }}>Cross-App Sync</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiLayers size={16} color="#10b981" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  100% Open <span style={{ color: '#64748b', fontWeight: 400 }}>Open Data Core</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiShield size={16} color="#3b82f6" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  Granular <span style={{ color: '#64748b', fontWeight: 400 }}>Access Permissions</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiActivity size={16} color="#8b5cf6" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  360° Vision <span style={{ color: '#64748b', fontWeight: 400 }}>360° Audit Logs</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THREE SPECIALIZED SUITES */}
      <section
        id="suites"
        style={{
          padding: '6rem 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'left', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#4f46e5',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            INTEGRATED CORE ARCHITECTURE
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#0f172a',
              marginTop: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            Three specialized suites. Built natively on one synchronized heartbeat.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0, maxWidth: '780px' }}>
            Forget third-party connectors that break under pressure. Vorniq HRM, Sales CRM, and Inventory are engineered
            as one single codebase.
          </p>
        </div>

        {/* 3 Column Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Card 1: Autonomous HR & Staff Management */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(79, 70, 229, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    backgroundColor: '#f5f3ff',
                    color: '#7c3aed',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  People & Talent
                </span>
                <FiUsers size={20} color="#7c3aed" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.4px' }}>
                Autonomous HR & Staff Management
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Automated onboarding pipelines, real-time team disbursements, dynamic org matrices, and shift schedules
                assembled directly to workforce operations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
                {[
                  'Multi-team operations across multi-country entities',
                  'Shift matrix tagging linked to sales performance',
                  'Dynamic leave-off tracking with automated shift coverage',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                    <FiCheck size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Mini Widget */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>PTO Operations Resilience</span>
                <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>100% Processed</span>
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Pending Reviews: 24 Team PTO Requests
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', marginLeft: '6px' }}>
                  {['SJ', 'MV', 'ER', 'DK'].map((initials, i) => (
                    <div
                      key={i}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i],
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '-6px',
                        border: '2px solid #ffffff',
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleLoginClick}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#4f46e5',
                    cursor: 'pointer',
                  }}
                >
                  View 24 PTO Requests
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: High-Velocity Deal Flow & Execution */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#93c5fd';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Pipelines & Deals
                </span>
                <FiTrendingUp size={20} color="#2563eb" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.4px' }}>
                High-Velocity Deal Flow & Execution
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Lead scoring, fast quote-to-contract generation, customer 360 timelines, and automated stock validation
                directly from deal kanban cards.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
                {[
                  'Visual drag-and-drop pipeline with real-time forecast',
                  '1-click customer contracts with e-signature closing',
                  'Live warehouse reserves before signing quotes',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                    <FiCheck size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Mini Widget */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Q3 Active Deal Pipeline</span>
                <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>New Record Deal Close</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                3,420 Active Deals Managed
              </div>
              {/* Mini visual pipeline bars */}
              <div style={{ display: 'flex', height: '14px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
                <div style={{ width: '45%', backgroundColor: '#6366f1' }} title="Qualified (45%)" />
                <div style={{ width: '30%', backgroundColor: '#8b5cf6' }} title="Proposal (30%)" />
                <div style={{ width: '25%', backgroundColor: '#10b981' }} title="Won (25%)" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.72rem', color: '#64748b' }}>
                <span>Win Rate: 74.2%</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>Won - Quota (130%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Zero-Latency Stock & Multi-Hub Logistics */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#a7f3d0';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(5, 150, 105, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Supply Chain & Ops
                </span>
                <FiBox size={20} color="#059669" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.4px' }}>
                Zero-Latency Stock & Multi-Hub Logistics
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Dynamic multi-depot stock routing, barcode/RFID automated picking, real-time stock-out forecasts, and
                auto-triggered supplier purchase orders.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
                {[
                  'Multi-depot balancing across Rotterdam, Austin & Singapore',
                  'FIFO/LIFO automated batch orders and trace',
                  'Direct carrier API integrations (DHL, FedEx, UPS)',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                    <FiCheck size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Mini Widget */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Global Depot Capacity</span>
                <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>• Live Sync</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', marginBottom: '2px' }}>
                    <span>Rotterdam Central</span>
                    <span style={{ fontWeight: 600 }}>82%</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', backgroundColor: '#2563eb' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', marginBottom: '2px' }}>
                    <span>Austin Logistics Hub</span>
                    <span style={{ fontWeight: 600 }}>44%</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '44%', height: '100%', backgroundColor: '#6366f1' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', marginBottom: '2px' }}>
                    <span>Singapore Gateway</span>
                    <span style={{ fontWeight: 700, color: '#ef4444' }}>91% Critical</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '91%', height: '100%', backgroundColor: '#ef4444' }} />
                  </div>
                </div>
              </div>
              <button
                onClick={handleLoginClick}
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '5px 0',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#059669',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                1-Click Reorder PO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE MODERN ARCHITECTURE SHIFT (COMPARISON) */}
      <section
        id="comparison"
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: '#fafbfc',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#2563eb',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              THE MODERN ARCHITECTURE SHIFT
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-1px',
                color: '#0f172a',
                marginTop: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              The Disconnected SaaS Stack vs. Vorniq
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', margin: '0 auto', maxWidth: '640px' }}>
              Maintaining multiple separate vendors creates operational friction, siloed data leaks, and artificial restrictions.
            </p>
          </div>

          {/* Comparison Cards: Fragmented vs Vorniq */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Left Card: The Fragmented SaaS Chaos */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #fee2e2',
                padding: '32px',
                boxShadow: '0 8px 30px rgba(239, 68, 68, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444',
                  }}
                >
                  <FiXCircle size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#991b1b' }}>
                    The Fragmented SaaS Chaos
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#b91c1c' }}>Separate HR, CRM & Inventory vendors</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#7f1d1d', marginBottom: '4px' }}>
                    <FiZap size={15} color="#ef4444" />
                    <span>Frequent Zapier / API Breaks</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                    Stock sold out in CRM still displays available on webstores, resulting in customer escalations.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#7f1d1d', marginBottom: '4px' }}>
                    <FiLock size={15} color="#ef4444" />
                    <span>Vendor Lock-in & License Taxes</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                    Forced seat limits, tier-gating, and costly per-user licensing fees penalizing growing operational teams.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#7f1d1d', marginBottom: '4px' }}>
                    <FiLayers size={15} color="#ef4444" />
                    <span>Manual CSV Syncing</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                    Operations teams waste 18 hours/week reconciling inventory databases with operation ledgers.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#7f1d1d', marginBottom: '4px' }}>
                    <FiShield size={15} color="#ef4444" />
                    <span>Security Vulnerabilities</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                    Multiple vendor logins, fragmented 2FA policies, and unmanaged off-boarding permissions void.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: The Vorniq Open Standard */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #d1fae5',
                padding: '32px',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                  }}
                >
                  <FiCheckCircle size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#065f46' }}>
                    The Vorniq Open Standard
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#047857' }}>Single-source of truth architecture</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#064e3b', marginBottom: '4px' }}>
                    <FiCheck size={16} color="#10b981" />
                    <span>100% Free Forever</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                    Full unrestricted access to HRM, Sales, and Inventory with no artificial user caps, tier-gating, or paywalls.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#064e3b', marginBottom: '4px' }}>
                    <FiZap size={16} color="#10b981" />
                    <span>Instant Zero-Latency Execution</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                    Single unified codebase without fragile API connectors. A quote signed triggers inventory and team updates seamlessly.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#064e3b', marginBottom: '4px' }}>
                    <FiGlobe size={16} color="#10b981" />
                    <span>Zero License Overhead</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                    Unlimited seats, unlimited records, free community and self-hosted ready.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#064e3b', marginBottom: '4px' }}>
                    <FiShield size={16} color="#10b981" />
                    <span>Enterprise-Grade Security</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                    Granular RBAC, continuous audit logs, and SOC2-compliant architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: OPERATIONAL WALKTHROUGH */}
      <section
        id="workflow"
        style={{
          padding: '6rem 1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#4f46e5',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            OPERATIONAL WALKTHROUGH
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#0f172a',
              marginTop: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            How Work Flows In Vorniq
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', margin: '0 auto', maxWidth: '680px' }}>
            Observe how a simple client action effortlessly triggers synchronized actions across Sales, Inventory, and HR simultaneously.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontWeight: 800,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              01
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#2563eb',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              SALES ENGINE
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px' }}>
              Client Confirms Order
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              The deal closes in CRM. The order is automatically verified against stock availability across all global
              warehouses within 4 milliseconds.
            </p>
            <div
              style={{
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FiShield size={13} color="#2563eb" />
              <span>Enterprise Order #8130 Authenticated</span>
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontWeight: 800,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              02
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#059669',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              INVENTORY MATRIX
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px' }}>
              Stock Reserved & Picking Triggered
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Units are subtracted from available buffer. Nearest facility floor managers receive auto-hedge
              pick-and-pack routing notifications on handhelds.
            </p>
            <div
              style={{
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FiBox size={13} color="#059669" />
              <span>Austin Depot Slip #8132 Generated</span>
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                fontWeight: 800,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              03
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#7c3aed',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              HRM & TEAMS SYNC
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px' }}>
              Milestone & Shift Operations
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Team performance milestone automatically attributed to records and logistics shift rosters are dynamically
              updated without manual entry.
            </p>
            <div
              style={{
                backgroundColor: '#f5f3ff',
                color: '#5b21b6',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FiUsers size={13} color="#7c3aed" />
              <span>Milestone logged, shift roster updated</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: STATS BANNER */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #312e81, #1e1b4b, #2e1065)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 20px 40px -10px rgba(49, 46, 129, 0.4)',
          }}
        >
          <div>
            <div style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '4px' }}>
              4.2x
            </div>
            <div style={{ fontSize: '1rem', color: '#c7d2fe', fontWeight: 500 }}>
              Faster Fulfillment Cycles
            </div>
          </div>
          <div>
            <div style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '4px' }}>
              -68%
            </div>
            <div style={{ fontSize: '1rem', color: '#c7d2fe', fontWeight: 500 }}>
              Stock Discrepancies
            </div>
          </div>
          <div>
            <div style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '4px' }}>
              14 hrs
            </div>
            <div style={{ fontSize: '1rem', color: '#c7d2fe', fontWeight: 500 }}>
              Saved per Manager Each Week
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section style={{ padding: '0 1.5rem 6rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Testimonial 1 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '32px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem', color: '#10b981' }}>
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={18} fill="#10b981" />
              ))}
            </div>
            <p
              style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: '#334155',
                fontStyle: 'italic',
                marginBottom: '1.75rem',
              }}
            >
              "We retired Salesforce, BambooHR, and NetSuite in favor of Vorniq. Not only did it eliminate our recurring
              software subscription bills entirely, but our supply chain errors dropped to zero."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                MV
              </div>
              <div>
                <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Marcus Vance</h5>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>CTO at Kinetic Global Systems</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '32px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem', color: '#10b981' }}>
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={18} fill="#10b981" />
              ))}
            </div>
            <p
              style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: '#334155',
                fontStyle: 'italic',
                marginBottom: '1.75rem',
              }}
            >
              "Having HR shifts linked dynamically to warehouse stock arrival spikes changed the game. Vorniq provides
              enterprise power completely free."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                ER
              </div>
              <div>
                <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Elena Rostova</h5>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>VP of Global Logistics at NextGrid Supply</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: INSTANT DEPLOYMENT CTA */}
      <section style={{ padding: '0 1.5rem 6rem', maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '3.5rem 2rem',
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.06)',
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(224, 231, 255, 0.5), rgba(255, 255, 255, 1))',
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#4f46e5',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            INSTANT DEPLOYMENT
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#0f172a',
              marginTop: '0.5rem',
              marginBottom: '0.85rem',
            }}
          >
            Ready to run your entire business on Vorniq?
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#475569',
              maxWidth: '620px',
              margin: '0 auto 2.2rem',
              lineHeight: 1.6,
            }}
          >
            Spin up your dedicated instance in under 120 seconds. 100% free for startups, enterprises, and everyone in
            between with zero trial deadlines.
          </p>

          {/* Interactive Email Registration & Login input */}
          <form
            onSubmit={handleStartFree}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              maxWidth: '480px',
              margin: '0 auto 1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your work email..."
              required
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '0.85rem 1.2rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4f46e5')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #4338ca, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem 1.6rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
            >
              <span>Get Started Free</span>
              <FiArrowRight size={16} />
            </button>
          </form>

          {/* CTA Checklist */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.84rem',
              color: '#64748b',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCheck size={16} color="#10b981" />
              <span>Completely free forever</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCheck size={16} color="#10b981" />
              <span>Instant Setup</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCheck size={16} color="#10b981" />
              <span>No Credit Card Ever</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid #eef2f6',
          backgroundColor: '#fafbfc',
          padding: '4rem 1.5rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Footer Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                V
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>Vorniq</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#e2e8f0',
                  color: '#475569',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                Vorniq Business OS
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Unified, open business suite automating cross-departmental operations, Inventory Intelligence, and HRM.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiShield size={14} color="#10b981" />
                <span>SOC2 Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiShield size={14} color="#10b981" />
                <span>GDPR Compliant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiShield size={14} color="#10b981" />
                <span>ISO 27001</span>
              </div>
            </div>
          </div>

          {/* Product Suites */}
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Product Suites
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#64748b' }}>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Finance & Ledgers
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Human Resources & People
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Inventory & Multi-Warehouse
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Pipeline CRM & Queries
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Supply Chain Analytics
              </span>
            </div>
          </div>

          {/* Ecosystem & Cloud */}
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Ecosystem & Cloud
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#64748b' }}>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Developer APIs & SDKs
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Vorniq App Store
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                System Status
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Enterprise Connectors
              </span>
              <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                Security Portal
              </span>
            </div>
          </div>

          {/* Preferences & Locale */}
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Preferences & Locale
            </h5>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.84rem',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <FiGlobe size={14} color="#6366f1" />
              <span>English (US)</span>
              <FiChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            borderTop: '1px solid #eef2f6',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: '#94a3b8',
          }}
        >
          <div>© 2026 Vorniq Platforms Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Security Operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
