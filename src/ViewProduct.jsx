import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewProduct.css';

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://spring-apigateway.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://spring-apigateway.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product deleted!");
      fetchProducts();
    } catch (error) {
      console.error("Delete failed", error);
      alert("❌ Could not delete product.");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/admin/update/${id}`);
  };

  return (
    <div className="view-products-container">
      <h2 className="section-title">All Products</h2>
      {products.length === 0 ? (
        <p className="no-products-msg">No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <img
                src={`https://spring-apigateway.onrender.com${product.imageUrl}`}
                alt={product.name}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Category: <strong>{product.category}</strong></p>
                <p>₹{product.price}</p>
              </div>
              <div className="product-actions">
                <button className="btn-update" onClick={() => handleUpdate(product.id)}>Update</button>
                <button className="btn-delete" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewProduct;
