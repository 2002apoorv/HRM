const express = require('express');
const { login, register, verify } = require('../controller/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.get('/verify', authMiddleware, verify);

module.exports = router;