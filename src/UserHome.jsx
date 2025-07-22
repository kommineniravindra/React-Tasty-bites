import React, { useState } from 'react'; // Import useState
import './UserHome.css';
import Navbar from './Navbar';
import Veg from './Veg';
import NonVeg from './NonVeg';
import Snacks from './Snacks';
import Drinks from './Drinks';
import ImageSlider from './ImageSlider';

function UserHome() {
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
    setBookingConfirmation(''); // Clear any previous confirmation message
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    // Optionally reset form fields when closing
    setBookingDetails({
      name: '',
      date: '',
      time: '',
      guests: 1,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send bookingDetails to a backend
    console.log('Booking submitted:', bookingDetails);

    // Simulate a successful booking
    setBookingConfirmation(
      `Booking confirmed for ${bookingDetails.name} on ${bookingDetails.date} at ${bookingDetails.time} for ${bookingDetails.guests} guests. Enjoy your meal!`
    );

    // Close the modal after a short delay or immediately
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingDetails({ // Reset form after "booking"
        name: '',
        date: '',
        time: '',
        guests: 1,
      });
    }, 3000); // Close after 3 seconds
  };

  return (
    <>
      <Navbar />

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

      {/* Food Sections */}
      <section id="veg" className="food-section">
        <Veg />
      </section>
      <section id="nonveg" className="food-section">
        <NonVeg />
      </section>
      <section id="snacks" className="food-section">
        <Snacks />
      </section>
      <section id="drinks" className="food-section">
        <Drinks />
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>Tasty Bites</h3>
            <p>Your daily dose of delicious meals and quick bites.</p>
          </div>

          <div className="footer-middle">
            <h4>Explore</h4>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#veg">Veg</a>
              </li>
              <li>
                <a href="#nonveg">Non-Veg</a>
              </li>
              <li>
                <a href="#snacks">Snacks</a>
              </li>
              <li>
                <a href="#drinks">Drinks</a>
              </li>
            </ul>
          </div>

          <div className="footer-right">
            <h4>Contact Us</h4>
            <p>
              Email: <a href="kommineniravindra99@gmail.com">kommineniravindra99@gmail.com</a>
            </p>
            <p>Phone: +91 960-326-2008</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2025 <span>Tasty Bites</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default UserHome;