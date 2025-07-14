const driver = process.env.FILE_STORAGE_DRIVER || "local";
let storage;

if (driver === "cloudflareR2") {
  storage = await import("./cloudflareR2.js");
} else {
  storage = await import("./local.js");
}

export const uploadFile = storage.uploadFile;
export const deleteFile = storage.deleteFile; 
