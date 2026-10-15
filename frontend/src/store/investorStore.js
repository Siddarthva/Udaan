import { create } from 'zustand';
import { investorApi } from '../api/api';
import { errorMessage } from '../api/axios';

export const useInvestorStore = create((set, get) => ({
    watchlist: [],
    interests: [],
    isLoading: false,
    error: null,

    fetchWatchlist: async () => {
        set({ isLoading: true, error: null });
        try {
            const watchlist = await investorApi.fetchWatchlist();
            set({ watchlist, isLoading: false });
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
        }
    },

    toggleSaveStartup: async (startupId) => {
        try {
            const result = await investorApi.toggleSave(startupId);
            await get().fetchWatchlist();
            return result.saved;
        } catch (err) {
            set({ error: errorMessage(err) });
            throw err;
        }
    },

    expressInterest: async (startupId, notes) => {
        set({ isLoading: true, error: null });
        try {
            const interest = await investorApi.expressInterest(startupId, notes);
            set((state) => ({
                interests: [interest, ...state.interests],
                isLoading: false
            }));
            return interest;
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
            throw err;
        }
    },

    fetchInvestorInterests: async () => {
        set({ isLoading: true, error: null });
        try {
            const interests = await investorApi.fetchInterests();
            set({ interests, isLoading: false });
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
        }
    }
}));
