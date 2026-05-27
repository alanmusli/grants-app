import api from './axiosConfig';

/**
 * API calls related to Authentication and Session Management
 */
export const authApi = {
    /**
     * Ends the local session and triggers a redirect to the central CAS logout.
     * @returns {Promise} Axios response promise
     */
    logout: async () => {
        // We use a POST request for logout to prevent CSRF attacks, 
        // even though the backend eventually redirects.
        return await api.post('/auth/logout');
    },

    /**
     * (Optional/Recommended) Fetches the current user's profile and RBAC role.
     * Useful for populating the React AuthContext on initial app load.
     */
    getCurrentUser: async () => {
        return await api.get('/auth/me');
    }
};