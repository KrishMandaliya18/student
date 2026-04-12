const express = require('express');
const router = express.Router();
const { protect, isStaff } = require('../Middleware/auth');

// Admin, Teacher, HOD post karega
router.post('/add', protect, isStaff, createNotice);

// Student fetch karega
router.get('/all', getNotices);

// Purane routes ke niche ye add karein:

// Delete route: /api/notices/:id
router.delete('/:id', deleteNotice);

// Update route: /api/notices/:id
router.put('/:id', updateNotice);

module.exports =  router;