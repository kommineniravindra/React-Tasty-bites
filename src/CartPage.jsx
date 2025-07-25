import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import QRCode from 'react-qr-code';
import { FaLock, FaQrcode, FaCreditCard, FaChevronDown, FaChevronUp, FaArrowLeft, FaClipboardList, FaEnvelope } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

const CartPage = () => {
  const {
    cartItems,
    updateQuantity: originalUpdateQuantity,
    removeFromCart: originalRemoveFromCart,
    totalAmount,
    clearCart,
    addToCart
  } = useCart();

  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [visibleSection, setVisibleSection] = useState('');
  const [isBillSummaryOpen, setIsBillSummaryOpen] = useState(true);
  const [isEmailSectionOpen, setIsEmailSectionOpen] = useState(true);

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [quantityAnimatingItemId, setQuantityAnimatingItemId] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const customerEmail = localStorage.getItem('email') || ''; // This will now get a value from Login/Signup
  const [userEmail, setUserEmail] = useState(customerEmail);
  const showEmailInput = !customerEmail;

  const shippingCost = 20;
  const taxCost = 20;

  const discountAmount = (totalAmount * discount) / 100;
  const estimatedTotalNum = totalAmount - discountAmount + shippingCost + taxCost;
  const estimatedTotal = estimatedTotalNum.toFixed(2);


  const SERVICE_ID = 'service_o1fbb8a';
  const TEMPLATE_ID = 'template_uy7nn2j';
  const PUBLIC_KEY = 'QT4vFNSyQjWyMeDEz';

  const getRandomConfettiColor = () => {
    const colors = ['#ff6f61', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#f9a825', '#e65100'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const debouncedUpdateQuantityAPI = useRef(
    debounce(async (itemId, newQuantity) => {
      console.log(`API Call: Updated quantity for item ${itemId} to ${newQuantity}`);
      toast.success(`Quantity for item updated!`, {
        position: "bottom-left", autoClose: 1000, hideProgressBar: true
      });
      setQuantityAnimatingItemId(null);
    }, 300)
  ).current;

  const updateQuantity = useCallback((itemId, newQuantityValue) => {
    const currentItem = cartItems.find(item => item.id === itemId);
    if (!currentItem) return;

    const oldQuantity = currentItem.quantity;
    const newQuantity = parseInt(newQuantityValue);

    if (newQuantity < 1) return;

    originalUpdateQuantity(itemId, newQuantity - oldQuantity);

    setQuantityAnimatingItemId(itemId);

    debouncedUpdateQuantityAPI(itemId, newQuantity);

  }, [cartItems, originalUpdateQuantity, debouncedUpdateQuantityAPI]);

  const removeFromCart = useCallback((itemId) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    if (!itemToRemove) return;

    const itemElement = document.getElementById(`cart-item-${itemId}`);
    if (itemElement) {
        itemElement.classList.add('removing');
        itemElement.addEventListener('animationend', () => {
            originalRemoveFromCart(itemId);
            toast.error(`${itemToRemove.name} removed from cart`, {
                position: "top-right", autoClose: 2000, hideProgressBar: true
            });
        }, { once: true });
    } else {
        originalRemoveFromCart(itemId);
        toast.error(`${itemToRemove.name} removed from cart`, {
            position: "top-right", autoClose: 2000, hideProgressBar: true
        });
    }

    console.log(`API Call: Removed item ${itemId}`);
  }, [cartItems, originalRemoveFromCart]);

  const handlePromoCodeSubmit = () => {
    const code = promoCodeInput.toUpperCase();
    let newDiscount = 0;
    if (code === 'RAVI10') {
      newDiscount = 10;
    } else if (code === 'RAVI20') {
      newDiscount = 20;
    } else if (code === 'RAVI30') {
      newDiscount = 30;
    }

    if (newDiscount > 0) {
      setDiscount(newDiscount);
      toast.success(`Promo code "${code}" applied! You got ${newDiscount}% off.`, {
        position: "top-right", autoClose: 2000, hideProgressBar: true
      });
    } else {
      setDiscount(0);
      toast.warn('Invalid promo code.', {
        position: "top-right", autoClose: 2000, hideProgressBar: true
      });
    }
  };

  const freeShippingThreshold = 200;
  const remainingForFreeShipping = freeShippingThreshold - totalAmount;
  const freeShippingProgress = Math.min(100, (totalAmount / freeShippingThreshold) * 100);

  const handleCheckout = async () => {
    if (!token) {
      toast.error('Login session expired. Please log in again.', { position: "top-center" });
      navigate('/login');
      return;
    }

    if (!userEmail || userEmail.trim() === '') {
        toast.error('Please enter your email to receive order details.', { position: "top-center" });
        return;
    }

    if (visibleSection === 'card' && (cardNumber.length !== 19 || cardHolder.trim() === '' || expiryDate.length !== 5)) {
        toast.error('Please fill in valid card details.', { position: "top-center" });
        return;
    }

    if (visibleSection === '') {
        toast.error('Please select a payment method (QR Code or Card).', { position: "top-center" });
        return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('https://spring-apigateway.onrender.com/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: cartItems.map((item) => ({
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: estimatedTotalNum, // Send the numerical value
          status: "PENDING", // Add an initial status for the backend
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Checkout failed');
      }

      const orderId = 'TB' + Date.now();

      const templateParams = {
        user_email: userEmail,
        order_id: orderId,
        orders: cartItems.map((item) => ({
          name: item.name,
          price: item.price.toFixed(2),
          units: item.quantity,
        })),
        cost: {
          subtotal: totalAmount.toFixed(2),
          tax: taxCost.toFixed(2),
          shipping: shippingCost.toFixed(2),
          discount: discountAmount.toFixed(2),
          total: estimatedTotal,
        }
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      clearCart();
      localStorage.removeItem('cartItems');
      setIsCheckedOut(true);
      setCheckoutSuccess(true);
      setCountdown(5);
      toast.success('Order placed successfully! Check your email.', { position: "top-center", autoClose: 3000 });
    } catch (err) {
      console.error('Checkout Error:', err);
      toast.error('Checkout failed. Please try again.', { position: "top-center" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    if (isCheckedOut && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCheckedOut && countdown === 0) {
      navigate('/user/orders');
    }
  }, [isCheckedOut, countdown, navigate]);

  const toggleSection = (section) => {
    setVisibleSection((prev) => (prev === section ? '' : section));
  };

  const toggleBillSummary = () => {
    setIsBillSummaryOpen((prev) => !prev);
  };

  const toggleEmailSection = () => {
    setIsEmailSectionOpen((prev) => !prev);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  const renderNavButtons = () => (
    <div className="bottom-nav-buttons">
      <button onClick={() => navigate('/user/home')} className="nav-text-btn">
        <FaArrowLeft className="nav-icon" /> Back to Menu
      </button>
      <button onClick={() => navigate('/user/orders')} className="nav-text-btn">
        Orders <FaClipboardList className="nav-icon-right" />
      </button>
    </div>
  );

  return (
    <div className="cart-container-template">
      <ToastContainer />
      <h2 className="my-cart-heading">My Cart ({cartItems.length})</h2>

      {isCheckedOut || cartItems.length === 0 ? (
        <>
          <div className="empty-cart-animation">
            <div className="cart-loader">
              <svg viewBox="0 0 24 24" className="animated-cart-svg">
                <path
                  fill="none"
                  stroke="#ffb300"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.3a1 1 0 0 0 .98 1.2h11.64M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                />
              </svg>
            </div>
            <p>{isCheckedOut ? 'Your order has been placed successfully!' : 'Your cart is empty.'}</p>
            {checkoutSuccess && (
              <div className="checkout-success">
                <div className="success-animation">
                  <div className="checkmark-circle">
                    <div className="checkmark" />
                  </div>
                  <h3>Checkout Successful!</h3>
                  <p className="countdown-text">Redirecting in {countdown} seconds...</p>
                  <div className="confetti-container">
                    {[...Array(150)].map((_, i) => (
                      <div
                        key={i}
                        className="confetti-piece"
                        style={{
                          '--rand-x': (Math.random() * 2 - 1).toFixed(2),
                          '--rand-y': (Math.random() * 2 - 1).toFixed(2),
                          '--rand-rot': (Math.random() * 2 - 1).toFixed(2),
                          backgroundColor: getRandomConfettiColor(),
                          animationDelay: `${Math.random() * 0.8}s`,
                          animationDuration: `${2 + Math.random() * 1.5}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="cart-empty-actions">
            <button onClick={() => navigate('/user/home')} className="continue-shopping-btn">Continue Shopping</button>
            <button onClick={() => navigate('/user/orders')} className="view-orders-btn">View Orders</button>
          </div>
        </>
      ) : (
        <div className="cart-content-template">
          <div className="cart-main-column">
            <table className="cart-items-table">
              <thead>
                <tr>
                  <th className="item-header"></th>
                  <th className="each-header">Each</th>
                  <th className="quantity-header">Quantity</th>
                  <th className="total-header">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} id={`cart-item-${item.id}`} className={quantityAnimatingItemId === item.id ? 'quantity-pulsing' : ''}>
                    <td className="item-details-cell">
                      <img
                        src={`https://spring-apigateway.onrender.com${item.imageUrl}`}
                        alt={item.name}
                        className="item-image-template"
                        onError={(e) => { e.target.src = '/fallback.jpg'; }}
                      />
                      <div className="item-info-template">
                        <div className="item-name-template">{item.name}</div>
                        {item.category && <div className="item-category-template">Category: {item.category}</div>}
                        <div className="item-status-template">In Stock</div>
                        <div className="item-actions">
                          <button className="item-action-btn item-action-edit">Edit</button>
                          <button className="item-action-btn item-action-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                          <button className="item-action-btn item-action-wishlist">Move to Wishlist</button>
                          <button className="item-action-btn item-action-save-later">Save for Later</button>
                        </div>
                      </div>
                    </td>
                    <td className="item-price-cell">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="item-quantity-cell">
                      <div className="quantity-controls-template">
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        >
                          {[...Array(10).keys()].map(num => (
                            <option key={num + 1} value={num + 1}>{num + 1}</option>
                          ))}
                        </select>
                        <span className="dropdown-arrow"></span>
                      </div>
                    </td>
                    <td className="item-total-cell">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-items-summary-bottom">
                <span className="items-count">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</span>
                <span className="cart-subtotal-bottom">₹{totalAmount.toFixed(2)}</span>
            </div>
            <button className="clear-cart-btn" onClick={clearCart}>Clear All Items</button>
          </div>

          <div className="cart-sidebar-column">
            <div className="promo-code-section">
              <label htmlFor="promo-code-input" className="promo-code-label">ENTER PROMO CODE</label>
              <div className="promo-input-group">
                <input
                  type="text"
                  id="promo-code-input"
                  placeholder="Promo Code"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="promo-code-input"
                  onKeyPress={(e) => { if (e.key === 'Enter') handlePromoCodeSubmit(); }}
                />
                <button className="promo-submit-btn" onClick={handlePromoCodeSubmit}>Submit</button>
              </div>
            </div>

            <div className={`payment-method-panel ${isBillSummaryOpen ? 'active' : ''}`}>
                <div className="panel-header" onClick={toggleBillSummary}>
                    <FaClipboardList className="panel-icon" />
                    <span>Bill Summary</span>
                    {isBillSummaryOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {isBillSummaryOpen && (
                    <div className="panel-content order-summary-details-template">
                        <div className="summary-line">
                            <span className="summary-label">Subtotal</span>
                            <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-line">
                            <span className="summary-label">Shipping cost</span>
                            <span className="summary-value">₹{shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="summary-line">
                            <span className="summary-label">Discount</span>
                            <span className="summary-value discount-value">-₹{discountAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-line">
                            <span className="summary-label">Tax</span>
                            <span className="summary-value">₹{taxCost.toFixed(2)}</span>
                        </div>
                        <div className="summary-line estimated-total-line">
                            <span className="summary-label">Estimated Total</span>
                            <span className="summary-value estimated-total-value">₹{estimatedTotal}</span>
                        </div>
                    </div>
                )}
            </div>
            {remainingForFreeShipping > 0 && (
                <div className="free-shipping-progress-container">
                    <p className="free-shipping-progress-text">You're ₹{remainingForFreeShipping.toFixed(2)} away from free shipping!</p>
                    <div className="progress-bar-outer">
                        <div className="progress-bar-inner" style={{width: `${freeShippingProgress}%`}}></div>
                    </div>
                </div>
            )}
            {remainingForFreeShipping <= 0 && totalAmount > 0 && (
                <div className="free-shipping-template green-text">
                    🎉 You've qualified for FREE shipping!
                </div>
            )}

            <div className={`payment-method-panel ${isEmailSectionOpen ? 'active' : ''}`}>
                <div className="panel-header" onClick={toggleEmailSection}>
                    <FaEnvelope className="panel-icon" />
                    <span>Email for Order Details</span>
                    {isEmailSectionOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {isEmailSectionOpen && (
                    <div className="panel-content">
                        {showEmailInput ? (
                            <div className="email-input-section">
                                <p className="email-prompt">Enter your email for order details:</p>
                                <input
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    placeholder="e.g., yourname@example.com"
                                    className="email-input-field"
                                />
                            </div>
                        ) : (
                            <div className="email-display-section">
                                <p className="email-prompt">Order details will be sent to:</p>
                                <strong className="customer-email-display">{customerEmail}</strong>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="payment-options-container">
                <h4 className="payment-options-heading">Choose Payment Method</h4>

                <div className={`payment-method-panel ${visibleSection === 'qr' ? 'active' : ''}`}>
                    <div className="panel-header" onClick={() => toggleSection('qr')}>
                        <FaQrcode className="panel-icon" />
                        <span>Pay with UPI/QR Code</span>
                        {visibleSection === 'qr' ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {visibleSection === 'qr' && (
                        <div className="panel-content qr-code-section">
                            <h4>Scan to Pay ₹{estimatedTotal}</h4>
                            <QRCode
                                value={`upi://pay?pa=9603262008@ybl&pn=TASTYBITE'S&am=${estimatedTotal}&cu=INR`}
                                size={120}
                            />
                            <div className="upi-id-wrapper">
                                <span className="upi-id-text">UPI ID: 9603262008@ybl</span>
                                <button className="copy-btn-reintegrated" onClick={() => {
                                    navigator.clipboard.writeText('9603262008@ybl');
                                    toast.success('UPI ID copied!', { position: "top-right", autoClose: 2000, hideProgressBar: true });
                                }}>
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`payment-method-panel ${visibleSection === 'card' ? 'active' : ''}`}>
                    <div className="panel-header" onClick={() => toggleSection('card')}>
                        <FaCreditCard className="panel-icon" />
                        <span>Pay with Credit/Debit Card</span>
                        {visibleSection === 'card' ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {visibleSection === 'card' && (
                        <div className="panel-content card-payment-form-reintegrated">
                            <div className="card-chip"></div>
                            <input
                                className="card-number-input"
                                placeholder="0000 0000 0000 0000"
                                maxLength="19"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                            />
                            <div className="card-info-group">
                                <div>
                                    <label className="card-input-label">Card Holder</label>
                                    <input
                                        className="card-holder-input"
                                        placeholder="Your Name"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="card-input-label">Expires</label>
                                    <input
                                        className="expiry-date-input"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={expiryDate}
                                        onChange={handleExpiryDateChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
              className="checkout-btn-template"
              onClick={handleCheckout}
              disabled={isCheckingOut || cartItems.length === 0}
            >
              {isCheckingOut ? (
                <>
                  <span className="spinner-template"></span> Processing...
                </>
              ) : (
                <>
                  <FaLock /> Checkout
                </>
              )}
            </button>
            {renderNavButtons()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;