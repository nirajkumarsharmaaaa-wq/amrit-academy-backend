const express = require('express');
const { 
  enrollInCourse, 
  getMyEnrollments, 
  markLessonComplete,
  getAllEnrollments 
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); 

router.post('/', enrollInCourse);
router.get('/my-courses', getMyEnrollments);
router.put('/:enrollmentId/complete-lesson', markLessonComplete);

// --- NAYA ROUTE ADMIN KE LIYE ---
router.get('/all', authorize('admin'), getAllEnrollments);

module.exports = router;