const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  explanation: {
    type: String,
    default: ''
  }
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  duration: {
    type: String,
    default: '10 min'
  },
  videoUrl: {
    type: String,
    default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  summary: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  quiz: [quizQuestionSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: 120
  },
  subtitle: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: [
      'Web Development',
      'Artificial Intelligence',
      'Data Science',
      'Cloud & DevOps',
      'UI/UX Design',
      'Cybersecurity',
      'Mobile Development'
    ],
    default: 'Web Development'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'Beginner'
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  instructorName: {
    type: String,
    default: 'Senior Staff Engineer'
  },
  instructorTitle: {
    type: String,
    default: 'Lead Tech Educator'
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: '6.5 Hours'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 142
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String
  }],
  lessons: [lessonSchema],
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function () {
  return this.lessons ? this.lessons.length : 0;
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);

