import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Compass,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  User,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isInstructor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-badge">
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <div className="logo-text-group">
            <span className="brand-name">
              Learn<span className="brand-highlight">Pulse</span>
            </span>
            <span className="brand-tagline">Interactive Hub</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Compass size={17} />
            <span>Explore Courses</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <LayoutDashboard size={17} />
              <span>My Learning</span>
            </Link>
          )}

          {isAuthenticated && isInstructor && (
            <Link
              to="/instructor"
              className={`nav-link ${isActive('/instructor') ? 'active' : ''}`}
            >
              <PlusCircle size={17} />
              <span>Instructor Studio</span>
            </Link>
          )}
        </nav>

        {/* Header Right Actions */}
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-profile-widget">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="user-avatar"
              />
              <div className="user-meta">
                <span className="user-name">{user?.name}</span>
                <span className={`user-role-badge role-${user?.role}`}>
                  {user?.role === 'admin' ? 'Platform Lead' : user?.role === 'instructor' ? 'Instructor' : 'Student'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-icon-logout"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="auth-action-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Sparkles size={14} />
                <span>Get Started Free</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <Link
            to="/"
            className={`mobile-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Compass size={18} />
            <span>Explore Courses</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`mobile-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              <span>My Learning</span>
            </Link>
          )}
          {isAuthenticated && isInstructor && (
            <Link
              to="/instructor"
              className={`mobile-link ${isActive('/instructor') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlusCircle size={18} />
              <span>Instructor Studio</span>
            </Link>
          )}
          <div className="mobile-drawer-footer">
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger btn-block">
                <LogOut size={16} />
                <span>Log Out ({user?.name})</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
