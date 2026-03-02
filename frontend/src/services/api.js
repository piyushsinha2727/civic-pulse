import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const issueService = {
    getIssues: async () => {
        const response = await api.get('/issues');
        return response.data;
    },

    reportIssue: async (formData) => {
        // formData should be instance of FormData (multipart/form-data)
        const response = await api.post('/issues/report', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateIssueStatus: async (id, status) => {
        const response = await api.patch(`/issues/${id}/status`, { status });
        return response.data;
    }
};

export default api;
