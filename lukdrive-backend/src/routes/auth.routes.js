const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register/school
// @desc    Register a new driving school and its admin
// @access  Public
router.post('/register/school', authController.registerSchool);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/verify-otp
// @desc    Verify OTP for login
// @access  Public
router.post('/verify-otp', authController.verifyOtp);

// @route   POST api/auth/request-otp
// @desc    Request a new OTP
// @access  Public
router.post('/request-otp', authController.requestOtp);

// @route   POST api/auth/logout
// @desc    Logout user (invalidate token if using a blacklist)
// @access  Private
router.post('/logout', authController.logout);


module.exports = router;