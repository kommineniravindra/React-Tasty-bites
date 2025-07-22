import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: '',
    role: 'USER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('https://spring-apigateway.onrender.com/api/auth/signup', user);
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 400) {
        setError('User already exists.');
      } else {
        setError('Signup failed. Try again later.');
      }
    } finally {
      setLoading(false);
    }
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
              type="text"
              placeholder="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <select
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              required
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div className="terms">
              <input type="checkbox" required />
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
