import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, progressService } from '../services/api';
import LessonQuiz from '../components/LessonQuiz';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const Classroom = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'quiz'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassroomData();
  }, [courseId]);

  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch course details
      const courseRes = await courseService.getById(courseId);
      if (!courseRes.data.success) {
        throw new Error('Course not found');
      }
      setCourse(courseRes.data.course);

      // Fetch progress
      const progressRes = await progressService.getProgress(courseId);
      if (progressRes.data.success && progressRes.data.enrollment) {
        setEnrollment(progressRes.data.enrollment);

        // Resume at last accessed lesson if available
        const lastId = progressRes.data.enrollment.lastAccessedLessonId;
        if (lastId && courseRes.data.course.lessons) {
          const foundIdx = courseRes.data.course.lessons.findIndex(
            l => l._id?.toString() === lastId.toString()
          );
          if (foundIdx !== -1) {
            setActiveLessonIdx(foundIdx);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load classroom');
    } finally {
      setLoading(false);
    }
  };

  const currentLesson = course?.lessons?.[activeLessonIdx];
  const totalLessons = course?.lessons?.length || 0;

  const isLessonCompleted = (lessonId) => {
    if (!enrollment?.completedLessonIds) return false;
    return enrollment.completedLessonIds.some(
      id => id.toString() === lessonId?.toString()
    );
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    try {
      setSavingProgress(true);
      const res = await progressService.completeLesson(courseId, currentLesson._id);
      if (res.data.success) {
        setEnrollment(prev => ({
          ...prev,
          progressPercentage: res.data.progressPercentage,
          certificateIssued: res.data.certificateIssued,
          completedLessonIds: res.data.completedLessonIds
        }));

        // Advance to next lesson if available
        if (activeLessonIdx < totalLessons - 1) {
          setActiveLessonIdx(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleQuizCompleted = (resultData) => {
    setEnrollment(prev => ({
      ...prev,
      progressPercentage: resultData.progressPercentage,
      certificateIssued: resultData.certificateIssued,
      completedLessonIds: resultData.completedLessonIds || prev?.completedLessonIds
    }));
  };

  // Convert YouTube regular watch links to standard embed link if necessary
  const formatVideoEmbedUrl = (rawUrl) => {
    if (!rawUrl) return 'https://www.youtube.com/embed/nu_pCVPKzTk';
    if (rawUrl.includes('/embed/')) return rawUrl;
    if (rawUrl.includes('watch?v=')) {
      const videoId = rawUrl.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (rawUrl.includes('youtu.be/')) {
      const videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return rawUrl;
  };

  if (loading) {
    return (
      <div className="classroom-loading">
        <div className="loading-spinner"></div>
        <p>Initializing interactive classroom session...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="classroom-error">
        <h2>{error || 'Course not available'}</h2>
        <Link to="/" className="btn btn-secondary mt-3">
          Back to Courses
        </Link>
      </div>
    );
  }

  const progressPercent = enrollment?.progressPercentage || 0;

  return (
    <div className="classroom-container">
      {/* Top Bar Navigation */}
      <header className="classroom-topbar">
        <div className="topbar-left">
          <Link to={`/courses/${course._id}`} className="btn-back-course">
            <ArrowLeft size={16} />
            <span>Course Details</span>
          </Link>
          <div className="topbar-divider"></div>
          <h2 className="topbar-course-title">{course.title}</h2>
        </div>

        <div className="topbar-right">
          <div className="classroom-progress-badge">
            <div className="progress-text-row">
              <span className="progress-stat">
                {progressPercent}% Complete
              </span>
              {enrollment?.certificateIssued && (
                <span className="certified-badge">
                  <Award size={13} />
                  <span>Certified</span>
                </span>
              )}
            </div>
            <div className="classroom-progress-track">
              <div
                className="classroom-progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-toggle-sidebar"
            aria-label="Toggle Syllabus"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Classroom Main Layout */}
      <div className="classroom-body">
        {/* Left Lesson Navigation Sidebar */}
        <aside className={`classroom-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h4>Course Modules</h4>
            <span className="lesson-counter">
              {activeLessonIdx + 1} of {totalLessons}
            </span>
          </div>

          <div className="sidebar-lessons-list">
            {course.lessons?.map((lesson, idx) => {
              const completed = isLessonCompleted(lesson._id);
              const isActive = idx === activeLessonIdx;

              return (
                <button
                  key={lesson._id || idx}
                  className={`syllabus-lesson-btn ${isActive ? 'active' : ''} ${completed ? 'completed' : ''}`}
                  onClick={() => {
                    setActiveLessonIdx(idx);
                    // On mobile, collapse sidebar after click
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                >
                  <div className="lesson-status-icon">
                    {completed ? (
                      <CheckCircle2 size={18} className="text-success" />
                    ) : (
                      <PlayCircle size={18} className="text-primary" />
                    )}
                  </div>
                  <div className="lesson-meta-info">
                    <span className="lesson-title-text">{lesson.title}</span>
                    <div className="lesson-sub-meta">
                      <span>{lesson.duration}</span>
                      {lesson.quiz && lesson.quiz.length > 0 && (
                        <span className="has-quiz-tag">• Quiz</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {enrollment?.certificateIssued && (
            <div className="sidebar-certificate-card">
              <Award size={24} color="#10b981" />
              <div>
                <h5>Certificate Earned!</h5>
                <p>Congratulations, you completed 100% of the lessons in this track.</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Stage Content */}
        <main className="classroom-main-stage">
          {currentLesson ? (
            <div className="active-lesson-wrapper">
              {/* Responsive Video Embed Player */}
              <div className="video-player-container">
                <iframe
                  src={formatVideoEmbedUrl(currentLesson.videoUrl)}
                  title={currentLesson.title}
                  className="lesson-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Lesson Header & Tab Switcher */}
              <div className="lesson-stage-header">
                <div className="lesson-title-row">
                  <div>
                    <span className="module-counter-tag">Module {activeLessonIdx + 1} of {totalLessons}</span>
                    <h2 className="lesson-main-title">{currentLesson.title}</h2>
                  </div>

                  <div className="lesson-tabs">
                    <button
                      className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notes')}
                    >
                      <BookOpen size={16} />
                      <span>Reading & Notes</span>
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                      onClick={() => setActiveTab('quiz')}
                    >
                      <HelpCircle size={16} />
                      <span>Interactive Quiz ({currentLesson.quiz?.length || 0})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Content Display */}
              <div className="lesson-content-body">
                {activeTab === 'notes' ? (
                  <div className="notes-tab-content">
                    {currentLesson.summary && (
                      <div className="lesson-summary-banner">
                        <Sparkles size={18} color="#4f46e5" />
                        <p>{currentLesson.summary}</p>
                      </div>
                    )}

                    <div className="notes-markdown-view">
                      <pre className="notes-formatted-text">
                        {currentLesson.content || 'Comprehensive notes and code examples for this module will appear here.'}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-tab-content">
                    <LessonQuiz
                      courseId={course._id}
                      lesson={currentLesson}
                      onQuizCompleted={handleQuizCompleted}
                    />
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="classroom-bottom-nav">
                <button
                  onClick={() => setActiveLessonIdx(prev => Math.max(0, prev - 1))}
                  disabled={activeLessonIdx === 0}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={savingProgress}
                  className="btn btn-primary btn-sm"
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {isLessonCompleted(currentLesson._id)
                      ? (activeLessonIdx < totalLessons - 1 ? 'Go to Next Module' : 'Completed!')
                      : (savingProgress ? 'Saving...' : 'Mark as Complete & Next')}
                  </span>
                </button>

                <button
                  onClick={() => setActiveLessonIdx(prev => Math.min(totalLessons - 1, prev + 1))}
                  disabled={activeLessonIdx >= totalLessons - 1}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="no-lesson-selected">
              <p>Select a module from the sidebar to begin learning.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Classroom;

