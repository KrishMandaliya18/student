const Attendance = require('../Models/Attendance');
const User = require('../Models/User');

// --- 1. Admin: Toggle (Mark/Unmark) Attendance ---
exports.toggleAttendance = async (req, res) => {
    try {
        const { universityId, day, month, year, status } = req.body;

        if (!universityId || !day || month === undefined || !year || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find existing record or create new one (upsert)
        const filter = { universityId, day, month, year };
        const update = { status };

        // new: true -> returns the modified document, upsert: true -> creates if doesn't exist
        const updatedAttendance = await Attendance.findOneAndUpdate(filter, update, { new: true, upsert: true });

        // IMPORTANT: Emit socket event for real-time frontend update
        if (global.io) {
            global.io.emit(`attendanceUpdate_${universityId}`, {
                day,
                month,
                year,
                status
            });
        }

        res.status(200).json({ message: "Attendance updated successfully", data: updatedAttendance });
    } catch (error) {
        console.error("Toggle Attendance Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- 2. Student: Get My Attendance ---
exports.getStudentAttendance = async (req, res) => {
    try {
        const { universityId } = req.params;

        if (!universityId) {
            return res.status(400).json({ message: "University ID is required" });
        }

        // Fetch all attendance records for this student
        const attendanceRecords = await Attendance.find({ universityId });

        res.status(200).json({ data: attendanceRecords });
    } catch (error) {
        console.error("Get Attendance Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
