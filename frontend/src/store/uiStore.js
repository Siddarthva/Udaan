import { create } from 'zustand';

export const useUIStore = create((set) => ({
    // Sidebar
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    // Notifications Engine
    notifications: [],
    addNotification: (notification) => set((state) => ({
        notifications: [{ ...notification, id: Date.now(), timestamp: new Date() }, ...state.notifications],
        notificationsCount: state.notificationsCount + 1
    })),
    clearNotifications: () => set({ notifications: [], notificationsCount: 0 }),

    // Global Overlays (Modals / Drawers)
    activeOverlay: null, // 'AUDIT_DRAWER' | 'DOSSIER_VIEWER' | 'SCENARIO_SIMULATOR' | 'VENTURE_WIZARD' | 'DEAL_WIZARD' | 'DISCOVERY_WIZARD' | 'SCHEDULE_SESSION' | 'REGISTRY_VIEWER' | 'COMPLIANCE_CONSOLE'
    overlayData: null,

    openOverlay: (type, data = null) => set({ activeOverlay: type, overlayData: data }),
    closeOverlay: () => set({ activeOverlay: null, overlayData: null })
}));
