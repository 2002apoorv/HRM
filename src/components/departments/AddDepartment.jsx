import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: ""
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value })
  }

  const styles = {
    container: {
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 15px rgba(44,62,80,0.08)',
      padding: '2rem',
      margin: '2rem auto',
      minWidth: '320px',
      maxWidth: '600px',
      fontFamily: 'Inter, sans-serif',
    },
    header: {
      color: '#f5f3ff',
      fontWeight: 700,
      fontSize: '1.8rem',
      marginBottom: '1.5rem',
      letterSpacing: '0.5px',
      fontFamily: "'Playfair Display', serif",
    },
    formGroup: {
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      color: '#ddd6fe',
      fontWeight: 500,
      marginBottom: '0.2rem',
    },
    input: {
      padding: '0.7rem 1rem',
      border: '1px solid #c4b5fd',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#ede9fe',
      outline: 'none',
    },
    textarea: {
      padding: '0.7rem 1rem',
      border: '1px solid #c4b5fd',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#ede9fe',
      outline: 'none',
      minHeight: '80px',
      resize: 'vertical',
    },
    button: {
      background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.7rem 1.2rem',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
      marginTop: '0.5rem',
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/api/department/add", department, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success){
        alert("The Department has been added successfully")
        navigate("/admin-dashboard/departments")
      }
        

    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Error:", err.message);
      }
    }

  }


  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Add Department</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="dep_name" style={styles.label}>Department Name</label>
          <input
            type="text"
            id="dep_name"
            name="dep_name"
            value={department.dep_name}
            placeholder='Enter Dep Name'
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={department.description}
            onChange={handleChange}
            placeholder='Description'
            style={styles.textarea}
          />
        </div>
        <button type="submit" style={styles.button}>Add Department</button>
      </form>
    </div>
  )
}