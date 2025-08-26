import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packageIndex, setPackageIndex] = useState(0);
  const [visiblePackagesCount] = useState(3);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    name: '',
    email: '',
    travelers: 1,
    departureDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const navigate = useNavigate();

  // Check authentication status
  const isAuthenticated = !!localStorage.getItem('token');

  const getFutureDates = useCallback((daysAhead) => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const destRes = await fetch('http://localhost:5000/api/destinations');
        const destData = await destRes.json();
        setDestinations(destData);

        const allPackages = destData.flatMap(dest => dest.packages || []);
        setPackages(allPackages);

        // If user is authenticated, fetch wishlist status
        if (isAuthenticated) {
          await checkWishlistStatus(destData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Check wishlist status for all destinations
  const checkWishlistStatus = async (destinations) => {
    try {
      const token = localStorage.getItem('token');
      const status = {};
      
      for (const destination of destinations) {
        const response = await fetch(
          `http://localhost:5000/api/wishlist/check/${destination._id || destination.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          status[destination._id || destination.id] = data.isInWishlist;
        }
      }
      
      setWishlistStatus(status);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Add or remove from wishlist
  const toggleWishlist = async (destination, e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          message: 'Please log in to add items to your wishlist',
          returnTo: '/destinations'
        } 
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const destinationId = destination._id || destination.id;
      const isCurrentlyInWishlist = wishlistStatus[destinationId];

      if (isCurrentlyInWishlist) {
        // Remove from wishlist
        const response = await fetch(`http://localhost:5000/api/wishlist/${destinationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setWishlistStatus(prev => ({
            ...prev,
            [destinationId]: false
          }));
        }
      } else {
        // Add to wishlist
        const response = await fetch('http://localhost:5000/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            destinationId: destinationId,
            name: destination.name,
            image: destination.image,
            description: destination.description,
            price: destination.packages?.[0]?.price || 0
          })
        });

        if (response.ok) {
          setWishlistStatus(prev => ({
            ...prev,
            [destinationId]: true
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const visiblePackageCards = useMemo(() => {
    return packages
      .slice(packageIndex, packageIndex + visiblePackagesCount)
      .map(pkg => (
        <PackageCard 
          key={pkg._id || pkg.id} 
          pkg={pkg} 
          onClick={() => setSelectedPackage(pkg)} 
        />
      ));
  }, [packages, packageIndex, visiblePackagesCount]);

  const handleBookingChange = useCallback((e) => {
    const { name, value } = e.target;
    setBookingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleBookNow = useCallback(() => {
    if (!selectedPackage) {
      console.error('No package selected');
      return;
    }

    const packageId = selectedPackage._id || selectedPackage.id;
    if (!packageId) {
      console.error('Package ID is missing');
      return;
    }

    navigate('/payment', { 
      state: { 
        package: {
          ...selectedPackage,
          _id: packageId
        }, 
        bookingInfo 
      } 
    });
  }, [selectedPackage, bookingInfo, navigate]);

  const handleLoadMore = useCallback(() => {
    setPackageIndex(prev => {
      const nextIndex = prev + visiblePackagesCount;
      return nextIndex >= packages.length ? 0 : nextIndex;
    });
  }, [packages.length, visiblePackagesCount]);

  if (isLoading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="destinations-page">
      <section className="destinations-hero">
        <h1>Explore Your Dream Destinations</h1>
        <p>Discover handpicked travel experiences tailored for you</p>
      </section>

      <section className="top-destinations">
        <h2 className="section-title">Featured Destinations</h2>
        <div className="destinations-grid">
          {destinations.map(destination => (
            <DestinationCard 
              key={destination._id || destination.id} 
              destination={destination} 
              isInWishlist={wishlistStatus[destination._id || destination.id] || false}
              onWishlistToggle={toggleWishlist}
            />
          ))}
        </div>
      </section>

      <section className="travel-packages">
        <h2 className="section-title">Trending Travel Packages</h2>
        <div className="packages-grid">{visiblePackageCards}</div>

        {packages.length > visiblePackagesCount && (
          <button className="load-more" onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </section>

      {selectedPackage && (
        <PackageModal 
          selectedPackage={selectedPackage}
          bookingInfo={bookingInfo}
          onClose={() => setSelectedPackage(null)}
          onBookingChange={handleBookingChange}
          onBookNow={handleBookNow}
          getFutureDates={getFutureDates}
        />
      )}
    </div>
  );
};

const PackageCard = React.memo(({ pkg, onClick }) => (
  <div className="package-card" onClick={onClick}>
    <div className="package-image" style={{ backgroundImage: `url(${pkg.image})` }} loading="lazy" alt={pkg.name}></div>
    <div className="package-details">
      <h3>{pkg.name}</h3>
      <div className="price-duration">
        <span className="price">${pkg.price}</span>
        <span className="duration">{pkg.duration}</span>
      </div>
      <ul className="includes">{pkg.includes?.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <button className="view-details-btn">View Details</button>
    </div>
  </div>
));

const DestinationCard = React.memo(({ destination, isInWishlist, onWishlistToggle }) => (
  <div className="destination-card">
    <div className="destination-image" style={{ backgroundImage: `url(${destination.image})` }} loading="lazy" alt={destination.name}>
      <div className="overlay"></div>
      <button 
        className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`}
        onClick={(e) => onWishlistToggle(destination, e)}
        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isInWishlist ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
    <div className="destination-content">
      <h3>{destination.name}</h3>
      <p>{destination.description}</p>
      <ul className="highlights">{destination.highlights?.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  </div>
));

// PackageModal remains the same as before
const PackageModal = React.memo(({ selectedPackage, bookingInfo, onClose, onBookingChange, onBookNow, getFutureDates }) => {
  const packageDates = useMemo(() => selectedPackage.dates || getFutureDates(3), [selectedPackage.dates, getFutureDates]);

  return (
    <div className="package-modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <div className="modal-grid">
          <div className="modal-left">
            <h2>{selectedPackage.name}</h2>
            <div className="image-gallery">
              <div className="main-image" style={{ backgroundImage: `url(${selectedPackage.image})` }} loading="lazy" alt={selectedPackage.name}></div>
            </div>
            <div className="package-includes">
              <h3>What's Included</h3>
              <ul>{selectedPackage.includes?.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
            <div className="flight-details">
              <h3>Flight Information</h3>
              <div className="flight-info">
                <div><span>Airline:</span><span>{selectedPackage.flightDetails?.airline || 'Not specified'}</span></div>
                <div><span>Duration:</span><span>{selectedPackage.flightDetails?.duration || 'Not specified'}</span></div>
              </div>
            </div>
            <div className="hotel-details">
              <h3>Accommodation</h3>
              <div className="hotel-info">
                <div><span>Hotel:</span><span>{selectedPackage.hotelDetails?.name || 'Not specified'}</span></div>
                <div><span>Rating:</span><span>{selectedPackage.hotelDetails?.rating ? '★'.repeat(selectedPackage.hotelDetails.rating) : 'Not rated'}</span></div>
              </div>
            </div>
          </div>
          <div className="modal-right">
            <div className="booking-form">
              <h3>Book This Package</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={bookingInfo.name} onChange={onBookingChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={bookingInfo.email} onChange={onBookingChange} required />
              </div>
              <div className="form-group">
                <label>Number of Travelers</label>
                <input type="number" name="travelers" min="1" value={bookingInfo.travelers} onChange={onBookingChange} required />
              </div>
              <div className="form-group">
                <label>Departure Date</label>
                <select name="departureDate" value={bookingInfo.departureDate} onChange={onBookingChange} required>
                  <option value="">Select date</option>
                  {packageDates.map(date => <option key={date} value={date}>{date}</option>)}
                </select>
              </div>
              <div className="price-summary">
                <div className="price-item"><span>Package Price</span><span>${selectedPackage.price}</span></div>
                <div className="price-total"><span>Total</span><span>${selectedPackage.price * bookingInfo.travelers}</span></div>
              </div>
              <button className="book-now-btn" onClick={onBookNow}>Proceed to Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Destinations;