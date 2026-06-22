import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Package, ShoppingBag, 
  DollarSign, Calendar, Search, Bell, Mail, ChevronDown, 
  Plus, Edit, Trash, Settings, LogOut, CheckCircle, Clock, 
  RefreshCw, Star, Percent, BarChart2, Shield, MessageSquare, 
  AlertTriangle, X, FileText, Menu, ChevronRight, Filter, 
  ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';

export default function AdminDasboardPage() {
  // Live Date and Time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  // State Management
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [chartFilter, setChartFilter] = useState('Weekly');
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState(null);
  
  // Search query in admin layout
  const [globalSearch, setGlobalSearch] = useState('');

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);

  // Mock Toast system
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Dynamic Dashboard States ---
  
  // 1. Orders
  const [orders, setOrders] = useState([
    { id: 'ORD-1084', customer: 'Emily Stone', count: 2, date: '2026-06-22', total: 285.00, payment: 'Paid', delivery: 'Processing', items: [{ name: 'Silk Slip Dress', qty: 1, price: 185.00 }, { name: 'Wrap Midi Dress', qty: 1, price: 100.00 }] },
    { id: 'ORD-1083', customer: 'Liam Davis', count: 1, date: '2026-06-22', total: 145.00, payment: 'Paid', delivery: 'Shipped', items: [{ name: 'Classic Leather Boots', qty: 1, price: 145.00 }] },
    { id: 'ORD-1082', customer: 'Olivia Wilson', count: 3, date: '2026-06-21', total: 420.00, payment: 'Paid', delivery: 'Delivered', items: [{ name: 'Classic Black Blazer', qty: 2, price: 260.00 }, { name: 'Gold Drop Earrings', qty: 1, price: 160.00 }] },
    { id: 'ORD-1081', customer: 'Noah Thomas', count: 1, date: '2026-06-20', total: 89.00, payment: 'Refunded', delivery: 'Cancelled', items: [{ name: 'Linen Summer Shirt', qty: 1, price: 89.00 }] },
    { id: 'ORD-1080', customer: 'Sophia Martinez', count: 2, date: '2026-06-20', total: 195.00, payment: 'Paid', delivery: 'Delivered', items: [{ name: 'Leather Crossbody Bag', qty: 1, price: 120.00 }, { name: 'Wide Brim Straw Hat', qty: 1, price: 75.00 }] }
  ]);

  // 2. Low Stock Alerts
  const [stockAlerts, setStockAlerts] = useState([
    { id: 'P01', name: 'Silk Slip Dress', sku: 'SSD-SL-01', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60', quantity: 3, status: 'Critical' },
    { id: 'P02', name: 'Classic Leather Boots', sku: 'CLB-BR-08', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=150&auto=format&fit=crop&q=60', quantity: 2, status: 'Critical' },
    { id: 'P03', name: 'Linen Summer Shirt', sku: 'LSS-WH-03', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=60', quantity: 4, status: 'Warning' },
    { id: 'P04', name: 'Oversized Wool Coat', sku: 'OWC-BK-02', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60', quantity: 1, status: 'Critical' }
  ]);

  // 3. Products List (Active)
  const [products, setProducts] = useState([
    { id: 'PRD-001', name: 'Classic Black Blazer', category: 'Outerwear', sold: 420, revenue: 54600, popularity: 95, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60', stock: 45 },
    { id: 'PRD-002', name: 'Wrap Midi Dress', category: 'Dresses', sold: 380, revenue: 45600, popularity: 88, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60', stock: 12 },
    { id: 'PRD-003', name: 'Leather Crossbody Bag', category: 'Accessories', sold: 290, revenue: 34800, popularity: 82, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60', stock: 18 },
    { id: 'PRD-004', name: 'Slim Fit Denim Jeans', category: 'Pants', sold: 240, revenue: 21600, popularity: 75, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&auto=format&fit=crop&q=60', stock: 32 }
  ]);

  // 4. Coupons Log
  const [coupons, setCoupons] = useState([
    { code: 'SUMMER20', discount: '20%', status: 'Active', usage: '142 times' },
    { code: 'WELCOME10', discount: '10%', status: 'Active', usage: '512 times' },
    { code: 'VIPBLOOM', discount: '25%', status: 'Expired', usage: '88 times' }
  ]);

  // 5. Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Low stock alert: Silk Slip Dress is under 5 units.', time: '10m ago', unread: true },
    { id: 2, message: 'New order #ORD-1084 received from Emily Stone.', time: '45m ago', unread: true },
    { id: 3, message: 'Payment confirmation: Order #ORD-1082 ($420.00).', time: '2h ago', unread: false }
  ]);

  // 6. Messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Support Team', text: 'Hey, is the silk dress restocked?', time: '1h ago', unread: true },
    { id: 2, sender: 'Inventory Manager', text: 'Classic leather boots details updated.', time: '4h ago', unread: false }
  ]);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Outerwear',
    stock: '',
    price: '',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60'
  });

  // Create Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    status: 'Active'
  });

  // Handle mock actions
  const handleRestock = (productId, name) => {
    // Increment product stock
    setStockAlerts(prev => prev.filter(item => item.id !== productId));
    setProducts(prev => prev.map(p => {
      if (p.name === name) {
        return { ...p, stock: p.stock + 15 };
      }
      return p;
    }));
    triggerToast(`Successfully restocked 15 units of "${name}"!`);
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.stock || !newProduct.price) {
      triggerToast('Please fill in all product fields!');
      return;
    }
    const created = {
      id: `PRD-00${products.length + 1}`,
      name: newProduct.name,
      category: newProduct.category,
      sold: 0,
      revenue: 0,
      popularity: 0,
      image: newProduct.image,
      stock: parseInt(newProduct.stock)
    };
    setProducts([created, ...products]);
    setShowAddProductModal(false);
    setNewProduct({ name: '', category: 'Outerwear', stock: '', price: '', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60' });
    triggerToast(`Product "${created.name}" added successfully!`);
  };

  const handleCreateCouponSubmit = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) {
      triggerToast('Please fill in all coupon fields!');
      return;
    }
    const created = {
      code: newCoupon.code.toUpperCase(),
      discount: newCoupon.discount.endsWith('%') ? newCoupon.discount : `${newCoupon.discount}%`,
      status: newCoupon.status,
      usage: '0 times'
    };
    setCoupons([created, ...coupons]);
    setShowCreateCouponModal(false);
    setNewCoupon({ code: '', discount: '', status: 'Active' });
    triggerToast(`Coupon "${created.code}" created successfully!`);
  };

  const clearUnreadNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearUnreadMessages = () => {
    setMessages(prev => prev.map(m => ({ ...m, unread: false })));
  };

  // Chart Data definitions based on filter
  const chartData = {
    Daily: [
      { label: 'Mon', revenue: 8400, orders: 120 },
      { label: 'Tue', revenue: 9800, orders: 142 },
      { label: 'Wed', revenue: 9100, orders: 135 },
      { label: 'Thu', revenue: 11200, orders: 168 },
      { label: 'Fri', revenue: 14500, orders: 210 },
      { label: 'Sat', revenue: 16400, orders: 245 },
      { label: 'Sun', revenue: 13200, orders: 198 }
    ],
    Weekly: [
      { label: 'Wk 1', revenue: 32000, orders: 480 },
      { label: 'Wk 2', revenue: 38500, orders: 560 },
      { label: 'Wk 3', revenue: 41200, orders: 610 },
      { label: 'Wk 4', revenue: 46892, orders: 702 }
    ],
    Monthly: [
      { label: 'Jan', revenue: 110000, orders: 1650 },
      { label: 'Feb', revenue: 125000, orders: 1820 },
      { label: 'Mar', revenue: 118000, orders: 1710 },
      { label: 'Apr', revenue: 142000, orders: 2100 },
      { label: 'May', revenue: 156000, orders: 2340 },
      { label: 'Jun', revenue: 174592, orders: 2680 }
    ]
  };

  const currentPoints = chartData[chartFilter];
  const maxRevenue = Math.max(...currentPoints.map(d => d.revenue));
  
  // Donut Segment details
  const donutSegments = [
    { label: 'New Customers', percentage: 65, value: '8,092', color: '#000000', dashOffset: 0 },
    { label: 'Returning Customers', percentage: 35, value: '4,358', color: '#f5af19', dashOffset: 162.8 } // segment computation
  ];

  // Helper values
  const totalUnreadNotifications = notifications.filter(n => n.unread).length;
  const totalUnreadMessages = messages.filter(m => m.unread).length;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#faf9f6', // Bloomair Warm Base Warm White
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#0a0a0a'
    }}>
      
      {/* ── TOAST NOTIFICATION CONTAINER ── */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          backgroundColor: '#000000',
          color: '#ffffff',
          border: '2px solid #ffffff',
          boxShadow: '4px 4px 0px #f5af19',
          padding: '16px 24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          animation: 'fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both'
        }}>
          <CheckCircle size={18} color="#f5af19" />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {toastMessage}
          </span>
        </div>
      )}

      {/* ── 1. SIDEBAR NAVIGATION ── */}
      <aside style={{
        width: 280,
        backgroundColor: '#000000',
        color: '#ffffff',
        borderRight: '2px solid #000000',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 900
      }}>
        {/* Sidebar Header / Logo */}
        <div style={{
          padding: '30px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Shield size={24} color="#f5af19" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ffffff'
            }}>
              BLOOMAIR
            </span>
            <span style={{
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#f5af19',
              fontWeight: 800
            }}>
              Control Panel
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{
          flex: 1,
          padding: '24px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          {[
            { id: 'Dashboard', icon: BarChart2 },
            { id: 'Products', icon: Package },
            { id: 'Categories', icon: Filter },
            { id: 'Orders', icon: ShoppingBag },
            { id: 'Customers', icon: Users },
            { id: 'Inventory', icon: RefreshCw },
            { id: 'Promotions', icon: Percent },
            { id: 'Reviews', icon: Star },
            { id: 'Payments', icon: DollarSign },
            { id: 'Reports & Analytics', icon: FileText },
            { id: 'Staff Management', icon: Shield },
            { id: 'Notifications', icon: Bell, badge: totalUnreadNotifications },
            { id: 'Settings', icon: Settings }
          ].map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (item.id === 'Notifications') clearUnreadNotifications();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: 0,
                  backgroundColor: isActive ? '#f5af19' : 'transparent',
                  color: isActive ? '#000000' : '#d4d4d8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  fontWeight: isActive ? 800 : 500,
                  fontSize: 13,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#d4d4d8';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={16} />
                  <span>{item.id}</span>
                </div>
                {item.badge > 0 && (
                  <span style={{
                    backgroundColor: isActive ? '#000000' : '#f5af19',
                    color: isActive ? '#ffffff' : '#000000',
                    fontSize: 9,
                    fontWeight: 900,
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#f5af19',
              color: '#000000',
              fontWeight: 800,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #ffffff'
            }}>
              AD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Administrator</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>bloomair.admin</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Log Out"
            onMouseEnter={e => e.currentTarget.style.color = '#e63946'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0 // Prevents layout blowouts
      }}>

        {/* ── 2. DEDICATED ADMIN NAVBAR/HEADER ── */}
        <header style={{
          backgroundColor: '#ffffff',
          height: 70,
          borderBottom: '2px solid #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 850
        }}>
          {/* Header Left: Search & Welcome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1, maxWidth: 500 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: 0
              }}>
                Welcome back, Admin
              </h1>
              <span style={{ fontSize: 11, color: '#71717b', fontWeight: 500 }}>
                System Status: <strong style={{ color: '#16a34a' }}>ONLINE</strong>
              </span>
            </div>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
              <input
                type="text"
                placeholder="Search orders, SKU, coupons..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 16px 8px 36px',
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 0,
                  border: '1.5px solid #000000',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717b' }} />
            </div>
          </div>

          {/* Header Right: Live Time, Actions, Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Live Clock widget */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#f4f1eb',
              border: '1px solid #000000',
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.02em',
              fontFamily: 'monospace'
            }}>
              <Clock size={12} color="#000000" />
              <span>{formatDateTime(currentTime)}</span>
            </div>

            {/* Notification Icon & Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                  setShowProfileMenu(false);
                  if (!showNotifications) clearUnreadNotifications();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Bell size={20} color="#000000" />
                {totalUnreadNotifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#e63946',
                    color: '#ffffff',
                    fontSize: 8,
                    fontWeight: 900,
                    borderRadius: '50%',
                    width: 14,
                    height: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ffffff'
                  }}>
                    {totalUnreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowNotifications(false)} />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: -60,
                    marginTop: 12,
                    width: 320,
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    boxShadow: '4px 4px 0px #000000',
                    zIndex: 99,
                    padding: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #000000', paddingBottom: 8 }}>
                      <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notifications</h4>
                      <button onClick={() => setNotifications([])} style={{ background: 'none', border: 'none', color: '#e63946', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Clear All</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: 11, color: '#71717b', textAlign: 'center', padding: '12px 0' }}>No notifications</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 8, borderBottom: '1px solid #f4f1eb' }}>
                            <p style={{ fontSize: 11, fontWeight: n.unread ? 700 : 400, color: '#0a0a0a' }}>{n.message}</p>
                            <span style={{ fontSize: 9, color: '#71717b' }}>{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Messages Icon & Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                  if (!showMessages) clearUnreadMessages();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Mail size={20} color="#000000" />
                {totalUnreadMessages > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#f5af19',
                    color: '#000000',
                    fontSize: 8,
                    fontWeight: 900,
                    borderRadius: '50%',
                    width: 14,
                    height: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ffffff'
                  }}>
                    {totalUnreadMessages}
                  </span>
                )}
              </button>

              {showMessages && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowMessages(false)} />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: -60,
                    marginTop: 12,
                    width: 300,
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    boxShadow: '4px 4px 0px #000000',
                    zIndex: 99,
                    padding: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #000000', paddingBottom: 8 }}>
                      <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Messages</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {messages.map(m => (
                        <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 8, borderBottom: '1px solid #f4f1eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: 11, color: '#0a0a0a' }}>{m.sender}</strong>
                            <span style={{ fontSize: 9, color: '#71717b' }}>{m.time}</span>
                          </div>
                          <p style={{ fontSize: 11, color: '#27272a', fontWeight: m.unread ? 700 : 400 }}>{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar & Settings Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                  setShowMessages(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: 4
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #000000'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" 
                    alt="Admin Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <ChevronDown size={14} color="#000000" />
              </button>

              {showProfileMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowProfileMenu(false)} />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 12,
                    width: 200,
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    boxShadow: '4px 4px 0px #000000',
                    zIndex: 99,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f4f1eb' }}>
                      <strong style={{ fontSize: 12, display: 'block' }}>Jane Doe</strong>
                      <span style={{ fontSize: 10, color: '#71717b' }}>Super Admin</span>
                    </div>
                    <button 
                      onClick={() => { setCurrentTab('Settings'); setShowProfileMenu(false); }}
                      style={{
                        padding: '10px 16px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        borderBottom: '1px solid #f4f1eb'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f4f1eb'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => triggerToast('Connecting to Help Center...')}
                      style={{
                        padding: '10px 16px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        borderBottom: '1px solid #f4f1eb'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f4f1eb'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Support Center
                    </button>
                    <button 
                      onClick={() => window.location.href = '/'}
                      style={{
                        padding: '10px 16px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#e63946',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff5f5'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── 3. MAIN TAB SWITCHER INNER CONTENT ── */}
        <main style={{
          flex: 1,
          padding: '40px 32px',
          overflowY: 'auto'
        }}>
          
          {/* TAB: DASHBOARD OVERVIEW */}
          {currentTab === 'Dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              
              {/* SECTION 1: OVERVIEW STAT CARDS */}
              <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 24
              }}>
                {/* CARD 1: Total Sales */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', color: '#71717b' }}>Total Sales</span>
                    <div style={{
                      backgroundColor: '#e6f4ea',
                      border: '1.5px solid #16a34a',
                      padding: '4px 8px',
                      borderRadius: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <TrendingUp size={12} color="#16a34a" />
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#16a34a' }}>+12.4%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#000000'
                    }}>
                      $124,592.00
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 500 }}>vs. last month ($110,840.00)</span>
                  </div>
                </div>

                {/* CARD 2: Total Orders */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', color: '#71717b' }}>Total Orders</span>
                    <div style={{
                      backgroundColor: '#e6f4ea',
                      border: '1.5px solid #16a34a',
                      padding: '4px 8px',
                      borderRadius: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <TrendingUp size={12} color="#16a34a" />
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#16a34a' }}>+8.2%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#000000'
                    }}>
                      1,842
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 700 }}>
                      <strong style={{ color: '#000000' }}>48</strong> completed today
                    </span>
                  </div>
                </div>

                {/* CARD 3: Total Customers */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', color: '#71717b' }}>Total Customers</span>
                    <div style={{
                      backgroundColor: '#e6f4ea',
                      border: '1.5px solid #16a34a',
                      padding: '4px 8px',
                      borderRadius: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <TrendingUp size={12} color="#16a34a" />
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#16a34a' }}>+14.5%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#000000'
                    }}>
                      12,450
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 700 }}>
                      <strong style={{ color: '#000000' }}>342</strong> new this month
                    </span>
                  </div>
                </div>

                {/* CARD 4: Total Products */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', color: '#71717b' }}>Total Products</span>
                    <div style={{
                      backgroundColor: '#fef3c7',
                      border: '1.5px solid #ca8a04',
                      padding: '4px 8px',
                      borderRadius: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <AlertTriangle size={12} color="#ca8a04" />
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#ca8a04' }}>{stockAlerts.length} Alerts</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#000000'
                    }}>
                      840
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 500 }}>
                      12 newly added • <span style={{ color: '#e63946', fontWeight: 700 }}>{stockAlerts.length} Restocks needed</span>
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION 2: REVENUE ANALYTICS PANEL & CHART */}
              <section style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                padding: 32
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 20,
                  marginBottom: 32
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h2 style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 22,
                      fontWeight: 900,
                      letterSpacing: '-0.01em',
                      margin: 0
                    }}>
                      Revenue Trends & Analytics
                    </h2>
                    <p style={{ fontSize: 12, color: '#71717b', fontWeight: 500 }}>
                      Sales comparisons and store revenue forecasts
                    </p>
                  </div>

                  {/* Period Filter Buttons */}
                  <div style={{ display: 'flex', border: '2px solid #000000', padding: 2, backgroundColor: '#ffffff' }}>
                    {['Daily', 'Weekly', 'Monthly'].map(period => (
                      <button
                        key={period}
                        onClick={() => {
                          setChartFilter(period);
                          setHoveredDataPoint(null);
                        }}
                        style={{
                          padding: '6px 16px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          backgroundColor: chartFilter === period ? '#000000' : 'transparent',
                          color: chartFilter === period ? '#ffffff' : '#000000',
                          transition: 'all 0.1s'
                        }}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Revenue Chart */}
                <div style={{ position: 'relative', width: '100%', height: 300, borderBottom: '2px solid #000000', borderLeft: '2px solid #000000', paddingLeft: 10, paddingTop: 10 }}>
                  
                  {/* Grid Lines */}
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', borderBottom: '1px dashed #e4e4e7', height: 1, zIndex: 1 }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderBottom: '1px dashed #e4e4e7', height: 1, zIndex: 1 }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', borderBottom: '1px dashed #e4e4e7', height: 1, zIndex: 1 }} />

                  {/* SVG Chart Graphic */}
                  <svg width="100%" height="100%" style={{ overflow: 'visible', zIndex: 2, position: 'relative' }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f5af19" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#f5af19" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* SVG Line / Path generation */}
                    {(() => {
                      const count = currentPoints.length;
                      const segmentWidth = 100 / (count - 1);
                      
                      // Calculate path coords
                      const coords = currentPoints.map((pt, i) => {
                        const x = `${i * segmentWidth}%`;
                        // Keep a minimum margin for top and bottom spacing
                        const y = 290 - (pt.revenue / maxRevenue) * 230;
                        return { x, y };
                      });

                      // Construct d string for path
                      let pathD = `M ${coords[0].x} ${coords[0].y}`;
                      for (let i = 1; i < coords.length; i++) {
                        pathD += ` L ${coords[i].x} ${coords[i].y}`;
                      }

                      // Construct area closed path string
                      const areaD = `${pathD} L 100% 290 L 0% 290 Z`;

                      return (
                        <>
                          {/* Gradient Fill under line */}
                          <path d={areaD} fill="url(#chartGradient)" />

                          {/* Main Stroke Line */}
                          <path d={pathD} fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

                          {/* Coordinate Points */}
                          {coords.map((co, i) => (
                            <g key={i}>
                              {/* Hover trigger circle */}
                              <circle
                                cx={co.x}
                                cy={co.y}
                                r={hoveredDataPoint === i ? 7 : 5}
                                fill={hoveredDataPoint === i ? '#f5af19' : '#000000'}
                                stroke="#ffffff"
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                                onMouseEnter={() => setHoveredDataPoint(i)}
                                onMouseLeave={() => setHoveredDataPoint(null)}
                              />
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Interactive Dynamic Hover Tooltip inside SVG wrapper */}
                  {hoveredDataPoint !== null && (
                    <div style={{
                      position: 'absolute',
                      left: `${(hoveredDataPoint / (currentPoints.length - 1)) * 90 + 3}%`,
                      top: 290 - (currentPoints[hoveredDataPoint].revenue / maxRevenue) * 230 - 75,
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      padding: '8px 12px',
                      border: '1.5px solid #ffffff',
                      boxShadow: '3px 3px 0px #f5af19',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      pointerEvents: 'none'
                    }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {currentPoints[hoveredDataPoint].label} Revenue
                      </span>
                      <strong style={{ fontSize: 13, color: '#f5af19', fontFamily: 'monospace' }}>
                        ${currentPoints[hoveredDataPoint].revenue.toLocaleString()}
                      </strong>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>
                        Orders: {currentPoints[hoveredDataPoint].orders}
                      </span>
                    </div>
                  )}
                </div>

                {/* X Axis Labels */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  paddingLeft: 10
                }}>
                  {currentPoints.map((pt, i) => (
                    <span key={i} style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>
                      {pt.label}
                    </span>
                  ))}
                </div>
              </section>

              {/* SECTION 3: TOP SELLING PRODUCTS & CUSTOMER INSIGHTS WIDGETS */}
              <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 32
              }}>
                {/* 3a. Top Selling Products */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900 }}>
                      Top Selling Products
                    </h3>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#f5af19', border: '1.5px solid #000000', padding: '3px 8px', backgroundColor: '#000000' }}>
                      This Season
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #000000' }}>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800 }}>Product</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800 }}>Category</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800, textAlign: 'right' }}>Sold</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800, textAlign: 'right' }}>Revenue</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800, textAlign: 'center' }}>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid #f4f1eb' }}>
                            <td style={{ padding: '12px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', border: '1px solid #000000' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a' }}>{p.name}</span>
                                  <span style={{ fontSize: 9, color: '#71717b', fontFamily: 'monospace' }}>{p.id}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 8px', fontSize: 11, color: '#71717b', fontWeight: 600 }}>{p.category}</td>
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 700, color: '#0a0a0a', textAlign: 'right' }}>{p.sold}</td>
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 800, color: '#0a0a0a', textAlign: 'right' }}>${p.revenue.toLocaleString()}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 60, height: 6, backgroundColor: '#f4f1eb', border: '1px solid #000000' }}>
                                  <div style={{ width: `${p.popularity}%`, height: '100%', backgroundColor: '#f5af19' }} />
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 800, color: '#000000' }}>{p.popularity}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3b. Customer Insights & Activity timeline */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20
                }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900 }}>
                    Customer Insights
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
                    {/* SVG Donut Chart */}
                    <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f1eb" strokeWidth="15" />
                        
                        {/* Segment 1: New Customers (65%) */}
                        {/* Circumference = 2 * pi * r = 2 * 3.14 * 40 = 251.2 */}
                        {/* 65% of 251.2 = 163.28 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#000000"
                          strokeWidth="15"
                          strokeDasharray="251.2"
                          strokeDashoffset="87.92" // offset to start (35% of 251.2)
                          transform="rotate(-90 50 50)"
                          style={{ cursor: 'pointer', transition: 'stroke-width 0.15s ease' }}
                          onMouseEnter={() => setHoveredDonutSegment(0)}
                          onMouseLeave={() => setHoveredDonutSegment(null)}
                        />

                        {/* Segment 2: Returning Customers (35%) */}
                        {/* 35% of 251.2 = 87.92 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#f5af19"
                          strokeWidth="15"
                          strokeDasharray="251.2"
                          strokeDashoffset="251.2" // offset
                          transform="rotate(144 50 50)" // 144 deg = 360 * 0.40 approx
                          style={{ cursor: 'pointer', transition: 'stroke-width 0.15s ease' }}
                          onMouseEnter={() => setHoveredDonutSegment(1)}
                          onMouseLeave={() => setHoveredDonutSegment(null)}
                        />
                      </svg>

                      {/* Donut Center text */}
                      <div style={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'monospace' }}>
                          {hoveredDonutSegment === 0 ? '65%' : hoveredDonutSegment === 1 ? '35%' : '12.4K'}
                        </span>
                        <span style={{ fontSize: 8, textTransform: 'uppercase', color: '#71717b', fontWeight: 800 }}>
                          {hoveredDonutSegment === 0 ? 'New' : hoveredDonutSegment === 1 ? 'Returning' : 'Total'}
                        </span>
                      </div>
                    </div>

                    {/* Donut Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                      {donutSegments.map((seg, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 4, 
                            padding: 8,
                            backgroundColor: hoveredDonutSegment === idx ? '#f4f1eb' : 'transparent',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 10, height: 10, backgroundColor: seg.color, border: '1px solid #000000' }} />
                            <span style={{ fontSize: 11, fontWeight: 700 }}>{seg.label}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>{seg.value}</span>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#71717b' }}>{seg.percentage}% of total</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Activity Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #f4f1eb', paddingTop: 20 }}>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', color: '#71717b' }}>
                      Customer Growth & Activity
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <ArrowUpRight size={14} color="#16a34a" style={{ marginTop: 2 }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 11, fontWeight: 700 }}>Registration rate spiked +24%</span>
                          <span style={{ fontSize: 9, color: '#71717b' }}>June 22, 14:20 • Campaigns: Organic Search</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <ArrowUpRight size={14} color="#16a34a" style={{ marginTop: 2 }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 11, fontWeight: 700 }}>Retention rate increased to 74.2%</span>
                          <span style={{ fontSize: 9, color: '#71717b' }}>June 21, 10:15 • Promotions: VIPBLOOM Coupon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: RECENT ORDERS & STOCK ALERTS */}
              <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 32
              }}>
                {/* 4a. Recent Orders Table */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900 }}>
                      Recent Orders
                    </h3>
                    <button 
                      onClick={() => setCurrentTab('Orders')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#000000',
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      View All <ChevronRight size={12} />
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #000000' }}>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800 }}>Order ID</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800 }}>Customer</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800, textAlign: 'center' }}>Items</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800, textAlign: 'right' }}>Total</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800, textAlign: 'center' }}>Status</th>
                          <th style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 8px', color: '#71717b', fontWeight: 800, textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} style={{ borderBottom: '1px solid #f4f1eb' }}>
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 700, color: '#000000', fontFamily: 'monospace' }}>{order.id}</td>
                            <td style={{ padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#0a0a0a' }}>{order.customer}</td>
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 600, color: '#71717b', textAlign: 'center' }}>{order.count}</td>
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 800, color: '#000000', textAlign: 'right' }}>${order.total.toFixed(2)}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                              <span style={{
                                fontSize: 9,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                padding: '3px 8px',
                                border: '1px solid currentColor',
                                color: order.delivery === 'Delivered' ? '#16a34a' : order.delivery === 'Shipped' ? '#4361ee' : order.delivery === 'Processing' ? '#ca8a04' : '#e63946'
                              }}>
                                {order.delivery}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                style={{
                                  padding: '4px 8px',
                                  border: '1.5px solid #000000',
                                  backgroundColor: 'transparent',
                                  color: '#000000',
                                  cursor: 'pointer',
                                  fontSize: 9,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#ffffff'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000000'; }}
                              >
                                <Eye size={10} /> Quick View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4b. Low Stock Alerts */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900 }}>
                      Low Stock Alerts
                    </h3>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#e63946', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Restock Immediately
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {stockAlerts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0', border: '1px dashed #000000', color: '#71717b', fontSize: 12, fontWeight: 600 }}>
                        All products are sufficiently stocked!
                      </div>
                    ) : (
                      stockAlerts.map(item => (
                        <div key={item.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 12,
                          backgroundColor: '#faf9f6',
                          border: '1.5px solid #000000'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', border: '1px solid #000000' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <strong style={{ fontSize: 12 }}>{item.name}</strong>
                              <span style={{ fontSize: 10, color: '#71717b', fontFamily: 'monospace' }}>SKU: {item.sku}</span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                              <span style={{
                                fontSize: 9,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                padding: '2px 6px',
                                backgroundColor: item.status === 'Critical' ? '#fee2e2' : '#fef3c7',
                                color: item.status === 'Critical' ? '#dc2626' : '#ca8a04',
                                border: `1px solid ${item.status === 'Critical' ? '#dc2626' : '#ca8a04'}`
                              }}>
                                {item.quantity} Left ({item.status})
                              </span>
                            </div>
                            <button
                              onClick={() => handleRestock(item.id, item.name)}
                              style={{
                                padding: '6px 12px',
                                border: '1.5px solid #000000',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                cursor: 'pointer',
                                fontSize: 10,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                boxShadow: '2px 2px 0px #000000'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5af19'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #000000'; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px #000000'; }}
                            >
                              Restock
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 5: QUICK ACTIONS PANEL & SALES SUMMARY */}
              <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 32
              }}>
                {/* 5a. Quick Actions Panel */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900 }}>
                    Quick Actions Panel
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 12
                  }}>
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '3px 3px 0px #000000'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5af19'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <Plus size={14} /> Add Product
                    </button>
                    <button
                      onClick={() => setCurrentTab('Orders')}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '3px 3px 0px #000000'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5af19'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <ShoppingBag size={14} /> Manage Orders
                    </button>
                    <button
                      onClick={() => setCurrentTab('Customers')}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '3px 3px 0px #000000'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5af19'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <Users size={14} /> Manage Users
                    </button>
                    <button
                      onClick={() => setShowCreateCouponModal(true)}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '3px 3px 0px #000000'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5af19'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <Percent size={14} /> Create Coupon
                    </button>
                    <button
                      onClick={() => setCurrentTab('Reports & Analytics')}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '3px 3px 0px #000000'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5af19'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <FileText size={14} /> View Reports
                    </button>
                    <button
                      onClick={() => { setCurrentTab('Inventory'); triggerToast('Loading inventory counts...'); }}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '3px 3px 0px #000000'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5af19'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <RefreshCw size={14} /> Update Stock
                    </button>
                  </div>
                </div>

                {/* 5b. Sales Summary Widget */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900 }}>
                    Sales Period Summary
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #f4f1eb' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Today's Sales</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>$13,200.00</span>
                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>+4.2%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #f4f1eb' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Weekly Sales</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>$46,892.00</span>
                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>+8.1%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #f4f1eb' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Monthly Sales</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>$174,592.00</span>
                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>+12.4%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Annual Sales</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>$1,894,500.00</span>
                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>+18.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {currentTab === 'Products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Product Directory</h2>
                  <p style={{ fontSize: 12, color: '#71717b' }}>Create, update, and manage your fashion items.</p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #000000',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: 11,
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px #f5af19',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <Plus size={14} /> Add New Product
                </button>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000000' }}>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Image</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Product Name</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Category</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Stock Level</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Units Sold</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Popularity</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f4f1eb' }}>
                        <td style={{ padding: 12 }}>
                          <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', border: '1px solid #000000' }} />
                        </td>
                        <td style={{ padding: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: 13 }}>{p.name}</strong>
                            <span style={{ fontSize: 10, color: '#71717b', fontFamily: 'monospace' }}>ID: {p.id}</span>
                          </div>
                        </td>
                        <td style={{ padding: 12, fontSize: 12, color: '#71717b', fontWeight: 600 }}>{p.category}</td>
                        <td style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>
                          <span style={{ color: p.stock <= 5 ? '#e63946' : '#000000' }}>
                            {p.stock} units
                          </span>
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{p.sold}</td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 800 }}>{p.popularity}%</span>
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button onClick={() => triggerToast(`Editing "${p.name}"...`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717b' }}><Edit size={14} /></button>
                            <button onClick={() => { setProducts(prev => prev.filter(item => item.id !== p.id)); triggerToast(`Deleted "${p.name}"`); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e63946' }}><Trash size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {currentTab === 'Orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Customer Orders</h2>
                <p style={{ fontSize: 12, color: '#71717b' }}>Track client receipts, fulfillment, and returns.</p>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000000' }}>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Order ID</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Customer Name</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Date Recieved</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Item Count</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Total Amount</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Payment</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Delivery Status</th>
                      <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f4f1eb' }}>
                        <td style={{ padding: 12, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{order.id}</td>
                        <td style={{ padding: 12, fontSize: 13, fontWeight: 600 }}>{order.customer}</td>
                        <td style={{ padding: 12, fontSize: 12, color: '#71717b' }}>{order.date}</td>
                        <td style={{ padding: 12, fontSize: 12, textAlign: 'center' }}>{order.count} items</td>
                        <td style={{ padding: 12, fontSize: 12, fontWeight: 800, textAlign: 'right' }}>${order.total.toFixed(2)}</td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '3px 8px',
                            border: '1.5px solid #000000',
                            backgroundColor: order.payment === 'Paid' ? '#e6f4ea' : '#fee2e2',
                            color: order.payment === 'Paid' ? '#16a34a' : '#dc2626'
                          }}>
                            {order.payment}
                          </span>
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <span style={{
                            fontSize: 9,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            border: '1px solid currentColor',
                            color: order.delivery === 'Delivered' ? '#16a34a' : order.delivery === 'Shipped' ? '#4361ee' : order.delivery === 'Processing' ? '#ca8a04' : '#e63946'
                          }}>
                            {order.delivery}
                          </span>
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              padding: '6px 12px',
                              border: '1.5px solid #000000',
                              backgroundColor: 'transparent',
                              color: '#000000',
                              cursor: 'pointer',
                              fontSize: 10,
                              fontWeight: 800,
                              textTransform: 'uppercase'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000000'; }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: INVENTORY */}
          {currentTab === 'Inventory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Stock & Inventory Alerts</h2>
                <p style={{ fontSize: 12, color: '#71717b' }}>Check warehouse logs, remaining pieces, and replenish alerts.</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: 32,
                alignItems: 'flex-start'
              }}>
                {/* Left side alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Critical Stock Levels</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {stockAlerts.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid #f4f1eb' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: 12 }}>{item.name}</strong>
                            <span style={{ fontSize: 9, color: '#71717b', fontFamily: 'monospace' }}>SKU: {item.sku}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#dc2626' }}>{item.quantity} Left</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side logs */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Full Inventory Stock</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {products.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#faf9f6', border: '1px solid #000000' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', border: '1px solid #000000' }} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: 12 }}>{p.name}</strong>
                            <span style={{ fontSize: 10, color: '#71717b' }}>{p.category}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                          <span style={{ fontSize: 12, fontWeight: 800 }}>{p.stock} units</span>
                          <button
                            onClick={() => {
                              setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: item.stock + 20 } : item));
                              triggerToast(`Added 20 units to "${p.name}"`);
                            }}
                            style={{
                              padding: '4px 10px',
                              border: '1.5px solid #000000',
                              backgroundColor: '#ffffff',
                              fontSize: 9,
                              fontWeight: 800,
                              cursor: 'pointer',
                              textTransform: 'uppercase'
                            }}
                          >
                            +20 Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS & COMING SOON FALLBACKS */}
          {!['Dashboard', 'Products', 'Orders', 'Inventory'].includes(currentTab) && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              padding: 48,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20
            }}>
              <Shield size={48} color="#f5af19" />
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900 }}>
                {currentTab} Panel
              </h2>
              <p style={{ fontSize: 14, color: '#71717b', maxWidth: 400, lineHeight: '1.6' }}>
                The administrative panel for "{currentTab}" is currently synchronized with the BLOOMAIR back-end. Fully functional CRUD hooks will be enabled shortly.
              </p>
              <button
                onClick={() => setCurrentTab('Dashboard')}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #000000',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0px #f5af19'
                }}
              >
                Return to Dashboard
              </button>
            </div>
          )}

        </main>
      </div>

      {/* ── 4. QUICK VIEW MODAL (ORDER DETAIL) ── */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '3px solid #000000',
            boxShadow: '8px 8px 0px #000000',
            width: '100%',
            maxWidth: 550,
            padding: 32,
            position: 'relative',
            animation: 'scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) both'
          }}>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000000'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderBottom: '2px solid #000000', paddingBottom: 16 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#f5af19', backgroundColor: '#000000', padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fulfillment Ticket
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900, marginTop: 12 }}>
                  Order {selectedOrder.id}
                </h3>
                <span style={{ fontSize: 11, color: '#71717b' }}>Placed on {selectedOrder.date}</span>
              </div>

              {/* Customer summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4f1eb', paddingBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#71717b', fontWeight: 800 }}>Customer</span>
                  <strong style={{ fontSize: 13 }}>{selectedOrder.customer}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#71717b', fontWeight: 800 }}>Payment Status</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#16a34a' }}>{selectedOrder.payment}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#71717b', fontWeight: 800 }}>Purchased Items</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#faf9f6', padding: '10px 16px', border: '1px solid #000000' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#f5af19' }}>{item.qty}x</span>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Billing */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #000000', paddingTop: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 800 }}>Total Order Value</span>
                <strong style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 900, color: '#000000' }}>
                  ${selectedOrder.total.toFixed(2)}
                </strong>
              </div>

              {/* Shipping Status updates */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => {
                    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, delivery: 'Delivered' } : o));
                    setSelectedOrder(prev => ({ ...prev, delivery: 'Delivered' }));
                    triggerToast(`Order ${selectedOrder.id} marked as DELIVERED.`);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    border: '2px solid #000000',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => {
                    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, delivery: 'Shipped' } : o));
                    setSelectedOrder(prev => ({ ...prev, delivery: 'Shipped' }));
                    triggerToast(`Order ${selectedOrder.id} status set to SHIPPED.`);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    border: '2px solid #000000',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Mark as Shipped
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. ADD PRODUCT MODAL ── */}
      {showAddProductModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <form 
            onSubmit={handleAddProductSubmit}
            style={{
              backgroundColor: '#ffffff',
              border: '3px solid #000000',
              boxShadow: '8px 8px 0px #000000',
              width: '100%',
              maxWidth: 450,
              padding: 32,
              position: 'relative',
              animation: 'scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) both'
            }}
          >
            <button 
              type="button"
              onClick={() => setShowAddProductModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000000'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900, marginBottom: 24, borderBottom: '2px solid #000000', paddingBottom: 12 }}>
              Add New Product
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Product Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Slip Dress"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    border: '2px solid #000000',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  required
                />
              </div>

              {/* Category selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    border: '2px solid #000000',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Pants">Pants</option>
                </select>
              </div>

              {/* Pricing & Stock Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Stock Level</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      fontSize: 13,
                      border: '2px solid #000000',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Retail Price ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 185"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      fontSize: 13,
                      border: '2px solid #000000',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  marginTop: 12,
                  padding: '12px 24px',
                  border: '2px solid #000000',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0px #f5af19'
                }}
              >
                Publish Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 6. CREATE COUPON MODAL ── */}
      {showCreateCouponModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <form 
            onSubmit={handleCreateCouponSubmit}
            style={{
              backgroundColor: '#ffffff',
              border: '3px solid #000000',
              boxShadow: '8px 8px 0px #000000',
              width: '100%',
              maxWidth: 450,
              padding: 32,
              position: 'relative',
              animation: 'scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) both'
            }}
          >
            <button 
              type="button"
              onClick={() => setShowCreateCouponModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000000'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900, marginBottom: 24, borderBottom: '2px solid #000000', paddingBottom: 12 }}>
              Create Promotional Coupon
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Coupon Code */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. BLOOMWINTER"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    border: '2px solid #000000',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  required
                />
              </div>

              {/* Discount Value */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Discount Value (e.g. 15% or 20)</label>
                <input
                  type="text"
                  placeholder="e.g. 15%"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    border: '2px solid #000000',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  required
                />
              </div>

              {/* Coupon log overview */}
              <div style={{ backgroundColor: '#faf9f6', padding: 12, border: '1px solid #000000', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Active Promotions ({coupons.length})</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {coupons.map((c, i) => (
                    <span key={i} style={{ fontSize: 10, fontWeight: 700, border: '1px solid #000000', padding: '2px 6px', backgroundColor: '#ffffff' }}>
                      {c.code} ({c.discount})
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  marginTop: 12,
                  padding: '12px 24px',
                  border: '2px solid #000000',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0px #f5af19'
                }}
              >
                Generate Code
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
