const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', [
    check('username').notEmpty().trim(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], registerUser);

router.post('/login', [
    check('email').isEmail(),
    check('password').notEmpty()
], loginUser);

router.get('/profile', protect, getProfile);

module.exports = router;