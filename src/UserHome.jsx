import React, { useState } from 'react';
import './UserHome.css';
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
    </>
  );
}

export default UserHome;
