import React, { useEffect, useState, useCallback } from 'react';
import './OrdersPage.css';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaChevronDown, FaChevronUp, FaFileInvoice, FaHome, FaClipboardList } from 'react-icons/fa';

// --- REMOVED NAVBAR IMPORT ---
// import Navbar from './Navbar'; // No longer needed if Navbar is not rendered here

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const navigate = useNavigate();

  const getOrderStage = useCallback((orderId) => {
    const stages = ["Pending", "Completed", "Cancelled"];
    return stages[orderId % 3];
  }, []);

  const deliveryPartners = ["Swiggy", "Zomato", "TastyExpress"];
  const getDeliveryPartner = useCallback((orderId) => deliveryPartners[orderId % deliveryPartners.length], []);

  const getETA = useCallback((orderDate) => {
    const now = new Date();
    const placedTime = new Date(orderDate);
    const etaMinutes = 45;
    const deliveryTime = new Date(placedTime.getTime() + etaMinutes * 60000);
    const diffMs = deliveryTime - now;
    const diffMin = Math.max(0, Math.ceil(diffMs / 60000));
    if (diffMin <= 0) return "Delivered";
    return `${diffMin} min`;
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        alert("Login expired. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("https://spring-apigateway.onrender.com/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Backend fetch failed");

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid orders format");

        const processedOrders = data.map(order => ({
          ...order,
          orderStage: getOrderStage(order.id),
          deliveryPartner: getDeliveryPartner(order.id),
          eta: getETA(order.orderDate),
          paymentMode: ["Cash", "Credit Card", "UPI"][order.id % 3]
        }));

        setOrders(processedOrders.reverse());
        localStorage.setItem("orders", JSON.stringify(processedOrders));
        setIsFallback(false);
      } catch (err) {
        console.warn("⚠️ Backend fetch failed, using fallback:", err);

        try {
          const raw = localStorage.getItem("orders");
          const parsed = JSON.parse(raw);

          if (Array.isArray(parsed)) {
            const processedFallback = parsed.map(order => ({
              ...order,
              orderStage: getOrderStage(order.id),
              deliveryPartner: getDeliveryPartner(order.id),
              eta: getETA(order.orderDate),
              paymentMode: ["Cash", "Credit Card", "UPI"][order.id % 3]
            }));
            setOrders(processedFallback.reverse());
            setIsFallback(true);
          } else {
            throw new Error("Fallback data invalid");
          }
        } catch (e) {
          console.error("❌ Fallback load failed:", e);
          localStorage.removeItem("orders");
          setOrders([]);
          setIsFallback(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, getOrderStage, getDeliveryPartner, getETA]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.orderStage.toLowerCase() === activeTab));
    }
  }, [orders, activeTab]);

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Tasty Bites - Invoice", 14, 25);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Order ID: #${order.id}`, 14, 35);
    doc.text(`Date: ${new Date(order.orderDate).toLocaleString()}`, 14, 42);
    doc.text(`Payment: ${order.paymentMode}`, 14, 49);

    const tableRows = order.items.map((item) => [
      item.productName,
      `₹${item.price.toFixed(2)}`,
      item.quantity,
      `₹${(item.price * item.quantity).toFixed(2)}`
    ]);

    let startY = 60;

    if (tableRows.length > 0) {
      autoTable(doc, {
        startY: startY,
        head: [["Product", "Price", "Qty", "Subtotal"]],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [176, 58, 46] },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20, halign: 'right' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 25, halign: 'right' }
        }
      });
    }

    let finalY = (doc.autoTable && doc.autoTable.previous) ? doc.autoTable.previous.finalY : startY + 5;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, 14, finalY + 10);

    doc.save(`invoice-order-${order.id}.pdf`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setExpandedOrderId(null);
  };

  const handleOrderCardClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    // Removed the outer <> </> (Fragment) as Navbar is no longer rendered
    <div className="orders-modern-container">
      <div className="orders-modern-header">
        <h2 className="header-title">Your Orders</h2>
        <div className="header-buttons">
          <button className="back-to-menu-btn" onClick={() => navigate("/user/home")}>
            <FaHome /> Back to Menu
          </button>
          <button className="view-cart-btn" onClick={() => navigate("/user/cart")}>
            <FaClipboardList /> View Cart
          </button>
        </div>
      </div>

      <div className="orders-modern-tabs">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabClick('all')}
        >
          All Orders
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => handleTabClick('pending')}
        >
          Pending
        </button>
        <button
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => handleTabClick('completed')}
        >
          Completed
        </button>
        <button
          className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => handleTabClick('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {loading ? (
        <div className="orders-loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty-state">
          <p>No orders found in this category.</p>
          <button className="back-to-menu-btn" onClick={() => navigate("/user/home")}>
            Go to Menu
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-summary" onClick={() => handleOrderCardClick(order.id)}>
                <div className="summary-main-info">
                  <span className="order-id">Order #{order.id}</span>
                  <span className={`order-status-badge status-${order.orderStage.toLowerCase()}`}>
                    {order.orderStage}
                  </span>
                </div>
                <div className="summary-details-row">
                  <span className="detail-label">Items:</span>
                  <span className="detail-value">{order.items.length} product{order.items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="summary-details-row">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value order-total">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-details-row">
                  <span className="detail-label">Placed On:</span>
                  <span className="detail-value">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <button className="expand-toggle-button">
                  {expandedOrderId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {expandedOrderId === order.id && (
                <div className="order-card-details">
                  <div className="order-items-list">
                    <h4>Products in this Order:</h4>
                    <ul>
                      {order.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.productName} (x{item.quantity}) - ₹{(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-delivery-info">
                    <h4>Delivery Details:</h4>
                    <p>
                      <span className="detail-label">Payment Mode:</span> {order.paymentMode}
                    </p>
                    {order.orderStage.toLowerCase() === 'pending' && (
                        <p>
                          <span className="detail-label">Delivery Partner:</span> {order.deliveryPartner}
                        </p>
                    )}
                    <p>
                      <span className="detail-label">ETA:</span> {order.eta}
                    </p>
                  </div>

                  <div className="order-actions-bottom">
                    <button className="invoice-btn" onClick={() => generateInvoice(order)}>
                      <FaFileInvoice /> Generate Invoice
                    </button>
                    {order.orderStage.toLowerCase() === 'pending' && (
                        <button className="cancel-order-btn">
                          Cancel Order
                        </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {isFallback && (
        <p className="fallback-message">
          *Could not fetch latest orders from backend. Displaying cached data.*
        </p>
      )}
    </div>
  );
}

export default OrdersPage;