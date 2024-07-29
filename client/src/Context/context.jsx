import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [ user, setUser ]= useState(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    })

    useEffect(() => {
        if(user) {
            sessionStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.removeItem("user");
        }
    }, [user])

    const login = (userData) => {
        setUser(userData);
    }
    const logout = () => {
        setUser(null);
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if(context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}