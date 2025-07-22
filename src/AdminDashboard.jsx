import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AdminDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const COLORS = ['#ff6384', '#36a2eb', '#4bc0c0', '#9966ff', '#ff9f40', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    fetchProducts();
    fetchAnalyticsSummary();
    fetchRevenueCharts();
    fetchRecentOrders();
  }, []);

  const fetchProducts = () => {
    axios.get("https://spring-apigateway.onrender.com/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error("Error fetching products", err));
  };

  const fetchAnalyticsSummary = () => {
    axios.get("https://spring-apigateway.onrender.com/api/analytics/summary", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setAnalytics(res.data))
    .catch(err => console.error("Error fetching analytics", err));
  };

  const fetchRevenueCharts = () => {
    axios.get("https://spring-apigateway.onrender.com/api/analytics/daily-revenue", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const formatted = res.data.map(entry => ({
        date: entry.label,
        revenue: entry.totalRevenue
      }));
      setDailyRevenue(formatted);
    });

    axios.get("https://spring-apigateway.onrender.com/api/analytics/weekly-revenue", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const formatted = res.data.map(entry => ({
        week: entry.label,
        revenue: entry.totalRevenue
      }));
      setWeeklyRevenue(formatted);
    });
  };

  const fetchRecentOrders = () => {
    axios.get("https://spring-apigateway.onrender.com/api/orders/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const recent = res.data.reverse().slice(0, 5);
      setRecentOrders(recent);
    })
    .catch(err => console.error("Failed to fetch recent orders", err));
  };

  const handleStatusUpdate = (orderId, status) => {
    axios.put(`https://spring-apigateway.onrender.com/api/orders/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => fetchRecentOrders())
    .catch(err => {
      console.error("Failed to update order status", err);
      alert("Error updating order status");
    });
  };

  const handleEdit = (id) => navigate(`/admin/update/${id}`);
  const handleDelete = (id) => {
    axios.delete(`https://spring-apigateway.onrender.com/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => fetchProducts())
    .catch(err => console.error("Delete failed", err));
  };

  const handleAddProduct = () => navigate("/admin/add-product");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
    const handleOpenEureka = () => {
    window.open("https://spring-eureka-service.onrender.com/", "_blank");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h4>Admin Panel</h4>
        <ul>
          <li className="active">Dashboard</li>
           <button className="add-btn" onClick={handleOpenEureka}>
             Eureka server
            </button>
          <li >Online Orders</li>
          <li >Customers</li>
          <li onClick={() => navigate("/admin/view-products")}>Menu</li>
          <li>Complaints</li>
          <li>Sales Report</li>
          
          <li onClick={() => navigate("/admin/add-product")}>Update Menu</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      <div className="dashboard-content">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <button className="add-btn" onClick={handleAddProduct}>+ Add Product</button>
        </div>

        <div className="summary-cards">
          <div className="summary-card"><span>{analytics?.totalOrders || 0}</span>Orders Received</div>
          <div className="summary-card"><span>{analytics?.totalOrders - 30 || 0}</span>Orders Served</div>
          <div className="summary-card"><span>30</span>Pending Orders</div>
          <div className="summary-card"><span>₹105</span>Refund</div>
          <div className="summary-card"><span>36</span>New Customers</div>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={`https://spring-apigateway.onrender.com${product.imageUrl}`}
                alt={product.name}
                onError={(e) => { e.target.src = "/fallback.jpg"; }}
              />
              <h4>{product.name}</h4>
              <p>{product.category}</p>
              <p><strong>₹{product.price}</strong></p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(product.id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="empty-text">No products found.</p>}
        </div>

        {analytics && (
          <div className="analytics-section">
            <h3>📊 Sales Analytics</h3>
            <p><strong>Total Orders:</strong> {analytics.totalOrders}</p>
            <p><strong>Total Revenue:</strong> ₹{analytics.totalRevenue.toFixed(2)}</p>
            <p><strong>Top Selling Items:</strong> {analytics.topSellingItems.join(", ")}</p>
          </div>
        )}

        <div className="charts">
          <h4>📅 Daily Revenue</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip />
              <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                {dailyRevenue.map((entry, index) => (
                  <Cell key={`cell-daily-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <h4>📈 Weekly Revenue</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip />
              <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                {weeklyRevenue.map((entry, index) => (
                  <Cell key={`cell-weekly-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="charts">
          <h4>📋 Recent Online Orders</h4>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.userName}</td>
                  <td>{order.items.map(i => `${i.productName} (x${i.quantity})`).join(", ")}</td>
                  <td>{order.phone || "N/A"}</td>
                  <td>₹{order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${order.status === "ACCEPTED" ? "accepted" : order.status === "DECLINED" ? "declined" : "pending"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="accept-btn" onClick={() => handleStatusUpdate(order.id, "ACCEPTED")}>Accept</button>
                    <button className="decline-btn" onClick={() => handleStatusUpdate(order.id, "DECLINED")}>Decline</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="empty-text">No recent orders</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;