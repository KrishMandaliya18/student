const express = require('express');
const router = express.Router();
const attendanceController = require('../Controllers/AttendanceController');

// Admin Routes
router.post('/toggle', attendanceController.toggleAttendance);

// Student Routes
router.get('/:universityId', attendanceController.getStudentAttendance);

module.exports = router;