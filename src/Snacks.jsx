import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Veg.css'; // Reusing styles
import { useCart } from './CartContext';
// Import the spinner component
import { ClipLoader } from 'react-spinners'; // Using ClipLoader for Snacks!

function Snacks() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState(['all']);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state for refresh button
  const itemsPerPage = 8;

  const { addToCart } = useCart();

  useEffect(() => {
    const MIN_LOAD_TIME = 10000; // 10 seconds in milliseconds
    let startTime; // Declare startTime here

    const fetchData = async () => {
      setLoading(true); // Ensure loading is true when starting fetch
      startTime = Date.now(); // Set startTime right before the async operation

      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('https://spring-apigateway.onrender.com/api/products/snacks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProducts(response.data);
        setFilteredProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load snack items:", err);
        setError('Failed to load snack items');
        setProducts([]); // Clear products on error
        setFilteredProducts([]); // Clear filtered products on error
      } finally {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const remainingTime = MIN_LOAD_TIME - elapsedTime;

        if (remainingTime > 0) {
          // If less than MIN_LOAD_TIME has passed, wait for the remainder
          setTimeout(() => {
            setLoading(false);
          }, remainingTime);
        } else {
          // If MIN_LOAD_TIME has already passed, set loading to false immediately
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [refreshTrigger]); // Add refreshTrigger to dependency array to re-run on refresh

  // Price range filter logic
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
    // This useEffect filters products when selectedRanges or products change
    // It does NOT affect the minimum load time for the initial fetch,
    // nor does it trigger a full re-fetch from the API.
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
  }, [selectedRanges, products]); // Depend on selectedRanges and products

  // Function to handle the refresh button click
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger the useEffect
    setCurrentPage(1); // Reset pagination on refresh
    setSelectedRanges(['all']); // Optionally reset filters to 'all' on refresh
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="veg-section"> {/* Reusing veg-section class for layout */}
      <h3 className="section-title">🍟 Crispy Snacks</h3>

      {/* Refresh Button - positioned on the right via CSS */}
      <div className="refresh-button-container">
        <button className="refresh-button" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* ✅ Price Filter */}
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
          {/* Using ClipLoader for Snacks */}
          <ClipLoader color="#32CD32" loading={loading} size={70} /> {/* LimeGreen for snacks! */}
          <p className="status-message">Loading crispy snacks...</p>
        </div>
      ) : error ? (
        <p className="status-message error">{error}</p>
      ) : currentItems.length === 0 ? (
        <p className="status-message">No snacks available.</p>
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
  );
}

export default Snacks;