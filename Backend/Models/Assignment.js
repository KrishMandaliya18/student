const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    fileName: { type: String, required: true }, // Original file name
    filePath: { type: String, required: true }, // Server par kahan save hai
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin ID
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);