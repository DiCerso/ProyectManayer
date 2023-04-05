import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { clientAxios } from '../config/clientAxios';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()

    const [Allusers, setAllusers] = useState([]);



    useEffect(() => {

        const authUser = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setLoading(false)
                return null
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            }

            try {
                const { data } = await clientAxios.get('/users/profile', config);
                setAuth(data.user);

            } catch (error) {
                console.error(error.response?.data);
                sessionStorage.removeItem('token')
            } finally {
                setLoading(false)
            }
        }

        authUser()


    }, []);

    const logout = async () => {
        const token = sessionStorage.removeItem('token');
        if (!token) {
            setLoading(false)
            navigate('/');
            return null
        }
    }

    const users = async () => {
        const token = sessionStorage.getItem('token');
            if (!token) return null;

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            }
        try {
            const { data } = await clientAxios.get('/users', config);
            await setAllusers(data.user)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider
            value={
                {
                    auth,
                    setAuth,
                    loading,
                    logout,
                    Allusers,
                    users
                }
            }
        >
            {children}

        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext
