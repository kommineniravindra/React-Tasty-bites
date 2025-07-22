import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaArrowLeft } from 'react-icons/fa';   // Import the icon you're using (make sure react-icons is installed)
import './AboutUsPage.css'; // Ensure this CSS file is in the same directory

const AboutUsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleBackToMenuClick = () => {
    navigate('/user/home'); // Navigate to the '/user/home' route
    // Or, if you want to go back to the previous page in history:
    // navigate(-1);
    // console.log('Navigating back to menu/home page...'); // For debugging
  };

  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>About Tasty Bites App</h1> {/* Emphasizing 'App' */}
        <p>Your seamless journey to delicious food, right at your fingertips.</p>
      </header>

      {/* NEW: Back to Menu Button */}
      <div className="menu-button-container">
        {/* Call the handler function on click */}
        <button onClick={handleBackToMenuClick} className="nav-text-btn">
          <FaArrowLeft className="nav-icon" /> Back to Menu
        </button>
      </div>
      {/* END NEW */}

      <section className="about-us-content">
        <div className="about-us-section">
          <h2>Our Story & Vision</h2>
          <p>
            Welcome to **Tasty Bites App**! We envisioned a world where discovering and ordering incredible food is not just easy, but an absolute delight. Born from a shared love for great meals and smart technology, our journey began with a simple idea: to connect food lovers with their next favorite bite, effortlessly.
          </p>
          <p>
            We believe that enjoying quality food should never be a hassle. That's why we poured our passion into building an intuitive and reliable platform that brings the best local flavors, diverse cuisines, and exclusive deals directly to you, wherever you are.
          </p>
        </div>

        <div className="about-us-section">
          <h2>How We Make Life Easier</h2>
          <p>
            At **Tasty Bites App**, we're more than just a delivery service; we're your personal food concierge. We simplify your food experience by offering:
          </p>
          <ul>
            <li>
              <strong>Effortless Discovery:</strong> Browse a curated selection of restaurants and dishes with smart filters.
            </li>
            <li>
              <strong>Quick & Easy Ordering:</strong> A streamlined process from menu to checkout in just a few taps.
            </li>
            <li>
              <strong>Reliable Delivery:</strong> Track your order in real-time and get your food hot and fresh.
            </li>
            <li>
              <strong>Personalized Recommendations:</strong> Discover new favorites based on your tastes and history.
            </li>
            <li>
              <strong>Exclusive Deals:</strong> Access special offers and loyalty rewards available only on our app.
            </li>
          </ul>
        </div>

        <div className="about-us-section full-width">
          <h2>Our Commitment to You</h2>
          <p>
            Every feature, every partnership, and every update to the Tasty Bites App is driven by our commitment to your satisfaction. We are constantly innovating to enhance your experience, ensuring secure transactions, exceptional customer support, and a constantly growing selection of culinary delights. Your feedback fuels our progress!
          </p>
          {/* Placeholder for an app screenshot or team photo */}
          <img
            src="https://dcassetcdn.com/design_img/500681/148570/148570_3650142_500681_image.png"
            alt="Tasty Bites App in action"
            className="about-us-image"
          />
        </div>
      </section>

      <section className="about-us-map">
        <h2>Our Main Office</h2>
        <div className="map-container">
          {/* Google Maps embed for Hyderabad, Telangana, India */}
          <iframe
            src="https://www.google.com/maps/search/sathya+technologies+map+embed+code/@17.436875,78.4445,18z?entry=ttu&g_ep=EgoyMDI1MDcyMC4wIKXMDSoASAFQAw%3D%3D"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Tasty Bites Main Office Location"
          ></iframe>
        </div>
      </section>

      <footer className="about-us-footer">
        <p>
          Ready to taste the convenience? Download the **Tasty Bites App** today!
        </p>
        <div className="app-download-links">
          {/* Replace with actual app store links */}
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="Download on the App Store"
            />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
            />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Tasty Bites. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUsPage;