const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to create Cloudinary storage for a given folder and resource type
const cloudinaryStorage = (folder, resourceType = "image") =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `skills2career/${folder}`,
      resource_type: resourceType,
      allowed_formats:
        resourceType === "image"
          ? ["jpg", "jpeg", "png", "webp"]
          : ["pdf", "doc", "docx", "png", "jpg", "jpeg"],
    },
  });

// File filters (same as before for early client-side validation)
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(file.originalname.toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only JPEG, JPG, PNG, WEBP images are allowed"));
};

const docFilter = (req, file, cb) => {
  const allowedMime =
    /application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|image\/png|image\/jpeg|image\/jpg/;
  const mime = allowedMime.test(file.mimetype);
  if (mime) cb(null, true);
  else cb(new Error("Allowed formats: PDF, DOC, DOCX, PNG, JPG, JPEG"));
};

// Exporters
exports.uploadProfile = multer({
  storage: cloudinaryStorage("profiles", "image"),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadCertificate = multer({
  storage: cloudinaryStorage("certificates", "raw"),
  fileFilter: docFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadCV = multer({
  storage: cloudinaryStorage("cv", "raw"),
  fileFilter: docFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadCompanyLogo = multer({
  storage: cloudinaryStorage("companies", "image"),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Export cloudinary instance for use in controllers (delete files)
exports.cloudinary = cloudinary;