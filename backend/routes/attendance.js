const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getAttendance, updateAttendance } = require('../controller/attendanceController');
const router = express.Router();

router.get('/', authMiddleware, getAttendance);
router.post('/update', authMiddleware, updateAttendance);

module.exports = router;
