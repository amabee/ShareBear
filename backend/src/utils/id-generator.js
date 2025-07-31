import crypto from 'crypto';

/**
 * Generates a secure random ID for posts
 * Format: 32 character alphanumeric string
 * Example: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
 */
export const generateSecureId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Generates a shorter secure ID (16 characters)
 * Format: 16 character alphanumeric string
 * Example: "a1b2c3d4e5f6g7h8"
 */
export const generateShortSecureId = () => {
  return crypto.randomBytes(8).toString('hex');
};

/**
 * Validates if a string is a valid secure ID format
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidSecureId = (id) => {
  return typeof id === 'string' && /^[a-f0-9]{32}$/.test(id);
};

/**
 * Validates if a string is a valid short secure ID format
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidShortSecureId = (id) => {
  return typeof id === 'string' && /^[a-f0-9]{16}$/.test(id);
}; 
