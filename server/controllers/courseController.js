const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all published courses with search, filters & user enrollment status
// @route   GET /api/courses
// @access  Public (Optional Auth)
exports.getAllCourses = async (req, res, next) => {
  try {
    const { category, level, search, sort } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'rating') {
      sortQuery = { rating: -1 };
    } else if (sort === 'popular') {
      sortQuery = { enrolledCount: -1 };
    }

    const courses = await Course.find(query).sort(sortQuery);

    // If user is authenticated, map enrollment status
    let userEnrollmentMap = {};
    if (req.user) {
      const enrollments = await Enrollment.find({ user: req.user._id });
      enrollments.forEach(e => {
        userEnrollmentMap[e.course.toString()] = {
          progressPercentage: e.progressPercentage,
          completedCount: e.completedLessonIds ? e.completedLessonIds.length : 0,
          isEnrolled: true
        };
      });
    }

    const coursesWithEnrollment = courses.map(c => {
      const obj = c.toObject();
      const enrollmentInfo = userEnrollmentMap[c._id.toString()];
      return {
        ...obj,
        isEnrolled: !!enrollmentInfo,
        userProgress: enrollmentInfo ? enrollmentInfo.progressPercentage : 0
      };
    });

    res.status(200).json({
      success: true,
      count: coursesWithEnrollment.length,
      courses: coursesWithEnrollment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single course by ID or slug
// @route   GET /api/courses/:id
// @access  Public (Optional Auth)
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    let enrollment = null;
    if (req.user) {
      enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: course._id
      });
    }

    const courseObj = course.toObject();

    res.status(200).json({
      success: true,
      course: {
        ...courseObj,
        isEnrolled: !!enrollment,
        enrollment: enrollment ? {
          progressPercentage: enrollment.progressPercentage,
          completedLessonIds: enrollment.completedLessonIds,
          lastAccessedLessonId: enrollment.lastAccessedLessonId,
          quizSubmissions: enrollment.quizSubmissions,
          certificateIssued: enrollment.certificateIssued
        } : null
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      thumbnail,
      duration,
      tags,
      learningOutcomes,
      lessons
    } = req.body;

    const course = await Course.create({
      title,
      subtitle,
      description,
      category,
      level: level || 'Beginner',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      instructor: req.user._id,
      instructorName: req.user.name,
      instructorTitle: req.user.headline || 'Course Instructor',
      duration: duration || '4 Hours',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
      lessons: Array.isArray(lessons) ? lessons : []
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership unless admin
    if (req.user.role !== 'admin' && course.instructor && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (req.user.role !== 'admin' && course.instructor && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Course and related enrollments deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

