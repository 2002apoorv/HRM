import React, { useEffect, useState } from 'react'
import { columns, LeaveButtons } from '../../utils/LeaveHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';

export const Table = () => {

    const [leaves, setLeaves] = useState(null);
    const [filteredLeaves, setFilteredLeaves] = useState(null);
    const fetchLeaves = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/leave", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                let sno = 1;
                const data = await response.data.leaves.map((leave) => ({
                    _id: leave._id,
                    sno: sno++,
                    employeeId: leave.employeeId.employeeId,
                    name: leave.employeeId.userId.name,
                    leaveType: leave.leaveType,
                    department: leave.employeeId.department.dep_name,
                    days: new Date(leave.endDate).getDate() -
                        new Date(leave.endDate).getDate(),
                    status: leave.status,
                    action: <LeaveButtons Id={leave._id} />,
                }))
                setLeaves(data)
                setFilteredLeaves(data)
            }

        } catch (err) {
            if (err.response) {
                console.log("Server error:", err.response.data);
            } else {
                console.log("Error:", err.message);
            }
        }
    }
    useEffect(() => {
        fetchLeaves()
    }, [])



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
            marginTop:'90px',
            marginLeft:'10px'
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
    
    

    const filterByButton = (status) => {
        const data = leaves.filter(leave =>
            leave.status
                .toLowerCase()
                .includes(status.toLowerCase())
        );
        setFilteredLeaves(data)
    }

    const filterByInput = (e) => {
        const data = leaves.filter(leave =>
            leave.employeeId
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );
        setFilteredLeaves(data)
    }
    // ...existing code...
    return (
        <>
            {filteredLeaves ? (
                <div>
                    <div>
                        <h3 style={styles.header}>Manage Leaves</h3>
                    </div>
                    <div style={styles.actionsCard}>
                        <input
                            type="text"
                            placeholder='Search by employee name'
                            style={styles.input}
                            onChange={filterByInput}
                        />
                        <div>
                            <button onClick={()=>filterByButton("Pending")}>Pending</button>
                            <button onClick={()=>filterByButton("Approved")}>Approved</button>
                            <button onClick={()=>filterByButton("Rejected")}>Rejected</button>
                        </div>
                    </div>
                    <div style={styles.tableWrapper}>
                        <DataTable columns={columns} data={filteredLeaves} pagination />
                    </div>
                </div>
            ) : (<div>Loading... </div>)}
        </>
    )
    // ...existing code...
}
