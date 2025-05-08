import { createContext, useContext, useEffect, useState } from 'react';
import api from "@/api/axios";
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { token } = useAuth();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserRole = async () => {
        try {
            if (!token) {
                setRole(null);
                return;
            }

            const response = await api.get(`/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRole(response.data.user?.role || null);
        } catch (error) {
            console.error("Failed to fetch user role:", error);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            setLoading(true);
            fetchUserRole();
        } else {
            setRole(null);
            setLoading(false);
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ role, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserRole = () => useContext(UserContext);
