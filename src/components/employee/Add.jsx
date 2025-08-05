import React, { useEffect, useState } from 'react'
import { fetchDepartment } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Add = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        employeeId: '',
        gender: '',
        maritalStatus: '',
        designation: '',
        department: '',
        salary: '',
        password: '',
        role: '',
        image: null,
    });

    const [departments, setDepartments] = useState([])
    useEffect(() => {
        const getDepartment = async () => {
            const departments = await fetchDepartment()
            setDepartments(departments)
        }
        getDepartment();
    }, [])

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
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
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key])
        })

        try {
            const response = await axios.post("http://localhost:5000/api/employee/add", formDataObj, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
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
        <div style={styles.container}>
            <h3 style={styles.header}>Add Employee</h3>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input style={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Date of Birth</label>
                    <input style={styles.input} type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Employee ID</label>
                    <input style={styles.input} type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Gender</label>
                    <select style={styles.select} name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Marital Status</label>
                    <select style={styles.select} name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Designation</label>
                    <input style={styles.input} type="text" name="designation" value={formData.designation} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Department</label>
                    <select
                        style={styles.select}
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        {departments.map(dep => (
                            <option key={dep._id} value={dep.dep_name}>
                                {dep.dep_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Salary</label>
                    <input style={styles.input} type="number" name="salary" value={formData.salary} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input style={styles.input} type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Role</label>
                    <select style={styles.select} name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Image</label>
                    <input style={styles.input} type="file" name="image" accept="image/*" onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" style={styles.button}>Add Employee</button>
                </div>
            </form>
        </div>
    )
}