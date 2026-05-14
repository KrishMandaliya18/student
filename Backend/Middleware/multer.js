const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Automatic folder banane ke liye code
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Folder ka naam
    },
    filename: (req, file, cb) => {
        // Filename ko saaf (clean) karne ke liye regex
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_')); 
    }
});

const upload = multer({ storage: storage });
module.exports = upload;