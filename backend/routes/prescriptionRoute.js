const express = require('express');
const { uploadPrescription } = require('../controllers/prescriptionController');
// const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/prescriptions
// router.post('/uploadprescription', isAuthenticated, uploadPrescription);
router.post('/uploadprescription', uploadPrescription);

module.exports = router;


