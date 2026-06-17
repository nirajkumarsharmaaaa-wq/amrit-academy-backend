const Course = require('../models/Course');

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate('instructor', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Teacher/Admin
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, isPublished, board, classCategory } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      thumbnail,
      isPublished,
      board,
      classCategory,
      instructor: req.user._id, 
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// --- NAYE FUNCTIONS: UPDATE & DELETE ---

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // DB me update hone ke baad naya data return karega
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// ---------------------------------------

// @desc    Add a lesson to a course
// @route   POST /api/courses/:id/lessons
// @access  Private/Teacher/Admin
exports.addLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, duration } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this course' });
    }

    const newLesson = { title, description, videoUrl, duration };
    course.lessons.push(newLesson);
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding lesson', error: error.message });
  }
};