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
  const [orders, setOrders] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const COLORS = ['#ff9f43', '#e17055', '#fdcb6e', '#ffeaa7', '#fab1a0', '#feca57', '#ff6b6b', '#f8c291'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchAnalyticsSummary(),
        fetchRevenueCharts(),
        fetchAllOrders()
      ]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = () => {
    return axios.get("https://spring-apigateway.onrender.com/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProducts(res.data))
    .catch(err => {
      console.error("Error fetching products", err);
      throw err;
    });
  };

  const fetchAnalyticsSummary = () => {
    return axios.get("https://spring-apigateway.onrender.com/api/analytics/summary", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setAnalytics(res.data))
    .catch(err => {
      console.error("Error fetching analytics", err);
      throw err;
    });
  };

  const fetchRevenueCharts = () => {
    const dailyPromise = axios.get("https://spring-apigateway.onrender.com/api/analytics/daily-revenue", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const formatted = res.data.map(entry => ({
        date: entry.label,
        revenue: entry.totalRevenue
      }));
      setDailyRevenue(formatted);
    }).catch(err => {
      console.error("Error fetching daily revenue", err);
      throw err;
    });

    const weeklyPromise = axios.get("https://spring-apigateway.onrender.com/api/analytics/weekly-revenue", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const formatted = res.data.map(entry => ({
        week: entry.label,
        revenue: entry.totalRevenue
      }));
      setWeeklyRevenue(formatted);
    }).catch(err => {
      console.error("Error fetching weekly revenue", err);
      throw err;
    });

    return Promise.all([dailyPromise, weeklyPromise]);
  };

  const fetchAllOrders = () => {
    return axios.get("https://spring-apigateway.onrender.com/api/orders/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setOrders(res.data.reverse());
    })
    .catch(err => {
      console.error("Failed to fetch all orders", err);
      throw err;
    });
  };

  const handleStatusUpdate = (orderId, status) => {
    axios.put(`https://spring-apigateway.onrender.com/api/orders/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => fetchAllOrders())
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

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h4>Admin Panel</h4>
        <ul>
          <li className={activeView === 'dashboard' ? 'active' : ''} onClick={() => setActiveView('dashboard')}>Dashboard</li>
          <li className={activeView === 'menu' ? 'active' : ''} onClick={() => setActiveView('menu')}>Menu</li>
          <li className={activeView === 'orders' ? 'active' : ''} onClick={() => setActiveView('orders')}>Online Orders</li>
          <li>Customers</li>
          <li>Complaints</li>
          <li>Sales Report</li>
          <li onClick={() => navigate("/admin/add-product")}>Update Menu</li>
          <li className="logout-button" onClick={handleLogout}>Logout</li>
          <button className="add-btn" onClick={handleOpenEureka}>Eureka server</button>
        </ul>
      </div>

      <div className="dashboard-content">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <div className="header-actions">
            <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="add-btn" onClick={handleAddProduct}>+ Add Product</button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {activeView === 'dashboard' && (
              <>
                <div className="summary-cards">
                  <div className="summary-card"><span>{analytics?.totalOrders || 0}</span>Total Orders</div>
                  <div className="summary-card"><span>{analytics?.totalOrders - 30 || 0}</span>Orders Fulfilled</div>
                  <div className="summary-card"><span>30</span>Pending Orders</div>
                  <div className="summary-card"><span>₹105</span>Refund</div>
                  <div className="summary-card"><span>36</span>New Customers</div>
                </div>

                <div className="charts">
                  <h4>🍽️ Restaurant Menu Items</h4>
                  <div className="product-grid four-cols">
                    {products.length > 0 ? products.map((product) => (
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
                    )) : (
                      <p className="empty-text">No menu items found.</p>
                    )}
                  </div>
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
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          color: '#333',
                          padding: '10px',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                        labelStyle={{ color: '#ff9f43', fontWeight: 'bold' }}
                        itemStyle={{ color: '#333' }}
                      />
                      <Bar dataKey="revenue" radius={[5, 5, 0, 0]}>
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
                      <XAxis dataKey="week" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          color: '#333',
                          padding: '10px',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                        labelStyle={{ color: '#ff9f43', fontWeight: 'bold' }}
                        itemStyle={{ color: '#333' }}
                      />
                      <Bar dataKey="revenue" radius={[5, 5, 0, 0]}>
                        {weeklyRevenue.map((entry, index) => (
                          <Cell key={`cell-weekly-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {activeView === 'orders' && (
              <div className="charts">
                <h4>📋 All Online Orders</h4>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.userName}</td>
                        <td>{order.items.map(i => `${i.productName} (x${i.quantity})`).join(", ")}</td>
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
                      <tr><td colSpan="7" className="empty-text">No orders available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeView === 'menu' && (
              <div className="charts">
                <h4>🍽️ Restaurant Menu Management</h4>
                <div className="product-grid four-cols">
                  {products.length > 0 ? products.map((product) => (
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
                  )) : (
                    <p className="empty-text">No menu items found.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;