import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_BASE_URL;

const apiClient = axios.create({
    baseURL: apiUrl,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.token = `${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
