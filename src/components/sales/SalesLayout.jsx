import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import {
  MdOutlineDashboard,
  MdOutlinePointOfSale,
  MdOutlineInventory2,
  MdOutlineReceiptLong,
  MdOutlineLocalShipping,
  MdOutlinePeople,
  MdOutlineAnalytics,
  MdOutlineCategory,
  MdApps,
  MdApartment,
  MdOutlineLogout,
  MdOutlineBadge,
  MdOutlineStorefront,
} from 'react-icons/md';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import api from '../../utils/api';

export const SalesLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    totalProducts: 84,
    lowStockCount: 4,
    recentInvoicesCount: 12,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const orgName = user?.organization?.name || 'Primary Enterprise';
  const orgCode = user?.organization?.code || 'ORG-001';
  const userName = user?.name || 'Admin User';
  const userInitial = userName.charAt(0).toUpperCase() || 'A';
  const userRole = user?.role === 'admin' ? 'Master Controller' : 'Store Manager';

  useEffect(() => {
    fetchSalesCounts();
  }, [location.pathname]);

  const fetchSalesCounts = async () => {
    try {
      const res = await api.get('/sales/reports/dashboard');
      if (res.data?.success && res.data?.metrics) {
        setStats({
          totalProducts: res.data.metrics.totalProducts || 84,
          lowStockCount: res.data.metrics.lowStockCount || 4,
          recentInvoicesCount: res.data.metrics.recentInvoices?.length || 12,
        });
      }
    } catch {
      // Graceful fallback for mock values
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
            onClick={() => navigate('/sales')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30 shrink-0">
              <MdOutlineStorefront size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base text-slate-900 tracking-tight leading-none">
                  Vorniq Commerce
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  OS 3.2
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Supply Chain &amp; POS Studio</span>
            </div>
          </div>

          {/* Workspace Pill Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 transition text-xs font-semibold text-slate-700"
            >
              <MdApartment size={16} className="text-emerald-600" />
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
                      navigate('/admin-dashboard');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    Switch to HRM Studio
                  </button>
                  <button
                    onClick={() => {
                      setWorkspaceMenuOpen(false);
                      navigate('/sales/reports');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                  >
                    Commerce Telemetry &amp; Reports
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
              placeholder="Search products, barcodes, orders, suppliers... (⌘K)"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
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
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
            title="App Launcher"
          >
            <MdApps size={20} />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-50 shadow-xs">
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
            {/* COMMERCE & POINT OF SALE SECTION */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-3 mb-2">
                Commerce &amp; Point of Sale
              </span>
              <nav className="space-y-1 text-xs font-semibold">
                {/* Commerce Dashboard */}
                <NavLink
                  to="/sales"
                  end
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineDashboard size={18} className="text-emerald-600" />
                    <span>Commerce Dashboard</span>
                  </div>
                </NavLink>

                {/* POS Billing Terminal */}
                <NavLink
                  to="/sales/pos"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlinePointOfSale size={18} />
                    <span>POS Touch Billing</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    F1
                  </span>
                </NavLink>

                {/* Product Catalog */}
                <NavLink
                  to="/sales/products"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineCategory size={18} />
                    <span>Product Catalog</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {stats.totalProducts}
                  </span>
                </NavLink>

                {/* Inventory & FEFO Ledger */}
                <NavLink
                  to="/sales/inventory"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineInventory2 size={18} />
                    <span>Inventory &amp; FEFO</span>
                  </div>
                  {stats.lowStockCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {stats.lowStockCount} alert
                    </span>
                  )}
                </NavLink>

                {/* Invoices & Returns */}
                <NavLink
                  to="/sales/invoices"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineReceiptLong size={18} />
                    <span>Invoices &amp; Returns</span>
                  </div>
                </NavLink>
              </nav>
            </div>

            {/* SUPPLY CHAIN & PARTNERS SECTION */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-3 mb-2">
                Supply Chain &amp; Partners
              </span>
              <nav className="space-y-1 text-xs font-semibold">
                {/* Purchases & Suppliers */}
                <NavLink
                  to="/sales/purchases"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineLocalShipping size={18} />
                    <span>Purchases &amp; Receiving</span>
                  </div>
                </NavLink>

                {/* Customers & Receivables */}
                <NavLink
                  to="/sales/customers"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlinePeople size={18} />
                    <span>Customers &amp; Receivables</span>
                  </div>
                </NavLink>

                {/* Reports & Analytics */}
                <NavLink
                  to="/sales/reports"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <MdOutlineAnalytics size={18} />
                    <span>Reports &amp; Analytics</span>
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
                <MdApps size={16} className="text-emerald-600" />
                <span>App Launcher</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] text-slate-400 bg-slate-100 border border-slate-200 rounded font-mono">
                ⌘J
              </kbd>
            </button>

            {/* Switch to HRM */}
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/70 border border-indigo-200/90 text-xs font-semibold text-indigo-700 hover:bg-indigo-100/70 transition shadow-xs"
            >
              <div className="flex items-center gap-2">
                <MdOutlineBadge size={16} className="text-indigo-600" />
                <span>Switch to HRM Studio</span>
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
          <span>Zero-Latency POS Sync</span>
          <span className="text-slate-300">•</span>
          <span>Unlimited SKUs &amp; Transactions</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-slate-400">
          <span>Database: <strong className="text-slate-600">PostgreSQL 16 Native</strong></span>
          <span>•</span>
          <span>FEFO Lot Auditing</span>
          <span>•</span>
          <span>© 2026 Vorniq Platforms Inc.</span>
        </div>
      </footer>
    </div>
  );
};

export default SalesLayout;
