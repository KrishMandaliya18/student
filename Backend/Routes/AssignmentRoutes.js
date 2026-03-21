const express = require('express');
const router = express.Router();
const { uploadAssignment, getAssignments } = require('../Controllers/AssignmentController');
const upload = require('../Middleware/multer');
const { protect, isAdmin } = require('../Middleware/auth'); // Aapka existing auth

// Admin upload karega
router.post('/upload', protect, isAdmin, upload.single('file'), uploadAssignment);

// Student fetch karega
router.get('/all', protect, getAssignments);

module.exports = router;