import React, { useState, useEffect } from 'react';
import authService from '../Services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false); // New state to track if user is new
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user came from the signup page (or any other indicator)
    if (location.state && location.state.isNewUser) {
      setIsNewUser(true); // Set to true if the user is new
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Login request via authService
      const response = await authService.login({ email, password });

      // Save JWT token in localStorage
      localStorage.setItem('token', response.token);

      // Set authenticated state in the parent component
      setIsAuthenticated(true);

      // Redirect user to the dashboard
      navigate('/dashboard');
      navigate(0)
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {isNewUser && <p className="info">Please register yourself first and then try to log in.</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
