import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';
import { FaArrowLeft, FaEye } from 'react-icons/fa';

function AddProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://spring-apigateway.onrender.com/api/products", product, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      alert("Product added successfully!");
      navigate("/admin/view-products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        {/* Top Buttons */}
        <div className="top-buttons">
          <button className="nav-btn" onClick={() => navigate("/admin/dashboard")}>
            <FaArrowLeft style={{ marginRight: "6px" }} />
            Back to Dashboard
          </button>
          <button className="nav-btn" onClick={() => navigate("/admin/view-products")}>
            <FaEye style={{ marginRight: "6px" }} />
            View Products
          </button>
        </div>

        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <input type="text" name="category" value={product.category} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Price:</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Image URL:</label>
            <input type="text" name="imageUrl" value={product.imageUrl} onChange={handleChange} />
          </div>

          <button type="submit" className="add-btn">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
