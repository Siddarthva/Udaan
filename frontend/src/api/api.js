import api from "./axios";

// Authentication API
export const authApi = {
    login: async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get("/auth/me");
        return response.data.user;
    },
    checkUsername: async (username) => {
        const response = await api.get(`/auth/check-username/${encodeURIComponent(username)}`);
        return response.data;
    },
    updateProfile: async (profileData) => {
        const response = await api.patch("/auth/profile", profileData);
        return response.data;
    }
};

// Activity Feed API
export const activityApi = {
    fetchAll: async () => {
        const response = await api.get("/startups/activity");
        return response.data.activities;
    }
};

// Community API
export const communityApi = {
    fetchMembers: async (filters = {}) => {
        const response = await api.get("/community", { params: filters });
        return response.data.members;
    },
    searchMembers: async (query) => {
        const response = await api.get("/community/search", { params: { q: query } });
        return response.data.members;
    }
};

// AI Assistant API
export const aiApi = {
    generateBio: async (data) => {
        const response = await api.post("/ai/bio", data);
        return response.data.bio;
    },
    generateStartupDescription: async (data) => {
        const response = await api.post("/ai/startup-description", data);
        return response.data.description;
    },
    generateStartupNames: async (data) => {
        const response = await api.post("/ai/startup-name", data);
        return response.data.names;
    },
    generateElevatorPitch: async (data) => {
        const response = await api.post("/ai/elevator-pitch", data);
        return response.data.pitch;
    }
};

// Unified Requests API
export const requestsApi = {
    create: async (requestData) => {
        const response = await api.post("/requests", requestData);
        return response.data.request;
    },
    fetchAll: async (status) => {
        const response = await api.get("/requests", { params: { status } });
        return response.data.requests;
    },
    accept: async (requestId) => {
        const response = await api.patch(`/requests/${requestId}/accept`);
        return response.data;
    },
    reject: async (requestId) => {
        const response = await api.patch(`/requests/${requestId}/reject`);
        return response.data;
    }
};

// Startups API
export const startupApi = {
    fetchAll: async (filters = {}) => {
        const response = await api.get("/startups", { params: filters });
        return response.data.startups;
    },
    fetchTrending: async () => {
        const response = await api.get("/startups/trending");
        return response.data.startups;
    },
    fetchAnalytics: async (id) => {
        const response = await api.get(`/startups/${id}/analytics`);
        return response.data.analytics;
    },
    fetchById: async (id) => {
        const response = await api.get(`/startups/${id}`);
        return response.data.startup;
    },
    create: async (startupData) => {
        const response = await api.post("/startups/launch", startupData);
        return response.data.startup;
    },
    update: async (id, updateData) => {
        const response = await api.patch(`/startups/${id}`, updateData);
        return response.data.startup;
    },
    invest: async (id, investmentData) => {
        const response = await api.post(`/startups/${id}/invest`, investmentData);
        return response.data.transaction;
    },
    addMember: async (startupId, memberData) => {
        const response = await api.post(`/startups/${startupId}/members`, memberData);
        return response.data.member;
    },
    removeMember: async (startupId, memberId) => {
        const response = await api.delete(`/startups/${startupId}/members/${memberId}`);
        return response.data;
    },
    uploadFile: async (file, bucket = "pitch-decks") => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);
        const response = await api.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    },
    fetchUpdates: async (startupId) => {
        const response = await api.get(`/startups/${startupId}/updates`);
        return response.data.updates;
    },
    createUpdate: async (startupId, updateData) => {
        const response = await api.post(`/startups/${startupId}/updates`, updateData);
        return response.data.update;
    },
    deleteUpdate: async (updateId) => {
        const response = await api.delete(`/startups/updates/${updateId}`);
        return response.data;
    }
};

// Investor Relations API
export const investorApi = {
    toggleSave: async (startupId) => {
        const response = await api.post(`/startups/${startupId}/save`);
        return response.data;
    },
    fetchWatchlist: async () => {
        const response = await api.get("/startups/relations/saved");
        return response.data.saved;
    },
    expressInterest: async (startupId, notes) => {
        const response = await api.post(`/startups/${startupId}/express-interest`, { notes });
        return response.data.interest;
    },
    fetchInterests: async () => {
        const response = await api.get("/startups/relations/interests");
        return response.data.interests;
    }
};

// Mentor Relations API
export const mentorApi = {
    sendRequest: async (startupId, message) => {
        const response = await api.post(`/startups/${startupId}/mentor-request`, { message });
        return response.data.request;
    },
    fetchRequests: async () => {
        const response = await api.get("/startups/relations/mentor-requests");
        return response.data.requests;
    },
    updateRequestStatus: async (requestId, payload) => {
        const response = await api.patch(`/messages/request/${requestId}`, typeof payload === 'string' ? { status: payload } : payload);
        return response.data;
    }
};

// Follow API
export const followApi = {
    followUser: async (userId) => {
        const response = await api.post(`/follow/user/${userId}`);
        return response.data;
    },
    unfollowUser: async (userId) => {
        const response = await api.delete(`/follow/user/${userId}`);
        return response.data;
    },
    followStartup: async (startupId) => {
        const response = await api.post(`/follow/startup/${startupId}`);
        return response.data;
    },
    unfollowStartup: async (startupId) => {
        const response = await api.delete(`/follow/startup/${startupId}`);
        return response.data;
    },
    fetchFollowers: async () => {
        const response = await api.get("/follow/followers");
        return response.data.followers;
    },
    fetchFollowing: async () => {
        const response = await api.get("/follow/following");
        return response.data.following;
    }
};

// Notifications API
export const notificationsApi = {
    fetchAll: async () => {
        const response = await api.get("/notifications");
        return response.data.notifications;
    },
    markRead: async () => {
        const response = await api.post("/notifications/read");
        return response.data;
    },
    markSingleRead: async (id) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    }
};

// Messages API
export const messagesApi = {
    fetchConversations: async () => {
        const response = await api.get("/messages/conversations");
        return response.data.conversations;
    },
    fetchMessageRequests: async () => {
        const response = await api.get("/messages/requests");
        return response.data.requests;
    },
    updateRequestStatus: async (requestId, payload) => {
        const response = await api.patch(`/messages/request/${requestId}`, typeof payload === 'string' ? { status: payload } : payload);
        return response.data;
    },
    fetchHistory: async (conversationId) => {
        const response = await api.get(`/messages/${conversationId}`);
        return response.data.messages;
    },
    sendMessage: async (messageData) => {
        const response = await api.post("/messages/send", messageData);
        return response.data.message;
    },
    markRead: async (conversationId) => {
        const response = await api.patch(`/messages/${conversationId}/read`);
        return response.data;
    }
};
