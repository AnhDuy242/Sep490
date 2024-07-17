import React, { createContext, useState, useEffect } from 'react';
import { login, logout } from '../services/Authentication';
import { jwtDecode } from 'jwt-decode'; 
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
        if (storedToken && storedTokenTimestamp) {
            const currentTime = new Date().getTime();
            const tokenAge = currentTime - parseInt(storedTokenTimestamp);
            if (tokenAge < 3600000) { // 1 hour in milliseconds
                setToken(storedToken);
                setIsLoggedIn(true);
                const decoded = jwtDecode(storedToken);
                setRole(decoded.role);
            } else {
                handleTokenExpiration();
            }
        }
    }, []);

    const handleTokenExpiration = () => {
        logout();
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTimestamp');
        setToken(null);
        setIsLoggedIn(false);
        setRole(null);
    };

    const updateToken = (newToken) => {
        setToken(newToken);
        setIsLoggedIn(true);
        const decoded = jwtDecode(newToken);
        setRole(decoded.role);
        localStorage.setItem('token', newToken);
        localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
    };

    const authContextValue = {
        isLoggedIn,
        token,
        role,
        updateToken,
        logout: handleTokenExpiration,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
