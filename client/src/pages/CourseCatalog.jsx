import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService } from '../services/api';
import CourseCard from '../components/CourseCard';
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Database,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Artificial Intelligence',
  'UI/UX Design',
  'Cloud & DevOps'
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CourseCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, sortBy]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel !== 'All') params.level = selectedLevel;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortBy) params.sort = sortBy;

      const res = await courseService.getAll(params);
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Unable to load courses. Please verify the backend server and MongoDB Atlas connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSearchQuery('');
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="catalog-page">
      {/* Hero Section */}
      <section className="catalog-hero">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={15} color="#6366f1" />
            <span>Modern Full-Stack Learning • Cloud & Atlas Ready</span>
          </div>

          <h1 className="hero-heading">
            Learn Industry Skills with <span className="gradient-text">Interactive Video & Quizzes</span>
          </h1>

          <p className="hero-description">
            Accelerate your software engineering career with hands-on curriculums. Build modern MERN apps, architect AI agents, create design systems, and deploy to cloud platforms with MongoDB Atlas.
          </p>

          <div className="hero-stats-row">
            <div className="stat-pill-item">
              <BookOpen size={16} color="#4f46e5" />
              <span>4+ Production Tracks</span>
            </div>
            <div className="stat-pill-item">
              <CheckCircle2 size={16} color="#10b981" />
              <span>Interactive Quizzes & Certificates</span>
            </div>
            <div className="stat-pill-item">
              <Database size={16} color="#059669" />
              <span>MongoDB Atlas Live Cluster</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Search & Filter Controls */}
      <section className="catalog-filter-bar">
        <div className="filter-controls-container">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="search-form-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              placeholder="Search courses by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); fetchCourses(); }}
                className="btn-clear-search"
              >
                ✕
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          {/* Difficulty & Sort Dropdowns */}
          <div className="dropdowns-group">
            <div className="filter-select-wrapper">
              <label>Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="custom-select"
              >
                {LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrapper">
              <label>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="custom-select"
              >
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-chips-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Course Grid Content */}
      <section className="courses-grid-section">
        {loading ? (
          <div className="courses-loading-state">
            <RefreshCw size={36} className="spinning-icon" color="#4f46e5" />
            <p>Fetching curriculum from MongoDB Atlas...</p>
          </div>
        ) : error ? (
          <div className="courses-error-state">
            <p>{error}</p>
            <button onClick={fetchCourses} className="btn btn-secondary mt-3">
              Try Again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="courses-empty-state">
            <GraduationCap size={48} color="#94a3b8" />
            <h3>No courses found matching your criteria</h3>
            <p>Try adjusting your search terms or clearing your selected category filters.</p>
            <button onClick={handleClearFilters} className="btn btn-primary mt-3">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseCatalog;

