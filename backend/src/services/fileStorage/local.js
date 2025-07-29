import fs from "fs";
import path from "path";
import { config } from "../../config/index.js";

export async function uploadFile(file, destination) {
  try {
    if (!file || !file.buffer) {
      throw new Error('Invalid file data: missing file or buffer');
    }

    const uploadDir = path.join(config.upload.dir, destination);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalname);
    await fs.promises.writeFile(filePath, file.buffer);
    return `/uploads/${destination}/${file.originalname}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

export async function deleteFile(filePath) {
  await fs.promises.unlink(path.join(config.upload.dir, filePath));
} 
