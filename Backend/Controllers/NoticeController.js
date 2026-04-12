


const Notice = require('../Models/Notice');

// 1. Naya Announcement Post karna (Admin ke liye)
exports.createNotice = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        // req.user comes from protect middleware
        const newNotice = new Notice({ 
            title, 
            content, 
            category: category || 'GENERAL',
            senderRole: req.user.role,
            senderName: req.user.name,
            senderId: req.user._id
        });
        await newNotice.save();
        res.status(201).json({ message: "Announcement posted successfully!", newNotice });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 2. Saare Announcements mangwana (Student side ke liye)
exports.getNotices = async (req, res) => {
    try {
        // Sort by Date (Naya wala upar)
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Delete Notice
exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        await Notice.findByIdAndDelete(id);
        res.status(200).json({ message: "Notice deleted successfully from database!" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};

// Update Notice
exports.updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, title } = req.body;
        
        const updatedNotice = await Notice.findByIdAndUpdate(
            id, 
            { content, title }, 
            { new: true } // Taaki update hone ke baad naya data return kare
        );
        
        res.status(200).json({ message: "Notice updated successfully!", updatedNotice });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

