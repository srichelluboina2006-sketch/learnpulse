const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getCourseProgress,
  completeLesson,
  submitQuiz
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/:courseId/enroll', protect, enrollCourse);
router.get('/:courseId', protect, getCourseProgress);
router.post('/:courseId/complete-lesson', protect, completeLesson);
router.post('/:courseId/submit-quiz', protect, submitQuiz);

module.exports = router;

