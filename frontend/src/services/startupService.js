import api from "../api/axios";

class StartupService {
    async fetchAll(filters = {}) {
        const response = await api.get("/startups", { params: filters });
        return response.data.startups;
    }

    async fetchById(id) {
        const response = await api.get(`/startups/${id}`);
        return response.data.startup;
    }

    async create(startupData) {
        const response = await api.post("/startups/launch", startupData);
        return response.data.startup;
    }

    async update(id, updateData) {
        const response = await api.patch(`/startups/${id}`, updateData);
        return response.data.startup;
    }

    async addMember(startupId, memberData) {
        const response = await api.post(`/startups/${startupId}/members`, memberData);
        return response.data.member;
    }

    async removeMember(startupId, memberId) {
        const response = await api.delete(`/startups/${startupId}/members/${memberId}`);
        return response.data;
    }
}

export default new StartupService();
