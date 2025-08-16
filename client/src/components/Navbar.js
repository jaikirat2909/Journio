import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">JOURNIO</Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link to="/destinations">Destinations</Link>
          <Link to="/experiences">Experiences</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Search and Auth */}
        <div className="navbar-actions">
          <button className="search-btn">
            <FaSearch />
          </button>
          <Link to="/signup" className="auth-btn">
            <FaUser />
            <span>Sign In</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/destinations" onClick={toggleMobileMenu}>Destinations</Link>
        <Link to="/experiences" onClick={toggleMobileMenu}>Experiences</Link>
        <Link to="/about" onClick={toggleMobileMenu}>About</Link>
        <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
        <div className="mobile-auth">
          <Link to="/signup" className="auth-btn" onClick={toggleMobileMenu}>
            <FaUser />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;