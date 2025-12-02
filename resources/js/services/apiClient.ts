import { toast } from '@/lib/toast';
import axios, { isAxiosError } from 'axios';

// Function to get CSRF token from meta tag
const getCsrfToken = () => {
    const tokenElement = document.querySelector('meta[name="csrf-token"]');
    return tokenElement ? tokenElement.getAttribute('content') : '';
};

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
});

// Add a request interceptor to include the CSRF token
apiClient.interceptors.request.use(
    (config) => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error)) {
            const message =
                error.response?.data?.message ||
                'Ha ocurrido un error inesperado.';
            const title = 'Error';
            if (error.response?.status !== 422) {
                toast.error(message, title);
            }
        }
        return Promise.reject(error);
    },
);

export default apiClient;
