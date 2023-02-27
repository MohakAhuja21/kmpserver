const Prescription = require('../models/Prescription');
const cloudinary = require('cloudinary');
const { catchAsyncError } = require("../middleware/catchAsyncError");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define a function to handle file upload
exports.uploadPrescription = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  // Upload the file to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'prescriptions',
  });

  // Create a new Prescription document in the database
  const prescription = await Prescription.create({
    // user: req.user._id,
    image: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(201).json({ prescription });
});
