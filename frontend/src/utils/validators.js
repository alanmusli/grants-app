/**
 * Checks if a required text input is empty or just whitespace.
 * Used for mandatory fields in the grant application.
 * * @param {string} value - The input value to check
 * @returns {boolean} - True if valid, false if empty
 */
export const isNotEmpty = (value) => {
    return value !== undefined && value !== null && String(value).trim() !== '';
};

/**
 * Enforces the strict 500-character limit for the Dean's Office justification 
 * when approving or rejecting an application.
 * * @param {string} text - The justification text
 * @returns {boolean} - True if within limits, false if exceeded
 */
export const validateJustificationLimit = (text) => {
    if (!text) return true; // Empty justification might be allowed depending on final business rules
    return String(text).length <= 500;
};

/**
 * Basic client-side sanitization to escape dangerous characters.
 * Prevents basic XSS rendering issues on the frontend.
 * * @param {string} text - The raw input text
 * @returns {string} - The sanitized text
 */
export const sanitizeClientInput = (text) => {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return String(text).replace(reg, (match) => (map[match]));
};

/**
 * Validates that an estimated cost is a positive number.
 * * @param {number|string} cost - The estimated cost input
 * @returns {boolean} - True if valid
 */
export const isPositiveAmount = (cost) => {
    const num = parseFloat(cost);
    return !isNaN(num) && num > 0;
};