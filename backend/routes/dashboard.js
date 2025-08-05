const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getSummary } = require('../controller/dashboardController');

router.get('/summary',authMiddleware,getSummary )

module.exports = router;