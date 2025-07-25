import React, { useState } from 'react';
import './UserHome.css';
import ImageSlider from './ImageSlider';
import { useNavigate } from 'react-router-dom';

function UserHome() {
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    date: '',
    time: '',
    guests: 1,
  });
  const [bookingConfirmation, setBookingConfirmation] = useState('');

  const handleBookTableClick = () => {
    setShowBookingModal(true);
    setBookingConfirmation('');
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setBookingDetails({
      name: '',
      date: '',
      time: '',
      guests: 1,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingDetails);

    setBookingConfirmation(
      `Booking confirmed for ${bookingDetails.name} on ${bookingDetails.date} at ${bookingDetails.time} for ${bookingDetails.guests} guests. Enjoy your meal!`
    );

    setTimeout(() => {
      setShowBookingModal(false);
      setBookingDetails({
        name: '',
        date: '',
        time: '',
        guests: 1,
      });
    }, 3000);
  };

  return (
    <>
      {/* Navbar is rendered by NavbarWrapper in App.js */}

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <ImageSlider />
        <div className="hero-overlay">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand">Tasty Bites</span>
            </h1>
            <p className="hero-subtitle">
              Delicious meals delivered right to your doorstep.
            </p>
            <button className="hero-btn" onClick={handleBookTableClick}>
              Book a Table
            </button>
            {bookingConfirmation && (
              <p className="booking-success-message">{bookingConfirmation}</p>
            )}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Book a Table</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={bookingDetails.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingDetails.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time:</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={bookingDetails.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="guests">Number of Guests:</label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  min="1"
                  value={bookingDetails.guests}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-booking-btn">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* About Us Section */}
      <div className="about-us-section">
        <div className="container">
          <h2>About Us</h2>
          <p>
            At Tasty Bites, we believe great food brings people together. Our menu is a vibrant mix of flavors, offering something delicious for everyone.
            Whether you’re craving spicy non-veg delights, wholesome vegetarian meals, refreshing beverages, or crunchy snacks, we’ve got your cravings covered.
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <div className="container">
          <h2>Our Menu</h2>
          <div className="menu-items-grid">
            {/* Veg Section */}
            <div className="menu-item">
              <img src="/veg-biryani.jpg" alt="Veg Dish" /> {/* Adjusted path */}
              <div className="menu-item-content">
                <h3>Veg Biryani</h3>
                <p>Fresh, organic vegetables tossed in a tangy, light dressing</p>
                <button className="view-menu-btn" onClick={() => navigate('/user/veg')}>View Veg Menu</button>
              </div>
            </div>

            {/* Non-Veg Section */}
            <div className="menu-item">
              <img src="/Chicken-Tikka.jpg" alt="Non-Veg Dish" /> {/* Adjusted path */}
              <div className="menu-item-content">
                <h3>Chicken Tikka</h3>
                <p>Perfectly grilled, tender chicken served with savory spices</p>
                <button className="view-menu-btn" onClick={() => navigate('/user/nonveg')}>View Non-Veg Menu</button>
              </div>
            </div>

            {/* Snacks Section */}
            <div className="menu-item">
              <img src="/French Fries.avif" alt="Snack" /> {/* Adjusted path */}
              <div className="menu-item-content">
                <h3>French Fries</h3>
                <p>Crispy and golden, the perfect snack to pair with any meal</p>
                <button className="view-menu-btn" onClick={() => navigate('/user/snacks')}>View Snacks Menu</button>
              </div>
            </div>

            {/* Drinks Section */}
            <div className="menu-item">
              <img src="/orange.avif" alt="Drink" /> {/* Adjusted path */}
              <div className="menu-item-content">
                <h3>Orange Juice</h3>
                <p>Refreshing yogurt-based drink with a rich orange flavor</p>
                <button className="view-menu-btn" onClick={() => navigate('/user/drinks')}>View Drinks Menu</button>
              </div>
            </div>
          </div>
          <button className="view-all-menu-btn" onClick={() => navigate('/user/veg')}>View All Menu</button>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"The food was absolutely amazing! Best dining experience I've ever had!"</p>
              <h4>- Jane Doe</h4>
            </div>
            <div className="testimonial-card">
              <p>"Highly recommend! The delivery was prompt and the food was cooked to perfection!"</p>
              <h4>- John Smith</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="container">
          <h2>Order Now and Experience Gourmet Dining!</h2>
          <button onClick={() => navigate('/user/veg')}>Order Now</button>
        </div>
      </div>
      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Top Chefs from Around the World</li>
            <li>Fresh Ingredients Delivered to Your Doorstep</li>
            <li>Customizable Dining Experiences</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>Tasty Bites</h3>
            <p>Your daily dose of delicious meals and quick bites.</p>
          </div>

          <div className="footer-middle">
            <h4>Explore</h4>
            <ul>
              <li><a onClick={() => navigate('/user/home')}>Home</a></li>
              <li><a onClick={() => navigate('/user/veg')}>Veg</a></li>
              <li><a onClick={() => navigate('/user/nonveg')}>Non-Veg</a></li>
              <li><a onClick={() => navigate('/user/snacks')}>Snacks</a></li>
              <li><a onClick={() => navigate('/user/drinks')}>Drinks</a></li>
            </ul>
          </div>

          <div className="footer-right">
            <h4>Contact Us</h4>
            <p>Email: <a href="mailto:kommineniravindra99@gmail.com">kommineniravindra99@gmail.com</a></p>
            <p>Phone: +91 960-326-2008</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 <span>Tasty Bites</span>. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default UserHome;