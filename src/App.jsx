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
import Navbar from './Navbar'; // Import Navbar

import { CartProvider } from './CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <CartProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={1500} // milliseconds
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* User Protected Routes */}
          {/* Apply PrivateRoute as a wrapper for ALL user-level routes */}
          <Route element={<PrivateRoute role="USER" />}>
            {/* Now, within the protected user routes, apply NavbarWrapper as a layout */}
            <Route element={<NavbarWrapper />}>
              <Route path="/user/home" element={<UserHome />} />
              <Route path="/user/veg" element={<Veg />} />
              <Route path="/user/nonveg" element={<NonVeg />} />
              <Route path="/user/snacks" element={<Snacks />} />
              <Route path="/user/drinks" element={<Drinks />} />
              <Route path="/user/cart" element={<CartPage />} />
              <Route path="/user/orders" element={<Orders />} />
              <Route path="/about-us" element={<AboutUsPage />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute role="ADMIN" />}>
            {/* Admin routes might not need the user Navbar */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/view-products" element={<ViewProducts />} />
            <Route path="/admin/update/:id" element={<UpdateProduct />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

// NavbarWrapper component
import { Outlet } from 'react-router-dom';

const NavbarWrapper = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This is essential: Renders the matched child route component */}
    </>
  );
};

export default App;