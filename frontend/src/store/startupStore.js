import { create } from 'zustand';
import startupService from '../services/startupService';

export const useStartupStore = create((set, get) => ({
    startups: [],
    currentStartup: null,
    isLoading: false,
    error: null,

    fetchStartups: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const startups = await startupService.fetchAll(filters);
            set({ startups, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchStartupDetails: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const currentStartup = await startupService.fetchById(id);
            set({ currentStartup, isLoading: false });
            return currentStartup;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    createStartup: async (startupData) => {
        set({ isLoading: true, error: null });
        try {
            const startup = await startupService.create(startupData);
            set((state) => ({
                startups: [startup, ...state.startups],
                isLoading: false
            }));
            return startup;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    updateStartup: async (id, updateData) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await startupService.update(id, updateData);
            set((state) => ({
                startups: state.startups.map(s => s.id === id ? updated : s),
                currentStartup: state.currentStartup?.id === id ? updated : state.currentStartup,
                isLoading: false
            }));
            return updated;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    addMember: async (startupId, memberData) => {
        try {
            const member = await startupService.addMember(startupId, memberData);
            set((state) => {
                if (state.currentStartup?.id === startupId) {
                    const members = [...(state.currentStartup.members || []), member];
                    return {
                        currentStartup: { ...state.currentStartup, members }
                    };
                }
                return {};
            });
            return member;
        } catch (err) {
            throw err;
        }
    },

    removeMember: async (startupId, memberId) => {
        try {
            await startupService.removeMember(startupId, memberId);
            set((state) => {
                if (state.currentStartup?.id === startupId) {
                    const members = (state.currentStartup.members || []).filter(m => m.id !== memberId);
                    return {
                        currentStartup: { ...state.currentStartup, members }
                    };
                }
                return {};
            });
        } catch (err) {
            throw err;
        }
    }
}));
