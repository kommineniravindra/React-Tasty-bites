import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Signup from './SignUp';
import Login from './Login';
import UserHome from './UserHome';
import AdminDashboard from './AdminDashboard';
import PrivateRoute from './PrivateRoute';
import Veg from './Veg';
import NonVeg from './NonVeg';
import Snacks from './Snacks';
import Drinks from './Drinks';
import AddProduct from './AddProduct';
import ViewProducts from './ViewProduct';
import UpdateProduct from './UpdateProduct';
import CartPage from './CartPage';
import Orders from './OrdersPage';
import AboutUsPage from './AboutUsPage';


import { CartProvider } from './CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Toast should be outside <Routes> */}
        <ToastContainer position="top-right" autoClose={1500} theme="light" />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* User Protected Routes */}
          <Route path="/user/home" element={<PrivateRoute role="USER"><UserHome /></PrivateRoute>} />
          <Route path="/user/veg" element={<PrivateRoute role="USER"><Veg /></PrivateRoute>} />
          <Route path="/user/nonveg" element={<PrivateRoute role="USER"><NonVeg /></PrivateRoute>} />
          <Route path="/user/snacks" element={<PrivateRoute role="USER"><Snacks /></PrivateRoute>} />
          <Route path="/user/drinks" element={<PrivateRoute role="USER"><Drinks /></PrivateRoute>} />
          <Route path="/user/cart" element={<PrivateRoute role="USER"><CartPage /></PrivateRoute>} />
          <Route path="/user/orders" element={<PrivateRoute role="USER"><Orders /></PrivateRoute>} />
          <Route path="/about-us" element={<PrivateRoute role="USER"><AboutUsPage /></PrivateRoute>} />
          {/* <Route path="/contact-us" element={<PrivateRoute role="USER"><ContactUs /></PrivateRoute>} /> */}


          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/add-product" element={<PrivateRoute role="ADMIN"><AddProduct /></PrivateRoute>} />
          <Route path="/admin/view-products" element={<PrivateRoute role="ADMIN"><ViewProducts /></PrivateRoute>} />
          <Route path="/admin/update/:id" element={<PrivateRoute role="ADMIN"><UpdateProduct /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
