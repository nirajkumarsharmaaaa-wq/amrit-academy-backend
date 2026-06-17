// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route Example: Any authenticated user
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'Profile data accessed successfully',
    user: req.user, 
  });
});

// Protected & Authorized Route Example: Admins only
router.get('/admin-dashboard', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Amrit Academy Admin Dashboard',
  });
});

// Protected & Authorized Route Example: Teachers and Admins
router.get('/course-management', protect, authorize('admin', 'teacher'), (req, res) => {
  res.status(200).json({
    message: 'Access granted to modify Amrit Academy courses',
  });
});

module.exports = router;