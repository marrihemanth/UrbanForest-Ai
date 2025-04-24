import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add JWT token to requests if it exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.message || 'An unexpected error occurred';
        return Promise.reject({ ...error, message });
    }
);

export const auth = {
    register: async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    login: async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            return response;
        } catch (error) {
            throw error;
        }
    },
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export const trees = {
    create: (treeData) => api.post('/trees', treeData),
    getAll: () => api.get('/trees'),
    getById: (id) => api.get(`/trees/${id}`),
    getRecommendations: (data) => api.post('/trees/recommend', data)
};

export const plantingRecords = {
    create: (recordData) => api.post('/planting/plant', recordData),
    getUserRecords: () => api.get('/planting/records')
};

export default api;