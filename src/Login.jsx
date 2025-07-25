import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // This is the correct way to send the email and password,
      // matching your backend's LoginDetails DTO (which expects an 'email' field).
      const response = await axios.post('https://spring-apigateway.onrender.com/api/auth/login', {
        email: email, // This is correctly sending 'email' as the key
        password
      });

      const { token, role, email: loggedInEmail } = response.data; // Backend's AuthResponse correctly returns 'email'

      // Storing authentication and user details in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', loggedInEmail); // Storing email under 'username' key for compatibility with other components
      
      // Storing a parsed user object for more structured data access
      const userObject = { username: loggedInEmail, role: role, email: loggedInEmail };
      localStorage.setItem('user', JSON.stringify(userObject));
      
      // Storing email explicitly under 'email' key for direct access
      localStorage.setItem('email', loggedInEmail); 

      setLoading(false);

      // Navigate based on user role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/home');
      }

    } catch (err) {
      setLoading(false);
      // Detailed error handling based on backend response
      if (err.response && err.response.status === 401 && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Display specific backend message (e.g., "Invalid email or password")
      } else {
        setError('Login failed. Please check your network connection or try again later.'); // Generic fallback error
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="overlay">
          <h2>WELCOME TO</h2>
          <div className="logo-box">
            <div className="logo-icon">🟧</div>
            <h3>TASTY BITE'S</h3>
          </div>
          <p>Login securely and get access to your personalized dashboard with just one click.</p>
          <p className="copy">© 2025 Tasty Bite's. All rights reserved.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="form-box">
          <div className="tab-header">
            <Link to="/signup" className="inactive-tab">Sign Up</Link>
            <span className="active-tab">Login</span>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email" // Input type for email
              placeholder="Email" // Placeholder text
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Login'}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <p className="login-note">
            Not registered? <Link to="/signup">Signup here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;