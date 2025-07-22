import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const images = [
  '/img1.jpeg',
  '/img2.jpeg',
  '/img3.jpeg',
  '/img4.jpeg',
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3000); // Changes image every 3 seconds
    return () => clearInterval(timer); // Cleans up the timer when component unmounts
  }, []);

  return (
    <div className="slider">
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}
    </div>
  );
};

export default ImageSlider;