const Assignment = require('../Models/Assignment');
const fs = require('fs');

exports.uploadAssignment = async (req, res) => {
    try {
        const { title, subject } = req.body;
        if (!req.file) return res.status(400).json({ message: "Please upload a file" });

        const newAssignment = new Assignment({
            title: title || req.file.originalname,
            subject,
            fileName: req.file.originalname,
            filePath: req.file.path.replace(/\\/g, "/"), // Windows path fix
            uploadedBy: req.user ? req.user._id : null // Auth check
        });

        await newAssignment.save();
        res.status(201).json({ message: "Uploaded successfully!", newAssignment });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
};

exports.deleteAssignment = async (req, res) => {
    try {
        const doc = await Assignment.findByIdAndDelete(req.params.id);
        if (doc && fs.existsSync(doc.filePath)) {
            fs.unlinkSync(doc.filePath); // File delete from server
        }
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};