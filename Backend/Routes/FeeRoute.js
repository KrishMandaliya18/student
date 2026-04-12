const express = require('express');
const router = express.Router();
const { 
    createFee, 
    getFees, 
    payFee, 
    getPayments, 
    getMyPayments, 
    verifyPayment 
} = require('../Controllers/FeeController');
const { protect, isAdmin } = require('../Middleware/auth');
const upload = require('../Middleware/multer');

// Create a fee (Admin Only)
router.post('/add', protect, isAdmin, createFee);

// Get all global fees (Student/Admin)
router.get('/all', protect, getFees);

// Upload payment screenshot (Student Only)
router.post('/pay/:feeId', protect, upload.single('file'), payFee);

// Get logged-in student's personal payments
router.get('/my-payments', protect, getMyPayments);

// Get all student payments for tracking (Admin Only)
router.get('/admin/payments', protect, isAdmin, getPayments);

// Verify specific payment status (Admin Only)
router.put('/verify/:paymentId', protect, isAdmin, verifyPayment);

module.exports = router;
