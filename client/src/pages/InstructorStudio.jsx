import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService, dashboardService } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import {
  Layers,
  PlusCircle,
  Users,
  Star,
  BookOpen,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle,
  XCircle,
  Video,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Artificial Intelligence',
  'Data Science',
  'Cloud & DevOps',
  'UI/UX Design',
  'Cybersecurity',
  'Mobile Development'
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const InstructorStudio = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 4.9,
    activeLiveLearners: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Course Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, courseId: null, title: '' });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    price: 0,
    duration: '2h 30m',
    lessons: [
      {
        title: 'Introduction & Architecture Overview',
        duration: '12 min',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        summary: 'Core foundational principles, stack walkthrough, and modern best practices.',
        content: 'Welcome to this comprehensive module. Review the key architecture patterns and code setup.',
        quiz: [
          {
            question: 'What is the primary benefit of Single Page Applications (SPAs)?',
            options: [
              'Faster page transitions without reloading the full page',
              'Requiring no JavaScript execution',
              'Lower browser memory consumption',
              'Inability to fetch data asynchronously'
            ],
            correctAnswer: 0,
            explanation: 'SPAs intercept link navigation and rewrite the DOM dynamically without page refreshes.'
          }
        ]
      }
    ]
  });

  useEffect(() => {
    fetchStudioData();
  }, []);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getStats();
      if (res.data.success) {
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.authoredCourses) {
          setCourses(res.data.authoredCourses);
        } else {
          // If student or general, fetch courses
          const courseRes = await courseService.getAll();
          if (courseRes.data.success) setCourses(courseRes.data.courses);
        }
      }
    } catch (err) {
      console.error('Failed to load instructor studio:', err);
      setError('Unable to load studio data. Please ensure the backend is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill out course title and description.');
      return;
    }

    try {
      setSaving(true);
      const res = await courseService.create(formData);
      if (res.data.success) {
        setSuccessMsg('Course created and published successfully!');
        setIsModalOpen(false);
        fetchStudioData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteModalState.courseId) return;
    try {
      await courseService.delete(deleteModalState.courseId);
      setSuccessMsg('Course deleted successfully.');
      setDeleteModalState({ isOpen: false, courseId: null, title: '' });
      fetchStudioData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleAddLessonField = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          title: `Lesson ${prev.lessons.length + 1}: Core Concepts`,
          duration: '15 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          summary: 'Detailed step-by-step walkthrough of the implementation details.',
          content: 'Detailed explanations, code snippets, and key takeaways for this topic.',
          quiz: [
            {
              question: 'Which method connects Mongoose to MongoDB Atlas?',
              options: ['mongoose.connect()', 'mongoose.listen()', 'mongoose.sync()', 'mongoose.open()'],
              correctAnswer: 0,
              explanation: 'mongoose.connect(connUri) initializes the database connection pool.'
            }
          ]
        }
      ]
    }));
  };

  return (
    <div className="studio-container">
      {/* Studio Header */}
      <div className="studio-header">
        <div>
          <div className="studio-badge">
            <Sparkles size={14} />
            <span>Instructor Studio & Curriculum Management</span>
          </div>
          <h1 className="studio-title">Course Studio</h1>
          <p className="studio-sub">
            Author interactive courses, embed video lessons, attach quizzes, and track learner engagement.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ height: 'fit-content' }}
        >
          <PlusCircle size={18} />
          <span>New Course</span>
        </button>
      </div>

      {successMsg && (
        <div className="alert-box alert-success">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="studio-metrics-row">
        <div className="studio-metric-card">
          <div className="metric-icon-box" style={{ background: '#ede9fe', color: '#4f46e5' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div className="metric-val">{courses.length}</div>
            <div className="metric-lbl">Total Courses</div>
          </div>
        </div>

        <div className="studio-metric-card">
          <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="metric-val">{stats.totalStudents}</div>
            <div className="metric-lbl">Total Enrolled Students</div>
          </div>
        </div>

        <div className="studio-metric-card">
          <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Star size={22} />
          </div>
          <div>
            <div className="metric-val">{stats.avgRating || 4.9} ★</div>
            <div className="metric-lbl">Average Rating</div>
          </div>
        </div>

        <div className="studio-metric-card">
          <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Video size={22} />
          </div>
          <div>
            <div className="metric-val">
              {courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)}
            </div>
            <div className="metric-lbl">Total Interactive Lessons</div>
          </div>
        </div>
      </div>

      {/* Course Catalog Table / Grid */}
      <div className="studio-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Authored Courses</h2>
            <p className="section-sub">Manage your syllabus, edit content, and view course metrics</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="empty-studio-box">
            <Layers size={40} color="#94a3b8" />
            <h3>No Courses Published Yet</h3>
            <p>Publish your first curriculum with video lessons and quizzes to start teaching!</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create Course Now</span>
            </button>
          </div>
        ) : (
          <div className="studio-course-table-wrapper">
            <table className="studio-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Lessons</th>
                  <th>Enrolled</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <div className="table-course-info">
                        <img src={course.thumbnail} alt={course.title} className="table-thumb" />
                        <div>
                          <div className="table-title">{course.title}</div>
                          <div className="table-subtitle">{course.subtitle?.slice(0, 45)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge category-badge">{course.category}</span>
                    </td>
                    <td>
                      <span className="badge level-badge">{course.level}</span>
                    </td>
                    <td>
                      <span className="table-metric-pill">
                        <Video size={13} />
                        <span>{course.lessons?.length || 0}</span>
                      </span>
                    </td>
                    <td>
                      <span className="table-metric-pill">
                        <Users size={13} />
                        <span>{course.enrolledCount || 0}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                        ★ {course.rating || 4.8}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/courses/${course._id}`}
                          className="btn-icon"
                          title="View Public Course Page"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          to={`/learn/${course._id}`}
                          className="btn-icon"
                          title="Open Interactive Classroom"
                        >
                          <BookOpen size={16} />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteModalState({
                              isOpen: true,
                              courseId: course._id,
                              title: course.title
                            })
                          }
                          className="btn-icon btn-icon-danger"
                          title="Delete Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Course Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#ede9fe',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PlusCircle size={20} />
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Create New Course</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="modal-form">
              <div className="form-group">
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Full-Stack MERN Mastery with MongoDB Atlas"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Level *</label>
                  <select
                    className="form-select"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Estimated Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="Build production-grade applications from scratch with modern architecture"
                  className="form-input"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Comprehensive syllabus description, prerequisites, and learning outcomes..."
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </div>

              {/* Lessons Preview */}
              <div className="form-lessons-section">
                <div className="section-header-row" style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>
                    Curriculum Lessons ({formData.lessons.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLessonField}
                    className="btn btn-secondary btn-sm"
                  >
                    <PlusCircle size={14} />
                    <span>Add Another Lesson</span>
                  </button>
                </div>

                {formData.lessons.map((lesson, idx) => (
                  <div key={idx} className="lesson-author-card">
                    <div className="lesson-author-header">
                      <span className="lesson-num-badge">Lesson {idx + 1}</span>
                      <input
                        type="text"
                        required
                        className="form-input"
                        style={{ fontWeight: 600 }}
                        value={lesson.title}
                        onChange={(e) => {
                          const updated = [...formData.lessons];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, lessons: updated });
                        }}
                      />
                    </div>

                    <div className="form-row" style={{ marginTop: '8px' }}>
                      <input
                        type="text"
                        placeholder="YouTube embed URL (e.g. https://www.youtube.com/embed/...)"
                        className="form-input flex-2"
                        value={lesson.videoUrl}
                        onChange={(e) => {
                          const updated = [...formData.lessons];
                          updated[idx].videoUrl = e.target.value;
                          setFormData({ ...formData, lessons: updated });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 15 min)"
                        className="form-input flex-1"
                        value={lesson.duration}
                        onChange={(e) => {
                          const updated = [...formData.lessons];
                          updated[idx].duration = e.target.value;
                          setFormData({ ...formData, lessons: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Creating Course...' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        title="Delete Course?"
        message={`Are you sure you want to delete "${deleteModalState.title}"? This will permanently remove the syllabus, enrolled progress, and quizzes.`}
        confirmText="Yes, Delete Course"
        onConfirm={handleDeleteCourse}
        onCancel={() => setDeleteModalState({ isOpen: false, courseId: null, title: '' })}
      />
    </div>
  );
};

export default InstructorStudio;

