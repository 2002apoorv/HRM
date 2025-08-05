import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import DataTable from 'react-data-table-component'
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper';
import axios from 'axios';
import { useState } from 'react';

const DepartmentList = () => {

  const [departments,setDepartment]=useState([])
  const [depLoading,setDepLoading]=useState(false);

  const onDepartmentDelete=async ()=>{
    fetchDepartment()
  }

  const fetchDepartment=async ()=>{
    setDepLoading(true)
    try{
      const response=await axios.get("http://localhost:5000/api/department",{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        let sno=1;
        console.log(response.data.departments)
        const data=await response.data.departments.map((dep)=>({
          _id:dep._id,
          sno:sno++,
          dep_name:dep.dep_name,
          action:(<DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete}/>)
        }))
        setDepartment(data);
      }

    }catch(err){
        if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Error:", err.message);
      }
    }finally{
      setDepLoading(false)
    }
  }

useEffect(()=>{
  
  fetchDepartment();
},[])

  const styles = {
    container: {
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 15px rgba(44,62,80,0.08)',
      padding: '2rem',
      margin: '1.5rem 0',
      
      fontFamily: 'Inter, sans-serif',
      
    },
    header: {
      color: '#23272F',
      fontWeight: 700,
      fontSize: '2rem',
      marginBottom: '2.2rem',
      fontFamily: "'Playfair Display', sans-serif",
      letterSpacing: '0.5px',
      
      marginTop: '100px',
    },
    actionsCard: {
      background: '#f5f3ff',
      borderRadius: '12px',
      border: '1px solid #ede9fe',
      boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
      
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
    },
  };

  // Example static departments
  

  return (
    <>{depLoading?"loading...":
    <div style={styles.container}>
      <div>
        <h3 style={styles.header}>Manage Departments</h3>
      </div>
      <div style={styles.actionsCard}>
        <input
          type="text"
          placeholder='Search by department name'
          style={styles.input}
        />
        <Link to="/admin-dashboard/add-department" style={styles.addButton}>
          Add New Department
        </Link>
      </div>
      <div style={styles.tableWrapper}>
        <DataTable columns={columns} data={departments}/>
      </div>
    </div>}</>
  )
}

export default DepartmentList