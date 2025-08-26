// src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to view your dashboard</div>;
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to your Dashboard, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout} style={{
        padding: '10px 15px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;