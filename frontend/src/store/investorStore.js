import { create } from 'zustand';
import investorService from '../services/investorService';

export const useInvestorStore = create((set, get) => ({
    watchlist: [],
    interests: [],
    isLoading: false,
    error: null,

    fetchWatchlist: async () => {
        set({ isLoading: true, error: null });
        try {
            const watchlist = await investorService.fetchWatchlist();
            set({ watchlist, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    toggleSaveStartup: async (startupId) => {
        try {
            const result = await investorService.toggleSave(startupId);
            // Re-fetch watchlist to ensure proper sync with database
            await get().fetchWatchlist();
            return result.saved;
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    expressInterest: async (startupId, notes) => {
        set({ isLoading: true, error: null });
        try {
            const interest = await investorService.expressInterest(startupId, notes);
            set((state) => ({
                interests: [interest, ...state.interests],
                isLoading: false
            }));
            return interest;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    fetchInvestorInterests: async () => {
        set({ isLoading: true, error: null });
        try {
            const interests = await investorService.fetchInterests();
            set({ interests, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    }
}));
