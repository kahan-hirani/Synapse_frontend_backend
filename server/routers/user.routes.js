const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser, getProfile} = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/auth.middlware.js');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', isAuthenticated, logoutUser);

router.get('/profile', isAuthenticated, getProfile);

module.exports = router;