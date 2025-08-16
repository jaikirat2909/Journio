import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AuthPage from './pages/Signup';
import HomePage from './pages/HomePage';
import Destinations from './pages/Destinations';
import Footer from './components/Footer';
import Payment from './pages/Payment';
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<AuthPage />} />
           <Route path="/destinations" element={<Destinations />} />
           <Route path="/payment" element={<Payment />} />
          {/* Add other routes as needed */}
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;