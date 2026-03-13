import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary Storage for Images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    resource_type: "image",
  },
});

// Configure Cloudinary Storage for PDFs
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio/documents",
    allowed_formats: ["pdf"],
    resource_type: "auto", // Automatically detect PDF or image
  },
});

// Create Multer instances
const imageUpload = multer({ storage: imageStorage });
const pdfUpload = multer({ storage: pdfStorage });

export { imageUpload, pdfUpload };
