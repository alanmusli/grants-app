// casService.js
const axios = require('axios');

/**
 * Validates a CAS ticket against the central authentication server.
 * * @param {string} ticket - The ticket string returned by CAS
 * @param {string} serviceUrl - The exact URL the CAS server redirected to
 * @returns {Promise<string|null>} - Returns the username if valid, null if invalid
 */
exports.validateTicket = async (ticket, serviceUrl) => {
    const casBaseUrl = 'https://cas.finki.ukim.mk';
    
    try {
        const validationUrl = `${casBaseUrl}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(serviceUrl)}`;
        
        // TODO: Execute real HTTP request
        // const response = await axios.get(validationUrl);
        
        /* if (response.data.includes('cas:authenticationSuccess')) {
            const match = response.data.match(/<cas:user>(.*?)<\/cas:user>/);
            return match ? match[1] : null;
        }
        return null;
        */

        // Mock validation for local testing purposes
        console.log(`[CAS MOCK] Validating ticket: ${ticket}`);
        if (ticket === 'mock_valid_ticket') {
            return 'v.rendevski'; // Mock username
        }
        
        return null; // Invalid ticket

    } catch (error) {
        console.error('Error validating CAS ticket:', error);
        throw new Error('CAS Server Communication Failure');
    }
};