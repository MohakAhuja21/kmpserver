const Prescription = require('../models/Prescription');
const multer = require('multer');
const cloudinary = require('cloudinary');
const { catchAsyncError } = require('../middleware/catchAsyncError');

// Multer storage configuration
const storage = multer.diskStorage({});

// Multer file filter configuration
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new Error('Please upload an image file'), false);
  }
  cb(null, true);
};

// Multer upload configuration
const upload = multer({ storage, fileFilter });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define a function to handle file upload
const uploadPrescription = catchAsyncError(async (req, res, next) => {
  // Use Multer to handle file upload
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'prescriptions',
    });

    // Create a new Prescription document in the database
    const prescription = await Prescription.create({
      user: req.user._id,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({ prescription });
  });
});

module.exports = uploadPrescription;
