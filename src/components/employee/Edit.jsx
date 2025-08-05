import React, { useEffect, useState } from 'react'
import { fetchDepartment } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';



export const Edit = () => {
    const [employee, setEmployee] = useState({
        name:'',
        maritalStatus:'',
        designation:'',
        salary:0,
        department:''
    })
    const navigate = useNavigate();
    const { id } = useParams()
    const [departments, setDepartments] = useState(null)
        useEffect(() => {
            const getDepartment = async () => {
                const departments = await fetchDepartment()
                setDepartments(departments)
            }
            getDepartment();
        }, [])


    useEffect(() => {
        const fetchEmployee = async () => {

            try {
                const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.success) {
                    const employee=response.data.employee
                    setEmployee((prev)=>({...prev,name:employee.userId.name,maritalStatus:employee.maritalStatus,designation:employee.designation,salary:employee.salary,department:employee.department}));
                }

            } catch (err) {
                if (err.response) {
                    console.log("Server error:gfkufu", err.response.data);
                } else {
                    console.log("Error:", err.message);
                }
            }
        }
        fetchEmployee();

    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target;
        
            setEmployee((prevData) => ({ ...prevData, [name]: value }));
        
    };


    const styles = {
        container: {
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
            padding: '2rem',
            margin: '2rem 0',
            minWidth: '320px',
            maxWidth: '600px',
        },
        header: {
            color: '#23272F',
            fontWeight: 700,
            fontSize: '1.3rem',
            marginBottom: '1.5rem',
            letterSpacing: '0.5px',
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
            background: '#FFF9ED',
            color: '#23272F',
            outline: 'none',
        },
        select: {
            padding: '0.7rem 1rem',
            border: '1px solid #E0E0E0',
            borderRadius: '8px',
            fontSize: '1rem',
            background: '#FFF9ED',
            color: '#23272F',
            outline: 'none',
        },
        button: {
            background: '#7B61FF',
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
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:5000/api/employee/${id}`, employee, {
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

        alert('Employee added!');
    };

    return (
        <>{employee&&departments?(
        <div style={styles.container}>
            <h3 style={styles.header}>Edit Employee</h3>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input style={styles.input} type="text" name="name" value={employee.name} onChange={handleChange} required />
                </div>
                
               
                
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Marital Status</label>
                    <select style={styles.select} name="maritalStatus" value={employee.maritalStatus} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Designation</label>
                    <input style={styles.input} type="text" name="designation" value={employee.designation} onChange={handleChange} required />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Department</label>
                    <select
                        style={styles.select}
                        name="department"
                        value={employee.department}
                        onChange={handleChange}
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
                    <label style={styles.label}>Salary</label>
                    <input style={styles.input} type="number" name="salary" value={employee.salary} onChange={handleChange} required />
                </div>
                
                
                
                <button type="submit" style={styles.button}>Edit Employee</button>
            </form>
        </div>):<div>Loading....</div>}</>
    )
}