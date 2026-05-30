import axios from 'axios';

const api = axios.create({
    // FIXED: Point to the local secure backend for development
    baseURL: 'https://localhost/api',    
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Global Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Just reject the error, let AuthContext handle the unauthenticated state gracefully!
        if (error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized.");
        }
        return Promise.reject(error);
    }
);
export default api;