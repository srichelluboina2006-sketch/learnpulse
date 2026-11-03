import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GraduationCap } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content-area">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-col-brand">
            <div className="footer-brand">
              <div className="footer-logo-badge">
                <GraduationCap size={20} color="#ffffff" />
              </div>
              <span className="footer-title">LearnPulse</span>
            </div>
            <p className="footer-desc">
              The modern full-stack interactive learning platform. Master web development, AI engineering, design systems, and cloud architectures with hands-on video classrooms and instant interactive quizzes.
            </p>
            <div className="footer-status-pill">
              <span className="status-dot"></span>
              <span>MongoDB Atlas Cloud Connected</span>
            </div>
          </div>

          <div className="footer-col-links">
            <h4 className="footer-heading">Learning Tracks</h4>
            <ul>
              <li><Link to="/?category=Web+Development">Web Development</Link></li>
              <li><Link to="/?category=Artificial+Intelligence">Artificial Intelligence</Link></li>
              <li><Link to="/?category=UI%2FUX+Design">UI/UX Design Systems</Link></li>
              <li><Link to="/?category=Cloud+%26+DevOps">Cloud & DevOps</Link></li>
            </ul>
          </div>

          <div className="footer-col-links">
            <h4 className="footer-heading">Platform</h4>
            <ul>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
              <li><Link to="/instructor">Instructor Studio</Link></li>
              <li><Link to="/login">Account Access</Link></li>
              <li><a href="/api/health" target="_blank" rel="noreferrer">API Health Status</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LearnPulse LMS. Built with MongoDB Atlas, Express, React 19, and Node.js.</p>
          <div className="footer-bottom-badges">
            <span className="footer-badge">Vercel Ready</span>
            <span className="footer-badge">Render Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
