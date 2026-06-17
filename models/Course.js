const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg',
  },
  // --- NAYE FIELDS YAHAN HAIN ---
  board: {
    type: String,
    enum: ['CBSE', 'BSEB', 'Both'],
    default: 'CBSE'
  },
  classCategory: {
    type: String,
    default: 'Class 9-10'
  },
  // -----------------------------
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  lessons: [lessonSchema], 
  isPublished: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);