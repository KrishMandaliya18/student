const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
    feeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    transactionId: { type: String }, // Placeholder for Razorpay
    screenshotPath: { type: String }, // Path to proof image
    paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', feePaymentSchema);
