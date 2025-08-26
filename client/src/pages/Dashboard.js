import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Dashboard.css';

// Icons for the dashboard
import { 
  FaUser, FaMapMarkerAlt, FaCalendarAlt, 
  FaCog, FaSignOutAlt, FaHeart, FaHistory, FaStar,
  FaTrash
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Fetch user data including bookings and wishlist
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setDashboardLoading(true);
        
        // Fetch user bookings - CORRECTED ENDPOINT
        const bookingsResponse = await fetch(`http://localhost:5000/api/bookings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        } else {
          console.error('Failed to fetch bookings:', bookingsResponse.status);
        }

        // Fetch user wishlist - CORRECTED ENDPOINT
        const wishlistResponse = await fetch(`http://localhost:5000/api/wishlist`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json();
          setWishlist(wishlistData);
        } else {
          console.error('Failed to fetch wishlist:', wishlistResponse.status);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchUserData();
  }, [user, activeTab]); // Added activeTab to refetch when switching tabs

  // Function to remove item from wishlist - CORRECTED ENDPOINT
  const removeFromWishlist = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setWishlist(wishlist.filter(item => item._id !== itemId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading your travel profile...</div>
      </div>
    );
  }

  // Show message if user is not available
  if (!user) {
    return (
      <div className="dashboard-error">
        <h2>User not found. Please log in again.</h2>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="dashboard-btn-primary"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Show loading while fetching dashboard data
  if (dashboardLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          {/* Sidebar skeleton */}
          <div className="sidebar-header">
            <h2>JOURNIO</h2>
            <div className="user-welcome">
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>Welcome back!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-content">
          <div className="loading-spinner">Loading your data...</div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const upcomingTrips = bookings.filter(booking => 
    new Date(booking.departureDate) > new Date()
  ).length;
  
  const completedTrips = bookings.filter(booking => 
    new Date(booking.departureDate) <= new Date()
  ).length;

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>JOURNIO</h2>
          <div className="user-welcome">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>Welcome back!</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'overview' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('overview')}
          >
            <FaUser />
            <span>Overview</span>
          </button>
          <button 
            className={activeTab === 'bookings' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('bookings')}
          >
            <FaCalendarAlt />
            <span>My Bookings</span>
          </button>
          <button 
            className={activeTab === 'wishlist' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('wishlist')}
          >
            <FaHeart />
            <span>Wishlist ({wishlist.length})</span>
          </button>
          <button 
            className={activeTab === 'settings' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog />
            <span>Settings</span>
          </button>
          <button className="nav-item logout-btn" onClick={logout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h1>Welcome to Your Travel Dashboard, {user.name.split(' ')[0]}!</h1>
            <p className="dashboard-subtitle">Manage your travel experiences and plan your next adventure</p>
            
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon upcoming">
                  <FaCalendarAlt />
                </div>
                <div className="stat-info">
                  <h3>Upcoming Trips</h3>
                  <p className="stat-number">{upcomingTrips}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon completed">
                  <FaHistory />
                </div>
                <div className="stat-info">
                  <h3>Completed Trips</h3>
                  <p className="stat-number">{completedTrips}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon wishlist">
                  <FaHeart />
                </div>
                <div className="stat-info">
                  <h3>Wishlist Items</h3>
                  <p className="stat-number">{wishlist.length}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Your Profile Information</h2>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{user.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Travel Tier:</span>
                  <span className="detail-value">
                    Explorer <FaStar style={{color: '#FFD700'}} />
                  </span>
                </div>
              </div>
            </div>

            {bookings.length > 0 && (
              <div className="recent-activity">
                <h2>Upcoming Trips</h2>
                <div className="activity-list">
                  {bookings
                    .filter(booking => new Date(booking.departureDate) > new Date())
                    .slice(0, 3)
                    .map(booking => (
                      <div key={booking._id} className="activity-item">
                        <div className="activity-icon">
                          <FaCalendarAlt />
                        </div>
                        <div className="activity-content">
                          <p>Your trip to <strong>{booking.destination}</strong> is coming up!</p>
                          <span className="activity-date">
                            Departure: {new Date(booking.departureDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {wishlist.length > 0 && (
              <div className="recent-activity">
                <h2>Recently Added to Wishlist</h2>
                <div className="wishlist-preview">
                  {wishlist.slice(0, 3).map(item => (
                    <div key={item._id} className="wishlist-preview-item">
                      <div 
                        className="wishlist-preview-image"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="wishlist-preview-info">
                        <h4>{item.name}</h4>
                        <p>From ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="tab-content">
            <h1>My Bookings</h1>
            <p className="dashboard-subtitle">Manage your upcoming and past trips</p>
            
            {bookings.length === 0 ? (
              <div className="empty-state">
                <FaCalendarAlt size={48} />
                <h3>No bookings yet</h3>
                <p>Start exploring our destinations to plan your next adventure!</p>
                <button 
                  className="btn-primary"
                  onClick={() => window.location.href = '/destinations'}
                >
                  Browse Destinations
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-destination">
                      <FaMapMarkerAlt />
                      <span>{booking.destination}</span>
                    </div>
                    <div className="booking-details">
                      <div className="booking-date">
                        <FaCalendarAlt />
                        <span>Departure: {new Date(booking.departureDate).toLocaleDateString()}</span>
                      </div>
                      <div className={`booking-status ${
                        new Date(booking.departureDate) > new Date() ? 'upcoming' : 'completed'
                      }`}>
                        {new Date(booking.departureDate) > new Date() ? 'Upcoming' : 'Completed'}
                      </div>
                      <div className="booking-price">
                        ${booking.totalAmount}
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button className="btn-outline">View Details</button>
                      {new Date(booking.departureDate) > new Date() && (
                        <button className="btn-primary">Manage Booking</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="tab-content">
            <h1>My Wishlist</h1>
            <p className="dashboard-subtitle">Your dream destinations</p>
            
            {wishlist.length === 0 ? (
              <div className="empty-state">
                <FaHeart size={48} />
                <h3>Your wishlist is empty</h3>
                <p>Start adding destinations to your wishlist to plan your next adventure!</p>
                <button 
                  className="btn-primary"
                  onClick={() => window.location.href = '/destinations'}
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(item => (
                  <div key={item._id} className="wishlist-card">
                    <div className="wishlist-image">
                      <div 
                        className="placeholder-image"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <button 
                        className="wishlist-remove"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="wishlist-content">
                      <h3>{item.name}</h3>
                      <p className="wishlist-description">{item.description}</p>
                      <p className="wishlist-price">From ${item.price}</p>
                      <div className="wishlist-actions">
                        <button className="btn-primary">Book Now</button>
                        <button 
                          className="btn-outline"
                          onClick={() => removeFromWishlist(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h1>Account Settings</h1>
            <p className="dashboard-subtitle">Manage your account preferences</p>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user.name} readOnly />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={user.email} readOnly />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input type="password" value="********" readOnly />
                <button className="btn-outline">Change Password</button>
              </div>
              
              <div className="form-group">
                <label>Notifications</label>
                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Email notifications</span>
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Promotional offers</span>
                  </label>
                </div>
              </div>
              
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;