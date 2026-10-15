import { create } from 'zustand';
import { startupApi } from '../api/api';
import { errorMessage } from '../api/axios';

export const useStartupStore = create((set) => ({
    startups: [],
    currentStartup: null,
    isLoading: false,
    error: null,

    fetchStartups: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const startups = await startupApi.fetchAll(filters);
            set({ startups, isLoading: false });
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
        }
    },

    fetchStartupDetails: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const currentStartup = await startupApi.fetchById(id);
            set({ currentStartup, isLoading: false });
            return currentStartup;
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
            throw err;
        }
    },

    createStartup: async (startupData) => {
        set({ isLoading: true, error: null });
        try {
            const startup = await startupApi.create(startupData);
            set((state) => ({
                startups: [startup, ...state.startups],
                isLoading: false
            }));
            return startup;
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
            throw err;
        }
    },

    updateStartup: async (id, updateData) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await startupApi.update(id, updateData);
            set((state) => ({
                startups: state.startups.map(s => s.id === id ? updated : s),
                currentStartup: state.currentStartup?.id === id ? updated : state.currentStartup,
                isLoading: false
            }));
            return updated;
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
            throw err;
        }
    },

    addMember: async (startupId, memberData) => {
        const member = await startupApi.addMember(startupId, memberData);
        set((state) => {
            if (state.currentStartup?.id === startupId) {
                const members = [...(state.currentStartup.members || []), member];
                return { currentStartup: { ...state.currentStartup, members } };
            }
            return {};
        });
        return member;
    },

    removeMember: async (startupId, memberId) => {
        await startupApi.removeMember(startupId, memberId);
        set((state) => {
            if (state.currentStartup?.id === startupId) {
                const members = (state.currentStartup.members || []).filter(m => m.id !== memberId);
                return { currentStartup: { ...state.currentStartup, members } };
            }
            return {};
        });
    },

    uploadPitchDeck: async (startupId, file) => {
        set({ isLoading: true, error: null });
        try {
            const { url } = await startupApi.uploadFile(file, 'pitch-decks');
            const updated = await startupApi.update(startupId, { pitch_deck_url: url });
            set((state) => ({
                startups: state.startups.map(s => s.id === startupId ? updated : s),
                currentStartup: state.currentStartup?.id === startupId ? updated : state.currentStartup,
                isLoading: false
            }));
            return updated;
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
            throw err;
        }
    }
}));
