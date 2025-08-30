import React, { useState, useEffect, useMemo } from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Typing animation state
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCaret, setShowCaret] = useState(true);

  // Destination hover state
  const [hoveredCard, setHoveredCard] = useState(null);

  // ✅ useMemo so phrases doesn't change on every render
  const phrases = useMemo(() => [
    "breathtaking destinations",
    "unforgettable experiences",
    "cultural adventures",
    "luxury getaways"
  ], []);

  const destinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      description: "White-washed buildings with stunning sunset views",
      price: "$1,200"
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      description: "Ancient temples and beautiful cherry blossoms",
      price: "$1,800"
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      description: "Tropical paradise with lush jungles and pristine beaches",
      price: "$950"
    }
  ];

  const travelTips = [
    {
      id: 1,
      title: "Pack Smart",
      description: "Bring versatile clothing items that can be layered and mixed for different occasions.",
      icon: "🎒"
    },
    {
      id: 2,
      title: "Local Cuisine",
      description: "Try authentic local dishes for a true cultural experience.",
      icon: "🍜"
    },
    {
      id: 3,
      title: "Capture Memories",
      description: "Take photos but also take time to be present in the moment.",
      icon: "📸"
    }
  ];

  // Typing animation effect
  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseBetween = 1500;
    const caretBlinkSpeed = 500;

    const typingTimer = setTimeout(() => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        setTypedText(currentPhrase.substring(0, typedText.length - 1));
      } else {
        setTypedText(currentPhrase.substring(0, typedText.length + 1));
      }

      if (!isDeleting && typedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), pauseBetween);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
      }
    }, typingSpeed);

    const caretTimer = setInterval(() => {
      setShowCaret(prev => !prev);
    }, caretBlinkSpeed);

    return () => {
      clearTimeout(typingTimer);
      clearInterval(caretTimer);
    };
  }, [typedText, currentPhraseIndex, isDeleting, phrases]);

  return (
     <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover <span className="typed-text">{typedText}</span>
              <span className={`caret ${showCaret ? 'visible' : ''}`}>|</span>
            </h1>
            <p className="hero-subtitle">
              Curated travel experiences tailored to your dreams
            </p>
          </div>
          <div className="hero-cta">
            <Link to="/destinations">
              <button className="explore-btn">
                <span>Explore Journeys</span>
                <svg className="arrow-icon" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
            <button className="video-btn">
              <div className="play-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span>Watch Story</span>
            </button>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="mouse-scroll"></div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="section-header">
          <h2 className="section-title">
            <span>Featured</span> <span className="highlight">Destinations</span>
          </h2>
          <p className="section-subtitle">Handpicked locations for your next adventure</p>
        </div>

        <div className="destination-cards">
          {destinations.map((destination) => (
            <div 
              key={destination.id}
              className={`destination-card ${hoveredCard === destination.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className="card-image"
                style={{ backgroundImage: `url(${destination.image})` }}
              >
                <div className="card-overlay"></div>
                <div className="card-content">
                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>
                  <div className="price-tag">{destination.price}</div>
                  <Link to="/destinations">
                    <button className="card-btn">
                      <span>Explore</span>
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="section-cta">
          <Link to="/destinations">
            <button className="view-all-btn">
              <span>View All Destinations</span>
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </Link>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience-section">
        <div className="experience-content">
          <h2 className="experience-title">Why Choose Journio</h2>
          <div className="experience-features">
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                </svg>
              </div>
              <h3>Tailored Experiences</h3>
              <p>Custom itineraries designed just for you</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5z"/>
                </svg>
              </div>
              <h3>Local Experts</h3>
              <p>Insider knowledge from our global network</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
              </div>
              <h3>Seamless Planning</h3>
              <p>From flights to activities, we handle it all</p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Inspiration Section */}
      <section className="inspiration-section">
        <div className="section-header">
          <h2 className="section-title">
            <span>Travel</span> <span className="highlight">Inspiration</span>
          </h2>
          <p className="section-subtitle">Tips and ideas for your next journey</p>
        </div>

        <div className="inspiration-grid">
          {travelTips.map((tip) => (
            <div key={tip.id} className="inspiration-card">
              <div className="inspiration-icon">{tip.icon}</div>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
        
        <div className="inspiration-cta">
          <p>Ready to start your adventure?</p>
          <Link to="/destinations">
            <button className="inspiration-btn">
              <span>Plan Your Trip</span>
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;