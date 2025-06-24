
import '../styles/Signup.css';

import React, { useState } from 'react';

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => setIsSignup(!isSignup);

  return (
    <div className="login-signup-wrapper">
      <div className="login-signup-card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p>{isSignup ? "Start your premium journey today!" : "Login to continue."}</p>

        <form className="login-signup-form">
          {isSignup && (
            <input type="text" placeholder="Full Name" required />
          )}
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="login-signup-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="login-signup-toggle">
          {isSignup ? "Already have an account?" : "New here?"}
          <span onClick={toggleMode}>
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
