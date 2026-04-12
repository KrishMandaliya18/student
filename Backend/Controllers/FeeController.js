const Fee = require('../Models/Fee');
const FeePayment = require('../Models/FeePayment');

// Admin: Create new fee
exports.createFee = async (req, res) => {
    try {
        const { title, description, amount, dueDate } = req.body;
        const fee = new Fee({
            title,
            description,
            amount,
            dueDate,
            createdBy: req.user.id
        });
        await fee.save();
        res.status(201).json({ msg: "Fee created successfully", fee });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

// All: Get all fees
exports.getFees = async (req, res) => {
    try {
        const fees = await Fee.find().sort({ dueDate: 1 });
        res.json(fees);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

// Student: Upload screenshot for payment
exports.payFee = async (req, res) => {
    try {
        const { feeId } = req.params;
        const studentId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ msg: "Please upload a payment screenshot" });
        }

        // Check if already paid or pending
        const existing = await FeePayment.findOne({ feeId, studentId });
        if (existing) {
            return res.status(400).json({ msg: "Payment status already updated for this fee." });
        }

        const payment = new FeePayment({
            feeId,
            studentId,
            screenshotPath: req.file.path,
            status: 'pending', // Needs admin verification
            paidAt: new Date()
        });

        await payment.save();
        res.status(201).json({ msg: "Payment screenshot uploaded. Waiting for verification.", payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Admin: Get all payments for tracking
exports.getPayments = async (req, res) => {
    try {
        const payments = await FeePayment.find()
            .populate('feeId', 'title amount')
            .populate('studentId', 'name universityId')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

// Student: Get their own payments
exports.getMyPayments = async (req, res) => {
    try {
        const payments = await FeePayment.find({ studentId: req.user.id })
            .populate('feeId', 'title amount')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

// Admin: Verify payment
exports.verifyPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await FeePayment.findById(paymentId);
        
        if (!payment) return res.status(404).json({ msg: "Payment not found" });

        payment.status = 'paid';
        await payment.save();

        res.json({ msg: "Payment verified successfully", payment });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
