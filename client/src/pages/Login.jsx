import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  UserCheck,
  ShieldCheck,
  BookOpen,
  AlertCircle
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Connection failed. Make sure the server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await login(demoEmail, demoPassword);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.message || 'Demo login failed');
      }
    } catch (err) {
      setErrorMsg('Connection failed. Ensure seed script has run (`npm run seed`).');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <GraduationCap size={28} color="#ffffff" />
          </div>
          <h2 className="auth-title">Welcome to LearnPulse</h2>
          <p className="auth-sub">Sign in to resume courses, quizzes, and certificates</p>
        </div>

        {errorMsg && (
          <div className="alert-box alert-error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Accounts Quick-Select */}
        <div className="demo-accounts-box">
          <div className="demo-header">
            <Sparkles size={14} color="#6366f1" />
            <span>Quick 1-Click Demo Accounts</span>
          </div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="demo-btn student-demo"
              onClick={() => handleDemoLogin('student@learnhub.dev', 'Student@123')}
            >
              <UserCheck size={14} />
              <div>
                <strong>Student Demo</strong>
                <small>Alex Morgan</small>
              </div>
            </button>

            <button
              type="button"
              className="demo-btn instructor-demo"
              onClick={() => handleDemoLogin('instructor@learnhub.dev', 'Instructor@123')}
            >
              <BookOpen size={14} />
              <div>
                <strong>Instructor Demo</strong>
                <small>Dr. Sarah Chen</small>
              </div>
            </button>

            <button
              type="button"
              className="demo-btn admin-demo"
              onClick={() => handleDemoLogin('admin@learnhub.dev', 'Admin@123')}
            >
              <ShieldCheck size={14} />
              <div>
                <strong>Admin Demo</strong>
                <small>Platform Lead</small>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
