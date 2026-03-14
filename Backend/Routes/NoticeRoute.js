const express = require('express');
const router = express.Router();
const { createNotice, getNotices,deleteNotice,updateNotice } = require ('../Controllers/NoticeController');

// Admin post karega
router.post('/add', createNotice);

// Student fetch karega
router.get('/all', getNotices);

// Purane routes ke niche ye add karein:

// Delete route: /api/notices/:id
router.delete('/:id', deleteNotice);

// Update route: /api/notices/:id
router.put('/:id', updateNotice);
module.exports =  router;