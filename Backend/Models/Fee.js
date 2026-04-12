const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
