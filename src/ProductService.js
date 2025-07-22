// src/services/ProductService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';
const token = localStorage.getItem('token');

const authHeader = {
  headers: { Authorization: `Bearer ${token}` }
};

export const fetchAllProducts = () => axios.get(BASE_URL);
export const fetchProductByCategory = (category) =>
  axios.get(`${BASE_URL}/category/${category}`);
export const createProduct = (product) =>
  axios.post(BASE_URL, product, authHeader);
export const updateProduct = (id, product) =>
  axios.put(`${BASE_URL}/${id}`, product, authHeader);
export const deleteProduct = (id) =>
  axios.delete(`${BASE_URL}/${id}`, authHeader);
