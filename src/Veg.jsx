import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Veg.css';
import { useCart } from './CartContext';
import { RingLoader } from 'react-spinners';

import Navbar from './Navbar';

function Veg() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState(['all']);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const itemsPerPage = 8;

  const { addToCart } = useCart();

  useEffect(() => {
    const MIN_LOAD_TIME = 1000;
    let startTime;

    const fetchData = async () => {
      setLoading(true);
      startTime = Date.now();

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://spring-apigateway.onrender.com/api/products/veg', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load veg items');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const remainingTime = MIN_LOAD_TIME - elapsedTime;

        if (remainingTime > 0) {
          setTimeout(() => {
            setLoading(false);
          }, remainingTime);
        } else {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleCheckboxChange = (range) => {
    if (range === 'all') {
      setSelectedRanges(['all']);
    } else {
      setSelectedRanges(prev => {
        const newRanges = prev.includes(range)
          ? prev.filter(r => r !== range)
          : [...prev.filter(r => r !== 'all'), range];
        return newRanges.length === 0 ? ['all'] : newRanges;
      });
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    if (selectedRanges.includes('all')) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      selectedRanges.some(range => {
        if (range === '0-100') return product.price <= 100;
        if (range === '101-200') return product.price > 100 && product.price <= 200;
        if (range === '201+') return product.price > 200;
        return false;
      })
    );

    setFilteredProducts(filtered);
  }, [selectedRanges, products]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentPage(1);
    setSelectedRanges(['all']);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="veg-section">
        <h3 className="section-title">🌿 Veg Menu</h3>

        <div className="refresh-button-container">
          <button className="refresh-button" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="checkbox-filter">
          <label>
            <input
              type="checkbox"
              checked={selectedRanges.includes('all')}
              onChange={() => handleCheckboxChange('all')}
            /> All
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedRanges.includes('0-100')}
              onChange={() => handleCheckboxChange('0-100')}
            /> ₹0–100
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedRanges.includes('101-200')}
              onChange={() => handleCheckboxChange('101-200')}
            /> ₹101–200
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedRanges.includes('201+')}
              onChange={() => handleCheckboxChange('201+')}
            /> ₹201+
          </label>
        </div>

        {loading ? (
          <div className="spinner-container">
            <RingLoader color="#ffb300" loading={loading} size={70} />
            <p className="status-message">Loading delicious veg items...</p>
          </div>
        ) : error ? (
          <p className="status-message error">{error}</p>
        ) : currentItems.length === 0 ? (
          <p className="status-message">No veg items available.</p>
        ) : (
          <>
            <div className="card-grid">
              {currentItems.map(product => (
                <div className="card" key={product.id}>
                  <img
                    src={`https://spring-apigateway.onrender.com${product.imageUrl}`}
                    alt={product.name}
                    className="card-img"
                    onError={(e) => { e.target.src = '/fallback.jpg'; }}
                  />
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              ))}
            </div>

            <div className="pagination-controls">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
            </div>
          </>
        )}
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>Tasty Bites</h3>
            <p>Your daily dose of delicious meals and quick bites.</p>
          </div>

          <div className="footer-middle">
            <h4>Explore</h4>
            <ul>
              <li><a href="#home">Home</a></li>
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

export default Veg;