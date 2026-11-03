import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';
import StatCard from '../components/StatCard';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award,
  ArrowRight,
  Sparkles,
  Compass,
  PlayCircle,
  Flame,
  Clock,
  Layers,
  GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const { user, isInstructor } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getStats();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Unable to load dashboard data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your learning dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalEnrolled: 0,
    completedCourses: 0,
    totalLessonsDone: 0,
    quizzesPassed: 0,
    certificatesCount: 0
  };

  const enrolledCourses = data?.enrolledCourses || [];

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-left">
          <div className="user-avatar-badge">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="banner-avatar"
            />
            <div className="banner-role-pill">
              <span className="role-dot"></span>
              {user?.role?.toUpperCase() || 'STUDENT'}
            </div>
          </div>
          <div className="banner-text">
            <h1 className="banner-title">
              Welcome back, <span className="highlight-name">{user?.name}</span>! 👋
            </h1>
            <p className="banner-subtitle">
              {user?.headline || 'Continuous learning drives professional excellence.'}
            </p>
          </div>
        </div>

        <div className="banner-actions">
          {isInstructor && (
            <Link to="/instructor" className="btn btn-secondary">
              <Layers size={16} />
              <span>Instructor Studio</span>
            </Link>
          )}
          <Link to="/" className="btn btn-primary">
            <Compass size={16} />
            <span>Explore Courses</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <p>{error}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="stats-grid">
        <StatCard
          title="Enrolled Courses"
          value={stats.totalEnrolled}
          subtitle="Active tracks"
          icon={BookOpen}
          iconColor="#4f46e5"
          bgGradient="linear-gradient(135deg, #ede9fe 0%, #eff6ff 100%)"
          borderColor="#4f46e5"
        />
        <StatCard
          title="Completed"
          value={stats.completedCourses}
          subtitle="100% finished"
          icon={CheckCircle}
          iconColor="#059669"
          bgGradient="linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
          borderColor="#059669"
        />
        <StatCard
          title="Lessons Done"
          value={stats.totalLessonsDone}
          subtitle="Knowledge checkpoints"
          icon={Flame}
          iconColor="#f59e0b"
          bgGradient="linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
          borderColor="#f59e0b"
        />
        <StatCard
          title="Quizzes Passed"
          value={stats.quizzesPassed}
          subtitle="Interactive assessments"
          icon={HelpCircle}
          iconColor="#0284c7"
          bgGradient="linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)"
          borderColor="#0284c7"
        />
        <StatCard
          title="Certificates"
          value={stats.certificatesCount}
          subtitle="Issued achievements"
          icon={Award}
          iconColor="#8b5cf6"
          bgGradient="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
          borderColor="#8b5cf6"
        />
      </div>

      {/* Enrolled Courses Section */}
      <div className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">In-Progress Learning Tracks</h2>
            <p className="section-sub">Pick up right where you left off</p>
          </div>
          <Link to="/" className="text-link">
            <span>Browse All Courses</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="empty-dashboard-card">
            <div className="empty-icon-circle">
              <GraduationCap size={36} color="#6366f1" />
            </div>
            <h3>No Courses Enrolled Yet</h3>
            <p>
              Jump into our hands-on course catalog! Learn React 19, Full-Stack MERN, AI Prompt Engineering, and Cloud Architecture.
            </p>
            <Link to="/" className="btn btn-primary">
              <Compass size={18} />
              <span>Explore Course Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="enrolled-courses-grid">
            {enrolledCourses.map((c) => (
              <div key={c.courseId} className="enrolled-course-card">
                <div className="enrolled-card-media">
                  <img src={c.thumbnail} alt={c.title} />
                  <span className="enrolled-category-pill">{c.category}</span>
                </div>

                <div className="enrolled-card-content">
                  <div className="progress-header">
                    <span className="progress-ratio">
                      {c.completedCount} / {c.totalLessons} Lessons
                    </span>
                    <span className="progress-pct">{c.progressPercentage}%</span>
                  </div>

                  <div className="progress-bar-track">
                    <div
                      className={`progress-bar-fill ${c.progressPercentage === 100 ? 'complete' : ''}`}
                      style={{ width: `${c.progressPercentage}%` }}
                    ></div>
                  </div>

                  <h3 className="enrolled-card-title">{c.title}</h3>

                  <div className="enrolled-card-footer">
                    {c.certificateIssued && (
                      <span className="cert-badge">
                        <Award size={14} />
                        <span>Certified</span>
                      </span>
                    )}
                    <Link
                      to={`/learn/${c.courseId}`}
                      className={`btn ${c.progressPercentage === 100 ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                      style={{ marginLeft: 'auto' }}
                    >
                      <PlayCircle size={15} />
                      <span>{c.progressPercentage === 100 ? 'Review Course' : 'Continue Learning'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
