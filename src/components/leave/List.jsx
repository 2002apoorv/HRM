import React, { useState,useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import axios from 'axios';



export const Listt = () => {
  const {user}=useAuth()
  const [leaves,setLeaves]=useState([])
  let sno=1;
  const {id}=useParams()


  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leave/${id}/${user.role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      
      if (response.data.success) {
        setLeaves(response.data.leaves);
        
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

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

  return (
    <div style={styles.card}>
      <div>
        <h3 style={styles.header}>Manage Leaves</h3>
      </div>
      <div style={styles.actionsCard}>
        <input
          type="text"
          placeholder='Search by employee name'
          style={styles.input}
        //   onChange={handleFilter}
        />

        <Link to="/employee-dashboard/add-leave" style={styles.addButton}>
          Add New Leave
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', background: '#fff', fontFamily: "'Inter', sans-serif" }}>
        <thead>
          <tr style={{ background: '#f5f3ff', color: '#23272F' }}>
            <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>SNO</th>
            <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Leave Type</th>
            <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>FROM</th>
            <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>TO</th>
            <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Description</th>
            
            <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr
              key={leave._id}
              style={{
                background: sno % 2 === 0 ? '#fff' : '#f7f6f3',
                color: '#23272F',
                borderBottom: '1px solid #EEE',
              }}
            >
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{sno++}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{leave.leaveType}</td>
              
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{leave.reason}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
