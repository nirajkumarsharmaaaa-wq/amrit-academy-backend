const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  // Array of lesson IDs that the student has finished watching
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.lessons' 
  }],
  enrolledAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Ensure a student can only enroll in a specific course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('enrollmentModels', enrollmentSchema);