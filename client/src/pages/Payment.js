import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  // Get data from navigation state
  const { package: travelPackage, bookingInfo } = location.state || {};

  useEffect(() => {
    if (!travelPackage || !bookingInfo) {
      navigate('/destinations'); // Redirect if no data
    }
  }, [travelPackage, bookingInfo, navigate]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would process payment here
    // For demo, we'll simulate success after 1.5 seconds
    setTimeout(() => {
      setPaymentSuccess(true);
      // Here you would call your backend to send email receipt
    }, 1500);
  };

  if (!travelPackage || !bookingInfo) {
    return <div className="payment-loading">Loading...</div>;
  }

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h2>Payment Successful!</h2>
        <p>Your booking confirmation has been sent to {bookingInfo.email}</p>
        
        <div className="receipt">
          <h3>Booking Details</h3>
          <div className="receipt-row">
            <span>Package:</span>
            <span>{travelPackage.name}</span>
          </div>
          <div className="receipt-row">
            <span>Travelers:</span>
            <span>{bookingInfo.travelers}</span>
          </div>
          <div className="receipt-row">
            <span>Departure:</span>
            <span>{bookingInfo.departureDate}</span>
          </div>
          <div className="receipt-row">
            <span>Total Paid:</span>
            <span>${travelPackage.price * bookingInfo.travelers}</span>
          </div>
          <div className="receipt-row">
            <span>Booking Reference:</span>
            <span>JRN-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
          </div>
        </div>

        <button 
          className="back-to-home"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Complete Your Booking</h2>
        
        <div className="booking-summary">
          <h3>{travelPackage.name}</h3>
          <p>Departure: {bookingInfo.departureDate}</p>
          <p>Travelers: {bookingInfo.travelers}</p>
          <p className="total-price">
            Total: <span>${travelPackage.price * bookingInfo.travelers}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-section">
            <h3>Your Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={bookingInfo.name} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={bookingInfo.email} 
                readOnly 
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Details</h3>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="card-details">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="pay-now-btn">
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;