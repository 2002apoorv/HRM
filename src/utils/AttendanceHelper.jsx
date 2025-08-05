import React from 'react'

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    maxWidth: "60px",
    grow: 0,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.department,
  },
  {
    name: "Action",
    cell: (row) => row.action,
    grow: 2,
  }
];

export const AttendanceHelper = ({status}) => {
  return (
    <div>
        {status == null ? (
      <div className="flex space-x-8">
        <button className="px-4 py-2 bg-green-500 text-white">
          Present
        </button>
        <button className="px-4 py-2 bg-red-500 text-white">
          Absent
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white">
          Sick
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-black">
          Leave
        </button>
      </div>
    ) : (
      <div>
        <p className="bg-gray-100 w-20 text-center py-2 rounded">
          {status}
        </p>
      </div>
    )}
    </div>
  )
};

