import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    name: "Image",
    cell: (row) => (
      <img src={row.profileImage} alt="Profile" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: 'cover' }} />
    ),
    grow: 0,
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
  },
  {
    name: "Action",
    cell: (row) => row.action,
    grow: 2,
  }
];


export const fetchDepartment=async ()=>{
    let departments;

    try{
      const response=await axios.get("http://localhost:5000/api/department",{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        departments=response.data.departments
      }

    }catch(err){
        if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Error:", err.message);
      }
    }
    return departments
}

export const getEmployees=async (id)=>{
    let employees;

    try{
      const response=await axios.get(`http://localhost:5000/api/employee/department/${id}`,{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        employees=response.data.employees
      }

    }catch(err){
        if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Error:", err.message);
      }
    }
    return employees
}

export const EmployeeButtons = ({ Id }) => {
  const styles = {
    container: {
      display: 'flex',
      gap: '0.7rem',
    },
    button: {
      background: '#4c1d95',
      color: '#fff',
      border: 'none',
      borderRadius: '999px',
      padding: '0.5rem 1.3rem',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background 0.18s, box-shadow 0.18s',
      boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
      outline: 'none',
    },
    edit: {
      background: '#FFA726',
      color: '#fff',
    },
    salary: {
      background: '#14b8a6',
      color: '#fff',
    },
    leave: {
      background: '#2563eb',
      color: '#fff',
    }
  };

  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button style={styles.button}
      onMouseOver={e => e.currentTarget.style.background = '#6d28d9'}
      onMouseOut={e => e.currentTarget.style.background = '#4c1d95'}
      onClick={()=>navigate(`/admin-dashboard/employees/${Id}`)}>View</button>
      <button style={{ ...styles.button, ...styles.edit }}
      onMouseOver={e => e.currentTarget.style.background = '#fb923c'}
      onMouseOut={e => e.currentTarget.style.background = '#FFA726'}
      onClick={()=>navigate(`/admin-dashboard/employees/edit/${Id}`)}>Edit</button>
      <button style={{ ...styles.button, ...styles.salary }}
      onMouseOver={e => e.currentTarget.style.background = '#0d9488'}
      onMouseOut={e => e.currentTarget.style.background = '#14b8a6'}
      onClick={()=>navigate(`/admin-dashboard/employee/salary/${Id}`)}>Salary</button>
      <button style={{ ...styles.button, ...styles.leave }}
      onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
      onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
      onClick={()=>navigate(`/admin-dashboard/employee/leaves/${Id}`)}
      >Leave</button>
    </div>
  );
}


  