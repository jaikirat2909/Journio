import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaGlobe, FaHeart, FaAward, FaRocket, FaQuoteLeft, FaHandshake, FaLeaf } from 'react-icons/fa';
import { GiWorld, GiJourney } from 'react-icons/gi';
import { MdTravelExplore } from 'react-icons/md';
import '../styles/About.css';

const AboutUs = () => {
  const [animatedStats, setAnimatedStats] = useState({
    travelers: 0,
    countries: 0,
    experiences: 0
  });
  
  const [activeTab, setActiveTab] = useState('mission');
  const statsRef = useRef(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  // Values data
  const values = [
    {
      icon: <FaHeart />,
      title: 'Passion for Travel',
      description: 'We live and breathe travel, and it shows in every journey we craft.'
    },
    {
      icon: <FaGlobe />,
      title: 'Global Responsibility',
      description: 'We promote sustainable tourism that benefits local communities.'
    },
    {
      icon: <FaUsers />,
      title: 'Personal Connection',
      description: 'Every traveler is unique, and so is every journey we create.'
    },
    {
      icon: <FaAward />,
      title: 'Excellence',
      description: 'We strive for perfection in every detail of your experience.'
    }
  ];

  // Company journey timeline
  const timeline = [
    {
      year: '2010',
      title: 'Our Beginning',
      description: 'Founded with a mission to transform how people experience travel.'
    },
    {
      year: '2014',
      title: 'Global Expansion',
      description: 'Expanded our services to over 30 countries across 5 continents.'
    },
    {
      year: '2018',
      title: 'Sustainability Initiative',
      description: 'Launched our eco-friendly and community-focused travel programs.'
    },
    {
      year: '2023',
      title: 'Digital Innovation',
      description: 'Introduced AI-powered personalized journey recommendations.'
    }
  ];

  // Animation for stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isStatsVisible) {
      const duration = 2000; // ms
      const steps = 60;
      const stepDuration = duration / steps;

      const targetStats = {
        travelers: 50000,
        countries: 87,
        experiences: 12000
      };

      const animateValue = (start, end, setter) => {
        let current = start;
        const range = end - start;
        const increment = range / steps;
        const timer = setInterval(() => {
          current += increment;
          if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
          }
          setter(Math.floor(current));
        }, stepDuration);
      };

      animateValue(0, targetStats.travelers, (value) => {
        setAnimatedStats(prev => ({ ...prev, travelers: value }));
      });

      animateValue(0, targetStats.countries, (value) => {
        setAnimatedStats(prev => ({ ...prev, countries: value }));
      });

      animateValue(0, targetStats.experiences, (value) => {
        setAnimatedStats(prev => ({ ...prev, experiences: value }));
      });
    }
  }, [isStatsVisible]);

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Our Story</h1>
          <p className="hero-subtitle">Crafting unforgettable journeys since 2010</p>
        </div>
      </section>

     

    

      {/* Mission & Vision Tabs */}
      <section className="mission-section">
        <div className="container">
          <h2 className="section-title">Our Purpose</h2>
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
                onClick={() => setActiveTab('mission')}
              >
                Our Mission
              </button>
              <button 
                className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
                onClick={() => setActiveTab('vision')}
              >
                Our Vision
              </button>
              <button 
                className={`tab-btn ${activeTab === 'approach' ? 'active' : ''}`}
                onClick={() => setActiveTab('approach')}
              >
                Our Approach
              </button>
            </div>
            <div className="tabs-content">
              {activeTab === 'mission' && (
                <div className="tab-pane active">
                  <h3>To inspire and enable extraordinary travel experiences</h3>
                  <p>
                    We're dedicated to creating journeys that not only show you the world 
                    but transform how you see it. Through personalized service, local expertise, 
                    and attention to detail, we make every trip an unforgettable adventure.
                  </p>
                </div>
              )}
              {activeTab === 'vision' && (
                <div className="tab-pane active">
                  <h3>A world where travel connects and transforms us</h3>
                  <p>
                    We envision a future where travel breaks down barriers, fosters understanding 
                    between cultures, and inspires positive change—both in travelers and the 
                    communities they visit.
                  </p>
                </div>
              )}
              {activeTab === 'approach' && (
                <div className="tab-pane active">
                  <h3>Personal, sustainable, and transformative</h3>
                  <p>
                    Our approach combines deep local knowledge with personalized planning, 
                    ensuring that each journey is unique, responsible, and truly transformative. 
                    We believe in travel that gives back and creates lasting positive impact.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
        {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <h3 className="stat-number">{animatedStats.travelers}+</h3>
              <p className="stat-label">Happy Travelers</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaGlobe />
              </div>
              <h3 className="stat-number">{animatedStats.countries}</h3>
              <p className="stat-label">Countries Covered</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaRocket />
              </div>
              <h3 className="stat-number">{animatedStats.experiences}</h3>
              <p className="stat-label">Curated Experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="commitment-section">
        <div className="container">
          <div className="commitment-content">
            <div className="commitment-text">
              <h2>Our Commitment to You</h2>
              <p>
                At Journio, we're committed to providing exceptional travel experiences that 
                exceed your expectations. Our dedicated team works tirelessly behind the scenes 
                to ensure every aspect of your journey is seamless, memorable, and truly special.
              </p>
              <div className="commitment-features">
                <div className="commitment-feature">
                  <FaHandshake />
                  <span>24/7 Support During Your Travels</span>
                </div>
                <div className="commitment-feature">
                  <FaLeaf />
                  <span>Sustainable & Eco-Friendly Options</span>
                </div>
                <div className="commitment-feature">
                  <FaAward />
                  <span>Best Price Guarantee</span>
                </div>
              </div>
            </div>
            <div className="commitment-visual">
              <div className="commitment-image"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container">
          <h2 className="section-title">Why Travelers Love Us</h2>
          <div className="testimonial">
            <div className="quote-icon">
              <FaQuoteLeft />
            </div>
            <blockquote>
              "Journio transformed what could have been just another vacation into a life-changing experience. 
              Their attention to detail and deep local knowledge made us feel like we were discovering 
              each destination through the eyes of a friend who lived there."
            </blockquote>
            <div className="testimonial-author">
              <strong>Emma Thompson</strong>
              <span>Traveled to Japan & Thailand</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;