const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dynamic Storage Engine: Creates a unique folder for each hotel
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const hotelName = req.body.name.replace(/\s+/g, "-").toLowerCase(); // Convert name to lowercase and replace spaces with dashes
    const uploadPath = `uploads/${hotelName}`;

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter
});

module.exports = upload;
