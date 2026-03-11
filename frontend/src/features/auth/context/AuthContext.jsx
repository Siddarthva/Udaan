import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const AuthContext = createContext(undefined);

/**
 * AuthProvider: Central hub for user session state.
 * Restores sessions from localStorage and interacts with the mock AuthService.
 */
export const AuthProvider = ({ children }) => {
    const { user, loadUserFromLocalStorage, logout: storeLogout } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore auth state from localStorage-backed Zustand store
        loadUserFromLocalStorage();
        setLoading(false);
    }, [loadUserFromLocalStorage]);

    // Keep the context API compatible, even though actual
    // login/signup flows now use the auth store directly.
    const login = async () => {
        console.warn("[AuthContext]: login is now handled via the auth store and AuthPage forms.");
    };

    const logout = () => {
        storeLogout();
        navigate('/', { replace: true });
    };

    const register = async () => {
        console.warn("[AuthContext]: register is now handled via the auth store and AuthPage forms.");
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
