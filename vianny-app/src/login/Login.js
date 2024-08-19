/* src/login/Login.js */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated, setUserRole, setLoggedInUsername }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/');
        const users = response.data;

        const user = users.find(
            (user) => user.username === username && user.email === email
        );

        if (user && user.userprofile.status === 'active') {
            setIsAuthenticated(true);
            setUserRole(user.userprofile.role);
            setLoggedInUsername(username);  // Store the username

            console.log('Logged in username:', username);  // Log the username

            switch (user.userprofile.role) {
                case 'admin':
                    navigate('/user-management');
                    break;
                case 'inventory_representative':
                    navigate('/inventory-list');
                    break;
                case 'production_representative':
                    navigate('/production-list');
                    break;
                case 'sales_representative':
                    navigate('/sales-stock');
                    break;
                default:
                    setError('Invalid role');
            }
        } else {
            setError('User is not active or invalid credentials');
        }
    } catch (error) {
        setError('Login failed');
        console.error('Login error:', error);
    }
};


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="login-form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="login-form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="login-error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
