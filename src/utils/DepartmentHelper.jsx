import axios from "axios";
import { useNavigate } from "react-router-dom";


export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno
    },
    {
        name: "Department",
        selector: (row) => row.dep_name
    },
    {
        name: "Action",
        selector: (row) => row.action
    }
]

export const DepartmentButtons = ({_id,onDepartmentDelete}) => {
    const styles = {
        container: {
            display: 'flex',
            gap: '0.7rem',
        },
        edit: {
            background: '#FFA726',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.5rem 1.3rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.18s, box-shadow 0.18s',
            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
            outline: 'none',
        },
        delete: {
            background: '#F44336',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.5rem 1.3rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.18s, box-shadow 0.18s',
            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
            outline: 'none',
        }
    };
    const navigate=useNavigate();
    const handleDelete=async (id)=>{
        const confirm=window.confirm("Do you want to delete");
        if(confirm){

        try {
                const response = await axios.delete(`http://localhost:5000/api/department/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.success) {
                    onDepartmentDelete()
                }

            } catch (err) {
                if (err.response) {
                    console.log("Server error:", err.response.data);
                } else {
                    console.log("Error:", err.message);
                }
            }
                        
        }
    }

    return (
        <div style={styles.container}>
            <button style={styles.edit}
                onMouseOver={e => e.currentTarget.style.background = '#fb923c'}
                onMouseOut={e => e.currentTarget.style.background = '#FFA726'}
                onClick={()=>navigate(`/admin-dashboard/department/${_id}`)}
            >Edit</button>
            <button style={styles.delete}
                onMouseOver={e => e.currentTarget.style.background = '#b91c1c'}
                onMouseOut={e => e.currentTarget.style.background = '#F44336'}
                onClick={()=>handleDelete(_id)}
            >Delete</button>
        </div>
    )
}