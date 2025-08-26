import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/Payment.css';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { package: selectedPackage, bookingInfo } = location.state || {};
  
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (selectedPackage && bookingInfo) {
      // Create payment intent on component mount
      createPaymentIntent();
    }
  }, [selectedPackage, bookingInfo]);

  if (!selectedPackage || !bookingInfo) {
    return <div className="error-message">No booking information found. Please start over.</div>;
  }

  const createPaymentIntent = async () => {
    try {
      const totalAmount = selectedPackage.price * bookingInfo.travelers;
      
      const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // Convert to cents
          currency: 'usd',
          package: selectedPackage,
          bookingInfo
        })
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setPaymentError('Failed to initialize payment. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    const cardElement = elements.getElement(CardElement);
    
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: bookingInfo.name,
            email: bookingInfo.email,
          },
        }
      });
      
      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded
        setTransactionId(paymentIntent.id);
        setPaymentSuccess(true);
        
        // Save payment details to database
        await savePaymentDetails(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const savePaymentDetails = async (transactionId) => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/save-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          package: selectedPackage,
          bookingInfo
        })
      });
      
      if (!response.ok) {
        console.error('Failed to save payment details');
      }
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. Transaction ID: {transactionId}</p>
          
          <div className="receipt">
            <h3>Booking Receipt</h3>
            <div className="receipt-details">
              <div className="receipt-row">
                <span>Package:</span>
                <span>{selectedPackage.name}</span>
              </div>
              <div className="receipt-row">
                <span>Travelers:</span>
                <span>{bookingInfo.travelers}</span>
              </div>
              <div className="receipt-row">
                <span>Departure Date:</span>
                <span>{bookingInfo.departureDate}</span>
              </div>
              <div className="receipt-row">
                <span>Total Amount:</span>
                <span>${selectedPackage.price * bookingInfo.travelers}</span>
              </div>
              <div className="receipt-row">
                <span>Transaction ID:</span>
                <span>{transactionId}</span>
              </div>
            </div>
          </div>
          
          <button className="home-btn" onClick={handleBackToHome}>Back to Home</button>
        </div>
      </div>
    );
  }

  const totalAmount = selectedPackage.price * bookingInfo.travelers;
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '10px 12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Your Booking</h1>
        
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Package:</span>
              <span>{selectedPackage.name}</span>
            </div>
            <div className="summary-row">
              <span>Travelers:</span>
              <span>{bookingInfo.travelers}</span>
            </div>
            <div className="summary-row">
              <span>Departure Date:</span>
              <span>{bookingInfo.departureDate}</span>
            </div>
            <div className="summary-row">
              <span>Total Amount:</span>
              <span>${totalAmount}</span>
            </div>
          </div>
        </div>
        
        <div className="user-details">
          <h2>User Information</h2>
          <div className="user-details-grid">
            <div className="detail-item">
              <label>Full Name</label>
              <input type="text" value={bookingInfo.name} disabled />
            </div>
            <div className="detail-item">
              <label>Email</label>
              <input type="email" value={bookingInfo.email} disabled />
            </div>
          </div>
        </div>
        
        <form className="payment-form" onSubmit={handleSubmit}>
          <h2>Payment Details</h2>
          
          <div className="form-group">
            <label htmlFor="card-element">Credit or Debit Card</label>
            <div className="stripe-card-element">
              <CardElement id="card-element" options={cardElementOptions} />
            </div>
          </div>
          
          {paymentError && <div className="payment-error">{paymentError}</div>}
          
          <button 
            type="submit" 
            className="pay-now-btn"
            disabled={!stripe || isProcessing || !clientSecret}
          >
            {isProcessing ? 'Processing...' : `Pay $${totalAmount}`}
          </button>
          
          <div className="payment-security-note">
            <div className="lock-icon">🔒</div>
            <span>Your payment is secure and encrypted</span>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrapper component to provide Stripe Elements context
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;