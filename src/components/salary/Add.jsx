import React, { useEffect, useState } from 'react'
import { fetchDepartment, getEmployees } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';



export const AddSalary = () => {
    const [salary, setSalary] = useState({
        employeeId: null,
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payDate: null
    })
    const navigate = useNavigate();

    const [departments, setDepartments] = useState(null)
    const [employees, setEmployees] = useState([])
    useEffect(() => {
        const getDepartment = async () => {
            const departments = await fetchDepartment()
            setDepartments(departments)
        }
        getDepartment();
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target;

        setSalary((prevData) => ({ ...prevData, [name]: value }));

    };


    const styles = {
        container: {
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(44,62,80,0.08)',
            padding: '2.5rem 2rem',
            margin: '1.5rem 0',
            minWidth: '320px',
            maxWidth: '600px',
            fontFamily: 'Inter, sans-serif',
            marginTop: '100px',
            marginLeft: '250px',
        },
        header: {
            color: '#23272F',
            fontWeight: 700,
            fontSize: '2rem',
            marginBottom: '2.2rem',
            fontFamily: "'Playfair Display', sans-serif",
            letterSpacing: '0.5px',
        },
        formCard: {
            background: '#f5f3ff',
            borderRadius: '12px',
            border: '1px solid #ede9fe',
            boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
            padding: '2rem 1.5rem',
            marginBottom: '1.5rem',
        },
        formGroup: {
            marginBottom: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
        },
        label: {
            color: '#23272F',
            fontWeight: 500,
            marginBottom: '0.2rem',
        },
        input: {
            padding: '0.7rem 1rem',
            border: '1px solid #E0E0E0',
            borderRadius: '8px',
            fontSize: '1rem',
            background: '#fff',
            color: '#23272F',
            outline: 'none',
        },
        select: {
            padding: '0.7rem 1rem',
            border: '1px solid #E0E0E0',
            borderRadius: '8px',
            fontSize: '1rem',
            background: '#fff',
            color: '#23272F',
            outline: 'none',
        },
        button: {
            background: '#4c1d95',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.9rem 1.5rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
            marginTop: '1.2rem',
            boxShadow: '0 1px 4px rgba(44,62,80,0.08)',
        }
    };

    const handleDepartment = async (e) => {
        const emps = await getEmployees(e.target.value)
        setEmployees(emps)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/api/salary/add/`, salary, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {

                navigate("/admin-dashboard/employees")
            }


        } catch (err) {
            if (err.response) {
                console.log("Server error:", err.response.data);
            } else {
                console.log("Error:", err.message);
            }
        }

        alert('Salary added!');
    };

    return (
        <>{departments ? (
            <div style={styles.container}>
                <h3 style={styles.header}>Add Salary</h3>
                <div style={styles.formCard}>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Department</label>
                        <select
                            style={styles.select}
                            name="department"

                            onChange={handleDepartment}
                            required
                        >
                            <option value="">Select</option>
                            {departments.map(dep => (
                                <option key={dep._id} value={dep._id}>
                                    {dep.dep_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Employee</label>
                        <select
                            style={styles.select}
                            name="employeeId"

                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.employeeId}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div style={styles.formGroup}>
                        <label style={styles.label}>Basic Salary</label>
                        <input style={styles.input} type="number" name="basicSalary" onChange={handleChange} required />
                    </div>


                    <div style={styles.formGroup}>
                        <label style={styles.label}>Allowances</label>
                        <input style={styles.input} type="number" name="allowances" onChange={handleChange} required />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Deductions</label>
                        <input style={styles.input} type="number" name="deductions" onChange={handleChange} required />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Pay Date</label>
                        <input style={styles.input} type="date" name="payDate" onChange={handleChange} required />
                    </div>

                    <button type="submit" style={styles.button}>Add Salary</button>
                </form>
                </div>
            </div>
        ) : <div>Loading....</div>}</>
    )
}