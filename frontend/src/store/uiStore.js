import { create } from 'zustand';

export const useUIStore = create((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    notificationsCount: 0,
    incrementNotifications: () => set((state) => ({ notificationsCount: state.notificationsCount + 1 })),
    clearNotifications: () => set({ notificationsCount: 0 }),
}));
