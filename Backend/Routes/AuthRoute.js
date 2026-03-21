const express = require('express');
const router = express.Router();
const { 
    signup, 
    login, 
    logout, 
    forceLogout, // Force logout controller
    // logoutOnClose,
    getAllStudents, 
    getStudents,
    updateStudentByAdmin, 
    deleteStudentByAdmin, 
    getUserProfile, 
    updateUserProfile 
} = require('../Controllers/AuthController');

// Yahan isAdmin ko bhi import karein
const { protect, isAdmin } = require('../Middleware/auth');

// --- PUBLIC ROUTES ---
router.post('/signup', signup);
router.get('/students', getStudents); // Naya route students ko fetch karne ke liye
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/force-logout', forceLogout); // Force logout route
// router.post('/logout-on-close', logoutOnClose); // Tab close logout route
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

