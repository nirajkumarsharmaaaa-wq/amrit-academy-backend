const express = require('express');
const { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, // Naya import
  deleteCourse, // Naya import
  addLesson 
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected & Authorized Routes (Admin / Teacher)
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.post('/:id/lessons', protect, authorize('teacher', 'admin'), addLesson);

// --- NAYE ROUTES ---
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);

module.exports = router;