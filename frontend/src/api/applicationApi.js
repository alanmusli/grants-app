import api from './axiosConfig';

/**
 * API calls related to Grant Applications and Reports
 */
export const applicationApi = {
    /**
     * Submits a new grant application.
     * @param {Object} formData - The application data from the form.
     * @returns {Promise} Axios response promise
     */
    submitApplication: async (formData) => {
        // FIXED: Point to '/applications' instead of '/applications/submit'
        // We let Axios use its default 'application/json' format to match our prototype backend
        return await api.post('/applications', formData);
    },

    /**
     * Updates the status of an application (Restricted to Dean's Office).
     * @param {string} applicationId - The ID of the application
     * @param {string} status - 'во разгледување', 'одобрено', or 'одбиено'
     * @param {string} justification - Max 500 characters
     * @returns {Promise} Axios response promise
     */
    updateStatus: async (applicationId, status, justification) => {
        return await api.put('/applications/status', {
            applicationId,
            status,
            justification
        });
    },

    /**
     * Submits the mandatory post-travel financial report.
     * @param {FormData} formData - Must contain the single PDF file and the applicationId.
     * @returns {Promise} Axios response promise
     */
    submitPostTravelReport: async (formData) => {
        return await api.post('/applications/report', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    /**
     * Fetches a list of applications. 
     * The backend should automatically filter this based on the user's role 
     * (e.g., Scientists see their own, Dean sees all).
     * @returns {Promise} Axios response promise containing the application array
     */
    /**
     * Fetches a single application by its ID.
     */
    getApplicationById: async (id) => {
        return await api.get(`/applications/${id}`);
    },
    getApplications: async () => {
        return await api.get('/applications');
    }
};