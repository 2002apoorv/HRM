const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getHrmSummary } = require('../controller/dashboardController');

router.get('/summary', authMiddleware, getHrmSummary);

module.exports = router;
