import fs from "fs";
import path from "path";
import { config } from "../../config/index.js";
import { generateFileName, RENAME_STRATEGIES, getFileInfo } from "../../utils/file-utils.js";

export async function uploadFile(file, destination, options = {}) {
  try {
    if (!file || !file.buffer) {
      throw new Error('Invalid file data: missing file or buffer');
    }

    const uploadDir = path.join(config.upload.dir, destination);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get renaming strategy from options or use default
    const strategy = options.renameStrategy || RENAME_STRATEGIES.UUID;
    const userId = options.userId || null;

    // Generate new filename
    const newFileName = generateFileName(file, strategy, userId);
    
    // Log file info for debugging
    const fileInfo = getFileInfo(file);
    console.log(`File upload: ${fileInfo.originalName} -> ${newFileName} (${(fileInfo.size / 1024 / 1024).toFixed(2)}MB)`);

    const filePath = path.join(uploadDir, newFileName);
    await fs.promises.writeFile(filePath, file.buffer);
    
    return `/uploads/${destination}/${newFileName}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

export async function deleteFile(filePath) {
  await fs.promises.unlink(path.join(config.upload.dir, filePath));
} 
