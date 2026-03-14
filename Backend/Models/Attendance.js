const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    universityId: {
        type: String,
        required: true,
        ref: 'User'
    },
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Present'
    }
}, { timestamps: true });

// Ensure a student can only have one attendance record per day
attendanceSchema.index({ universityId: 1, day: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);