import { create } from 'zustand';
import { mentorApi } from '../api/api';
import { errorMessage } from '../api/axios';

export const useMentorStore = create((set) => ({
    requests: [],
    isLoading: false,
    error: null,

    sendMentorshipRequest: async (startupId, message) => {
        set({ isLoading: true, error: null });
        try {
            const request = await mentorApi.sendRequest(startupId, message);
            set((state) => ({
                requests: [request, ...state.requests],
                isLoading: false
            }));
            return request;
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
            throw err;
        }
    },

    fetchMentorRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const requests = await mentorApi.fetchRequests();
            set({ requests, isLoading: false });
        } catch (err) {
            set({ error: errorMessage(err), isLoading: false });
        }
    },

    updateRequestStatus: async (requestId, status) => {
        try {
            const updated = await mentorApi.updateRequestStatus(requestId, status);
            set((state) => ({
                requests: state.requests.map(r => r.id === requestId ? updated : r)
            }));
            return updated;
        } catch (err) {
            set({ error: errorMessage(err) });
            throw err;
        }
    }
}));
