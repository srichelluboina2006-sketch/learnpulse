const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Enroll authenticated student in a course
// @route   POST /api/progress/:courseId/enroll
// @access  Private (Student/User)
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id
    });

    if (enrollment) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this course',
        enrollment
      });
    }

    // Default first lesson as last accessed
    const firstLessonId = course.lessons && course.lessons.length > 0 ? course.lessons[0]._id : null;

    enrollment = await Enrollment.create({
      user: req.user._id,
      course: course._id,
      completedLessonIds: [],
      progressPercentage: 0,
      lastAccessedLessonId: firstLessonId
    });

    // Increment enrolled count
    await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      enrollment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current student's progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
exports.getCourseProgress = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        enrollment: null
      });
    }

    res.status(200).json({
      success: true,
      isEnrolled: true,
      enrollment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a lesson as completed
// @route   POST /api/progress/:courseId/complete-lesson
// @access  Private
exports.completeLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.body;
    if (!lessonId) {
      return res.status(400).json({ success: false, message: 'lessonId is required' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id
    });

    // Auto-enroll if not enrolled yet
    if (!enrollment) {
      enrollment = await Enrollment.create({
        user: req.user._id,
        course: course._id,
        completedLessonIds: [],
        progressPercentage: 0
      });
      await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });
    }

    // Add lessonId if not already completed
    const alreadyCompleted = enrollment.completedLessonIds.some(
      id => id.toString() === lessonId.toString()
    );

    if (!alreadyCompleted) {
      enrollment.completedLessonIds.push(lessonId);
    }

    enrollment.lastAccessedLessonId = lessonId;

    // Recalculate percentage
    const totalLessons = course.lessons.length || 1;
    const progressPercent = Math.min(
      100,
      Math.round((enrollment.completedLessonIds.length / totalLessons) * 100)
    );
    enrollment.progressPercentage = progressPercent;

    if (progressPercent === 100 && !enrollment.certificateIssued) {
      enrollment.certificateIssued = true;
      enrollment.certificateIssuedAt = new Date();
    }

    enrollment.updatedAt = new Date();
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      progressPercentage: enrollment.progressPercentage,
      certificateIssued: enrollment.certificateIssued,
      completedLessonIds: enrollment.completedLessonIds
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit quiz answers and calculate score
// @route   POST /api/progress/:courseId/submit-quiz
// @access  Private
exports.submitQuiz = async (req, res, next) => {
  try {
    const { lessonId, userAnswers } = req.body;
    // userAnswers: array of integers corresponding to selected option index for each question

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const quizQuestions = lesson.quiz || [];
    if (quizQuestions.length === 0) {
      return res.status(400).json({ success: false, message: 'This lesson does not have a quiz' });
    }

    let score = 0;
    const review = quizQuestions.map((q, idx) => {
      const selected = userAnswers && userAnswers[idx] !== undefined ? userAnswers[idx] : -1;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;

      return {
        question: q.question,
        options: q.options,
        userSelected: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60; // 60% passing mark

    // Record submission in enrollment
    let enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        user: req.user._id,
        course: course._id,
        completedLessonIds: [],
        progressPercentage: 0
      });
      await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });
    }

    // Remove existing submission for this lesson if retaken
    enrollment.quizSubmissions = enrollment.quizSubmissions.filter(
      sub => sub.lessonId.toString() !== lessonId.toString()
    );

    enrollment.quizSubmissions.push({
      lessonId,
      score,
      totalQuestions,
      percentage,
      passed,
      submittedAt: new Date()
    });

    // Auto mark lesson completed if passed
    if (passed) {
      const alreadyCompleted = enrollment.completedLessonIds.some(
        id => id.toString() === lessonId.toString()
      );
      if (!alreadyCompleted) {
        enrollment.completedLessonIds.push(lessonId);
      }
      const totalLessons = course.lessons.length || 1;
      enrollment.progressPercentage = Math.min(
        100,
        Math.round((enrollment.completedLessonIds.length / totalLessons) * 100)
      );
      if (enrollment.progressPercentage === 100 && !enrollment.certificateIssued) {
        enrollment.certificateIssued = true;
        enrollment.certificateIssuedAt = new Date();
      }
    }

    enrollment.updatedAt = new Date();
    await enrollment.save();

    res.status(200).json({
      success: true,
      result: {
        score,
        totalQuestions,
        percentage,
        passed,
        review
      },
      progressPercentage: enrollment.progressPercentage,
      certificateIssued: enrollment.certificateIssued
    });
  } catch (err) {
    next(err);
  }
};

