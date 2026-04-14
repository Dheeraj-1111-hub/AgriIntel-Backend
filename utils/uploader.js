import multer from "multer";

// ============================================
// MEMORY STORAGE (RENDER SAFE)
// ============================================

const storage = multer.memoryStorage();

// ============================================
// FILE FILTER (VALIDATION)
// ============================================

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP allowed."));
  }
};

// ============================================
// MULTER INSTANCE
// ============================================

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  }
});