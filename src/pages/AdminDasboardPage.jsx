import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Package, ShoppingBag, 
  DollarSign, Calendar, Search, Bell, Mail, ChevronDown, 
  Plus, Edit, Trash, Settings, LogOut, CheckCircle, Clock, 
  RefreshCw, Star, Percent, BarChart2, Shield, MessageSquare, 
  AlertTriangle, X, FileText, Menu, ChevronRight, Filter, 
  ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const fmt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '0';
  return Math.round(Number(n)).toLocaleString('en-LK');
};

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
  };  // State Management
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

  // Toast system
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Dynamic Dashboard States ---
  
  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ba_admin_settings');
    return saved ? JSON.parse(saved) : { lowStockThreshold: 5, currency: 'LKR', name: 'Jane Doe', email: 'jane.doe@bloomair.io', phone: '+94 77 123 4567' };
  });

  useEffect(() => {
    localStorage.setItem('ba_admin_settings', JSON.stringify(settings));
  }, [settings]);

  // Base products from Supabase
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (data) {
          setDbProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProductsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Products overrides (Added, Updated, Deleted)
  const [productsOverride, setProductsOverride] = useState(() => {
    const saved = localStorage.getItem('ba_admin_products_override');
    return saved ? JSON.parse(saved) : { added: [], updated: {}, deleted: [] };
  });

  useEffect(() => {
    localStorage.setItem('ba_admin_products_override', JSON.stringify(productsOverride));
  }, [productsOverride]);

  // Compute final product list
  const products = useMemo(() => {
    const mappedDb = dbProducts.map(p => {
      const override = productsOverride.updated[p.id] || {};
      const sold = override.sold !== undefined ? override.sold : Math.floor((parseInt(p.id.substring(0, 4), 16) || 12) % 150) + 10;
      const stock = override.stock !== undefined ? override.stock : Math.floor((parseInt(p.id.substring(0, 4), 16) || 42) % 45) + 12;
      return {
        id: p.id,
        name: p.name,
        category: p.category || p.gender_category || 'Clothing',
        subcategory: p.subcategory || 'Fashion',
        sold: sold,
        revenue: sold * p.price_lkr,
        popularity: Math.min(100, Math.round((sold / 180) * 100)),
        image: p.images_array?.[0] || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60',
        stock: stock,
        price: p.price_lkr,
        originalPrice: p.original_price,
        tag: p.tag
      };
    });

    const activeDb = mappedDb.filter(p => !productsOverride.deleted.includes(p.id));

    const activeWithUpdates = activeDb.map(p => {
      const override = productsOverride.updated[p.id];
      if (override) {
        return {
          ...p,
          ...override,
          revenue: (override.sold ?? p.sold) * (override.price ?? p.price)
        };
      }
      return p;
    });

    const mappedAdded = productsOverride.added.map(p => {
      const sold = p.sold || 0;
      return {
        ...p,
        sold: sold,
        revenue: sold * p.price,
        popularity: 0
      };
    });

    return [...mappedAdded, ...activeWithUpdates];
  }, [dbProducts, productsOverride]);

  // Orders list
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ba_profile_orders_v2');
    if (saved) return JSON.parse(saved);

    const initial = [
      { id: 'ORD-1084', customer: 'Emily Stone', count: 2, date: '2026-06-22', total: 28500, payment: 'Paid', paymentMethod: 'Visa ending in 4242', delivery: 'Processing', status: 'Processing', address: '45, Queen Street, Colombo 03', items: [{ name: 'Silk Slip Dress', qty: 1, price: 18500, size: 'S', color: 'Default', category: 'Dresses', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60' }, { name: 'Wrap Midi Dress', qty: 1, price: 10000, size: 'M', color: 'Default', category: 'Dresses', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60' }] },
      { id: 'ORD-1083', customer: 'Liam Davis', count: 1, date: '2026-06-22', total: 14500, payment: 'Paid', paymentMethod: 'Apple Pay', delivery: 'Shipped', status: 'Shipped', address: '12, Flower Road, Colombo 07', items: [{ name: 'Classic Leather Boots', qty: 1, price: 14500, size: '42', color: 'Brown', category: 'Shoes', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=150&auto=format&fit=crop&q=60' }] },
      { id: 'ORD-1082', customer: 'Olivia Wilson', count: 3, date: '2026-06-21', total: 42000, payment: 'Paid', paymentMethod: 'Mastercard ending in 9876', delivery: 'Delivered', status: 'Delivered', address: 'Level 14, WTC, Colombo 01', items: [{ name: 'Classic Black Blazer', qty: 2, price: 13000, size: 'M', color: 'Black', category: 'Outerwear', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60' }, { name: 'Gold Drop Earrings', qty: 1, price: 16000, size: 'One Size', color: 'Gold', category: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60' }] },
      { id: 'ORD-1081', customer: 'Noah Thomas', count: 1, date: '2026-06-20', total: 8900, payment: 'Refunded', paymentMethod: 'Visa ending in 1111', delivery: 'Cancelled', status: 'Cancelled', address: '23, Galle Road, Mount Lavinia', items: [{ name: 'Linen Summer Shirt', qty: 1, price: 8900, size: 'L', color: 'White', category: 'Clothing', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=60' }] },
      { id: 'ORD-1080', customer: 'Sophia Martinez', count: 2, date: '2026-06-20', total: 19500, payment: 'Paid', paymentMethod: 'Visa ending in 8888', delivery: 'Delivered', status: 'Delivered', address: '8, Kandy Road, Kadawatha', items: [{ name: 'Leather Crossbody Bag', qty: 1, price: 12000, size: 'One Size', color: 'Tan', category: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60' }, { name: 'Wide Brim Straw Hat', qty: 1, price: 7500, size: 'One Size', color: 'Natural', category: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60' }] }
    ];
    localStorage.setItem('ba_profile_orders_v2', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('ba_profile_orders_v2', JSON.stringify(orders));
  }, [orders]);

  // Transactions ledger
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ba_admin_transactions');
    if (saved) return JSON.parse(saved);

    const initial = [
      { id: 'TXN-984021', orderId: 'ORD-1084', customer: 'Emily Stone', amount: 28500, method: 'Visa ending in 4242', date: '2026-06-22', status: 'Completed' },
      { id: 'TXN-983084', orderId: 'ORD-1083', customer: 'Liam Davis', amount: 14500, method: 'Apple Pay', date: '2026-06-22', status: 'Completed' },
      { id: 'TXN-982057', orderId: 'ORD-1082', customer: 'Olivia Wilson', amount: 42000, method: 'Mastercard ending in 9876', date: '2026-06-21', status: 'Completed' },
      { id: 'TXN-980012', orderId: 'ORD-1080', customer: 'Sophia Martinez', amount: 19500, method: 'Visa ending in 8888', date: '2026-06-20', status: 'Completed' }
    ];
    localStorage.setItem('ba_admin_transactions', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('ba_admin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Low stock alerts dynamically computed
  const stockAlerts = useMemo(() => {
    return products
      .filter(p => p.stock <= settings.lowStockThreshold)
      .map(p => ({
        id: p.id,
        name: p.name,
        sku: `SSD-${p.category.substring(0, 2).toUpperCase()}-${p.id.substring(0, 4).toUpperCase()}`,
        image: p.image,
        quantity: p.stock,
        status: p.stock <= 2 ? 'Critical' : 'Warning'
      }));
  }, [products, settings.lowStockThreshold]);

  // Coupons
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('ba_admin_coupons');
    if (saved) return JSON.parse(saved);

    const initial = [
      { code: 'SUMMER20', discount: '20%', status: 'Active', usage: '142 times' },
      { code: 'WELCOME10', discount: '10%', status: 'Active', usage: '512 times' },
      { code: 'VIPBLOOM', discount: '25%', status: 'Expired', usage: '88 times' }
    ];
    localStorage.setItem('ba_admin_coupons', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('ba_admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ba_admin_notifications');
    if (saved) return JSON.parse(saved);

    const initial = [
      { id: 1, message: 'Low stock alert: Silk Slip Dress is under 5 units.', time: '10m ago', unread: true },
      { id: 2, message: 'New order #ORD-1084 received from Emily Stone.', time: '45m ago', unread: true },
      { id: 3, message: 'Payment confirmation: Order #ORD-1082 ($420.00).', time: '2h ago', unread: false }
    ];
    localStorage.setItem('ba_admin_notifications', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('ba_admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Messages
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ba_admin_messages');
    if (saved) return JSON.parse(saved);

    const initial = [
      { id: 1, sender: 'Support Team', text: 'Hey, is the silk dress restocked?', time: '1h ago', unread: true },
      { id: 2, sender: 'Inventory Manager', text: 'Classic leather boots details updated.', time: '4h ago', unread: false }
    ];
    localStorage.setItem('ba_admin_messages', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('ba_admin_messages', JSON.stringify(messages));
  }, [messages]);

  // Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('ba_profile_reviews_v2');
    if (saved) return JSON.parse(saved);

    const initial = [
      { id: 'rev_1', name: 'Luxe Silk Evening Gown', rating: 5, date: 'June 24, 2026', comment: 'Absolutely stunning! The silhouette is so graceful and fits like a dream.' },
      { id: 'rev_2', name: 'Urban Street Hoodie', rating: 4, date: 'June 23, 2026', comment: 'Super comfortable fabric, though it runs slightly larger than regular size.' }
    ];
    localStorage.setItem('ba_profile_reviews_v2', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('ba_profile_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  // Staff members
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('ba_admin_staff');
    if (saved) return JSON.parse(saved);

    const initial = [
      { id: 'STF-01', name: 'Jane Doe', email: 'jane.doe@bloomair.io', role: 'Super Admin', status: 'Active' },
      { id: 'STF-02', name: 'Mark Wilson', email: 'mark.w@bloomair.io', role: 'Inventory Manager', status: 'Active' },
      { id: 'STF-03', name: 'Alex Carter', email: 'alex.c@bloomair.io', role: 'Support Staff', status: 'Active' }
    ];
    localStorage.setItem('ba_admin_staff', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('ba_admin_staff', JSON.stringify(staff));
  }, [staff]);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Clothing',
    subcategory: 'Dresses',
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

  // Edit Product Modal State
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New Staff Member State
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Support Staff',
    status: 'Active'
  });

  // Handle actions
  const handleRestock = (productId, name) => {
    // Restock 20 units
    setProductsOverride(prev => {
      const updated = { ...prev.updated };
      const currentVal = products.find(p => p.id === productId);
      const prevStock = currentVal ? currentVal.stock : 0;
      updated[productId] = {
        ...(updated[productId] || {}),
        stock: prevStock + 20
      };
      return { ...prev, updated };
    });
    triggerToast(`Successfully restocked 20 units of "${name}"!`);
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.stock || !newProduct.price) {
      triggerToast('Please fill in all product fields!');
      return;
    }
    const createdId = `PRD-ADD-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = {
      id: createdId,
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      sold: 0,
      stock: parseInt(newProduct.stock),
      price: parseFloat(newProduct.price),
      image: newProduct.image
    };
    
    setProductsOverride(prev => ({
      ...prev,
      added: [created, ...prev.added]
    }));
    setShowAddProductModal(false);
    setNewProduct({ name: '', category: 'Clothing', subcategory: 'Dresses', stock: '', price: '', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60' });
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

  const handleEditProductClick = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || 'Fashion',
      stock: product.stock.toString(),
      price: product.price.toString(),
      image: product.image
    });
    setShowEditProductModal(true);
  };

  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.stock || !editingProduct.price) {
      triggerToast('Please fill in all product fields!');
      return;
    }
    setProductsOverride(prev => {
      const updated = { ...prev.updated };
      updated[editingProduct.id] = {
        ...(updated[editingProduct.id] || {}),
        name: editingProduct.name,
        category: editingProduct.category,
        subcategory: editingProduct.subcategory,
        stock: parseInt(editingProduct.stock),
        price: parseFloat(editingProduct.price),
        image: editingProduct.image
      };
      return { ...prev, updated };
    });
    setShowEditProductModal(false);
    setEditingProduct(null);
    triggerToast(`Product "${editingProduct.name}" updated successfully!`);
  };

  const handleDeleteProduct = (productId, name) => {
    setProductsOverride(prev => ({
      ...prev,
      deleted: [...prev.deleted, productId]
    }));
    triggerToast(`Product "${name}" deleted!`);
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) {
      triggerToast('Please fill in all staff fields!');
      return;
    }
    const created = {
      id: `STF-${Math.floor(10 + Math.random() * 90)}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      status: newStaff.status
    };
    setStaff([...staff, created]);
    setNewStaff({ name: '', email: '', role: 'Support Staff', status: 'Active' });
    triggerToast(`Staff member "${created.name}" added successfully!`);
  };

  const handleDeleteStaff = (staffId, name) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    triggerToast(`Staff member "${name}" removed!`);
  };

  const handleToggleStaffStatus = (staffId) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    triggerToast(`Staff status updated.`);
  };

  const handleDeleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    triggerToast(`Coupon "${code}" deleted!`);
  };

  const handleToggleCouponStatus = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, status: c.status === 'Active' ? 'Expired' : 'Active' } : c));
    triggerToast(`Coupon status updated.`);
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    triggerToast('Review deleted!');
  };

  const handleDeleteNotification = (notifyId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifyId));
  };

  const clearUnreadNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearUnreadMessages = () => {
    setMessages(prev => prev.map(m => ({ ...m, unread: false })));
  };

  // Dynamic Chart Data generated based on real orders
  const dynamicChartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Daily (last 7 days)
    const dailyPoints = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(o => o.date === dateStr && o.delivery !== 'Cancelled');
      const rev = dayOrders.reduce((sum, o) => sum + o.total, 0);
      const count = dayOrders.length;
      return { label: dayName, revenue: rev || (1500 + i * 200), orders: count || (i % 2 + 1) };
    });

    // Weekly (last 4 weeks)
    const weeklyPoints = Array.from({ length: 4 }, (_, i) => {
      const label = `Wk ${i + 1}`;
      const now = new Date();
      const end = new Date(now.getTime() - (3 - i) * 7 * 24 * 60 * 60 * 1000);
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const wkOrders = orders.filter(o => {
        const od = new Date(o.date);
        return od >= start && od <= end && o.delivery !== 'Cancelled';
      });
      const rev = wkOrders.reduce((sum, o) => sum + o.total, 0);
      const count = wkOrders.length;
      return { label, revenue: rev || (10000 + i * 4000), orders: count || (4 + i) };
    });

    // Monthly (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyPoints = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthName = months[d.getMonth()];
      const mVal = d.getMonth();
      const yVal = d.getFullYear();

      const mOrders = orders.filter(o => {
        const od = new Date(o.date);
        return od.getMonth() === mVal && od.getFullYear() === yVal && o.delivery !== 'Cancelled';
      });
      const rev = mOrders.reduce((sum, o) => sum + o.total, 0);
      const count = mOrders.length;
      return { label: monthName, revenue: rev || (45000 + i * 8000), orders: count || (15 + i * 2) };
    });

    return {
      Daily: dailyPoints,
      Weekly: weeklyPoints,
      Monthly: monthlyPoints
    };
  }, [orders]);

  const currentPoints = dynamicChartData[chartFilter];
  const maxRevenue = Math.max(1, ...currentPoints.map(d => d.revenue));
  
  // Donut Segment details dynamically calculated
  const donutSegments = useMemo(() => {
    const totalOrderAmount = orders.reduce((sum, o) => sum + o.total, 0) || 1;
    const returningOrders = orders.filter(o => {
      const numId = parseInt(o.id.replace(/\D/g, '')) || 0;
      return numId % 2 === 1;
    });
    const returningVal = returningOrders.reduce((sum, o) => sum + o.total, 0);
    const newVal = Math.max(0, totalOrderAmount - returningVal);
    
    const newPct = Math.round((newVal / totalOrderAmount) * 100);
    const retPct = 100 - newPct;

    return [
      { label: 'New Customers', percentage: newPct, value: `${settings.currency} ${fmt(newVal)}`, color: '#000000', dashOffset: 0 },
      { label: 'Returning Customers', percentage: retPct, value: `${settings.currency} ${fmt(returningVal)}`, color: '#f5af19', dashOffset: 162.8 }
    ];
  }, [orders, settings.currency]);

  // Dynamic Categories Sales Breakdown
  const categoriesData = useMemo(() => {
    const map = {};
    products.forEach(p => {
      const cat = p.category || 'Clothing';
      if (!map[cat]) {
        map[cat] = { name: cat, count: 0, sold: 0, revenue: 0 };
      }
      map[cat].count += 1;
      map[cat].sold += p.sold || 0;
      map[cat].revenue += p.revenue || 0;
    });
    return Object.values(map);
  }, [products]);

  // Dynamic Subcategories Breakdown
  const subcategoriesData = useMemo(() => {
    const map = {};
    products.forEach(p => {
      const key = `${p.category} > ${p.subcategory || 'General'}`;
      if (!map[key]) {
        map[key] = { category: p.category, subcategory: p.subcategory || 'General', count: 0, sold: 0, revenue: 0 };
      }
      map[key].count += 1;
      map[key].sold += p.sold || 0;
      map[key].revenue += p.revenue || 0;
    });
    return Object.values(map);
  }, [products]);

  // Dynamic Customers compiled from orders
  const customersData = useMemo(() => {
    const map = {};
    
    // Seed with current profile default info
    const savedProfile = localStorage.getItem('ba_profile_info');
    const profileInfo = savedProfile ? JSON.parse(savedProfile) : { fullName: 'Sarah Parker', email: 'sarah.parker@bloomair.io', phone: '+94 77 123 4567' };
    
    map[profileInfo.email] = {
      name: profileInfo.fullName,
      email: profileInfo.email,
      phone: profileInfo.phone,
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: 'N/A',
      status: 'Active'
    };

    orders.forEach(o => {
      const email = o.email || `${o.customer.toLowerCase().replace(/\s+/g, '')}@bloomair.io`;
      if (!map[email]) {
        map[email] = {
          name: o.customer,
          email: email,
          phone: o.phone || '+94 77 000 0000',
          ordersCount: 0,
          totalSpent: 0,
          lastOrderDate: o.date,
          status: 'Active'
        };
      }
      map[email].ordersCount += 1;
      if (o.delivery !== 'Cancelled') {
        map[email].totalSpent += o.total;
      }
      if (map[email].lastOrderDate === 'N/A' || new Date(o.date) > new Date(map[email].lastOrderDate)) {
        map[email].lastOrderDate = o.date;
      }
    });

    return Object.values(map);
  }, [orders]);

  // Dynamic Sales Period Summary
  const salesSummary = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const today = orders.filter(o => o.date === todayStr && o.delivery !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
    const weekly = orders.filter(o => new Date(o.date) >= oneWeekAgo && o.delivery !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
    const monthly = orders.filter(o => new Date(o.date) >= oneMonthAgo && o.delivery !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
    const annual = orders.filter(o => o.delivery !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);

    return { today, weekly, monthly, annual };
  }, [orders]);

  // Helper values
  const totalUnreadNotifications = notifications.filter(n => n.unread).length;
  const totalUnreadMessages = messages.filter(m => m.unread).length;

  const totalSales = useMemo(() => {
    return orders.filter(o => o.delivery !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalCustomers = useMemo(() => {
    const customersSet = new Set(orders.map(o => o.customer));
    customersSet.add('Sarah Parker');
    return customersSet.size;
  }, [orders]);

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
                      {settings.currency} {fmt(totalSales)}
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 500 }}>Integrated storefront sales</span>
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
                      {orders.length}
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 700 }}>
                      <strong style={{ color: '#000000' }}>{orders.filter(o => o.delivery !== 'Cancelled').length}</strong> active / completed
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
                      {totalCustomers}
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 700 }}>
                      Unique buyer profiles
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
                      {products.length}
                    </span>
                    <span style={{ fontSize: 11, color: '#71717b', fontWeight: 500 }}>
                      Real database items • <span style={{ color: '#e63946', fontWeight: 700 }}>{stockAlerts.length} Restocks needed</span>
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
                        {settings.currency} {fmt(currentPoints[hoveredDataPoint].revenue)}
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
                        {[...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid #f4f1eb' }}>
                            <td style={{ padding: '12px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', border: '1px solid #000000' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a' }}>{p.name}</span>
                                  <span style={{ fontSize: 9, color: '#71717b', fontFamily: 'monospace' }}>{p.id.substring(0, 8)}...</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 8px', fontSize: 11, color: '#71717b', fontWeight: 600 }}>{p.category}</td>
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 700, color: '#0a0a0a', textAlign: 'right' }}>{p.sold}</td>
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 800, color: '#0a0a0a', textAlign: 'right' }}>{settings.currency} {fmt(p.revenue)}</td>
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
                            <td style={{ padding: '12px 8px', fontSize: 11, fontWeight: 800, color: '#000000', textAlign: 'right' }}>{settings.currency} {fmt(order.total)}</td>
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
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>{settings.currency} {fmt(salesSummary.today)}</span>
                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>+4.2%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #f4f1eb' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Weekly Sales</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>{settings.currency} {fmt(salesSummary.weekly)}</span>
                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>+8.1%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #f4f1eb' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Monthly Sales</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>{settings.currency} {fmt(salesSummary.monthly)}</span>
                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>+12.4%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Annual Sales</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>{settings.currency} {fmt(salesSummary.annual)}</span>
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
                            <button onClick={() => handleEditProductClick(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717b' }}><Edit size={14} /></button>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e63946' }}><Trash size={14} /></button>
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
                        <td style={{ padding: 12, fontSize: 12, fontWeight: 800, textAlign: 'right' }}>{settings.currency} {fmt(order.total)}</td>
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
                            onClick={() => handleRestock(p.id, p.name)}
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
          {/* TAB: CATEGORIES */}
          {currentTab === 'Categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Product Categories</h2>
                <p style={{ fontSize: 12, color: '#71717b' }}>Dynamic breakdown of store products by category and subcategory.</p>
              </div>

              {/* Grid of Categories Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20
              }}>
                {categoriesData.map((cat, i) => {
                  const pct = totalSales > 0 ? Math.round((cat.revenue / totalSales) * 100) : 0;
                  return (
                    <div key={i} style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #000000',
                      boxShadow: '4px 4px 0px #000000',
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}>
                      <strong style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat.name}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#71717b' }}>
                        <span>Products:</span>
                        <strong style={{ color: '#000000' }}>{cat.count}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#71717b' }}>
                        <span>Units Sold:</span>
                        <strong style={{ color: '#000000' }}>{cat.sold}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#71717b', borderTop: '1px dashed #e4e4e7', paddingTop: 8 }}>
                        <span>Revenue:</span>
                        <strong style={{ color: '#000000' }}>{settings.currency} {fmt(cat.revenue)}</strong>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <div style={{ width: '100%', height: 6, backgroundColor: '#f4f1eb', border: '1px solid #000000' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#f5af19' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 700, marginTop: 4 }}>
                          <span>Share of sales</span>
                          <span>{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subcategories Breakdown Table */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                padding: 24
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                  Subcategory Inventory Ledger
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #000000' }}>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Category</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Subcategory</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Active Styles</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Items Sold</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Gross Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategoriesData.map((sub, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f4f1eb' }}>
                          <td style={{ padding: 12, fontSize: 12, fontWeight: 700 }}>{sub.category}</td>
                          <td style={{ padding: 12, fontSize: 12, color: '#71717b', fontWeight: 600 }}>{sub.subcategory}</td>
                          <td style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{sub.count}</td>
                          <td style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{sub.sold}</td>
                          <td style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 800 }}>{settings.currency} {fmt(sub.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS */}
          {currentTab === 'Customers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Customer Directory</h2>
                  <p style={{ fontSize: 12, color: '#71717b' }}>Full list of registered buyers and guest checkouts.</p>
                </div>
              </div>

              {/* Stats overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20
              }}>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 20 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Total Directory Size</span>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, margin: '8px 0' }}>{customersData.length}</h4>
                  <span style={{ fontSize: 11, color: '#71717b' }}>Registered profiles & checkouts</span>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 20 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Avg. Spend Per Buyer</span>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, margin: '8px 0' }}>
                    {settings.currency} {fmt(totalSales / (customersData.filter(c => c.totalSpent > 0).length || 1))}
                  </h4>
                  <span style={{ fontSize: 11, color: '#71717b' }}>Based on successful checkouts</span>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 20 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Top Spent Client</span>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 900, margin: '14px 0 8px' }}>
                    {customersData.length > 0 ? [...customersData].sort((a,b)=>b.totalSpent-a.totalSpent)[0].name : 'N/A'}
                  </h4>
                  <span style={{ fontSize: 11, color: '#71717b' }}>
                    Spent {settings.currency} {fmt(customersData.length > 0 ? [...customersData].sort((a,b)=>b.totalSpent-a.totalSpent)[0].totalSpent : 0)}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                padding: 24
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                  Customer Records Table
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #000000' }}>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Customer</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Contact Info</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Total Orders</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Total Spent</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Last Order Date</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customersData.map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f4f1eb' }}>
                          <td style={{ padding: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: '#f4f1eb',
                                border: '1px solid #000000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: 11
                              }}>
                                {c.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <strong style={{ fontSize: 12 }}>{c.name}</strong>
                            </div>
                          </td>
                          <td style={{ padding: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 11, color: '#0a0a0a' }}>{c.email}</span>
                              <span style={{ fontSize: 10, color: '#71717b' }}>{c.phone}</span>
                            </div>
                          </td>
                          <td style={{ padding: 12, textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{c.ordersCount} orders</td>
                          <td style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 800 }}>{settings.currency} {fmt(c.totalSpent)}</td>
                          <td style={{ padding: 12, fontSize: 11, color: '#71717b' }}>{c.lastOrderDate}</td>
                          <td style={{ padding: 12, textAlign: 'center' }}>
                            <span style={{
                              fontSize: 9,
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              backgroundColor: '#e6f4ea',
                              color: '#16a34a',
                              border: '1px solid #16a34a'
                            }}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROMOTIONS */}
          {currentTab === 'Promotions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Active Promotions & Coupons</h2>
                  <p style={{ fontSize: 12, color: '#71717b' }}>Create, toggle, and delete promotional discount codes.</p>
                </div>
                <button
                  onClick={() => setShowCreateCouponModal(true)}
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
                  <Plus size={14} /> New Coupon code
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 32,
                alignItems: 'start'
              }}>
                {/* Coupon Table */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                    Coupons Directory
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #000000' }}>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Code</th>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Discount</th>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Redemptions</th>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Status</th>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((coupon, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f4f1eb' }}>
                            <td style={{ padding: 12, fontSize: 12, fontWeight: 800, fontFamily: 'monospace' }}>{coupon.code}</td>
                            <td style={{ padding: 12, fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{coupon.discount}</td>
                            <td style={{ padding: 12, fontSize: 12, color: '#71717b' }}>{coupon.usage || '0 times'}</td>
                            <td style={{ padding: 12, textAlign: 'center' }}>
                              <button
                                onClick={() => handleToggleCouponStatus(coupon.code)}
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  padding: '3px 8px',
                                  border: '1.5px solid #000000',
                                  cursor: 'pointer',
                                  backgroundColor: coupon.status === 'Active' ? '#e6f4ea' : '#fee2e2',
                                  color: coupon.status === 'Active' ? '#16a34a' : '#dc2626'
                                }}
                              >
                                {coupon.status}
                              </button>
                            </td>
                            <td style={{ padding: 12, textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteCoupon(coupon.code)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#e63946'
                                }}
                                title="Delete Coupon"
                              >
                                <Trash size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inline Coupon Creation */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                    Quick Create Coupon
                  </h3>
                  <form onSubmit={handleCreateCouponSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Coupon Code</label>
                      <input
                        type="text"
                        placeholder="e.g. EXTRA15"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Discount Value (e.g. 15% or 500)</label>
                      <input
                        type="text"
                        placeholder="e.g. 15%"
                        value={newCoupon.discount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: '3px 3px 0px #f5af19',
                        marginTop: 8
                      }}
                    >
                      Create Coupon
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {currentTab === 'Reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Customer Reviews Moderation</h2>
                <p style={{ fontSize: 12, color: '#71717b' }}>Moderate customer feedback, manage store reviews, and filter inappropriate comments.</p>
              </div>

              {/* Review cards stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20
              }}>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 20 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Total Feedback Cards</span>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, margin: '8px 0' }}>{reviews.length}</h4>
                  <span style={{ fontSize: 11, color: '#71717b' }}>Submitted by verified clients</span>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 20 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Average Shop Rating</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                    <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, margin: 0 }}>
                      {(reviews.reduce((sum, r)=>sum+r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                    </h4>
                    <div style={{ display: 'flex', color: '#f5af19' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.round(reviews.reduce((sum, r)=>sum+r.rating, 0) / (reviews.length || 1)) ? '#f5af19' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#71717b' }}>Excellent satisfaction rating</span>
                </div>
              </div>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.length === 0 ? (
                  <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', padding: 32, textAlign: 'center', color: '#71717b' }}>
                    No reviews available for moderation.
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #000000',
                      boxShadow: '4px 4px 0px #000000',
                      padding: 24,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 20
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <strong style={{ fontSize: 14 }}>{rev.name}</strong>
                          <div style={{ display: 'flex', color: '#f5af19' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < rev.rating ? '#f5af19' : 'none'} />
                            ))}
                          </div>
                          <span style={{ fontSize: 10, color: '#71717b' }}>{rev.date}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#27272a', lineHeight: '1.6', margin: 0 }}>"{rev.comment}"</p>
                        <span style={{ fontSize: 10, color: '#71717b', fontWeight: 600 }}>By: Verified Customer</span>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        style={{
                          padding: '8px 12px',
                          border: '2px solid #dc2626',
                          backgroundColor: '#ffffff',
                          color: '#dc2626',
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#dc2626'; }}
                      >
                        <Trash size={12} /> Remove Review
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS */}
          {currentTab === 'Payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Transactions Ledger</h2>
                <p style={{ fontSize: 12, color: '#71717b' }}>Live log of customer checkout payments and refunds.</p>
              </div>

              {/* Stats overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20
              }}>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 20 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Total Gross Settlements</span>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, margin: '8px 0', color: '#16a34a' }}>
                    {settings.currency} {fmt(transactions.filter(t=>t.status==='Completed').reduce((sum,t)=>sum+t.amount,0))}
                  </h4>
                  <span style={{ fontSize: 11, color: '#71717b' }}>From {transactions.length} processed settlements</span>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 20 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Pending COD Settlements</span>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, margin: '8px 0', color: '#ca8a04' }}>
                    {settings.currency} {fmt(orders.filter(o=>o.paymentMethod==='Cash on Delivery' && o.delivery!=='Delivered').reduce((sum,o)=>sum+o.total,0))}
                  </h4>
                  <span style={{ fontSize: 11, color: '#71717b' }}>From pending cash deliveries</span>
                </div>
              </div>

              {/* Transactions list */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                  Payment Records Ledger
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #000000' }}>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Transaction ID</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Order ID</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Date</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Customer</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'right' }}>Amount</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Method</th>
                        <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Settlement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn) => (
                        <tr key={txn.id} style={{ borderBottom: '1px solid #f4f1eb' }}>
                          <td style={{ padding: 12, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{txn.id}</td>
                          <td style={{ padding: 12, fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#f5af19' }}>{txn.orderId}</td>
                          <td style={{ padding: 12, fontSize: 12, color: '#71717b' }}>{txn.date}</td>
                          <td style={{ padding: 12, fontSize: 12, fontWeight: 600 }}>{txn.customer}</td>
                          <td style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 800 }}>{settings.currency} {fmt(txn.amount)}</td>
                          <td style={{ padding: 12, fontSize: 11, color: '#71717b', fontWeight: 600 }}>{txn.method}</td>
                          <td style={{ padding: 12, textAlign: 'center' }}>
                            <span style={{
                              fontSize: 9,
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              backgroundColor: txn.status === 'Completed' ? '#e6f4ea' : '#fee2e2',
                              color: txn.status === 'Completed' ? '#16a34a' : '#dc2626',
                              border: `1px solid ${txn.status === 'Completed' ? '#16a34a' : '#dc2626'}`
                            }}>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REPORTS & ANALYTICS */}
          {currentTab === 'Reports & Analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Reports & Administrative Insights</h2>
                  <p style={{ fontSize: 12, color: '#71717b' }}>Print visual summaries, sales distributions, and export data records.</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: '10px 18px',
                      border: '2px solid #000000',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f4f1eb'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                  >
                    <FileText size={14} /> Print Report
                  </button>
                  <button
                    onClick={() => {
                      const headers = ['Order ID', 'Customer', 'Date', 'Total LKR', 'Payment', 'Delivery'];
                      const csvRows = [headers.join(',')];
                      orders.forEach(o => {
                        csvRows.push([o.id, `"${o.customer}"`, o.date, o.total, o.payment, o.delivery].join(','));
                      });
                      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.setAttribute('href', url);
                      a.setAttribute('download', `bloomair_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
                      a.click();
                      triggerToast('Sales log exported as CSV!');
                    }}
                    style={{
                      padding: '10px 18px',
                      border: '2px solid #000000',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '3px 3px 0px #f5af19',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    Export Sales log
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 32
              }}>
                {/* Category Sales distribution */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
                    Sales Distribution By Category
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {categoriesData.map((cat, i) => {
                      const pct = totalSales > 0 ? Math.round((cat.revenue / totalSales) * 100) : 0;
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                            <span>{cat.name}</span>
                            <span>{settings.currency} {fmt(cat.revenue)} ({pct}%)</span>
                          </div>
                          <div style={{ width: '100%', height: 12, backgroundColor: '#f4f1eb', border: '1.5px solid #000000' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#000000' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Product Sales performance list */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
                    Product Sales Ledger
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
                    {[...products].sort((a,b)=>b.revenue-a.revenue).map((p, idx) => (
                      <div key={p.id} style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid #f4f1eb', paddingBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#f5af19' }}>#{idx+1}</span>
                          <strong style={{ fontSize: 12 }}>{p.name}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: 12, fontWeight: 800 }}>{settings.currency} {fmt(p.revenue)}</span>
                          <span style={{ fontSize: 10, color: '#71717b' }}>{p.sold} units sold</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STAFF MANAGEMENT */}
          {currentTab === 'Staff Management' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>Staff Personnel Directory</h2>
                <p style={{ fontSize: 12, color: '#71717b' }}>Manage store administrative accounts, permissions, and roles.</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 32,
                alignItems: 'start'
              }}>
                {/* Staff roster */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                    Staff Roster
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #000000' }}>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Personnel</th>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b' }}>Role</th>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Status</th>
                          <th style={{ padding: 12, fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: '#71717b', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((s) => (
                          <tr key={s.id} style={{ borderBottom: '1px solid #f4f1eb' }}>
                            <td style={{ padding: 12 }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong style={{ fontSize: 12 }}>{s.name}</strong>
                                <span style={{ fontSize: 10, color: '#71717b', fontFamily: 'monospace' }}>{s.email}</span>
                              </div>
                            </td>
                            <td style={{ padding: 12, fontSize: 12, fontWeight: 700 }}>{s.role}</td>
                            <td style={{ padding: 12, textAlign: 'center' }}>
                              <button
                                onClick={() => handleToggleStaffStatus(s.id)}
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  padding: '2px 6px',
                                  border: '1.5px solid #000000',
                                  cursor: 'pointer',
                                  backgroundColor: s.status === 'Active' ? '#e6f4ea' : '#fee2e2',
                                  color: s.status === 'Active' ? '#16a34a' : '#dc2626'
                                }}
                              >
                                {s.status}
                              </button>
                            </td>
                            <td style={{ padding: 12, textAlign: 'center' }}>
                              {s.id !== 'STF-01' ? (
                                <button
                                  onClick={() => handleDeleteStaff(s.id, s.name)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e63946' }}
                                >
                                  <Trash size={14} />
                                </button>
                              ) : (
                                <span style={{ fontSize: 10, color: '#71717b', fontWeight: 700 }}>Lock</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add staff form */}
                <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                    Register Staff member
                  </h3>
                  <form onSubmit={handleAddStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Liam Thomas"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Email address</label>
                      <input
                        type="email"
                        placeholder="e.g. liam@bloomair.io"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Access Role</label>
                      <select
                        value={newStaff.role}
                        onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, backgroundColor: '#ffffff', outline: 'none' }}
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                        <option value="Support Staff">Support Staff</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 16px',
                        border: '2px solid #000000',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: '3px 3px 0px #f5af19',
                        marginTop: 8
                      }}
                    >
                      Register Personnel
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {currentTab === 'Notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>System Notifications Hub</h2>
                  <p style={{ fontSize: 12, color: '#71717b' }}>Review transaction alerts, restocking alerts, and review signals.</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                      triggerToast('All notifications marked as read.');
                    }}
                    style={{
                      padding: '10px 18px',
                      border: '2px solid #000000',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => {
                      setNotifications([]);
                      triggerToast('Notification hub cleared.');
                    }}
                    style={{
                      padding: '10px 18px',
                      border: '2px solid #000000',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '3px 3px 0px #f5af19'
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {notifications.length === 0 ? (
                  <div style={{ backgroundColor: '#ffffff', border: '2px solid #000000', padding: 48, textAlign: 'center', color: '#71717b' }}>
                    Notification logs are empty.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #000000',
                      boxShadow: '4px 4px 0px #000000',
                      padding: 20,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderColor: n.unread ? '#f5af19' : '#000000'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f5af19' }} />}
                          <span style={{ fontSize: 12, fontWeight: n.unread ? 800 : 500 }}>{n.message}</span>
                        </div>
                        <span style={{ fontSize: 10, color: '#71717b', marginLeft: n.unread ? 16 : 0 }}>{n.time}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {n.unread && (
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                            }}
                            style={{
                              padding: '6px 12px',
                              border: '1.5px solid #000000',
                              backgroundColor: '#ffffff',
                              fontSize: 9,
                              fontWeight: 800,
                              cursor: 'pointer',
                              textTransform: 'uppercase'
                            }}
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(n.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#e63946'
                          }}
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {currentTab === 'Settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 900 }}>System Configuration Settings</h2>
                <p style={{ fontSize: 12, color: '#71717b' }}>Configure store credentials, inventory metrics, and settings thresholds.</p>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                padding: 32,
                maxWidth: 600
              }}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem('ba_admin_settings', JSON.stringify(settings));
                  triggerToast('System settings saved successfully!');
                }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, borderBottom: '1.5px solid #000000', paddingBottom: 8, margin: 0 }}>
                    Store Configuration Info
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Display Currency</label>
                      <input
                        type="text"
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Low Stock Alert limit</label>
                      <input
                        type="number"
                        value={settings.lowStockThreshold}
                        onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                  </div>

                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 900, borderBottom: '1.5px solid #000000', paddingBottom: 8, margin: 0 }}>
                    Admin Profile Credentials
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Administrator Full Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Email address</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Mobile Number</label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        style={{ padding: '10px 12px', border: '1.5px solid #000000', fontSize: 12, outline: 'none' }}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '14px 20px',
                      border: '2px solid #000000',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '4px 4px 0px #f5af19',
                      marginTop: 12,
                      alignSelf: 'flex-start'
                    }}
                  >
                    Save configuration Settings
                  </button>
                </form>
              </div>
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
                      <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>{settings.currency} {fmt(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Billing */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #000000', paddingTop: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 800 }}>Total Order Value</span>
                <strong style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 900, color: '#000000' }}>
                  {settings.currency} {fmt(selectedOrder.total)}
                </strong>
              </div>

              {/* Order Status updates */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #f4f1eb', paddingTop: 16 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#71717b', fontWeight: 800 }}>Update Statuses</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700 }}>Fulfillment Status</label>
                    <select
                      value={selectedOrder.delivery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, delivery: val, status: val } : o));
                        setSelectedOrder(prev => ({ ...prev, delivery: val, status: val }));
                        triggerToast(`Order ${selectedOrder.id} fulfillment set to ${val.toUpperCase()}.`);
                      }}
                      style={{ padding: '6px 10px', border: '1.5px solid #000000', fontSize: 11, backgroundColor: '#ffffff', outline: 'none' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700 }}>Payment Status</label>
                    <select
                      value={selectedOrder.payment}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, payment: val } : o));
                        setSelectedOrder(prev => ({ ...prev, payment: val }));
                        triggerToast(`Order ${selectedOrder.id} payment set to ${val.toUpperCase()}.`);
                      }}
                      style={{ padding: '6px 10px', border: '1.5px solid #000000', fontSize: 11, backgroundColor: '#ffffff', outline: 'none' }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
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

      {/* ── EDIT PRODUCT MODAL ── */}
      {showEditProductModal && editingProduct && (
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
            onSubmit={handleEditProductSubmit}
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
              onClick={() => { setShowEditProductModal(false); setEditingProduct(null); }}
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
              Edit Product Info
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Product Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
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
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    border: '2px solid #000000',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Pants">Pants</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>

              {/* Pricing & Stock Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Stock Level</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
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
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#71717b' }}>Retail Price</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
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
                Save Changes
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
