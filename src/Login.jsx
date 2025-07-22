import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Make sure this has the spinner CSS too

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://spring-apigateway.onrender.com/api/auth/login', {
        username,
        password
      });

      const token = response.data;
      localStorage.setItem('token', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      const user = {
        username: payload.sub || username,
        role: payload.role
      };

      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));

      setLoading(false);
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/user/home');

    } catch (error) {
      setLoading(false);
      setError('Login failed: ' + (error.response?.data || error.message));
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
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
