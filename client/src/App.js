import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';
import Navbar from './components/Navbar';
import AuthPage from './pages/Signup';
import HomePage from './pages/HomePage';
import Destinations from './pages/Destinations';
import Footer from './components/Footer';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard'; // Add this import
import ProtectedRoute from './components/ProtectedRoute'; // Add this import
import Experiences from './pages/Experiences';
import AboutUs from './pages/About';
// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/about" element={<AboutUs />} />
          {/* Wrap the Payment route with Stripe Elements */}
          <Route 
            path="/payment" 
            element={
              <Elements stripe={stripePromise}>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </Elements>
            } 
          />
          {/* Add Dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Add other routes as needed */}
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;