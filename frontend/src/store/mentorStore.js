import { create } from 'zustand';
import mentorService from '../services/mentorService';

export const useMentorStore = create((set, get) => ({
    requests: [],
    isLoading: false,
    error: null,

    sendMentorshipRequest: async (startupId, message) => {
        set({ isLoading: true, error: null });
        try {
            const request = await mentorService.sendRequest(startupId, message);
            set((state) => ({
                requests: [request, ...state.requests],
                isLoading: false
            }));
            return request;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    fetchMentorRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const requests = await mentorService.fetchRequests();
            set({ requests, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateRequestStatus: async (requestId, status) => {
        try {
            const updated = await mentorService.updateRequestStatus(requestId, status);
            set((state) => ({
                requests: state.requests.map(r => r.id === requestId ? updated : r)
            }));
            return updated;
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    }
}));
