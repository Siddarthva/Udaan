import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

export const AppProviders = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </AuthProvider>
        </QueryClientProvider>
    );
};
