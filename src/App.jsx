import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { PrivateRoutes } from './utils/PrivateRoutes';
import { RoleBaseRoutes } from './utils/RoleBaseRoutes';

import { AdminMainDashboard } from './components/dashboard/AdminMainDashboard';
import DepartmentList from './components/departments/DepartmentList';
import { AddDepartment } from './components/departments/AddDepartment';
import { List } from './components/employee/List';
import { Add } from './components/employee/Add';
import { View } from './components/employee/View';
import { Edit } from './components/employee/Edit';
import { AddSalary } from './components/salary/Add';
import ViewSalary from './components/salary/View.jsx';
import {Listt} from './components/leave/List.jsx'
import {Addleave} from './components/leave/Add.jsx'
import Preloader from './components/Preloader.jsx'; // 👈 import your Preloader component
import {SummaryCard} from './components/EmployeeDashboard/Summary.jsx'
import  Setting  from './components/EmployeeDashboard/Setting.jsx';
import { Table } from './components/leave/Table.jsx';
import { Detail } from './components/leave/Detail.jsx';
import EditDepartment from './components/departments/EditDepartment.jsx';
import { Attendance } from './components/attendance/Attendance.jsx';
import { AttendanceReport } from './components/attendance/AttendanceReport.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : 'visible';
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      {loading && <Preloader />} {/* 👈 conditionally show preloader */}
      
      {!loading && (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/admin-dashboard'
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
              <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />
              <Route path="/admin-dashboard/employees" element={<List />} />
              <Route path="/admin-dashboard/add-employee" element={<Add />} />
              <Route path="/admin-dashboard/employees/:id" element={<View />} />
              <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />} />
              <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
              <Route path="/admin-dashboard/leaves" element={<Table />} />
              <Route path="/admin-dashboard/leaves/:id" element={<Detail />} />
              <Route path="/admin-dashboard/employee/salary/:id" element={<ViewSalary />} />
              <Route path="/admin-dashboard/employee/leaves/:id" element={<Listt />} />
              <Route path="/admin-dashboard/attendance" element={<Attendance />} />
              <Route path="/admin-dashboard/attendance-report" element={<AttendanceReport />} />
              <Route path="/admin-dashboard/setting" element={<Setting />} />
              
            </Route>
            <Route path='/employee-dashboard' element={<PrivateRoutes>
                  <RoleBaseRoutes requiredRole={["admin","employee"]}>
                   <EmployeeDashboard />
                  </RoleBaseRoutes>
                </PrivateRoutes>} >

                <Route index element={<SummaryCard />} />
                <Route path='/employee-dashboard/profile/:id' element={<View />} />/
                 <Route path='/employee-dashboard/leaves/:id' element={<Listt />} />
                 <Route path='/employee-dashboard/add-leave' element={<Addleave />} />
                 <Route path='/employee-dashboard/salary/:id' element={<ViewSalary />} />
                 <Route path='/employee-dashboard/setting' element={<Setting />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
