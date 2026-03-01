import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../../../services/authService";

const AuthContext = createContext(undefined);

/**
 * AuthProvider: Central hub for user session state.
 * Restores sessions from localStorage and interacts with the mock AuthService.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const session = await authService.getCurrentUser();
                if (session && session.user) {
                    setUser(session.user);
                }
            } catch (e) {
                console.error("[AUTH]: Session restoration failed", e);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = async (email, role, fullName) => {
        setLoading(true);
        try {
            const session = await authService.login(email, role, fullName);
            setUser(session.user);
            return session;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const session = await authService.register(userData);
            setUser(session.user);
            return session;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
