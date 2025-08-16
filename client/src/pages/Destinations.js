import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [visiblePackages, setVisiblePackages] = useState(3);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    name: '',
    email: '',
    travelers: 1,
    departureDate: ''
  });
  const navigate = useNavigate();

  // Mock data fetch - replace with actual API calls
  useEffect(() => {
    // Fetch destinations
    const mockDestinations = [
      {
        id: 1,
        name: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
        description: "Tropical paradise with lush jungles and pristine beaches",
        highlights: ["Ubud Monkey Forest", "Tanah Lot Temple", "Uluwatu Cliff"]
      },
      // Add 2-3 more top destinations
    ];

    // Fetch packages
    const mockPackages = [
      {
        id: 1,
        destinationId: 1,
        name: "Bali Premium Escape",
        price: 1299,
        duration: "5D/4N",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
        includes: [
          "Return flights from major cities",
          "4 nights at 5-star resort",
          "Daily breakfast",
          "Airport transfers"
        ],
        flightDetails: {
          airline: "Garuda Indonesia",
          departure: "08:00 AM",
          arrival: "03:00 PM",
          duration: "7h 15m"
        },
        hotelDetails: {
          name: "The Mulia Resort",
          rating: 5,
          amenities: ["Pool", "Spa", "Beach Access"]
        },
        dates: getFutureDates(3) // Dates starting 3 days from now
      },
      {
        id: 2,
        destinationId: 2,
        name: "Bali Premium Escape",
        price: 1299,
        duration: "5D/4N",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
        includes: [
          "Return flights from major cities",
          "4 nights at 5-star resort",
          "Daily breakfast",
          "Airport transfers"
        ],
        flightDetails: {
          airline: "Garuda Indonesia",
          departure: "08:00 AM",
          arrival: "03:00 PM",
          duration: "7h 15m"
        },
        hotelDetails: {
          name: "The Mulia Resort",
          rating: 5,
          amenities: ["Pool", "Spa", "Beach Access"]
        },
        dates: getFutureDates(3) // Dates starting 3 days from now
      }
      // Add 9-11 more packages
    ];

    setDestinations(mockDestinations);
    setPackages(mockPackages);
  }, []);

  function getFutureDates(daysAhead) {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookNow = () => {
    // In a real app, you would process payment here
    navigate('/payment', {
      state: {
        package: selectedPackage,
        bookingInfo
      }
    });
  };

  return (
    <div className="destinations-page">
      {/* Hero Section */}
      <section className="destinations-hero">
        <h1>Explore Your Dream Destinations</h1>
        <p>Discover handpicked travel experiences tailored for you</p>
      </section>

      {/* Top Destinations */}
      <section className="top-destinations">
        <h2 className="section-title">Featured Destinations</h2>
        <div className="destinations-grid">
          {destinations.map(destination => (
            <div key={destination.id} className="destination-card">
              <div 
                className="destination-image"
                style={{ backgroundImage: `url(${destination.image})` }}
              >
                <div className="overlay"></div>
              </div>
              <div className="destination-content">
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <ul className="highlights">
                  {destination.highlights.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Packages */}
      <section className="travel-packages">
        <h2 className="section-title">Trending Travel Packages</h2>
        <div className="packages-grid">
          {packages.slice(0, visiblePackages).map(pkg => (
            <div 
              key={pkg.id} 
              className="package-card"
              onClick={() => setSelectedPackage(pkg)}
            >
              <div 
                className="package-image"
                style={{ backgroundImage: `url(${pkg.image})` }}
              ></div>
              <div className="package-details">
                <h3>{pkg.name}</h3>
                <div className="price-duration">
                  <span className="price">${pkg.price}</span>
                  <span className="duration">{pkg.duration}</span>
                </div>
                <ul className="includes">
                  {pkg.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>

        {visiblePackages < packages.length && (
          <button 
            className="load-more"
            onClick={() => setVisiblePackages(prev => prev + 3)}
          >
            Show More Packages
          </button>
        )}
      </section>

      {/* Package Details Modal */}
      {selectedPackage && (
        <div className="package-modal">
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setSelectedPackage(null)}
            >
              &times;
            </button>

            <div className="modal-grid">
              <div className="modal-left">
                <h2>{selectedPackage.name}</h2>
                <div className="image-gallery">
                  <div 
                    className="main-image"
                    style={{ backgroundImage: `url(${selectedPackage.image})` }}
                  ></div>
                </div>

                <div className="package-includes">
                  <h3>What's Included</h3>
                  <ul>
                    {selectedPackage.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="flight-details">
                  <h3>Flight Information</h3>
                  <div className="flight-info">
                    <div>
                      <span>Airline:</span>
                      <span>{selectedPackage.flightDetails.airline}</span>
                    </div>
                    <div>
                      <span>Duration:</span>
                      <span>{selectedPackage.flightDetails.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="hotel-details">
                  <h3>Accommodation</h3>
                  <div className="hotel-info">
                    <div>
                      <span>Hotel:</span>
                      <span>{selectedPackage.hotelDetails.name}</span>
                    </div>
                    <div>
                      <span>Rating:</span>
                      <span>{'★'.repeat(selectedPackage.hotelDetails.rating)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-right">
                <div className="booking-form">
                  <h3>Book This Package</h3>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={bookingInfo.name}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={bookingInfo.email}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Number of Travelers</label>
                    <input 
                      type="number" 
                      name="travelers"
                      min="1"
                      value={bookingInfo.travelers}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Departure Date</label>
                    <select 
                      name="departureDate"
                      value={bookingInfo.departureDate}
                      onChange={handleBookingChange}
                      required
                    >
                      <option value="">Select date</option>
                      {selectedPackage.dates.map(date => (
                        <option key={date} value={date}>{date}</option>
                      ))}
                    </select>
                  </div>
                  <div className="price-summary">
                    <div className="price-item">
                      <span>Package Price</span>
                      <span>${selectedPackage.price}</span>
                    </div>
                    <div className="price-total">
                      <span>Total</span>
                      <span>${selectedPackage.price * bookingInfo.travelers}</span>
                    </div>
                  </div>
                  <button 
                    className="book-now-btn"
                    onClick={handleBookNow}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;