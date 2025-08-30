import React, { useState, useEffect } from 'react';
import { FaStar, FaPaperPlane, FaComments, FaSmile, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/Experiences.css';

const Experiences = () => {
  const [feedback, setFeedback] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // Show only 2 initially
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    message: '',
    experienceType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Experience types for the dropdown
  const experienceTypes = [
    'Adventure Activities',
    'Cultural Experiences',
    'Food & Dining',
    'Wellness & Spa',
    'Nightlife',
    'Shopping',
    'Local Tours',
    'Photography',
    'Water Sports',
    'Wildlife Safari'
  ];

  const MAX_FEEDBACK_ITEMS = 6; // Maximum number of feedback items to store

  useEffect(() => {
    // Load saved feedback from localStorage
    const savedFeedback = localStorage.getItem('experiencesFeedback');
    if (savedFeedback) {
      const parsedFeedback = JSON.parse(savedFeedback);
      // Sort by timestamp (newest first)
      const sortedFeedback = parsedFeedback.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setFeedback(sortedFeedback);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || !formData.experienceType) {
      setSubmitMessage('Please fill in all required fields');
      return;
    }

    if (formData.rating === 0) {
      setSubmitMessage('Please provide a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newFeedback = {
        id: Date.now(),
        ...formData,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        timestamp: new Date().toISOString()
      };

      // Add new feedback and limit to MAX_FEEDBACK_ITEMS
      let updatedFeedback = [newFeedback, ...feedback];
      
      // If we exceed the maximum, remove the oldest items
      if (updatedFeedback.length > MAX_FEEDBACK_ITEMS) {
        // Sort by timestamp to ensure we remove the oldest
        updatedFeedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        // Keep only the newest MAX_FEEDBACK_ITEMS
        updatedFeedback = updatedFeedback.slice(0, MAX_FEEDBACK_ITEMS);
      }
      
      setFeedback(updatedFeedback);
      localStorage.setItem('experiencesFeedback', JSON.stringify(updatedFeedback));

      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: 0,
        message: '',
        experienceType: ''
      });
      
      // Reset visible count to show only the first 2
      setVisibleCount(2);
      
      setSubmitMessage('Thank you for sharing your experience!');
    } catch (error) {
      setSubmitMessage('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 4000);
    }
  };

  const handleLoadMore = () => {
    if (visibleCount + 2 >= feedback.length) {
      // Show all if we're about to reach the end
      setVisibleCount(feedback.length);
    } else {
      // Show 2 more
      setVisibleCount(prev => prev + 2);
    }
  };

  const handleShowLess = () => {
    // Show only the first 2
    setVisibleCount(2);
  };

  const StarRating = ({ rating, onChange, readonly = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${readonly ? 'readonly' : 'clickable'}`}
            onClick={() => !readonly && onChange(star)}
          >
            <FaStar />
          </span>
        ))}
      </div>
    );
  };

  // Get the feedback items to display (newest first, limited by visibleCount)
  const displayedFeedback = feedback.slice(0, visibleCount);

  return (
    <div className="experiences-page">
      {/* Hero Section */}
      <section className="experiences-hero">
        <div className="hero-content">
          <h1>Share Your Journey</h1>
          <p>Your experiences help us create better adventures for everyone</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="experiences-content">
        <div className="container">
          <div className="content-grid">
            {/* Feedback Form Section */}
            <div className="form-section">
              <div className="section-header">
                <FaComments className="header-icon" />
                <h2>Tell Us About Your Experience</h2>
                <p>We value your feedback and use it to improve our services</p>
              </div>

              <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="experienceType">Type of Experience *</label>
                  <select
                    id="experienceType"
                    name="experienceType"
                    value={formData.experienceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select experience type</option>
                    {experienceTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Rating *</label>
                  <div className="rating-container">
                    <StarRating 
                      rating={formData.rating} 
                      onChange={handleRatingChange} 
                    />
                    <span className="rating-text">
                      {formData.rating === 0 ? 'Select rating' : `${formData.rating}/5 stars`}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Experience *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share details about your experience, what you enjoyed, and any suggestions for improvement..."
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <FaPaperPlane />
                      Share Your Experience
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div className={`submit-message ${submitMessage.includes('Thank you') ? 'success' : 'error'}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Feedback Display Section */}
            <div className="feedback-section">
              <div className="section-header">
                <FaSmile className="header-icon" />
                <h2>Recent Experiences Shared</h2>
                <p>See what other travelers are saying about their journeys</p>
                <div className="feedback-count">
                  Showing {displayedFeedback.length} of {feedback.length} experiences
                </div>
              </div>

              {feedback.length === 0 ? (
                <div className="no-feedback">
                  <div className="empty-state">
                    <FaComments className="empty-icon" />
                    <h3>No experiences shared yet</h3>
                    <p>Be the first to share your travel experience!</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="feedback-list">
                    {displayedFeedback.map(item => (
                      <div key={item.id} className="feedback-item">
                        <div className="feedback-header">
                          <div className="user-info">
                            <h4>{item.name}</h4>
                            <span className="experience-type">{item.experienceType}</span>
                          </div>
                          <div className="feedback-meta">
                            <StarRating rating={item.rating} readonly={true} />
                            <span className="date">{item.date}</span>
                          </div>
                        </div>
                        <p className="feedback-message">"{item.message}"</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Load More / Show Less buttons */}
                  <div className="feedback-controls">
                    {visibleCount < feedback.length && (
                      <button className="load-more-btn" onClick={handleLoadMore}>
                        <FaChevronDown />
                        Load More ({feedback.length - visibleCount} more)
                      </button>
                    )}
                    
                    {visibleCount > 2 && (
                      <button className="show-less-btn" onClick={handleShowLess}>
                        <FaChevronUp />
                        Show Less
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experiences;