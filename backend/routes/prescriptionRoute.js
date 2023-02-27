const express = require('express');
const { uploadPrescription, deletePrescription } = require('../controllers/prescriptionController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/prescriptions
// Upload a prescription
router.post('/uploadprescription', isAuthenticated, upload.single('image'), uploadPrescription);

// DELETE /api/v1/prescriptions/:id
// Delete a prescription
router.delete('deleteprescription/:id', isAuthenticated, deletePrescription);

module.exports = router;
