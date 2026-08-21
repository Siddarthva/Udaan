import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const login = useAuthStore((state) => state.login);
    const signup = useAuthStore((state) => state.signup);
    const logout = useAuthStore((state) => state.logout);
    const updateProfile = useAuthStore((state) => state.updateProfile);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile
    };
};
