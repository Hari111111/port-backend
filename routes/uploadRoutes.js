import express from "express";
import { imageUpload, pdfUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
router.post("/image", imageUpload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }
    // multer-storage-cloudinary provides path/filename which is the URL/PublicId in Cloudinary
    return res.status(200).json({
      message: "Image uploaded successfully",
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({ message: "Error uploading image to Cloudinary" });
  }
});

// @desc    Upload PDF to Cloudinary
// @route   POST /api/upload/pdf
router.post("/pdf", pdfUpload.single("pdf"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded." });
    }
    // multer-storage-cloudinary provides path/filename which is the URL/PublicId in Cloudinary
    return res.status(200).json({
      message: "PDF uploaded successfully",
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return res.status(500).json({ message: "Error uploading PDF to Cloudinary" });
  }
});

export default router;
