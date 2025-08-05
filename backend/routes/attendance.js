const express = require('express');
const { getAttendance } = require('../controller/attendanceController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const defaultAttendance= require('../middleware/defaultAttendance');

router.get('/',authMiddleware,defaultAttendance, getAttendance);

module.exports = router;