import api from "../api/axios";

class InvestorService {
    async toggleSave(startupId) {
        const response = await api.post(`/startups/${startupId}/save`);
        return response.data; // { message, saved }
    }

    async fetchWatchlist() {
        const response = await api.get("/startups/relations/saved");
        return response.data.saved;
    }

    async expressInterest(startupId, notes) {
        const response = await api.post(`/startups/${startupId}/express-interest`, { notes });
        return response.data.interest;
    }

    async fetchInterests() {
        const response = await api.get("/startups/relations/interests");
        return response.data.interests;
    }
}

export default new InvestorService();
