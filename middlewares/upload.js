const multer = require("multer");
const cloudinary = require("../cloudinary/config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: (req, file) => {
      // usa el mimetype para determinar el formato del archivo
      return file.mimetype.split("/")[1];
    },
    transformation: [{ width: 100, height: 100, crop: "fill" }],
    public_id: (req, file) => {
      return file.fieldname + "-" + Date.now();
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
