import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'


export const View = () => {
    const [employee, setEmployee] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchEmployee = async () => {

            try {
                const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.success) {
                    setEmployee(response.data.employee);
                }

            } catch (err) {
                if (err.response) {
                    console.log("Server error:", err.response.data);
                } else {
                    console.log("Error:", err.message);
                }
            }
        }
        fetchEmployee();

    }, [])

    return (
  <>
    {employee ? (
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
          padding: '2.5rem 2rem',
          margin: '2rem auto',
          maxWidth: '500px',
          width: '100%',
          marginTop:"100px"
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <img
            src={`http://localhost:5000/${employee.userId.profileImage}`}
            alt={employee.userId.name}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem',
              border: '4px solid #7B61FF',
              background: '#FFF9ED',
            }}
          />
          <h2
            style={{
              color: '#23272F',
              fontWeight: 700,
              fontSize: '2rem',
              margin: 0,
            }}
          >
            {employee.userId.name}
          </h2>
          <p
            style={{
              color: '#7B61FF',
              fontWeight: 500,
              fontSize: '1.1rem',
              margin: 0,
            }}
          >
            {employee.designation}
          </p>
        </div>
        <div
          style={{
            color: '#23272F',
            fontSize: '1.08rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: '#FFF9ED',
            borderRadius: '12px',
            padding: '1.2rem 1rem',
          }}
        >
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Email:</strong> {employee.userId.email}
          </div>
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Employee ID:</strong> {employee.employeeId}
          </div>
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Department:</strong> {employee.department.dep_name}
          </div>
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>DOB:</strong> {new Date(employee.dob).toDateString()}
          </div>
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Gender:</strong> {employee.gender}
          </div>
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Marital Status:</strong> {employee.maritalStatus}
          </div>
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Salary:</strong> {employee.salary}
          </div>
          <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Role:</strong> {employee.userId.role}
          </div>
        </div>
      </div>
    ) : (
      <div>Loading.....</div>
    )}
  </>
)
}
