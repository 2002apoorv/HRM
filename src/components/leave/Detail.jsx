import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


export const Detail = () => {
    const [leave, setLeave] = useState(null)
    const { id } = useParams()
    const navigate=useNavigate()

    useEffect(() => {
        const fetchLeave = async () => {

            try {
                const response = await axios.get(`http://localhost:5000/api/leave/detail/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.success) {
                    setLeave(response.data.leave);
                }

            } catch (err) {
                if (err.response) {
                    console.log("Server error:", err.response.data);
                } else {
                    console.log("Error:", err.message);
                }
            }
        }
        fetchLeave();

    }, [])

    const changeStatus = async (leaveId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/leave/${leaveId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      navigate('/admin-dashboard/leaves');
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
        <>
            {leave ? (
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
                        padding: '2.5rem 2rem',
                        margin: '2rem auto',
                        maxWidth: '500px',
                        width: '100%',
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
                            src={`http://localhost:5000/${leave.employeeId.userId.profileImage}`}
                            alt={leave.employeeId.userId.name}
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
                            {leave.employeeId.userId.name}
                        </h2>

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
                        {/* <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Email:</strong> {leave.userId.email}
          </div> */}
                        <div>
                            <strong style={{ width: 120, display: 'inline-block' }}>Employee ID:</strong> {leave.employeeId.employeeId}
                        </div>
                        <div>
                            <strong style={{ width: 120, display: 'inline-block' }}>Department:</strong> {leave.employeeId.department.dep_name}
                        </div>
                        <div>
                            <strong style={{ width: 120, display: 'inline-block' }}>Leave Type:</strong> {leave.leaveType}
                        </div>
                        <div>
                            <strong style={{ width: 120, display: 'inline-block' }}>Reason:</strong> {leave.reason}
                        </div>
                        <div>
                            <strong style={{ width: 120, display: 'inline-block' }}>Start Date:</strong> {new Date(leave.startDate).toLocaleDateString()}
                        </div>
                        <div>
                            <strong style={{ width: 120, display: 'inline-block' }}>End Date:</strong> {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                        {leave.status === "Pending" ? (
                            <div className="flex space-x-2">
                                <button onClick={() => changeStatus(leave._id, "Approved")}>Approve</button>
                                <button onClick={() => changeStatus(leave._id, "Rejected")}>Reject</button>
                            </div>
                        ) : (
                            <p className="font-medium">{leave.status}</p>
                        )}
                        {/* <div>
            <strong style={{ width: 120, display: 'inline-block' }}>Role:</strong> {employee.userId.role}
          </div> */}
                    </div>
                </div>
            ) : (
                <div>Loading.....</div>
            )}
        </>
    )
}
