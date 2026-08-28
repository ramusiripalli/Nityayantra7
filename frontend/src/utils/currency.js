/**
 * Format a number as Indian Rupee currency (₹)
 * @param {number} amount 
 * @returns {string} e.g. "₹1,499"
 */
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate percentage discount
 * @param {number} originalPrice 
 * @param {number} currentPrice 
 * @returns {number} discount percentage rounded
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
