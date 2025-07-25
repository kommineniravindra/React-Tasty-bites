import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './Navbar.css';

import {
  FaHome,
  FaCarrot,
  FaDrumstickBite,
  FaCookieBite,
  FaGlassWhiskey,
  FaShoppingCart,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Get cart items
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    } else if (storedUser?.email) {
      setUserName(storedUser.email.split('@')[0]); 
    } else {
      setUserName('Guest'); // Default for no user
    }
  }, []);

  // Modified to navigate to routes instead of scrolling
  const handleNavigate = (path) => {
    navigate(path);
    setShowMenu(false); // Close menu after navigation
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setShowMenu(false); // Close menu after logout
  };

  return (
    <div className="navbar-custom">
      <div className={`nav-items ${showMenu ? 'show' : ''}`}>
        {/* Changed onClick to use handleNavigate for routes */}
        <button onClick={() => handleNavigate('/user/home')} className="nav-button"><FaHome /> Home</button>
        <button onClick={() => handleNavigate('/user/veg')} className="nav-button"><FaCarrot /> Veg</button>
        <button onClick={() => handleNavigate('/user/nonveg')} className="nav-button"><FaDrumstickBite /> Non-Veg</button>
        <button onClick={() => handleNavigate('/user/snacks')} className="nav-button"><FaCookieBite /> Snacks</button>
        <button onClick={() => handleNavigate('/user/drinks')} className="nav-button"><FaGlassWhiskey /> Drinks</button>

        <button onClick={() => handleNavigate('/user/cart')} className="nav-button cart-button">
          <FaShoppingCart /> Cart
          {(cartItems.length > 0) && (
            <span className="cart-badge">{(cartItems.length)}</span>
          )}
        </button>
        <button onClick={() => handleNavigate('/user/orders')} className="nav-button"><FaClipboardList /> Orders</button>
        <button onClick={() => handleNavigate('/about-us')} className="nav-button">About Us</button>

        <div className="dropdown-container">
          <button className="user-button nav-button" onClick={() => setShowMenu(!showMenu)}>
            <FaUserCircle /> {userName}
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="dropdown-item"><FaSignOutAlt /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;