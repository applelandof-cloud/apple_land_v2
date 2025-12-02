import axios from 'axios';

// Function to get CSRF token from meta tag
const getCsrfToken = () => {
    const tokenElement = document.querySelector('meta[name="csrf-token"]');
    return tokenElement ? tokenElement.getAttribute('content') : '';
};

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// Add a request interceptor to include the CSRF token
apiClient.interceptors.request.use(config => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
