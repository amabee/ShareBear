import crypto from 'crypto';
import path from 'path';

/**
 * File renaming strategies
 */
export const RENAME_STRATEGIES = {
  UUID: 'uuid',           // Generate UUID-based names
  TIMESTAMP: 'timestamp', // Timestamp + random string
  HASH: 'hash',          // File content hash
  USER_SPECIFIC: 'user_specific', // Include user ID
  ORIGINAL: 'original'    // Keep original name (fallback)
};

/**
 * Generate a unique filename based on the selected strategy
 * @param {Object} file - The uploaded file object
 * @param {string} strategy - The renaming strategy to use
 * @param {string} userId - User ID (required for user_specific strategy)
 * @returns {string} The new filename with extension
 */
export function generateFileName(file, strategy = RENAME_STRATEGIES.UUID, userId = null) {
  const extension = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, extension);
  
  let newFileName;
  
  switch (strategy) {
    case RENAME_STRATEGIES.UUID:
      // Generate UUID-based name
      newFileName = crypto.randomUUID();
      break;
      
    case RENAME_STRATEGIES.TIMESTAMP:
      // Timestamp + random string
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      newFileName = `${timestamp}_${randomString}`;
      break;
      
    case RENAME_STRATEGIES.HASH:
      // File content hash (SHA-256)
      const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
      newFileName = hash.substring(0, 32); // Use first 32 characters for better uniqueness
      break;
      
    case RENAME_STRATEGIES.USER_SPECIFIC:
      // User ID + timestamp + random string
      if (!userId) {
        throw new Error('User ID is required for user_specific naming strategy');
      }
      const userTimestamp = Date.now();
      const userRandom = crypto.randomBytes(4).toString('hex');
      newFileName = `user_${userId}_${userTimestamp}_${userRandom}`;
      break;
      
    case RENAME_STRATEGIES.ORIGINAL:
    default:
      // Keep original name but sanitize it
      newFileName = sanitizeFileName(baseName);
      break;
  }
  
  return `${newFileName}${extension}`;
}

/**
 * Sanitize filename to remove special characters and spaces
 * @param {string} filename - The filename to sanitize
 * @returns {string} Sanitized filename
 */
function sanitizeFileName(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .replace(/_+/g, '_')              // Replace multiple underscores with single
    .replace(/^_|_$/g, '')            // Remove leading/trailing underscores
    .toLowerCase();
}

/**
 * Get file info for logging/debugging
 * @param {Object} file - The uploaded file object
 * @returns {Object} File information
 */
export function getFileInfo(file) {
  return {
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    extension: path.extname(file.originalname)
  };
} 
