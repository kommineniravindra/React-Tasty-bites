import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
    role: 'USER', // Default to USER, but now user can change it
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (user.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://spring-apigateway.onrender.com/api/auth/signup', {
        username: user.email, // Backend's AuthController still expects 'username'
        password: user.password,
        role: user.role // Send the selected role
      });
      
      alert('Signup successful! Please log in.');

      // Set localStorage items after successful signup, similar to login
      localStorage.setItem('username', user.email);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify({ username: user.email, role: user.role, email: user.email }));
      localStorage.setItem('email', user.email);

      navigate('/login');

    } catch (err) {
      if (err.response?.status === 409) {
        setError('Email already exists.');
      } else if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError('Signup failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-left">
        <div className="overlay">
          <h2>WELCOME TO</h2>
          <div className="logo-box">
            <div className="logo-icon">🟧</div>
            <h3>TASTY BITE'S</h3>
          </div>
          <p>Experience the luxury of fine dining from your home</p>
          <p className="copy">© 2025. Design by RAVINDRA. All rights reserved.</p>
        </div>
      </div>

      <div className="signup-right">
        <div className="form-box">
          <div className="tab-header">
            <span className="active-tab">Sign Up</span>
            <Link to="/login" className="inactive-tab">Sign In</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {/* Re-introducing the role selection dropdown */}
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              required
              disabled={loading}
              className="role-select" // Add a class for potential styling
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            {/* End of role selection */}
            <div className="terms">
              <input type="checkbox" required disabled={loading} />
              <label>I accept the terms and policy</label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            {loading && <div className="spinner"></div>}
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;