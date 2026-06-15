import api from "../api/axios";

class MentorService {
    async sendRequest(startupId, message) {
        const response = await api.post(`/startups/${startupId}/mentor-request`, { message });
        return response.data.request;
    }

    async fetchRequests() {
        const response = await api.get("/startups/relations/mentor-requests");
        return response.data.requests;
    }

    async updateRequestStatus(requestId, status) {
        const response = await api.patch(`/startups/relations/mentor-requests/${requestId}`, { status });
        return response.data.request;
    }
}

export default new MentorService();
