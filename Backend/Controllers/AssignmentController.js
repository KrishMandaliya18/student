const Assignment = require('../Models/Assignment');

// 1. Upload Assignment (Admin Only)
exports.uploadAssignment = async (req, res) => {
    try {
        const { title, subject } = req.body;
        const newAssignment = new Assignment({
            title,
            subject,
            fileName: req.file.originalname,
            filePath: req.file.path, // Multer path deta hai
            uploadedBy: req.user._id // Auth middleware se milega
        });

        await newAssignment.save();
        res.status(201).json({ message: "Assignment uploaded successfully!", newAssignment });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
};

// 2. Get All Assignments (For Students)
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching assignments", error });
    }
};