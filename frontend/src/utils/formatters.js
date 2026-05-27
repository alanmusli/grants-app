/**
 * Formats numerical amounts into Macedonian Denars (MKD).
 * Ensures consistency across the budget overview and grant application costs.
 * * @param {number} amount - The financial amount to format
 * @returns {string} - Formatted string (e.g., "100.000 MKD")
 */
export const formatCurrencyMKD = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '0 MKD';
    }
    
    return new Intl.NumberFormat('mk-MK', {
        style: 'currency',
        currency: 'MKD',
        minimumFractionDigits: 0, // The budget requires 1 MKD precision
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Formats a standard ISO date string or Date object into a readable local format (DD.MM.YYYY).
 * * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return 'Непознат датум';
    
    const d = new Date(date);
    return new Intl.DateTimeFormat('mk-MK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(d);
};