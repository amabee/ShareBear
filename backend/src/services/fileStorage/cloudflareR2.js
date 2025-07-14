export async function uploadFile(file, destination) {
  
  return `https://r2.example.com/${destination}/${file.originalname}`;
}

export async function deleteFile(filePath) {
  // TODO: Implement Cloudflare R2 delete logic
}
