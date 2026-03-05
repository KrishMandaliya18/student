const express = require('express');
const router = express.Router();
const { 
    signup, 
    login, 
    getAllStudents, 
    updateStudentByAdmin, 
    deleteStudentByAdmin, 
    getUserProfile, 
    updateUserProfile 
} = require('../Controllers/AuthController');

// Yahan isAdmin ko bhi import karein
const { protect, isAdmin } = require('../Middleware/auth');

// --- PUBLIC ROUTES ---
router.post('/signup', signup);
router.post('/login', login);

// --- PROTECTED ROUTES ( Admin dono ke liye) ---
router.get('/profile', protect, getUserProfile);
router.put('/profile/update', protect, updateUserProfile);

// --- ADMIN ONLY ROUTES (Yahan protect ke baad isAdmin lagaya hai) ---

// 1. Saare students ki list dekhna
router.get('/all-students', protect, isAdmin, getAllStudents);

// 2. Admin jab student ko edit karega
router.put('/update-student/:id', protect, isAdmin, updateStudentByAdmin);

// 3. Admin jab student ko delete karega
router.delete('/delete-student/:id', protect, isAdmin, deleteStudentByAdmin);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { signup, login,getAllStudents,updateStudentByAdmin,deleteStudentByAdmin,getUserProfile, updateUserProfile } = require('../Controllers/AuthController');
// const { protect } = require('../Middleware/auth');

// router.post('/signup', signup);
// router.post('/login', login);
// // router.get('/profile', protect, getUserProfile);
// // router.put('/update-profile', protect, updateUserProfile);

// router.get('/all-students', protect, getAllStudents)


// router.get('/profile', protect, getUserProfile);
// router.put('/profile/update', protect, updateUserProfile);

// // 1. Admin jab student ko edit karega
// router.put('/update-student/:id', protect, updateStudentByAdmin);

// // 2. Admin jab student ko delete karega
// router.delete('/delete-student/:id', protect, deleteStudentByAdmin);
// module.exports = router;
