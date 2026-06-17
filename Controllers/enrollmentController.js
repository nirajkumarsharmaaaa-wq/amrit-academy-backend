const Enrollment = require('../models/enrollmentModels');
const Course = require('../models/Course');

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
// @access  Private/Student
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      paymentStatus: 'completed', 
    });

    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    res.status(500).json({ message: 'Error during enrollment', error: error.message });
  }
};

// @desc    Get logged in student's enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private/Student
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title thumbnail instructor lessons');
      
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};

// @desc    Mark a specific lesson as completed
// @route   PUT /api/enrollments/:enrollmentId/complete-lesson
// @access  Private/Student
exports.markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      await enrollment.save();
    }

    res.status(200).json({ message: 'Lesson marked as complete', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// --- NAYA FUNCTION ADMIN KE LIYE ---
// @desc    Get all enrollments for Admin
// @route   GET /api/enrollments/all
// @access  Private/Admin
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title');
      
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all enrollments', error: error.message });
  }
};