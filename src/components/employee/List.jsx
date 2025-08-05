import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';



export const List = () => {

const [employees,setEmployees]=useState([])
const [empLoading,setEmpLoading]=useState(false);
const [filteredEmployees,setFilteredEmployees]=useState([]);

useEffect(()=>{
  const fetchEmployees=async ()=>{
    setEmpLoading(true)
    try{
      const response=await axios.get("http://localhost:5000/api/employee",{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        let sno=1;
        console.log(response.data.employees)
        const data=await response.data.employees.map((emp)=>({
          _id:emp._id,
          sno:sno++,
          dep_name:emp.department.dep_name,
          name:emp.userId.name,
          dob:new Date(emp.dob).toDateString(),
          profileImage: <img src={`http://localhost:5000/uploads/${emp.userId.profileImage}`} />,
          action:(<EmployeeButtons Id={emp._id}/>)
        }))
        setEmployees(data);
        setFilteredEmployees(data)
      }

    }catch(err){
        if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Error:", err.message);
      }
    }finally{
      setEmpLoading(false)
    }
  }
  fetchEmployees();
},[])

  const styles = {
    card: {
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 15px rgba(44,62,80,0.08)',
      padding: '2rem',
      margin: '1.5rem 0',
      marginTop: '50px',
      fontFamily: 'Inter, sans-serif',
    },
    header: {
      color: '#23272F',
      fontWeight: 700,
      fontSize: '2rem',
      marginBottom: '2.2rem',
      fontFamily: "'Playfair Display', sans-serif",
      letterSpacing: '0.5px',
    },
    actionsCard: {
      background: '#f5f3ff',
      borderRadius: '12px',
      border: '1px solid #ede9fe',
      boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
      padding: '1rem 1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    input: {
      padding: '0.7rem 1rem',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      fontSize: '1rem',
      background: '#fff',
      color: '#23272F',
      outline: 'none',
      flex: 1,
    },
    addButton: {
      background: '#4c1d95',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.7rem 1.2rem',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background 0.2s',
      whiteSpace: 'nowrap',
      boxShadow: '0 1px 4px rgba(44,62,80,0.08)',
    },
    tableWrapper: {
      width: '100%',
      overflowX: 'auto',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
      padding: '1rem 0.5rem',
    }
  };

  // Custom styles for DataTable to match the screenshot
  const customStyles = {
    table: {
      style: {
        background: 'transparent',
      },
    },
    headRow: {
      style: {
        background: '#fff',
        borderBottom: '2px solid #f0f0f0',
      },
    },
    headCells: {
      style: {
        paddingLeft: '4px',
        paddingRight: '4px',
        fontSize: '0.9rem',
        fontWeight: 700,
        color: '#23272F',
      },
    },
    rows: {
      style: {
        background: '#fff',
        minHeight: '48px',
        borderBottom: '1px solid #f0f0f0',
        '&:not(:last-of-type)': {
          borderBottom: '1px solid #f0f0f0',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '4px',
        paddingRight: '4px',
        fontSize: '0.95rem',
        color: '#23272F',
      },
    },
  };

  const handleFilter = (e) =>{
    const records=employees.filter((emp)=>(
       emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    setFilteredEmployees(records)
  }

  return (
    <div style={styles.card}>
      <div>
        <h3 style={styles.header}>Manage Employees</h3>
      </div>
      <div style={styles.actionsCard}>
        <input
          type="text"
          placeholder='Search by employee name'
          style={styles.input}
          onChange={handleFilter}
        />
        <Link to="/admin-dashboard/add-employee" style={styles.addButton}>
          Add New Employee
        </Link>
      </div>
      <div style={styles.tableWrapper}>
        <DataTable columns={columns} data={filteredEmployees} pagination customStyles={customStyles}/>
      </div>
    </div>
  )
}