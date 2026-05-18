const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const profileDir = path.join(__dirname, "../uploads/profiles");
const certDir = path.join(__dirname, "../uploads/certificates");
const cvDir = path.join(__dirname, "../uploads/cv");
const companyDir = path.join(__dirname, "../uploads/companies"); // Added company dir

createUploadDir(profileDir);
createUploadDir(certDir);
createUploadDir(cvDir);
createUploadDir(companyDir); // Create company dir

const storage = (destination) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, destination),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only JPEG, JPG, PNG, WEBP images are allowed"));
};

const docFilter = (req, file, cb) => {
  const allowedExt = /pdf|doc|docx|png|jpg|jpeg/;
  const allowedMime = /application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|image\/png|image\/jpeg|image\/jpg/;
  const ext = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedMime.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Allowed formats: PDF, DOC, DOCX, PNG, JPG, JPEG"));
};

exports.uploadProfile = multer({ storage: storage(profileDir), fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } });
exports.uploadCertificate = multer({ storage: storage(certDir), fileFilter: docFilter, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadCV = multer({ storage: storage(cvDir), fileFilter: docFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Export Company Logo uploader
exports.uploadCompanyLogo = multer({ 
  storage: storage(companyDir), 
  fileFilter: imageFilter, 
  limits: { fileSize: 2 * 1024 * 1024 } 
});