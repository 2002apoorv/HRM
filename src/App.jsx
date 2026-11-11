import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AppLauncher } from './pages/AppLauncher';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { PrivateRoutes } from './utils/PrivateRoutes';
import { RoleBaseRoutes } from './utils/RoleBaseRoutes';

// HRM Components
import { AdminMainDashboard } from './components/dashboard/AdminMainDashboard';
import DepartmentList from './components/departments/DepartmentList';
import { AddDepartment } from './components/departments/AddDepartment';
import { List } from './components/employee/List';
import { Add } from './components/employee/Add';
import { View } from './components/employee/View';
import { Edit } from './components/employee/Edit';
import { AddSalary } from './components/salary/Add';
import ViewSalary from './components/salary/View.jsx';
import { Listt } from './components/leave/List.jsx';
import { Addleave } from './components/leave/Add.jsx';
import Preloader from './components/Preloader.jsx';
import { SummaryCard } from './components/EmployeeDashboard/Summary.jsx';
import Setting from './components/EmployeeDashboard/Setting.jsx';
import { Table } from './components/leave/Table.jsx';
import { Detail } from './components/leave/Detail.jsx';

// Sales & Inventory Components
import { SalesLayout } from './components/sales/SalesLayout';
import { SalesDashboardView } from './components/sales/SalesDashboardView';
import { ProductManagementView } from './components/sales/ProductManagementView';
import { InventoryManagementView } from './components/sales/InventoryManagementView';
import { PosBillingView } from './components/sales/PosBillingView';
import { InvoicesReturnsView } from './components/sales/InvoicesReturnsView';
import { PurchasesSuppliersView } from './components/sales/PurchasesSuppliersView';
import { CustomersReceivablesView } from './components/sales/CustomersReceivablesView';
import { ReportsAnalyticsView } from './components/sales/ReportsAnalyticsView';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : 'visible';
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      {loading && <Preloader />}

      {!loading && (
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Authentication Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Central Application Launcher */}
            <Route
              path="/apps"
              element={
                <PrivateRoutes>
                  <AppLauncher />
                </PrivateRoutes>
              }
            />

            {/* HRM Module Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoutes>
                  <RoleBaseRoutes requiredRole={['admin']}>
                    <AdminDashboard />
                  </RoleBaseRoutes>
                </PrivateRoutes>
              }
            >
              <Route index element={<AdminMainDashboard />} />
              <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
              <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
              <Route path="/admin-dashboard/employees" element={<List />} />
              <Route path="/admin-dashboard/add-employee" element={<Add />} />
              <Route path="/admin-dashboard/employees/:id" element={<View />} />
              <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />} />
              <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
              <Route path="/admin-dashboard/leaves" element={<Table />} />
              <Route path="/admin-dashboard/leaves/:id" element={<Detail />} />
              <Route path="/admin-dashboard/employee/salary/:id" element={<ViewSalary />} />
              <Route path="/admin-dashboard/employee/leaves/:id" element={<Listt />} />
              <Route path="/admin-dashboard/setting" element={<Setting />} />
            </Route>

            {/* Employee Dashboard */}
            <Route
              path="/employee-dashboard"
              element={
                <PrivateRoutes>
                  <RoleBaseRoutes requiredRole={['admin', 'employee']}>
                    <EmployeeDashboard />
                  </RoleBaseRoutes>
                </PrivateRoutes>
              }
            >
              <Route index element={<SummaryCard />} />
              <Route path="/employee-dashboard/profile/:id" element={<View />} />
              <Route path="/employee-dashboard/leaves/:id" element={<Listt />} />
              <Route path="/employee-dashboard/add-leave" element={<Addleave />} />
              <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />} />
              <Route path="/employee-dashboard/setting" element={<Setting />} />
            </Route>

            {/* Sales & Inventory Module Routes */}
            <Route
              path="/sales"
              element={
                <PrivateRoutes>
                  <RoleBaseRoutes requiredRole={['admin', 'employee']}>
                    <SalesLayout />
                  </RoleBaseRoutes>
                </PrivateRoutes>
              }
            >
              <Route index element={<SalesDashboardView />} />
              <Route path="/sales/pos" element={<PosBillingView />} />
              <Route path="/sales/products" element={<ProductManagementView />} />
              <Route path="/sales/inventory" element={<InventoryManagementView />} />
              <Route path="/sales/invoices" element={<InvoicesReturnsView />} />
              <Route path="/sales/purchases" element={<PurchasesSuppliersView />} />
              <Route path="/sales/customers" element={<CustomersReceivablesView />} />
              <Route path="/sales/reports" element={<ReportsAnalyticsView />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
