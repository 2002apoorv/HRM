import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';

export const AppLauncher = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSyncTab, setActiveSyncTab] = useState('all');
  const [comingSoonApp, setComingSoonApp] = useState(null);
  const [notified, setNotified] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  const orgName = user?.organization?.name || 'Vorniq Community OS';
  const orgCode = user?.organization?.code || 'ORG-001';
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const userName = user?.name || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase() || 'A';
  const userRole = user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Workspace` : 'Free Instance';

  // Keyboard shortcut: ⌘K or Ctrl+K focuses the search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAppLaunch = (app) => {
    if (app.isLive) {
      navigate(app.route);
    } else {
      setNotified(false);
      setComingSoonApp(app);
    }
  };

  const handleNotifyMe = () => {
    setNotified(true);
    setTimeout(() => {
      setComingSoonApp(null);
      setNotified(false);
    }, 1800);
  };

  const apps = [
    {
      id: 'hrm',
      title: 'Human Resources (HRM)',
      categoryKey: 'hrm',
      categoryLabel: 'Workforce & Payroll',
      badge: 'Core HR',
      status: 'Active',
      isLive: true,
      color: 'purple',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-100',
      btnClass: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30',
      actionText: 'Launch HRM Studio',
      route: isAdmin ? '/admin-dashboard' : '/employee-dashboard',
      description:
        'Complete workforce management suite with employee profiles, department hierarchies, leave approvals, and automated payroll processing.',
      workflows: [
        { emoji: '👥', label: 'Employee Directory' },
        { emoji: '🏢', label: 'Departments' },
        { emoji: '💳', label: 'Payroll & Salaries' },
        { emoji: '📅', label: 'Leave Requests' },
        { emoji: '⏱️', label: 'Attendance Ledger' },
      ],
      keywords: 'human resources hrm workforce payroll employee attendance department salary leave',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      id: 'sales',
      title: 'Sales & Inventory Studio',
      categoryKey: 'pos',
      categoryLabel: 'Commerce & Supply Chain',
      badge: 'Enterprise POS & Stock',
      status: 'Active',
      isLive: true,
      color: 'teal',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-100',
      btnClass: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30',
      actionText: 'Launch Sales & Inventory',
      route: '/sales',
      description:
        'End-to-end commerce operations: fast touch POS billing, product catalog, pharmacy batch & FEFO expiry allocation, purchases, and real-time inventory ledger.',
      workflows: [
        { emoji: '🏪', label: 'Point of Sale (POS)' },
        { emoji: '📦', label: 'Batch & Expiry Ledger' },
        { emoji: '🧾', label: 'Invoices & Returns' },
        { emoji: '🚚', label: 'Purchase Orders' },
        { emoji: '📊', label: 'Stock Analytics' },
      ],
      keywords: 'sales inventory commerce pos stock expiry batch fefo store billing catalog purchases',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <rect height="14" rx="2" width="20" x="2" y="3"></rect>
          <line x1="2" x2="22" y1="20" y2="20"></line>
          <line x1="6" x2="6" y1="8" y2="8.01"></line>
          <line x1="10" x2="10" y1="8" y2="8.01"></line>
          <line x1="14" x2="14" y1="8" y2="8.01"></line>
          <line x1="18" x2="18" y1="8" y2="8.01"></line>
          <line x1="8" x2="16" y1="12" y2="12"></line>
        </svg>
      ),
    },
    {
      id: 'mrp',
      title: 'Manufacturing (MRP)',
      categoryKey: 'mrp',
      categoryLabel: 'Manufacturing & Operations',
      badge: 'BOM & Routing',
      status: 'Roadmap',
      isLive: false,
      color: 'amber',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
      btnClass: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30',
      actionText: 'Launch MRP Studio',
      description:
        'Bills of materials (BOM), multi-stage work orders, routing sheets, scrap tracking, and real-time machine capacity management.',
      workflows: [
        { emoji: '⚙️', label: 'Bills of Materials' },
        { emoji: '🏭', label: 'Work Orders' },
        { emoji: '🔧', label: 'Maintenance' },
        { emoji: '📋', label: 'Quality Control' },
      ],
      keywords: 'manufacturing mrp bom routing work centers quality control maintenance scrap',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M4.93 19.07l2.12-2.12m9.9-9.9 2.12-2.12"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
      ),
    },
    {
      id: 'crm',
      title: 'CRM & Pipelines',
      categoryKey: 'pos',
      categoryLabel: 'Sales & Relationships',
      badge: 'Deals & Scoring',
      status: 'Roadmap',
      isLive: false,
      color: 'blue',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
      btnClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
      actionText: 'Launch CRM Studio',
      description:
        'Visual drag-and-drop kanban deal stages, lead scoring, quote generation, and unified customer 360 communication logs.',
      workflows: [
        { emoji: '🎯', label: 'Deals Pipeline' },
        { emoji: '📞', label: 'Lead Captures' },
        { emoji: '📑', label: 'Quotes & Proposals' },
        { emoji: '👥', label: 'Customer 360' },
      ],
      keywords: 'crm customer pipeline leads deals proposals quotes sales relationships kanban',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      ),
    },
    {
      id: 'accounting',
      title: 'Accounting & Ledger',
      categoryKey: 'accounting',
      categoryLabel: 'Financial Operations',
      badge: 'Double-Entry',
      status: 'Roadmap',
      isLive: false,
      color: 'indigo',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      btnClass: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30',
      actionText: 'Launch Accounting Suite',
      description:
        'Double-entry bookkeeping, chart of accounts, automated tax rules, multi-currency bank reconciliation, and live P&L balance sheets.',
      workflows: [
        { emoji: '📖', label: 'General Ledger' },
        { emoji: '🏦', label: 'Bank Feeds' },
        { emoji: '📊', label: 'Balance Sheets' },
        { emoji: '🧾', label: 'Tax Reporting' },
      ],
      keywords: 'accounting financial ledger bank taxes pnl general ledger double entry balance sheets',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          <line x1="12" x2="16" y1="6" y2="6"></line>
          <line x1="12" x2="16" y1="10" y2="10"></line>
        </svg>
      ),
    },
    {
      id: 'purchasing',
      title: 'Purchasing & Vendors',
      categoryKey: 'inventory',
      categoryLabel: 'Procurement & Inbound',
      badge: 'Procurement',
      status: 'Roadmap',
      isLive: false,
      color: 'rose',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-100',
      btnClass: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30',
      actionText: 'Launch Purchasing',
      description:
        'Automated RFQs, vendor price comparisons, purchase approvals, 3-way invoice matching, and supplier ratings.',
      workflows: [
        { emoji: '🛒', label: 'Quotation RFQs' },
        { emoji: '📜', label: 'Vendor Master' },
        { emoji: '📥', label: 'Goods Receipts' },
        { emoji: '💳', label: 'Vendor Bills' },
      ],
      keywords: 'purchasing vendor relations rfq procurement matching suppliers purchase orders',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
    },
    {
      id: 'documents',
      title: 'Document Vault & E-Sign',
      categoryKey: 'automation',
      categoryLabel: 'Productivity & Legal',
      badge: 'Smart OCR',
      status: 'Roadmap',
      isLive: false,
      color: 'cyan',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-100',
      btnClass: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/30',
      actionText: 'Launch Documents',
      description:
        'Secure digital asset management, automated document indexing, OCR parsing, and tamper-evident e-signing workflows.',
      workflows: [
        { emoji: '📂', label: 'Document Folders' },
        { emoji: '✍️', label: 'E-Sign Envelopes' },
        { emoji: '🔍', label: 'Smart OCR' },
      ],
      keywords: 'document vault digital signatures ocr envelopes pdf files legal',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" x2="8" y1="13" y2="13"></line>
          <line x1="16" x2="8" y1="17" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      id: 'automations',
      title: 'Automations & Webhooks',
      categoryKey: 'automation',
      categoryLabel: 'System Engine & APIs',
      badge: 'Low-Code Engine',
      status: 'Roadmap',
      isLive: false,
      color: 'emerald',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
      actionText: 'Launch Automations',
      description:
        'Event-driven triggers, custom scheduled cron jobs, RESTful webhook dispatchers, and automated internal notifications.',
      workflows: [
        { emoji: '⚡', label: 'Trigger Workflows' },
        { emoji: '🔗', label: 'Custom Webhooks' },
        { emoji: '📜', label: 'Audit Trail & Logs' },
      ],
      keywords: 'automation webhooks engine low code cron audit logs triggers apis',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m13 2-2 10h8L7 22l2-10H1L13 2z"></path>
        </svg>
      ),
    },
  ];

  // Filtering
  const filteredApps = apps.filter((app) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'hrm' && app.categoryKey === 'hrm') ||
      (activeCategory === 'pos' && app.categoryKey === 'pos') ||
      (activeCategory === 'inventory' && (app.categoryKey === 'inventory' || app.id === 'sales')) ||
      (activeCategory === 'mrp' && app.categoryKey === 'mrp') ||
      (activeCategory === 'accounting' && app.categoryKey === 'accounting') ||
      (activeCategory === 'automation' && app.categoryKey === 'automation');

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.title.toLowerCase().includes(q) ||
      app.categoryLabel.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.keywords.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="text-slate-800 min-h-screen flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800 antialiased"
      style={{
        backgroundColor: '#f8f9ff',
        backgroundImage: `
          radial-gradient(at 15% 10%, rgba(79, 70, 229, 0.07) 0px, transparent 40%),
          radial-gradient(at 85% 15%, rgba(139, 92, 246, 0.06) 0px, transparent 45%),
          radial-gradient(at 50% 90%, rgba(16, 185, 129, 0.04) 0px, transparent 50%)
        `,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* COMING SOON MODAL */}
      {comingSoonApp && (
        <div
          onClick={() => setComingSoonApp(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* App Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 shadow-sm border border-slate-200 mb-4">
              {comingSoonApp.icon}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
              <span>⏳</span> Coming Later in OS 3.5
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {comingSoonApp.title}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mt-1 mb-3">
              {comingSoonApp.categoryLabel}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {comingSoonApp.description}
            </p>

            {/* Workflows in this suite */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Included Workflows in Development:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {comingSoonApp.workflows.map((wf, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200"
                  >
                    <span>{wf.emoji}</span> {wf.label}
                  </span>
                ))}
              </div>
            </div>

            {notified ? (
              <div className="py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2">
                <span>✓</span> You're subscribed! We'll notify you on launch.
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setComingSoonApp(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Close
                </button>
                <button
                  onClick={handleNotifyMe}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/30"
                >
                  Notify Me When Live
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BEGIN: MainHeader */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 w-full border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Left Navigation Links */}
          <div className="flex items-center gap-6">
            <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4.5c1.45-1.47 4.5-2 4.5-2"></path>
                  <path d="M15 9V4s3.03.55 4.5 2c1.47 1.45 2 4.5 2 4.5"></path>
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">Vorniq</span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  OS 3.0
                </span>
              </div>
            </div>

            {/* Navigation Switchers & Items */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => navigate('/apps')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 text-slate-900 hover:bg-slate-200 transition"
              >
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <rect height="4" rx="1" width="4" x="3" y="3"></rect>
                  <rect height="4" rx="1" width="4" x="10" y="3"></rect>
                  <rect height="4" rx="1" width="4" x="17" y="3"></rect>
                  <rect height="4" rx="1" width="4" x="3" y="10"></rect>
                  <rect height="4" rx="1" width="4" x="10" y="10"></rect>
                  <rect height="4" rx="1" width="4" x="17" y="10"></rect>
                  <rect height="4" rx="1" width="4" x="3" y="17"></rect>
                  <rect height="4" rx="1" width="4" x="10" y="17"></rect>
                  <rect height="4" rx="1" width="4" x="17" y="17"></rect>
                </svg>
                <span>Apps</span>
                <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
              <button onClick={() => navigate('/')} className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">
                Solutions
              </button>
              <button onClick={() => navigate('/')} className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">
                Docs
              </button>
              <button onClick={() => navigate('/')} className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">
                Community
              </button>
            </nav>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across Vorniq apps, features, or records..."
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-14 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded font-mono shadow-xs">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Header Actions & Tenant Selector */}
          <div className="flex items-center gap-3 relative">
            {/* Community Tenant Pill Dropdown */}
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer text-xs font-medium text-slate-700"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
              <span className="text-slate-900 font-semibold">{orgName}</span>
              <span className="text-[10px] text-slate-400 font-mono">{orgCode}</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => alert('No new notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Notifications"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
            </button>

            {/* User Profile Pill & Dropdown Toggle */}
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-50">
                {userInitial}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-900 leading-tight">{userName}</p>
                <p className="text-[10px] text-slate-500 font-medium">{userRole}</p>
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            {userMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{userName}</p>
                  <p className="text-[11px] text-slate-500">{user?.email || 'admin@gmail.com'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                    {orgName} ({orgCode})
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition flex items-center justify-between"
                  >
                    <span>Vorniq Home Page</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition flex items-center justify-between font-semibold"
                  >
                    <span>Sign Out</span>
                    <span>⏻</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: MainContent */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Banner & Announcement Pill */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/90 border border-indigo-100 text-xs font-semibold text-indigo-700 shadow-xs mb-3 hover:bg-indigo-100/70 transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>Vorniq Business OS 3.0 • 100% Free &amp; Open Suite</span>
            <span className="text-indigo-400 font-normal">→</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            One Unified Workspace. All Business Apps.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            Launch modular business engines, configure permissions, or execute fast workflow actions. 100% free forever, zero licensing overhead.
          </p>

          {/* Trust Badge Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-slate-500 mt-4 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
              </svg>
              100% Free Forever
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              No Credit Card Required
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              Unlimited Users &amp; Records
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Core Engine: v3.2.0 (Online)
            </span>
          </div>
        </div>

        {/* BEGIN: Live Sync Engine & Architecture Telemetry Strip */}
        <div className="mb-8 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-card max-w-[1720px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5 mr-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Live Ecosystem Sync Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Zero-Latency Heartbeat
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              {[
                { id: 'all', label: 'All Apps Synced' },
                { id: 'sales', label: 'Sales Matrix' },
                { id: 'inventory', label: 'Inventory Ledger' },
                { id: 'hrm', label: 'HRM Suite' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSyncTab(tab.id)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    activeSyncTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sync Pipeline Event Cards Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            {/* Event 1 */}
            <div
              onClick={() => handleAppLaunch(apps[1])}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs cursor-pointer hover:bg-slate-100/70 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase text-indigo-600 tracking-wider">
                    Sales Trigger • Just now
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">0.12s sync</span>
                </div>
                <p className="font-semibold text-slate-900 truncate">Deal Won: Apex Robotics</p>
                <p className="text-[11px] text-slate-500 truncate">Enterprise contract executed &amp; signed</p>
              </div>
            </div>

            {/* Event 2 */}
            <div
              onClick={() => handleAppLaunch(apps[1])}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs cursor-pointer hover:bg-slate-100/70 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect height="14" rx="2" width="20" x="2" y="3"></rect>
                  <line x1="2" x2="22" y1="20" y2="20"></line>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase text-teal-600 tracking-wider">
                    Inventory Action • Zero-delay
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Auto</span>
                </div>
                <p className="font-semibold text-slate-900 truncate">Warehouse D4 Allocation</p>
                <p className="text-[11px] text-slate-500 truncate">120 units reserved &amp; dispatch slip queued</p>
              </div>
            </div>

            {/* Event 3 */}
            <div
              onClick={() => handleAppLaunch(apps[0])}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs cursor-pointer hover:bg-slate-100/70 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase text-purple-600 tracking-wider">
                    HRM Automation • Verified
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">100% Core</span>
                </div>
                <p className="font-semibold text-slate-900 truncate">Commission &amp; Milestone Log</p>
                <p className="text-[11px] text-slate-500 truncate">Sales lead tagged &amp; team roster synced</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-center sm:text-left">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/50">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">1.2ms Sync</p>
                <p className="text-[10px] text-slate-500">Cross-App Realtime</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/50">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">100% Open</p>
                <p className="text-[10px] text-slate-500">Unified Data Core</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/50">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Granular RBAC</p>
                <p className="text-[10px] text-slate-500">Access Permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/50">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">360° Vision</p>
                <p className="text-[10px] text-slate-500">Continuous Audit Logs</p>
              </div>
            </div>
          </div>
        </div>
        {/* END: Live Sync Engine */}

        {/* Category Filter Tabs Navigation */}
        <section className="mb-7">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {[
                { id: 'all', label: `All Apps (${apps.length})` },
                { id: 'hrm', label: 'Workforce & HRM' },
                { id: 'pos', label: 'Commerce & POS' },
                { id: 'inventory', label: 'Inventory & Supply Chain' },
                { id: 'mrp', label: 'Manufacturing (MRP)' },
                { id: 'accounting', label: 'Accounting & Finance' },
                { id: 'automation', label: 'System & Automation' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs transition whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'font-bold bg-indigo-600 text-white shadow-sm'
                      : 'font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/90'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>8 Engines Online</span>
            </div>
          </div>
        </section>

        {/* BEGIN: AppGrid (Light Modern SaaS Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6" id="appsGrid">
          {filteredApps.map((app) => (
            <article
              key={app.id}
              className="bg-white border border-slate-200/85 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-300 relative group"
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-start gap-4">
                  {/* App Icon */}
                  <div
                    className={`w-13 h-13 p-3 rounded-xl border shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${app.iconBg}`}
                  >
                    {app.icon}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex-1">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider block mb-0.5 text-${app.color}-600`}
                    >
                      {app.categoryLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {app.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${app.badgeClass}`}>
                        {app.badge}
                      </span>
                      {app.isLive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Coming Later
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mt-4">{app.description}</p>

                {/* Workflows Chips */}
                <div className="mt-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    Included Workflows
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {app.workflows.map((wf, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAppLaunch(app)}
                        className="pill-chip px-3 py-1 rounded-lg text-xs font-medium text-slate-700 inline-flex items-center gap-1.5 cursor-pointer text-left"
                      >
                        <span>{wf.emoji}</span> {wf.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <div className="mt-7 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleAppLaunch(app)}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-sm transition-all flex items-center justify-center gap-2 group/btn ${app.btnClass}`}
                >
                  <span>{app.actionText}</span>
                  <svg
                    className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </section>
        {/* END: AppGrid */}

        {/* Ready to deploy callout container */}
        <div className="mt-14 mb-4 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 text-center max-w-4xl mx-auto shadow-card">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200">
            Instant Deployment
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-3">
            Ready to run your entire business on Vorniq?
          </h3>
          <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto">
            Spin up your dedicated instance in under 120 seconds. 100% free for startups, enterprises, and everyone with zero trial deadlines.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
            <input
              className="w-full sm:flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              placeholder="Enter your work email..."
              type="email"
            />
            <button
              onClick={() => alert('Work email registered for cloud notifications!')}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition whitespace-nowrap"
            >
              Get Started Free →
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
            <span>✓ Completely free forever</span>
            <span>•</span>
            <span>✓ Instant setup</span>
            <span>•</span>
            <span>✓ No credit card ever</span>
          </div>
        </div>
      </main>
      {/* END: MainContent */}

      {/* BEGIN: Clean Light Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  V
                </div>
                <span className="font-display font-bold text-base text-slate-900">Vorniq</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">Free OS</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                Unified, open business suite automating cross-departmental operations, inventory intelligence, and HRM.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-1">🛡️ SOC2 Certified</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">🔒 GDPR Compliant</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">⚡ ISO 27001</span>
              </div>
            </div>

            {/* Product Suites */}
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Product Suites</p>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/sales')} className="hover:text-indigo-600 transition text-left">Financial Ledgers</button></li>
                <li><button onClick={() => navigate('/admin-dashboard')} className="hover:text-indigo-600 transition text-left">Human Resources &amp; People</button></li>
                <li><button onClick={() => navigate('/sales/inventory')} className="hover:text-indigo-600 transition text-left">Inventory &amp; Multi-Warehouse</button></li>
                <li><button onClick={() => navigate('/sales')} className="hover:text-indigo-600 transition text-left">Pipeline CRM &amp; Quotes</button></li>
                <li><button onClick={() => navigate('/sales/reports')} className="hover:text-indigo-600 transition text-left">Supply Chain Analytics</button></li>
              </ul>
            </div>

            {/* Ecosystem & Cloud */}
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Ecosystem &amp; Cloud</p>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="hover:text-indigo-600 transition text-left">Developer API &amp; SDKs</button></li>
                <li><button onClick={() => navigate('/')} className="hover:text-indigo-600 transition text-left">Vorniq App Store</button></li>
                <li><button onClick={() => navigate('/')} className="hover:text-indigo-600 transition text-left">System Status</button></li>
                <li><button onClick={() => navigate('/')} className="hover:text-indigo-600 transition text-left">Enterprise Connectors</button></li>
                <li><button onClick={() => navigate('/')} className="hover:text-indigo-600 transition text-left">Security Portal</button></li>
              </ul>
            </div>

            {/* Preferences & Locale */}
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Preferences &amp; Locale</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs cursor-pointer">
                  <span>🌐 English (US)</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 block mb-0.5">Self-Hosted Community Node</span>
                  <span>PostgreSQL 16 Engine • Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright & Sub-footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © 2026 Vorniq Platforms Inc. All modules licensed under open standard. Free Forever.
            </div>
            <div className="flex items-center gap-5">
              <span className="hover:text-slate-600 transition cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-600 transition cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-600 transition cursor-pointer">Security Operations</span>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Clean Light Footer */}
    </div>
  );
};
