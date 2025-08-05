import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ViewSalary = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();
  let sno = 1;
  const { user } = useAuth();

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/salary/${id}/${user.role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filterSalaries = (q) => {
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId.employeeId.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(44,62,80,0.08)',
        padding: '2.5rem 2rem',
        margin: '1.5rem auto',
        maxWidth: '900px',
        width: '100%',
        fontFamily: 'Inter, sans-serif',
        marginTop:"100px" 
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.2rem'}}>
        <h2 style={{
          color: '#23272F',
          fontWeight: 700,
          fontSize: '2rem',
          fontFamily: "'Playfair Display', serif",
          letterSpacing: '0.5px',
          margin: 0,
        }}>
          Salary History
        </h2>
      </div>

      <div style={{
        background: '#f5f3ff',
        borderRadius: '12px',
        border: '1px solid #ede9fe',
        boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <input
          type="text"
          placeholder="Search By Emp ID"
          style={{
            border: '1px solid #c4b5fd',
            padding: '0.7rem 1rem',
            borderRadius: '8px',
            fontSize: '1rem',
            background: '#fff',
            color: '#23272F',
            outline: 'none',
            fontFamily: "'Inter', sans-serif",
            minWidth: '220px',
          }}
          onChange={(e) => filterSalaries(e.target.value)}
        />
      </div>

      {filteredSalaries === null ? (
        <div>Loading ...</div>
      ) : filteredSalaries.length > 0 ? (
        <div style={{
          overflowX: 'auto',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
          padding: '1rem 0.5rem',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', background: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <thead>
              <tr style={{ background: '#f5f3ff', color: '#23272F' }}>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>SNO</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Emp ID</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Salary</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Allowance</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Deduction</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Total</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.2px', borderBottom: '2px solid #f0f0f0' }}>Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary, idx) => (
                <tr
                  key={salary._id}
                  style={{
                    background: idx % 2 === 0 ? '#fff' : '#f7f6f3',
                    color: '#23272F',
                    borderBottom: '1px solid #EEE',
                  }}
                >
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{salary.employeeId.employeeId}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{salary.basicSalary}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{salary.allowance}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{salary.deductions}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{salary.netSalary}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    {new Date(salary.payDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No Records</div>
      )}
    </div>
  );
};

export default ViewSalary;
