import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShoppingBag, CreditCard, MapPin, ChevronLeft, ShieldCheck, Sparkles, CheckCircle2, Phone, Mail, User } from 'lucide-react';

const fmt = (n) => parseInt(n).toLocaleString('en-LK');

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty and order is not placed yet
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      toast.error('Your cart is empty.');
      navigate('/');
    }
  }, [items, navigate]);

  // Load profile defaults from localStorage
  const [personalInfo] = useState(() => {
    const saved = localStorage.getItem('ba_profile_info');
    return saved ? JSON.parse(saved) : { fullName: profile?.full_name || 'Sarah Parker', email: user?.email || 'sarah.parker@bloomair.io', phone: '+94 77 123 4567' };
  });

  const [savedAddresses] = useState(() => {
    const saved = localStorage.getItem('ba_profile_addresses');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedPayments] = useState(() => {
    const saved = localStorage.getItem('ba_profile_payments');
    return saved ? JSON.parse(saved) : [];
  });

  // Form states
  const [name, setName] = useState(personalInfo.fullName);
  const [email, setEmail] = useState(personalInfo.email);
  const [phone, setPhone] = useState(personalInfo.phone);
  
  const defaultAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || {};
  const [addressLine1, setAddressLine1] = useState(defaultAddress.line1 || '');
  const [addressLine2, setAddressLine2] = useState(defaultAddress.line2 || '');
  const [city, setCity] = useState(defaultAddress.city || '');
  
  const defaultPayment = savedPayments.find(p => p.isDefault) || savedPayments[0] || {};
  const [paymentMethod, setPaymentMethod] = useState(defaultPayment.type === 'Credit Card' ? 'card' : 'cod');
  
  // Card Details (mock)
  const [cardNumber, setCardNumber] = useState(defaultPayment.last4 ? `•••• •••• •••• ${defaultPayment.last4}` : '');
  const [cardExpiry, setCardExpiry] = useState(defaultPayment.exp || '');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(defaultPayment.holder || personalInfo.fullName.toUpperCase());

  // Coupons
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponInput, setCouponInput] = useState('');

  // Order success state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Check if coupon discount is stored in cart (or passed)
  useEffect(() => {
    // Look up applied coupon in localStorage if any was applied in the cart sidebar
    const storedCoupon = localStorage.getItem('ba_applied_coupon');
    if (storedCoupon) {
      try {
        const couponObj = JSON.parse(storedCoupon);
        setAppliedCoupon(couponObj.code);
        setDiscountPercent(parseFloat(couponObj.discount) || 0);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    // Load active coupons from localStorage (created by admin dashboard)
    const couponsString = localStorage.getItem('ba_admin_coupons');
    const coupons = couponsString ? JSON.parse(couponsString) : [
      { code: 'SUMMER20', discount: '20%', status: 'Active' },
      { code: 'WELCOME10', discount: '10%', status: 'Active' }
    ];

    const matched = coupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.status === 'Active');
    if (matched) {
      const pct = parseInt(matched.discount) || 0;
      setDiscountPercent(pct);
      setAppliedCoupon(matched.code.toUpperCase());
      localStorage.setItem('ba_applied_coupon', JSON.stringify({ code: matched.code.toUpperCase(), discount: pct }));
      toast.success(`Coupon ${matched.code} applied! ${pct}% discount.`);
    } else {
      toast.error('Invalid or expired coupon code.');
    }
    setCouponInput('');
  };

  const calculateSubtotal = () => total;
  const discountAmount = (calculateSubtotal() * discountPercent) / 100;
  const shippingCost = calculateSubtotal() - discountAmount > 3000 ? 0 : 350;
  const grandTotal = calculateSubtotal() - discountAmount + shippingCost;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !addressLine1 || !city) {
      toast.error('Please fill in all required delivery details.');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv || !cardHolder)) {
      toast.error('Please enter your payment card details.');
      return;
    }

    // Process placing order
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const paymentDetailsStr = paymentMethod === 'card' 
      ? `Visa ending in ${cardNumber.slice(-4)}`
      : 'Cash on Delivery';

    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      customer: name,
      email: email,
      phone: phone,
      count: itemCount,
      date: dateStr,
      total: grandTotal,
      payment: 'Paid',
      paymentMethod: paymentDetailsStr,
      delivery: 'Processing',
      status: 'Processing',
      address: `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}`,
      items: items.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        size: item.size || 'M',
        color: item.color || 'Default',
        category: item.category || 'Clothing',
        image: item.image
      }))
    };

    // Save to user orders list (localStorage)
    const existingOrdersStr = localStorage.getItem('ba_profile_orders_v2');
    const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('ba_profile_orders_v2', JSON.stringify(updatedOrders));

    // Save to payments ledger (localStorage)
    const txId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTransaction = {
      id: txId,
      orderId: orderId,
      customer: name,
      amount: grandTotal,
      method: paymentDetailsStr,
      date: dateStr,
      status: 'Completed'
    };
    const existingTxStr = localStorage.getItem('ba_admin_transactions');
    const existingTx = existingTxStr ? JSON.parse(existingTxStr) : [];
    localStorage.setItem('ba_admin_transactions', JSON.stringify([newTransaction, ...existingTx]));

    // Save notifications for admin (localStorage)
    const newNotification = {
      id: Date.now(),
      message: `New order ${orderId} received from ${name} (LKR ${fmt(grandTotal)}).`,
      time: 'Just now',
      unread: true
    };
    const existingNotifyStr = localStorage.getItem('ba_admin_notifications');
    const existingNotify = existingNotifyStr ? JSON.parse(existingNotifyStr) : [];
    localStorage.setItem('ba_admin_notifications', JSON.stringify([newNotification, ...existingNotify]));

    // Clean up
    clearCart();
    localStorage.removeItem('ba_applied_coupon');
    setPlacedOrderDetails(newOrder);
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
  };

  if (orderPlaced && placedOrderDetails) {
    return (
      <div style={{
        maxWidth: 600,
        margin: '80px auto',
        padding: 40,
        backgroundColor: '#ffffff',
        border: '3px solid #000000',
        boxShadow: '8px 8px 0px #000000',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: '#e6f4ea',
            border: '2.5px solid #16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={36} color="#16a34a" />
          </div>
        </div>
        <span style={{ fontSize: 10, letterSpacing: '4px', color: '#f5af19', fontWeight: 800, textTransform: 'uppercase' }}>
          Checkout Successful
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 900, marginTop: 8, marginBottom: 12 }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: 13, color: '#71717b', lineHeight: '1.6', maxWidth: 440, margin: '0 auto 24px' }}>
          Thank you for your purchase. Your order <strong style={{ color: '#000000', fontFamily: 'monospace' }}>{placedOrderDetails.orderNumber}</strong> has been logged and is currently in processing.
        </p>

        <div style={{
          textAlign: 'left',
          backgroundColor: '#faf9f6',
          border: '1.5px solid #000000',
          padding: 24,
          marginBottom: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1.5px solid #000000', paddingBottom: 8, margin: 0, fontWeight: 800 }}>
            Receipt Summary
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#71717b' }}>Customer Name:</span>
            <strong>{placedOrderDetails.customer}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#71717b' }}>Deliver to:</span>
            <strong style={{ textAlign: 'right' }}>{placedOrderDetails.address}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#71717b' }}>Payment Details:</span>
            <strong>{placedOrderDetails.paymentMethod}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderTop: '1px dashed #d4d4d8', paddingTop: 10 }}>
            <span style={{ color: '#71717b' }}>Grand Total Paid:</span>
            <strong style={{ fontSize: 15 }}>LKR {fmt(placedOrderDetails.total)}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={() => navigate('/profile?tab=orders')}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: '2px solid #000000',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #f5af19'
            }}
          >
            Track Order
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: '2px solid #000000',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#000000'; }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 1200,
      margin: '40px auto',
      padding: '0 24px',
      fontFamily: 'Inter, sans-serif',
      color: '#0a0a0a'
    }}>
      {/* Back link */}
      <button 
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 24,
          padding: 0
        }}
      >
        <ChevronLeft size={16} /> Back to Bag
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '7fr 5fr',
        gap: 40,
        alignItems: 'start'
      }}>
        {/* LEFT: Checkout Forms */}
        <form onSubmit={handlePlaceOrder} style={{
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 32
        }}>
          {/* Header */}
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28,
              fontWeight: 900,
              margin: 0
            }}>
              Checkout
            </h1>
            <span style={{ fontSize: 12, color: '#71717b', fontWeight: 500 }}>
              Verify billing, delivery and secure payment.
            </span>
          </div>

          {/* Section 1: Customer Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, borderBottom: '1px solid #000000', paddingBottom: 6, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={14} /> Contact Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: '50%' }}>
              <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Mobile Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                placeholder="+94 77 123 4567"
                required
              />
            </div>
          </div>

          {/* Section 2: Delivery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, borderBottom: '1px solid #000000', paddingBottom: 6, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={14} /> Shipping Destination
            </h3>
            
            {savedAddresses.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => {
                      setAddressLine1(addr.line1);
                      setAddressLine2(addr.line2 || '');
                      setCity(addr.city);
                      setName(addr.fullName);
                      setPhone(addr.phone);
                    }}
                    style={{
                      padding: '8px 12px',
                      border: '1.5px solid #000000',
                      backgroundColor: addressLine1 === addr.line1 ? '#f5af19' : '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '1.5px 1.5px 0px #000000'
                    }}
                  >
                    Use Saved: {addr.type} ({addr.fullName})
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Address Line 1 *</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address, P.O. box, company name"
                  style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: '50%' }}>
                <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Colombo 03"
                  style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, borderBottom: '1px solid #000000', paddingBottom: 6, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={14} /> Secure Payment Method
            </h3>

            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <label style={{
                flex: 1,
                padding: '16px',
                border: '2px solid #000000',
                backgroundColor: paymentMethod === 'card' ? '#faf9f6' : '#ffffff',
                boxShadow: paymentMethod === 'card' ? '3px 3px 0px #000000' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13
              }}>
                <input 
                  type="radio" 
                  name="payMethod" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')}
                  style={{ cursor: 'pointer', accentColor: '#000' }}
                />
                Credit / Debit Card
              </label>
              <label style={{
                flex: 1,
                padding: '16px',
                border: '2px solid #000000',
                backgroundColor: paymentMethod === 'cod' ? '#faf9f6' : '#ffffff',
                boxShadow: paymentMethod === 'cod' ? '3px 3px 0px #000000' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13
              }}>
                <input 
                  type="radio" 
                  name="payMethod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')}
                  style={{ cursor: 'pointer', accentColor: '#000' }}
                />
                Cash on Delivery (COD)
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div style={{
                backgroundColor: '#faf9f6',
                border: '1.5px solid #000000',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                {savedPayments.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    {savedPayments.map((pay) => (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => {
                          setCardNumber(`•••• •••• •••• ${pay.last4}`);
                          setCardExpiry(pay.exp);
                          setCardHolder(pay.holder);
                        }}
                        style={{
                          padding: '6px 10px',
                          border: '1.5px solid #000000',
                          backgroundColor: cardNumber.endsWith(pay.last4) ? '#f5af19' : '#ffffff',
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '1.5px 1.5px 0px #000000'
                        }}
                      >
                        Use Saved {pay.provider} (*{pay.last4})
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Cardholder Name *</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="SARAH PARKER"
                    style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                    required={paymentMethod === 'card'}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Card Number *</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                    required={paymentMethod === 'card'}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Expiration Date *</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                      required={paymentMethod === 'card'}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Security Code (CVV) *</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 13, outline: 'none' }}
                      required={paymentMethod === 'card'}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            style={{
              padding: '16px 32px',
              border: '2px solid #000000',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px #f5af19',
              marginTop: 12
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#000000'}
          >
            Confirm & Place Order (LKR {fmt(grandTotal)})
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: '#71717b', fontSize: 11 }}>
            <ShieldCheck size={14} color="#16a34a" />
            <span>Secure 256-bit SSL encrypted checkout connection.</span>
          </div>
        </form>

        {/* RIGHT: Order Summary */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 900, borderBottom: '2px solid #000000', paddingBottom: 10, margin: 0 }}>
            Order Summary
          </h3>

          {/* Items breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 300, overflowY: 'auto' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 12, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 60, height: 76, objectFit: 'cover', border: '1px solid #000000' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ fontSize: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</strong>
                  <span style={{ fontSize: 10, color: '#71717b' }}>Size: {item.size} / Qty: {item.quantity}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700 }}>LKR {fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Coupon application form */}
          <form onSubmit={handleApplyCoupon} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 10,
            borderTop: '1px solid #e4e4e7',
            paddingTop: 16
          }}>
            <input
              type="text"
              placeholder="Promo code (e.g. SUMMER20)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1.5px solid #000000',
                fontSize: 12,
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: '2px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#000000'; }}
            >
              Apply
            </button>
          </form>

          {appliedCoupon && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#e6f4ea',
              border: '1px solid #16a34a',
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700
            }}>
              <span style={{ color: '#16a34a' }}>Coupon "{appliedCoupon}" Applied:</span>
              <span style={{ color: '#16a34a' }}>-{discountPercent}%</span>
            </div>
          )}

          {/* Totals */}
          <div style={{
            borderTop: '1px solid #e4e4e7',
            paddingTop: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717b' }}>Subtotal ({itemCount} items)</span>
              <span>LKR {fmt(calculateSubtotal())}</span>
            </div>
            {discountPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-LKR {fmt(discountAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717b' }}>Shipping fee</span>
              <span>{shippingCost === 0 ? 'FREE' : `LKR ${fmt(shippingCost)}`}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 15,
              fontWeight: 900,
              borderTop: '1.5px solid #000000',
              paddingTop: 12,
              marginTop: 4
            }}>
              <span>Grand Total</span>
              <span style={{ fontSize: 18, color: '#000000' }}>LKR {fmt(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
