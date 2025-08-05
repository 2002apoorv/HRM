
import React, { useEffect } from 'react'
import { useContext } from 'react';
import { useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const userContext = createContext();

export const AuthContext = ({children}) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);


 

    useEffect(() => {
        const verifyUser = async () => {
            try{

                if(!localStorage.getItem('token')){
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/auth/verify',{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if(response.data.success){
                    setUser(response.data.user);
                } else {
                    setUser(null);
                    setLoading(false);
                }
            } catch(err){
                console.error("Error verifying user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }

        }
        verifyUser();
    },[])

    const login=(user)=>{
        setUser(user)
    }

    const logout=()=>{
        setUser(null)
        localStorage.removeItem('token');
    }   

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  )
}

export const useAuth = () => useContext(userContext);
export default AuthContext;