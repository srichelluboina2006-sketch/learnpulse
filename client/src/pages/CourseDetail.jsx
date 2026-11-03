import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, progressService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  BookOpen,
  Star,
  Users,
  CheckCircle,
  PlayCircle,
  HelpCircle,
  Award,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await courseService.getById(id);
      if (res.data.success) {
        setCourse(res.data.course);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Course not found');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollOrResume = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (course.isEnrolled) {
      navigate(`/learn/${course._id}`);
      return;
    }

    try {
      setEnrolling(true);
      const res = await progressService.enroll(course._id);
      if (res.data.success) {
        navigate(`/learn/${course._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="course-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading course curriculum...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-error">
        <h2>{error || 'Course not found'}</h2>
        <Link to="/" className="btn btn-secondary mt-3">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const userProgress = course.enrollment?.progressPercentage || 0;

  return (
    <div className="course-detail-page">
      {/* Course Hero Banner */}
      <section className="detail-hero">
        <div className="detail-hero-container">
          <div className="detail-hero-left">
            <div className="detail-badges-row">
              <span className="badge category-badge">{course.category}</span>
              <span className={`badge level-badge level-${course.level?.toLowerCase()}`}>
                {course.level}
              </span>
            </div>

            <h1 className="detail-title">{course.title}</h1>
            <p className="detail-subtitle">{course.subtitle || course.description}</p>

            <div className="detail-meta-row">
              <div className="meta-item rating-star-item">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span className="font-bold">{course.rating || 4.9}</span>
                <span className="text-muted">({course.reviewsCount || 150} reviews)</span>
              </div>
              <div className="meta-item">
                <Users size={16} />
                <span>{course.enrolledCount || 1200} Students Enrolled</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{course.duration} Total Duration</span>
              </div>
            </div>

            <div className="instructor-card-compact">
              <div className="instructor-info">
                <span className="taught-by-label">Taught by</span>
                <h4 className="instructor-title">{course.instructorName}</h4>
                <p className="instructor-headline">{course.instructorTitle}</p>
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card */}
          <div className="detail-hero-right">
            <div className="sticky-enrollment-card">
              <div className="card-preview-thumb">
                <img src={course.thumbnail} alt={course.title} />
                <div className="play-overlay">
                  <PlayCircle size={48} color="#ffffff" />
                </div>
              </div>

              <div className="enrollment-card-body">
                <div className="price-display">
                  <span className="price-main">Free</span>
                  <span className="price-badge">100% Free Access</span>
                </div>

                {course.isEnrolled ? (
                  <div className="enrolled-status-box">
                    <div className="progress-info-row">
                      <span>Progress</span>
                      <span className="font-semibold">{userProgress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${userProgress}%` }}></div>
                    </div>
                    <button
                      onClick={handleEnrollOrResume}
                      className="btn btn-primary btn-block mt-3"
                    >
                      <span>Continue to Classroom</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnrollOrResume}
                    disabled={enrolling}
                    className="btn btn-primary btn-block btn-lg"
                  >
                    <span>{enrolling ? 'Enrolling...' : 'Enroll in Course (Free)'}</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                <div className="card-guarantees">
                  <div className="guarantee-item">
                    <CheckCircle size={15} color="#10b981" />
                    <span>Full lifetime access to all lessons</span>
                  </div>
                  <div className="guarantee-item">
                    <CheckCircle size={15} color="#10b981" />
                    <span>Interactive quizzes with instant scoring</span>
                  </div>
                  <div className="guarantee-item">
                    <Award size={15} color="#10b981" />
                    <span>Certificate of completion included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Outcomes & Syllabus */}
      <section className="detail-body-section">
        <div className="detail-body-container">
          {/* What You'll Learn */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="content-card outcomes-card">
              <h3 className="section-card-title">
                <Award size={20} color="#4f46e5" />
                <span>What you'll learn in this course</span>
              </h3>
              <div className="outcomes-grid">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="outcome-item">
                    <CheckCircle size={18} color="#10b981" className="outcome-icon" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Syllabus */}
          <div className="content-card syllabus-card">
            <div className="syllabus-header">
              <h3 className="section-card-title">
                <Layers size={20} color="#4f46e5" />
                <span>Curriculum & Syllabus</span>
              </h3>
              <span className="syllabus-meta">
                {lessons.length} Modules • {course.duration}
              </span>
            </div>

            <div className="lessons-accordion">
              {lessons.map((lesson, idx) => {
                const isCompleted = course.enrollment?.completedLessonIds?.some(
                  id => id.toString() === lesson._id?.toString()
                );

                return (
                  <div key={lesson._id || idx} className="lesson-item-row">
                    <div className="lesson-left">
                      <div className="lesson-order-badge">
                        {isCompleted ? (
                          <CheckCircle size={16} color="#10b981" />
                        ) : (
                          <PlayCircle size={16} color="#6366f1" />
                        )}
                      </div>
                      <div className="lesson-info">
                        <h4 className="lesson-title">{lesson.title}</h4>
                        {lesson.summary && <p className="lesson-summary">{lesson.summary}</p>}
                      </div>
                    </div>

                    <div className="lesson-right">
                      {lesson.quiz && lesson.quiz.length > 0 && (
                        <span className="quiz-pill-badge">
                          <HelpCircle size={13} />
                          <span>{lesson.quiz.length} Questions</span>
                        </span>
                      )}
                      <span className="lesson-duration-badge">
                        <Clock size={13} />
                        <span>{lesson.duration}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Overview Description */}
          <div className="content-card description-card">
            <h3 className="section-card-title">
              <BookOpen size={20} color="#4f46e5" />
              <span>Course Description</span>
            </h3>
            <div className="description-text">
              <p>{course.description}</p>
            </div>

            {course.tags && course.tags.length > 0 && (
              <div className="course-tags-group">
                <span className="tags-label">Technologies & Skills:</span>
                <div className="tags-list">
                  {course.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="tech-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;

