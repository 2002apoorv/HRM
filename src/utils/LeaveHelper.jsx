import React from 'react';
import { useNavigate } from 'react-router-dom';

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    maxWidth: "60px",
    grow: 0,
  },
  {
    name: "Employee ID",
    selector: (row) => row.employeeId,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
  },
  {
    name: "Department",
    selector: (row) => row.department,
  },
  {
    name: "Days",
    selector: (row) => row.days,
  },
  {
    name: "Status",
    selector: (row) => row.status,
  },
  {
    name: "Action",
    cell: (row) => row.action,
    grow: 2,
  }
];


export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/admin-dashboard/leaves/${id}`);
  };

  return (
    <button
      className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
      onClick={() => handleView(Id)}
    >
      View
    </button>
  );
};