import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h3>JOURNIO</h3>
          <p>Travel beyond your imagination</p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Company</h4>
            <a href="/about">About Us</a>
            <a href="/careers">Careers</a>
            <a href="/blog">Blog</a>
          </div>

          <div className="link-group">
            <h4>Support</h4>
            <a href="/contact">Contact</a>
            <a href="/faq">FAQ</a>
            <a href="/privacy">Privacy Policy</a>
          </div>

          <div className="link-group">
            <h4>Social</h4>
            <a href="https://facebook.com">Facebook</a>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://twitter.com">Twitter</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Journio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;