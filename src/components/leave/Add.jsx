import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export const Addleave = () => {
    const { user } = useAuth();

    const [leave, setLeave] = useState({
        userId: user._id,
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeave((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/leave/add`, leave, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                navigate(`/employee-dashboard/leaves/${user._id}`);
            }
        } catch (err) {
            if (err.response) {
                console.log("Server error:", err.response.data);
            } else {
                console.log("Error:", err.message);
            }
        }
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '50px auto',
            padding: '40px',
            borderRadius: '8px',
            background: '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            marginTop:"100px",paddingRight:"60px"
        }}>
            <h2>Request for Leave</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Leave Type</label><br />
                    <select
                        name="leaveType"
                        value={leave.leaveType}
                        onChange={handleChange}
                        style={{
                            width: '517px',
                            padding: '18px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    >
                        <option value="">Select Leave Type</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Annual Leave">Annual Leave</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 ,marginRight:"5px"}}>
                        <label>From Date</label><br />
                        <input
                            type="date"
                            name="startDate"
                            value={leave.startDate}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </div>

                    <div style={{ flex: 1,marginLeft:"10px" }}>
                        <label>To Date</label><br />
                        <input
                            type="date"
                            name="endDate"
                            value={leave.endDate}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Description</label><br />
                    <textarea
                        name="reason"
                        placeholder="Reason"
                        value={leave.reason}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '517px',
                        padding: '10px',
                        backgroundColor: 'rgb(76, 29, 149)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Add Leave
                </button>
            </form>
        </div>
    );
};
