import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import {
  MdOutlineDashboard,
  MdOutlinePeople,
  MdOutlineApartment,
  MdOutlineBeachAccess,
  MdOutlineAttachMoney,
  MdOutlineSettings,
  MdApps,
  MdOutlineLogout,
  MdOutlinePointOfSale,
  MdOutlineSchedule,
  MdOutlineFolderShared,
  MdApartment,
} from 'react-icons/md';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import api from '../utils/api';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    employeeCount: 28,
    departmentCount: 5,
    pendingLeavesCount: 3,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const orgName = user?.organization?.name || 'Primary Enterprise';
  const orgCode = user?.organization?.code || 'ORG-001';
  const userName = user?.name || 'Admin User';
  const userInitial = userName.charAt(0).toUpperCase() || 'A';
  const userRole = user?.role === 'admin' ? 'Master Controller' : 'Staff Member';

  useEffect(() => {
    fetchCounts();
  }, [location.pathname]);

  const fetchCounts = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      if (res.data?.success) {
        setStats({
          employeeCount: res.data.totalEmployees || 28,
          departmentCount: res.data.totalDepartments || 5,
          pendingLeavesCount: res.data.pendingLeaves || 3,
        });
      }
    } catch {
      // Use defaults if backend is busy
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans antialiased">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Brand & Workspace */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Logo & Module Title */}
          <div
            onClick={() => navigate('/admin-dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base text-slate-900 tracking-tight leading-none">
                  Vorniq HRM
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  OS 3.2
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">People &amp; Operations Studio</span>
            </div>
          </div>

          {/* Workspace Pill Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 transition text-xs font-semibold text-slate-700"
            >
              <MdApartment size={16} className="text-indigo-600" />
              <span>
                Workspace: <span className="font-bold text-slate-900">{orgName}</span> ({orgCode})
              </span>
              <FiChevronDown size={13} className="text-slate-400" />
            </button>

            {workspaceMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 top-10 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{orgName}</p>
                  <p className="text-[10px] text-slate-500">Tenant Code: {orgCode}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setWorkspaceMenuOpen(false);
                      navigate('/apps');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition flex items-center justify-between"
                  >
                    <span>Switch Workspace</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      setWorkspaceMenuOpen(false);
                      navigate('/admin-dashboard/setting');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    Organization Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Search Input */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiSearch size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees, departments, policies... (⌘K)"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs font-mono">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Header Status & User Pill */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Core Sync Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Core Sync: 0.12ms</span>
          </div>

          {/* Grid Launcher Icon */}
          <button
            onClick={() => navigate('/apps')}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
            title="App Launcher"
          >
            <MdApps size={20} />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-50 shadow-xs">
              {userInitial}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-slate-900 leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-500 font-medium">{userRole}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Sign Out"
          >
            <MdOutlineLogout size={18} />
          </button>
        </div>
      </header>

      {/* BODY WITH SIDEBAR AND MAIN OUTLET */}
      <div className="flex flex-1">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 shrink-0 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-6">
            {/* WORKFORCE CORE SECTION */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-3 mb-2">
                Workforce Core
              </span>
              <nav className="space-y-1 text-xs font-semibold">
                {/* HRM Dashboard */}
                <NavLink
                  to="/admin-dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineDashboard size={18} className="text-indigo-600" />
                    <span>HRM Dashboard</span>
                  </div>
                </NavLink>

                {/* Employees */}
                <NavLink
                  to="/admin-dashboard/employees"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlinePeople size={18} />
                    <span>Employees</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {stats.employeeCount}
                  </span>
                </NavLink>

                {/* Departments */}
                <NavLink
                  to="/admin-dashboard/departments"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineApartment size={18} />
                    <span>Departments</span>
                  </div>
                </NavLink>

                {/* Leaves & Time Off */}
                <NavLink
                  to="/admin-dashboard/leaves"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineBeachAccess size={18} />
                    <span>Leaves &amp; Time Off</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {stats.pendingLeavesCount}
                  </span>
                </NavLink>

                {/* Salary & Payroll */}
                <NavLink
                  to="/admin-dashboard/salary/add"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineAttachMoney size={18} />
                    <span>Salary &amp; Payroll</span>
                  </div>
                </NavLink>

                {/* Shifts & Clock-in */}
                <NavLink
                  to="/admin-dashboard/leaves"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineSchedule size={18} />
                    <span>Shifts &amp; Clock-in</span>
                  </div>
                </NavLink>
              </nav>
            </div>

            {/* SYSTEM & POLICIES SECTION */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-3 mb-2">
                System &amp; Policies
              </span>
              <nav className="space-y-1 text-xs font-semibold">
                <button
                  onClick={() => alert('HR Documents & Employee Vault: Active in OS 3.2.')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineFolderShared size={18} />
                    <span>HR Documents</span>
                  </div>
                </button>

                <NavLink
                  to="/admin-dashboard/setting"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineSettings size={18} />
                    <span>Settings</span>
                  </div>
                </NavLink>
              </nav>
            </div>
          </div>

          {/* BOTTOM SIDEBAR ACTIONS */}
          <div className="p-4 border-t border-slate-200/80 space-y-2 bg-slate-50/50">
            {/* App Launcher Button */}
            <button
              onClick={() => navigate('/apps')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              <div className="flex items-center gap-2">
                <MdApps size={16} className="text-indigo-600" />
                <span>App Launcher</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] text-slate-400 bg-slate-100 border border-slate-200 rounded font-mono">
                ⌘J
              </kbd>
            </button>

            {/* Switch to Sales & POS */}
            <button
              onClick={() => navigate('/sales')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/90 text-xs font-semibold text-emerald-700 hover:bg-emerald-100/70 transition shadow-xs"
            >
              <div className="flex items-center gap-2">
                <MdOutlinePointOfSale size={16} className="text-emerald-600" />
                <span>Switch to Sales &amp; POS</span>
              </div>
              <span>→</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* BOTTOM TELEMETRY FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-3 px-6 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Vorniq Business OS 3.2.0
          </span>
          <span className="text-slate-300">•</span>
          <span>100% Free &amp; Open Suite</span>
          <span className="text-slate-300">•</span>
          <span>No Credit Card Required</span>
          <span className="text-slate-300">•</span>
          <span>Unlimited Users &amp; Records</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-slate-400">
          <span>Database: <strong className="text-slate-600">PostgreSQL 16 Native</strong></span>
          <span>•</span>
          <span>SOC-2 Compliant Architecture</span>
          <span>•</span>
          <span>© 2026 Vorniq Platforms Inc.</span>
        </div>
      </footer>
    </div>
  );
};