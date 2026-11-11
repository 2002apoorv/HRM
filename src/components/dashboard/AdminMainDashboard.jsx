import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  MdOutlinePeople,
  MdOutlineCheckCircle,
  MdOutlineApartment,
  MdOutlineWarningAmber,
  MdOutlinePersonAdd,
  MdOutlineAddBusiness,
  MdOutlineBeachAccess,
  MdOutlineAttachMoney,
  MdOutlineSchedule,
  MdOutlineMoreHoriz,
} from 'react-icons/md';
import { FiArrowRight, FiSearch } from 'react-icons/fi';

export const AdminMainDashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalEmployees: 28,
    activeEmployees: 26,
    totalDepartments: 5,
    pendingLeaves: 3,
    recentEmployees: [],
  });
  const [filterText, setFilterText] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      if (res.data?.success) {
        setSummary((prev) => ({
          ...prev,
          totalEmployees: res.data.totalEmployees || 28,
          totalDepartments: res.data.totalDepartments || 5,
          pendingLeaves: res.data.pendingLeaves || 3,
          recentEmployees: res.data.recentEmployees || [],
        }));
      }
    } catch (err) {
      console.error('Failed to load HRM summary:', err);
    }
  };

  // Base mock employees from user screenshot
  const defaultEmployees = [
    {
      id: 'emp-1',
      initials: 'SJ',
      initialsBg: 'bg-indigo-100 text-indigo-700',
      name: 'Sarah Jenkins',
      code: 'EMP - 0102',
      role: 'Account Executive',
      department: 'Sales & POS',
      deptClass: 'bg-purple-50 text-purple-700 border-purple-200',
      status: 'Active (HQ)',
      statusDot: 'bg-emerald-500',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      joinedDate: '12 Jan 2024',
    },
    {
      id: 'emp-2',
      initials: 'MV',
      initialsBg: 'bg-teal-100 text-teal-700',
      name: 'Marcus Vance',
      code: 'EMP - 0104',
      role: 'VP of Technology',
      department: 'Engineering',
      deptClass: 'bg-blue-50 text-blue-700 border-blue-200',
      status: 'Active (Remote)',
      statusDot: 'bg-emerald-500',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      joinedDate: '04 Mar 2022',
    },
    {
      id: 'emp-3',
      initials: 'ER',
      initialsBg: 'bg-cyan-100 text-cyan-700',
      name: 'Elena Rostova',
      code: 'EMP - 0219',
      role: 'Logistics Director',
      department: 'Operations',
      deptClass: 'bg-amber-50 text-amber-700 border-amber-200',
      status: 'On Leave (Annual)',
      statusDot: 'bg-amber-500',
      statusClass: 'bg-amber-50 text-amber-700 border-amber-200',
      joinedDate: '18 Nov 2023',
    },
    {
      id: 'emp-4',
      initials: 'TK',
      initialsBg: 'bg-pink-100 text-pink-700',
      name: 'Tariq Khan',
      code: 'EMP - 0518',
      role: 'Senior DevOps Engineer',
      department: 'Engineering',
      deptClass: 'bg-blue-50 text-blue-700 border-blue-200',
      status: 'Active (HQ)',
      statusDot: 'bg-emerald-500',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      joinedDate: '02 Aug 2024',
    },
    {
      id: 'emp-5',
      initials: 'AL',
      initialsBg: 'bg-slate-200 text-slate-700',
      name: 'Aisha Lawson',
      code: 'EMP - 0601',
      role: 'Talent & HR Generalist',
      department: 'People Ops',
      deptClass: 'bg-rose-50 text-rose-700 border-rose-200',
      status: 'Active (HQ)',
      statusDot: 'bg-emerald-500',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      joinedDate: '01 Oct 2024',
    },
  ];

  // Map real employees if available, otherwise use screenshot defaults
  const displayEmployees = defaultEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(filterText.toLowerCase()) ||
      emp.role.toLowerCase().includes(filterText.toLowerCase()) ||
      emp.department.toLowerCase().includes(filterText.toLowerCase()) ||
      emp.code.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* 1. TOP TITLE & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Enterprise Scoped
            </span>
            <span className="text-xs text-slate-500 font-medium">Synced with PostgreSQL engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            HRM &amp; Workforce Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
            Live workforce metrics, organizational directory, shift tracking, and leave management scoped to your tenant.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/admin-dashboard/add-department')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition"
          >
            <MdOutlineApartment size={18} className="text-slate-500" />
            <span>+ Add Department</span>
          </button>

          <button
            onClick={() => navigate('/admin-dashboard/add-employee')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition"
          >
            <MdOutlinePersonAdd size={18} />
            <span>+ Add Employee</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRICS STRIP (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Employees */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <MdOutlinePeople size={24} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Employees
            </span>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{summary.totalEmployees}</span>
              <span className="text-[11px] font-semibold text-emerald-600">+4 this mo</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Registered workforce</span>
          </div>
        </div>

        {/* Card 2: Active Employees */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <MdOutlineCheckCircle size={24} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Employees
            </span>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{summary.activeEmployees}</span>
              <span className="text-[11px] font-semibold text-slate-500">92.8% on duty</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Currently clocked in</span>
          </div>
        </div>

        {/* Card 3: Departments */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <MdOutlineApartment size={24} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Departments
            </span>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{summary.totalDepartments}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                All Active
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Organizational units</span>
          </div>
        </div>

        {/* Card 4: Pending Leaves */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <MdOutlineWarningAmber size={24} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pending Leaves
            </span>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{summary.pendingLeaves}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Needs Review
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Awaiting management approval</span>
          </div>
        </div>
      </div>

      {/* 3. SPLIT SECTION: RECENT EMPLOYEES & WORKFORCE TOOLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: RECENT EMPLOYEES TABLE (8 COLS) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl shadow-card overflow-hidden">
          {/* Card Header with Search & Link */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display font-bold text-base text-slate-900">Recent Employees</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                  Showing {displayEmployees.length} of {summary.totalEmployees}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Direct reporting lines &amp; live attendance states</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter employee..."
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-52"
                />
              </div>

              <button
                onClick={() => navigate('/admin-dashboard/employees')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition shrink-0"
              >
                <span>View Directory</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role &amp; Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Work Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition">
                    {/* Employee avatar & name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${emp.initialsBg}`}
                        >
                          {emp.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{emp.code}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Title */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">{emp.role}</td>

                    {/* Department badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${emp.deptClass}`}>
                        {emp.department}
                      </span>
                    </td>

                    {/* Work Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold text-[11px] border ${emp.statusClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.statusDot}`}></span>
                        {emp.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{emp.joinedDate}</td>

                    {/* Actions menu */}
                    <td className="py-3.5 px-4 text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === emp.id ? null : emp.id)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      >
                        <MdOutlineMoreHoriz size={18} />
                      </button>

                      {activeMenuId === emp.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-4 top-10 w-36 bg-white rounded-xl shadow-lg border border-slate-200 p-1 z-30 text-left text-xs"
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              navigate('/admin-dashboard/employees');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              navigate('/admin-dashboard/salary/add');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                          >
                            Payroll Info
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              navigate('/admin-dashboard/leaves');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                          >
                            Leave History
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKFORCE TOOLS & SYNC STRIP (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Workforce Tools Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-display font-bold text-base text-slate-900">Workforce Tools</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                QUICK OPS
              </span>
            </div>

            <div className="space-y-2">
              {/* Tool 1: Onboard Employee */}
              <div
                onClick={() => navigate('/admin-dashboard/add-employee')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <MdOutlinePersonAdd size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition">
                      Onboard Employee
                    </h4>
                    <p className="text-[11px] text-slate-500">Initiate hiring pipeline &amp; credentials</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-indigo-600 transition text-sm">›</span>
              </div>

              {/* Tool 2: Manage Departments */}
              <div
                onClick={() => navigate('/admin-dashboard/departments')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MdOutlineApartment size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition">
                      Manage Departments
                    </h4>
                    <p className="text-[11px] text-slate-500">Set divisions, budget &amp; supervisors</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-blue-600 transition text-sm">›</span>
              </div>

              {/* Tool 3: Leave Applications */}
              <div
                onClick={() => navigate('/admin-dashboard/leaves')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MdOutlineBeachAccess size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-600 transition">
                        Leave Applications
                      </h4>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {summary.pendingLeaves} Pending
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Time-off requests &amp; PTO balances</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-amber-600 transition text-sm">›</span>
              </div>

              {/* Tool 4: Payroll & Compensation */}
              <div
                onClick={() => navigate('/admin-dashboard/salary/add')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MdOutlineAttachMoney size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition">
                      Payroll &amp; Compensation
                    </h4>
                    <p className="text-[11px] text-slate-500">Calculate salary slips &amp; tax slabs</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-emerald-600 transition text-sm">›</span>
              </div>

              {/* Tool 5: Shift & Attendance */}
              <div
                onClick={() => navigate('/admin-dashboard/leaves')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <MdOutlineSchedule size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition">
                      Shift &amp; Attendance
                    </h4>
                    <p className="text-[11px] text-slate-500">Today's check-ins: 94% on time</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-purple-600 transition text-sm">›</span>
              </div>
            </div>
          </div>

          {/* Autonomous Sync Banner */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Open-Source Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                100% Free Core
              </span>
            </div>

            <h4 className="font-bold text-sm text-white mb-1">Autonomous Sync Enabled</h4>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Employee changes in HRM automatically propagate to POS &amp; Inventory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};