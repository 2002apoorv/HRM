const express = require('express');
const { login ,verify} = require('../controller/authController');
const router= express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

const app = express();

app.use(express.json());

router.post('/login',login);
router.get('/verify', authMiddleware,verify);

module.exports = router;