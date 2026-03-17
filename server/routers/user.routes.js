const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser, getProfile, updateProfile, updatePassword} = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/auth.middlware.js');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', isAuthenticated, logoutUser);

router.get('/profile', isAuthenticated, getProfile);
router.patch('/profile', isAuthenticated, updateProfile);
router.patch('/profile/password', isAuthenticated, updatePassword);

module.exports = router;