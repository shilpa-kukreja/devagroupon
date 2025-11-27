// middleware/brandUpload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const brandDir = path.join(process.cwd(), "uploads/brands");
if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, brandDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const brandMiddleware = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default brandMiddleware;