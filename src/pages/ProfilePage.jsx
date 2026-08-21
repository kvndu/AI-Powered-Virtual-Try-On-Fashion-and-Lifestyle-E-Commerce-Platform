import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import {
  User, Mail, Phone, Shield, Award, Edit, Edit2, Plus, Trash2, CheckCircle2, MapPin,
  CreditCard, Package, Heart, Sparkles, TrendingUp, HelpCircle, LogOut, Settings,
  Calendar, Bell, ChevronRight, Download, RefreshCw, MessageSquare, Eye, Star, X,
  ChevronDown, Briefcase, Clock, ArrowRight, Share2, Tag, Gift, Percent, Compass,
  Scissors, Ruler, CheckCircle, EyeOff, ShieldCheck
} from 'lucide-react';

// Pre-configured rich mockup dataset to hydrate the premium UI experience
const INITIAL_WISHLIST = [];
const INITIAL_ORDERS = [];
const INITIAL_ADDRESSES = [
  { id: '1', type: 'Home', isDefault: true, fullName: 'Sarah Parker', line1: '45, Queen Street', line2: 'Colombo 03', city: 'Colombo', phone: '+94 77 123 4567' },
  { id: '2', type: 'Work', isDefault: false, fullName: 'Sarah Parker (BloomAIR Office)', line1: 'Level 14, World Trade Center', line2: 'Echelon Square', city: 'Colombo 01', phone: '+94 77 987 6543' }
];

const INITIAL_PAYMENTS = [
  { id: '1', type: 'Credit Card', isDefault: true, provider: 'Visa', last4: '4242', exp: '12/28', holder: 'SARAH PARKER' },
  { id: '2', type: 'Digital Wallet', isDefault: false, provider: 'Apple Pay / BloomPay', holder: 'sarah.p@bloomair.io' }
];

const INITIAL_REVIEWS = [];
const RECENTLY_VIEWED = [];


export default function ProfilePage() {
  const { user, profile, logout, updateProfile } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine starting tab from URL query parameter e.g., ?tab=wishlist
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Synchronize state with URL search parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  // State Persistence Hooks via LocalStorage
  const [personalInfo, setPersonalInfo] = useState(() => {
    const saved = localStorage.getItem('ba_profile_info');
    if (saved) return JSON.parse(saved);
    return {
      fullName: profile?.full_name || user?.user_metadata?.full_name || 'Sarah Parker',
      email: user?.email || 'sarah.parker@bloomair.io',
      phone: '+94 77 123 4567',
      tier: 'Platinum',
      verified: true
    };
  });

  useEffect(() => {
    if (profile?.full_name) {
      setPersonalInfo(prev => ({ ...prev, fullName: profile.full_name }));
    }
  }, [profile]);

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('ba_profile_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('ba_profile_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('ba_profile_wishlist_v2');
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ba_profile_orders_v2');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [sizeProfile, setSizeProfile] = useState(() => {
    const saved = localStorage.getItem('ba_profile_size');
    return saved ? JSON.parse(saved) : {
      height: '172',
      weight: '62',
      shirtSize: 'M',
      pantSize: '30',
      shoeSize: '39',
      fitPreference: 'Oversized'
    };
  });

  const [aiFashionProfile, setAiFashionProfile] = useState(() => {
    const saved = localStorage.getItem('ba_profile_ai_fashion');
    return saved ? JSON.parse(saved) : {
      preferredStyle: 'Quiet Luxury & Tailored Minimalism',
      preferredFit: 'Fluid & Relaxed Fit',
      favColors: ['Oatmeal', 'Espresso', 'Cream', 'Olive'],
      favCategories: ['Blazers', 'Midi Silk Dresses', 'Tailored Pants'],
      personality: 'The Chic Sartorialist'
    };
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('ba_profile_reviews_v2');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('ba_profile_info', JSON.stringify(personalInfo));
  }, [personalInfo]);

  useEffect(() => {
    localStorage.setItem('ba_profile_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('ba_profile_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('ba_profile_wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ba_profile_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ba_profile_size', JSON.stringify(sizeProfile));
  }, [sizeProfile]);

  useEffect(() => {
    localStorage.setItem('ba_profile_ai_fashion', JSON.stringify(aiFashionProfile));
  }, [aiFashionProfile]);

  useEffect(() => {
    localStorage.setItem('ba_profile_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  const calculateTotalSpent = () => {
    const total = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.qty), 0);
    }, 0);
    return `Rs. ${total.toLocaleString()}`;
  };

  const calculateTotalItems = () => {
    return orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0);
    }, 0);
  };


  // Modal Forms States
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: personalInfo.fullName, phone: personalInfo.phone });

  const [addingAddress, setAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({ type: 'Home', fullName: '', line1: '', line2: '', city: '', phone: '' });

  const [addingPayment, setAddingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ provider: 'Visa', holder: '', last4: '', exp: '' });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [writingReviewProduct, setWritingReviewProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  // Calculations for dynamic recommendation size
  const calculateRecommendedSize = () => {
    const h = parseFloat(sizeProfile.height);
    const w = parseFloat(sizeProfile.weight);
    if (!h || !w) return 'Fill details';
    if (h > 180 || w > 78) return 'L / XL';
    if (h > 168 || w > 58) return 'M';
    return 'XS / S';
  };

  // Profile Edit Submission
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await updateProfile({ full_name: profileForm.fullName });
      }
      setPersonalInfo(prev => ({
        ...prev,
        fullName: profileForm.fullName,
        phone: profileForm.phone
      }));
      setEditingProfile(false);
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  // Address CRUD
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.line1 || !addressForm.city || !addressForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingAddressId) {
      setAddresses(prev => prev.map(addr => addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr));
      toast.success('Address updated.');
    } else {
      const newAddress = {
        ...addressForm,
        id: Date.now().toString(),
        isDefault: addresses.length === 0
      };
      setAddresses(prev => [...prev, newAddress]);
      toast.success('New address added.');
    }
    setAddingAddress(false);
    setEditingAddressId(null);
    setAddressForm({ type: 'Home', fullName: '', line1: '', line2: '', city: '', phone: '' });
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
    toast.success('Default address updated.');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => {
      const filtered = prev.filter(addr => addr.id !== id);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    toast.success('Address deleted.');
  };

  const handleEditAddressClick = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({ ...addr });
    setAddingAddress(true);
  };

  // Payment Card CRUD
  const handleSavePayment = (e) => {
    e.preventDefault();
    if (!paymentForm.holder || !paymentForm.last4 || !paymentForm.exp) {
      toast.error('Please fill in all card details.');
      return;
    }
    const newPay = {
      id: Date.now().toString(),
      type: 'Credit Card',
      provider: paymentForm.provider,
      last4: paymentForm.last4.slice(-4),
      exp: paymentForm.exp,
      holder: paymentForm.holder.toUpperCase(),
      isDefault: payments.length === 0
    };
    setPayments(prev => [...prev, newPay]);
    setAddingPayment(false);
    setPaymentForm({ provider: 'Visa', holder: '', last4: '', exp: '' });
    toast.success('Payment card added.');
  };

  const handleSetDefaultPayment = (id) => {
    setPayments(prev => prev.map(p => ({ ...p, isDefault: p.id === id })));
    toast.success('Default payment updated.');
  };

  const handleDeletePayment = (id) => {
    setPayments(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (filtered.length > 0 && !filtered.some(p => p.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    toast.success('Payment method removed.');
  };

  // Wishlist Actions
  const handleMoveToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: sizeProfile.shirtSize,
      color: 'Default',
      quantity: 1
    });
    setWishlist(prev => prev.filter(w => w.id !== item.id));
    toast.success('Moved to cart!');
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
    toast.success('Removed from wishlist.');
  };

  // Orders Actions
  const handleBuyAgain = (item) => {
    addItem({
      id: Math.floor(Math.random() * 1000) + 200,
      name: item.name,
      price: item.price,
      image: item.image,
      size: item.size,
      color: item.color,
      quantity: 1
    });
    toast.success('Added back to cart!');
  };

  const handleDownloadInvoice = (order) => {
    // Generate a premium simulated PDF download
    toast.loading('Generating tax invoice...', { id: 'invoice_gen' });
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice - ${order.orderNumber}</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                .header { border-bottom: 2px solid #000; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
                .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                .details { margin: 30px 0; display: flex; justify-content: space-between; }
                table { width: 100%; border-collapse: collapse; margin: 30px 0; }
                th { border-bottom: 1px solid #ddd; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                td { border-bottom: 1px dotted #eee; padding: 12px; font-size: 14px; }
                .total { font-size: 18px; font-weight: bold; text-align: right; padding-top: 20px; }
                .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="logo">BLOOMAIR COUTURE</div>
                  <div style="font-size: 12px; color: #666; margin-top: 4px;">Premium E-Commerce Outlet</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 20px; font-weight: 300;">INVOICE</div>
                  <div style="font-size: 12px; font-weight: bold; margin-top: 4px;"># ${order.orderNumber}</div>
                </div>
              </div>
              <div class="details">
                <div>
                  <strong>Billed To:</strong><br>
                  ${personalInfo.fullName}<br>
                  ${addresses[0]?.line1 || 'Colombo Residence'}<br>
                  ${addresses[0]?.city || 'Colombo'}, Sri Lanka<br>
                  ${personalInfo.phone}
                </div>
                <div style="text-align: right;">
                  <strong>Invoice Date:</strong> ${order.date}<br>
                  <strong>Payment:</strong> ${order.paymentMethod}<br>
                  <strong>Status:</strong> ${order.status}
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Qty</th>
                    <th style="text-align: right;">Price (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td><strong>${item.name}</strong><br><span style="font-size:11px;color:#777;">${item.category}</span></td>
                      <td>${item.size}</td>
                      <td>${item.color}</td>
                      <td>${item.qty}</td>
                      <td style="text-align: right;">Rs. ${item.price.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="total">
                Grand Total: Rs. ${order.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}
              </div>
              <div class="footer">
                Thank you for shopping with BloomAIR. This is a computer generated invoice and requires no physical signature.<br>
                For support, contact support@bloomair.io
              </div>
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
        toast.success('Invoice generated & print window opened.', { id: 'invoice_gen' });
      } else {
        toast.error('Pop-up blocked. Please allow pop-ups to print invoices.', { id: 'invoice_gen' });
      }
    }, 1200);
  };

  // Review Submissions
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error('Please enter a comment.');
      return;
    }
    const newReview = {
      id: 'rev_' + Date.now(),
      name: writingReviewProduct.name,
      rating: reviewForm.rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: reviewForm.comment
    };
    setReviews(prev => [newReview, ...prev]);
    setWritingReviewProduct(null);
    setReviewForm({ rating: 5, comment: '' });
    toast.success('Thank you! Review posted.');
  };

  // AI Style Recommendation Regenerate Outfits
  const [aiOutfits, setAiOutfits] = useState([
    { name: 'Classic Riviera', items: ['Oatmeal Double-Breasted Linen Suit', 'Cream Silk camisole', 'Leather Sandals'], tag: 'Formal Elegant' },
    { name: 'Monochrome Luxe', items: ['Charcoal Silk Trousers', 'Off-white Cashmere Knit', 'Black Pointed Slides'], tag: 'Nordic Chic' },
    { name: 'Resort Chic', items: ['Olive Linen Utility Skirt Dress', 'Woven Straw Bag', 'Gold Hoops'], tag: 'Casual Premium' }
  ]);

  const handleRegenerateOutfit = () => {
    toast.loading('AI Stylist compiling outfit recommendations...', { id: 'ai_stylist' });
    setTimeout(() => {
      const premiumOutfitsList = [
        [
          { name: 'Tailored Minimalist', items: ['Oversized Bouclé Wool Blazer', 'High Waist Pleated Crepe Pants', 'Premium Leather Chelsea Boots'], tag: 'Atelier Style' },
          { name: 'Sunset Silk Lounge', items: ['Ethereal Satin Slip Midi Dress', 'Cashmere Drape Cardigan', 'Suede Mules'], tag: 'Sunset Luxe' },
          { name: 'Urban Trench Outfit', items: ['Sartorial Double-Breasted Wool Trench', 'Mockneck Cashmere Top', 'Distressed Indigo Denim'], tag: 'Sartorial Edge' }
        ],
        [
          { name: 'High Fashion Sculpt', items: ['Structured Asymmetric Jacket', 'Wide-Leg Satin Palazzo Pants', 'Silver Patent Slingbacks'], tag: 'Avangard' },
          { name: 'Cozy Cashmere Set', items: ['Ribbed Knit Wide Trouser', 'Ribbed Mockneck Sweater', 'Camel Suede Slides'], tag: 'Quiet Luxury' },
          { name: 'Metropolitan Sleek', items: ['Black Double Breasted Blazer', 'White Crisp Poplin Shirt', 'Indigo Raw Selvedge Jeans'], tag: 'Modern Daily' }
        ]
      ];
      const selected = premiumOutfitsList[Math.floor(Math.random() * premiumOutfitsList.length)];
      setAiOutfits(selected);
      toast.success('New AI Outfits matched for your fit profile!', { id: 'ai_stylist' });
    }, 1500);
  };

  // Settings Forms Handlers
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    toast.success('Password updated securely.');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  const [notificationToggles, setNotificationToggles] = useState({
    marketing: true,
    orders: true,
    styleMatches: false,
    security: true
  });

  const handleLogoutClick = async () => {
    if (logout) {
      await logout();
      toast.success('Successfully logged out.');
      navigate('/');
    }
  };

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh', color: '#111', fontFamily: '"Inter", sans-serif', paddingBottom: 60 }}>
      {/* Dynamic Keyframe Animations & Media Queries Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .anim-fade { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .sidebar-item { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .sidebar-item.active { background: #000 !important; color: #fff !important; }
        .btn-black { background: #000; color: #fff; transition: all 0.3s; border: 1px solid #000; cursor: pointer; }
        .btn-black:hover { background: #fff; color: #000; }
        .btn-white { background: #fff; color: #000; border: 1px solid #e5e7eb; transition: all 0.3s; cursor: pointer; }
        .btn-white:hover { background: #f9f9f9; border-color: #999; }
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
        .tab-content-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .flat-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .flat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 1024px) {
          .tab-content-grid {
            grid-template-columns: 1fr;
            padding: 0 20px;
          }
          .desktop-only-sidebar { display: none; }
          .mobile-tabs-dropdown { display: block !important; }
        }
      `}} />

      {/* ── Top Hero Header Banner ── */}
      <div style={{ background: '#000000', color: '#ffffff', padding: '60px 40px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        {/* Abstract luxury ambient circles */}
        <div style={{ position: 'absolute', right: '-10%', top: '-30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 70%)' }}></div>
        <div style={{ position: 'absolute', left: '-5%', bottom: '-40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%)' }}></div>

        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          {/* Left: Avatar & Personal Specs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                border: '2px solid #D4AF37', // Platinum/gold luxury frame
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 28, fontWeight: 300, letterSpacing: 1
              }}>
                {personalInfo.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                background: '#D4AF37', color: '#000',
                borderRadius: '50%', width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #000'
              }} title="AI Fit Match Verified">
                <Sparkles size={11} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>
                  {personalInfo.fullName}
                </h1>
                <span style={{
                  background: 'rgba(212,175,55,0.2)', color: '#D4AF37',
                  border: '1px solid rgba(212,175,55,0.3)',
                  padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em'
                }}>
                  {personalInfo.tier.toUpperCase()} MEMBER
                </span>
                {personalInfo.verified && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(52,211,153,0.15)', color: '#34D399', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>
                    <ShieldCheck size={10} /> Verified
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4, opacity: 0.8, fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} /> {personalInfo.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} /> {personalInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                setProfileForm({ fullName: personalInfo.fullName, phone: personalInfo.phone });
                setEditingProfile(true);
              }}
              className="btn-white"
              style={{ padding: '8px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <Edit2 size={12} /> Edit Profile
            </button>
            <button
              onClick={handleLogoutClick}
              className="btn-white"
              style={{ padding: '8px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, background: '#df4759', border: 'none', color: '#fff' }}
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-bar: Breadcrumbs / Overview dashboard trigger ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '12px 40px', fontSize: 12, color: '#666' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span>BloomAIR</span> / <span style={{ color: '#000', fontWeight: 500 }}>My Account</span> / <span style={{ textTransform: 'capitalize' }}>{activeTab}</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Award size={12} /> GOLD TIER UPGRADE AT 3,000 PTS
          </div>
        </div>
      </div>

      {/* ── Main Layout Container ── */}
      <div className="tab-content-grid" style={{ marginTop: 32 }}>

        {/* 1. Left Sidebar (Tab Switches) */}
        <aside className="desktop-only-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'overview', label: 'Overview Dashboard', icon: <Compass size={16} /> },
            { id: 'orders', label: 'Purchase History', icon: <Package size={16} /> },
            { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={16} /> },
            { id: 'tracking', label: 'Order Tracking', icon: <Clock size={16} /> },
            { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={16} /> },
            { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={16} /> },
            { id: 'sizing', label: 'Size & Fit Profile', icon: <Ruler size={16} /> },
            { id: 'ai-profile', label: 'AI Outfit Studio', icon: <Sparkles size={16} /> },
            { id: 'insights', label: 'Fashion Insights', icon: <TrendingUp size={16} /> },
            { id: 'reviews', label: 'Reviews & Activity', icon: <MessageSquare size={16} /> },
            { id: 'loyalty', label: 'Loyalty Rewards', icon: <Gift size={16} /> },
            { id: 'settings', label: 'Account Settings', icon: <Settings size={16} /> },
            { id: 'support', label: 'Support & FAQs', icon: <HelpCircle size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '12px 16px',
                border: 'none', background: 'transparent',
                borderRadius: 8, cursor: 'pointer',
                textAlign: 'left', fontSize: 13, fontWeight: 500,
                color: activeTab === tab.id ? '#fff' : '#555'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* 2. Mobile Responsive Tab Dropdown Selector */}
        <div className="mobile-tabs-dropdown" style={{ display: 'none', marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#777', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Navigation Menu</label>
          <div style={{ position: 'relative' }}>
            <select
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px',
                border: '1px solid #e5e7eb', background: '#fff',
                borderRadius: 8, fontSize: 14, fontWeight: 600,
                appearance: 'none', outline: 'none'
              }}
            >
              <option value="overview">Overview Dashboard</option>
              <option value="orders">Purchase History</option>
              <option value="wishlist">My Wishlist</option>
              <option value="tracking">Order Tracking</option>
              <option value="addresses">Saved Addresses</option>
              <option value="payments">Payment Methods</option>
              <option value="sizing">Size & Fit Profile</option>
              <option value="ai-profile">AI Outfit Studio</option>
              <option value="insights">Fashion Insights</option>
              <option value="reviews">Reviews & Activity</option>
              <option value="loyalty">Loyalty Rewards</option>
              <option value="settings">Account Settings</option>
              <option value="support">Support & FAQs</option>
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* 3. Tab Content Display Pane */}
        <main className="anim-fade" style={{ minWidth: 0 }}>

          {/* ──────────────── OVERVIEW TAB ──────────────── */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Dashboard Overview</h2>

              {/* Stat Summary Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
                {[
                  { label: 'Total Orders', value: orders.length, color: '#000', desc: 'Placed in last 12m' },
                  { label: 'Total Items Purchased', value: calculateTotalItems(), color: '#000', desc: 'Items checked out' },
                  { label: 'Total Amount Spent', value: calculateTotalSpent(), color: '#000', desc: 'Premium transactions' },
                  { label: 'Wishlist Count', value: wishlist.length, color: '#D4AF37', desc: 'Saved for later' },
                  { label: 'Reward Points', value: '2,450', color: '#D4AF37', desc: 'Platinum Tier status' },
                  { label: 'Available Coupons', value: '3 Active', color: '#10B981', desc: 'Up to 25% off discount' },
                  { label: 'Active Orders', value: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length, color: '#10B981', desc: 'Currently in transit' },
                  { label: 'Saved Addresses', value: addresses.length, color: '#4B5563', desc: 'Delivery locations' }
                ].map((stat, idx) => (
                  <div key={idx} className="flat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</span>
                    <span style={{ fontSize: 24, fontWeight: 700, margin: '8px 0', color: stat.color }}>{stat.value}</span>
                    <span style={{ fontSize: 11, color: '#999' }}>{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Grid Widgets (Split Sections) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24, marginBottom: 40 }}>
                {/* Active Tracking Widget */}
                {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length > 0 ? (
                  <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Active Order</h3>
                        <span style={{ background: '#FFFDF5', color: '#D4AF37', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(212,175,55,0.2)' }}>{orders[0].status.toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <img src={orders[0].items[0].image} alt="Active" style={{ width: 60, height: 75, objectFit: 'cover', borderRadius: 6 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{orders[0].orderNumber}</div>
                          <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>Estimated Arrival: {orders[0].date}</div>
                          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Carrier: BloomAIR Premium Express</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTabChange('tracking')}
                      className="btn-black"
                      style={{ width: '100%', padding: '10px', borderRadius: 4, fontSize: 12, fontWeight: 600, marginTop: 20 }}
                    >
                      Track Shipment Details
                    </button>
                  </div>
                ) : (
                  <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Active Order</h3>
                        <span style={{ background: '#F3F4F6', color: '#666', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid #e5e7eb' }}>INACTIVE</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 0' }}>
                        <Package size={32} style={{ color: '#ccc', marginBottom: 12 }} />
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>No Active Shipments</div>
                        <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>You have no shipments in transit.</div>
                      </div>
                    </div>
                    <button
                      disabled
                      style={{ width: '100%', padding: '10px', borderRadius: 4, fontSize: 12, fontWeight: 600, marginTop: 20, background: '#f3f4f6', color: '#999', border: '1px solid #e5e7eb', cursor: 'not-allowed' }}
                    >
                      Track Shipment Details
                    </button>
                  </div>
                )}

                {/* AI Stylist Recommendation Widget */}
                <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(to bottom right, #fff, #FAF9F6)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkles size={16} color="#D4AF37" />
                        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Styling Insight</h3>
                      </div>
                      <span style={{ fontSize: 11, color: '#777', fontWeight: 600 }}>{aiFashionProfile.personality}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#555', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                      "Your style matches <strong>Quiet Luxury & Minimalism</strong>. We recommend pairing structured blazer coordinates with linen blends."
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {aiFashionProfile.favColors.map((color, i) => (
                        <span key={i} style={{ background: '#f3f4f6', fontSize: 11, padding: '4px 8px', borderRadius: 20, color: '#555' }}>
                          🎨 {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleTabChange('ai-profile')}
                    className="btn-white"
                    style={{ width: '100%', padding: '10px', borderRadius: 4, fontSize: 12, fontWeight: 600, marginTop: 20 }}
                  >
                    Enter AI Outfit Studio
                  </button>
                </div>
              </div>

              {/* Recently Viewed Carousel Heading */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recently Viewed Fashion</h3>
                <span style={{ fontSize: 11, color: '#777' }}>SWIPE / SCROLL HORIZONTALLY</span>
              </div>

              {/* Horizontal Scroll Carousel */}
              <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 15, scrollbarWidth: 'thin' }}>
                {RECENTLY_VIEWED.map(item => (
                  <div key={item.id} className="flat-card" style={{ minWidth: 220, flex: '0 0 auto', padding: 12 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>{item.brand}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, height: 36, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>Rs. {item.price.toLocaleString()}</span>
                        <button
                          onClick={() => {
                            addItem({ ...item, size: 'M', color: 'Default' });
                            toast.success('Added to bag!');
                          }}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}
                          title="Add to Bag"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── PURCHASE HISTORY ──────────────── */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Purchase History</h2>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }} className="flat-card">
                  <Package size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>No Purchase History</h3>
                  <p style={{ fontSize: 13, color: '#777', margin: '8px 0 24px 0' }}>You have not placed any orders yet.</p>
                  <button onClick={() => navigate('/')} className="btn-black" style={{ padding: '12px 30px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {orders.map((order, idx) => (
                    <div key={idx} className="flat-card">
                      {/* Order header information */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: 16, marginBottom: 16, gap: 12 }}>
                        <div>
                          <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>ORDER ID</span>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>#{order.orderNumber}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>DATE PLACED</span>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{order.date}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>PAYMENT METHOD</span>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{order.paymentMethod}</div>
                        </div>
                        <div>
                          <span style={{
                            background: order.status === 'Delivered' ? '#ECFDF5' : '#FEF3C7',
                            color: order.status === 'Delivered' ? '#059669' : '#D97706',
                            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20
                          }}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Order products list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {order.items.map((item, idy) => (
                          <div key={idy} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                              <img src={item.image} alt={item.name} style={{ width: 60, height: 75, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                  Category: {item.category} • Size: {item.size} • Color: {item.color}
                                </div>
                                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Qty: {item.qty}</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                              <div style={{ fontSize: 16, fontWeight: 700, marginRight: 20 }}>
                                Rs. {(item.price * item.qty).toLocaleString()}
                              </div>
                              <button
                                onClick={() => handleBuyAgain(item)}
                                className="btn-white"
                                style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4 }}
                              >
                                Buy Again
                              </button>
                              <button
                                onClick={() => {
                                  setWritingReviewProduct(item);
                                  setReviewForm({ rating: 5, comment: '' });
                                }}
                                className="btn-white"
                                style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4 }}
                              >
                                Rate Product
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons footer */}
                      <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="btn-white"
                          style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <Eye size={13} /> View Order Details
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="btn-black"
                          style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <Download size={13} /> Download Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* ──────────────── WISHLIST TAB ──────────────── */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>My Wishlist</h2>

              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }} className="flat-card">
                  <Heart size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Your Wishlist is Empty</h3>
                  <p style={{ fontSize: 13, color: '#777', margin: '8px 0 24px 0' }}>Explore styles and bookmark items to build your outfit canvas.</p>
                  <button onClick={() => navigate('/')} className="btn-black" style={{ padding: '12px 30px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                  {wishlist.map(item => (
                    <div key={item.id} className="flat-card" style={{ padding: 16 }}>
                      <div style={{ position: 'relative' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 8 }} />
                        <span style={{
                          position: 'absolute', top: 12, left: 12,
                          background: item.stock === 'In Stock' ? '#10B981' : '#F59E0B',
                          color: '#fff', fontSize: 10, fontWeight: 700,
                          padding: '2px 8px', borderRadius: 20
                        }}>
                          {item.stock.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          style={{
                            position: 'absolute', top: 12, right: 12,
                            background: '#fff', border: 'none', borderRadius: '50%',
                            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={14} color="#df4759" />
                        </button>
                      </div>

                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>{item.brand}</div>
                        <h4 style={{ fontSize: 15, fontWeight: 600, margin: '4px 0 8px 0', height: 40, overflow: 'hidden' }}>{item.name}</h4>
                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Rs. {item.price.toLocaleString()}</div>

                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="btn-black"
                          style={{ width: '100%', padding: '12px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}
                        >
                          Move To Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracking' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Order Tracking</h2>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }} className="flat-card">
                  <Package size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>No Shipments to Track</h3>
                  <p style={{ fontSize: 13, color: '#777', margin: '8px 0 24px 0' }}>There are no active orders or shipments currently in transit.</p>
                  <button onClick={() => navigate('/')} className="btn-black" style={{ padding: '12px 30px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="flat-card" style={{ marginBottom: 30 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 20, marginBottom: 20, gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#777' }}>ESTIMATED DELIVERY</div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>June 22, 2026</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#777' }}>TRACKING NUMBER</div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>TRK-98234-BA</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#777' }}>STATUS</div>
                      <span style={{ background: '#FFFBEB', color: '#D97706', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(217,119,6,0.15)', display: 'inline-block', marginTop: 6 }}>
                        IN TRANSIT (COLOMBO HUB)
                      </span>
                    </div>
                  </div>

                  {/* Progress Pipeline */}
                  <div style={{ padding: '20px 10px', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: 600, position: 'relative' }}>
                      {/* Connecting line */}
                      <div style={{ position: 'absolute', top: 12, left: '10%', right: '10%', height: 2, background: '#e5e7eb', zIndex: 1 }} />
                      <div style={{ position: 'absolute', top: 12, left: '10%', width: '60%', height: 2, background: '#000', zIndex: 2 }} />

                      {[
                        { label: 'Order Placed', date: 'June 12', active: true, done: true },
                        { label: 'Processing', date: 'June 13', active: true, done: true },
                        { label: 'Shipped', date: 'June 14', active: true, done: true },
                        { label: 'Out for Delivery', date: 'June 21', active: true, done: false },
                        { label: 'Delivered', date: 'June 22', active: false, done: false }
                      ].map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '18%', position: 'relative', zIndex: 3 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: step.done ? '#000' : step.active ? '#fff' : '#fff',
                            border: step.done ? 'none' : step.active ? '2px solid #000' : '2px solid #e5e7eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 12
                          }}>
                            {step.done && <CheckCircle size={14} color="#fff" />}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: step.active ? 700 : 500, marginTop: 8, textAlign: 'center', color: step.active ? '#000' : '#888' }}>{step.label}</span>
                          <span style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{step.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#FAF9F6', borderRadius: 8, padding: 16, marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src="https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?q=80&w=200" alt="tracking product" style={{ width: 50, height: 62, objectFit: 'cover', borderRadius: 6 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Oversized Bouclé Wool Blazer</div>
                        <div style={{ fontSize: 11, color: '#777' }}>Qty: 1 • Size: M • Color: Oatmeal</div>
                      </div>
                    </div>
                    <button className="btn-black" style={{ padding: '10px 20px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                      Track Realtime Map
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* ──────────────── SAVED ADDRESSES ──────────────── */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Saved Addresses</h2>
                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({ type: 'Home', fullName: '', line1: '', line2: '', city: '', phone: '' });
                    setAddingAddress(true);
                  }}
                  className="btn-black"
                  style={{ padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Plus size={14} /> Add New Address
                </button>
              </div>

              {addingAddress && (
                <div className="flat-card" style={{ marginBottom: 24, border: '2px solid #000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{editingAddressId ? 'Edit Address' : 'Add Address'}</h3>
                    <button onClick={() => setAddingAddress(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                  <form onSubmit={handleSaveAddress} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Address Type</label>
                      <select
                        value={addressForm.type}
                        onChange={e => setAddressForm({ ...addressForm, type: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      >
                        <option value="Home">Home Address</option>
                        <option value="Work">Work Address</option>
                        <option value="Other">Other Address</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Recipient Full Name *</label>
                      <input
                        required
                        value={addressForm.fullName}
                        onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        placeholder="e.g. Sarah Parker"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Street Address *</label>
                      <input
                        required
                        value={addressForm.line1}
                        onChange={e => setAddressForm({ ...addressForm, line1: e.target.value })}
                        placeholder="Line 1"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Apartment, Suite, Unit, etc. (Optional)</label>
                      <input
                        value={addressForm.line2}
                        onChange={e => setAddressForm({ ...addressForm, line2: e.target.value })}
                        placeholder="Line 2"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>City *</label>
                      <input
                        required
                        value={addressForm.city}
                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="Colombo"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Phone Number *</label>
                      <input
                        required
                        value={addressForm.phone}
                        onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                      <button type="button" onClick={() => setAddingAddress(false)} className="btn-white" style={{ padding: '10px 20px', borderRadius: 4 }}>Cancel</button>
                      <button type="submit" className="btn-black" style={{ padding: '10px 20px', borderRadius: 4 }}>Save Address</button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {addresses.map(addr => (
                  <div key={addr.id} className="flat-card" style={{ border: addr.isDefault ? '1.5px solid #000' : '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#000', color: '#fff' }}>{addr.type.toUpperCase()}</span>
                        {addr.isDefault && <span style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>Default Location</span>}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{addr.fullName}</div>
                      <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
                        {addr.line1}<br />
                        {addr.line2 && <>{addr.line2}<br /></>}
                        {addr.city}, Sri Lanka
                      </div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>{addr.phone}</div>
                    </div>

                    <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 16, paddingTop: 12, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefaultAddress(addr.id)} style={{ border: 'none', background: 'none', fontSize: 11, color: '#555', cursor: 'pointer', fontWeight: 600 }}>
                          Set Default
                        </button>
                      )}
                      <button onClick={() => handleEditAddressClick(addr)} style={{ border: 'none', background: 'none', fontSize: 11, color: '#555', cursor: 'pointer', fontWeight: 600 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.id)} style={{ border: 'none', background: 'none', fontSize: 11, color: '#df4759', cursor: 'pointer', fontWeight: 600 }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── SAVED PAYMENTS ──────────────── */}
          {activeTab === 'payments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Payment Methods</h2>
                <button
                  onClick={() => setAddingPayment(true)}
                  className="btn-black"
                  style={{ padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Plus size={14} /> Add Card
                </button>
              </div>

              {addingPayment && (
                <div className="flat-card" style={{ marginBottom: 24, border: '2px solid #000', maxWidth: 500 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Add Credit/Debit Card</h3>
                    <button onClick={() => setAddingPayment(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                  <form onSubmit={handleSavePayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Card Brand *</label>
                      <select
                        value={paymentForm.provider}
                        onChange={e => setPaymentForm({ ...paymentForm, provider: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="Amex">American Express</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Cardholder Name *</label>
                      <input
                        required
                        value={paymentForm.holder}
                        onChange={e => setPaymentForm({ ...paymentForm, holder: e.target.value })}
                        placeholder="e.g. SARAH PARKER"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Card Number *</label>
                      <input
                        required
                        maxLength={16}
                        value={paymentForm.last4}
                        onChange={e => setPaymentForm({ ...paymentForm, last4: e.target.value.replace(/\D/g, '') })}
                        placeholder="16 Digit Card Number"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Expiration Date (MM/YY) *</label>
                      <input
                        required
                        maxLength={5}
                        value={paymentForm.exp}
                        onChange={e => setPaymentForm({ ...paymentForm, exp: e.target.value })}
                        placeholder="12/28"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                      <button type="button" onClick={() => setAddingPayment(false)} className="btn-white" style={{ padding: '10px 20px', borderRadius: 4 }}>Cancel</button>
                      <button type="submit" className="btn-black" style={{ padding: '10px 20px', borderRadius: 4 }}>Add Card</button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {payments.map(pay => (
                  <div key={pay.id} className="flat-card" style={{ border: pay.isDefault ? '1.5px solid #000' : '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{pay.provider.toUpperCase()}</span>
                        {pay.isDefault && <span style={{ fontSize: 10, color: '#999', fontWeight: 600 }}>Default Card</span>}
                      </div>

                      {pay.type === 'Credit Card' ? (
                        <>
                          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.15em', margin: '10px 0' }}>•••• •••• •••• {pay.last4}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                            <div>
                              <div style={{ fontSize: 9, color: '#999' }}>CARDHOLDER</div>
                              <div style={{ fontSize: 12, fontWeight: 600 }}>{pay.holder}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 9, color: '#999' }}>EXPIRES</div>
                              <div style={{ fontSize: 12, fontWeight: 600 }}>{pay.exp}</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Digital Wallet ID</div>
                          <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>{pay.holder}</div>
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 20, paddingTop: 12, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      {!pay.isDefault && (
                        <button onClick={() => handleSetDefaultPayment(pay.id)} style={{ border: 'none', background: 'none', fontSize: 11, color: '#555', cursor: 'pointer', fontWeight: 600 }}>
                          Set Default
                        </button>
                      )}
                      <button onClick={() => handleDeletePayment(pay.id)} style={{ border: 'none', background: 'none', fontSize: 11, color: '#df4759', cursor: 'pointer', fontWeight: 600 }}>
                        Delete Method
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── SIZE & FIT PROFILE ──────────────── */}
          {activeTab === 'sizing' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Fashion Size Profile</h2>

              <div className="flat-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
                {/* Size Form inputs */}
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Your Physical Specs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600 }}>Height (cm)</label>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{sizeProfile.height} cm</span>
                      </div>
                      <input
                        type="range" min="140" max="210"
                        value={sizeProfile.height}
                        onChange={e => setSizeProfile({ ...sizeProfile, height: e.target.value })}
                        style={{ width: '100%', accentColor: '#000' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600 }}>Weight (kg)</label>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{sizeProfile.weight} kg</span>
                      </div>
                      <input
                        type="range" min="40" max="120"
                        value={sizeProfile.weight}
                        onChange={e => setSizeProfile({ ...sizeProfile, weight: e.target.value })}
                        style={{ width: '100%', accentColor: '#000' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Shirt Size</label>
                        <select
                          value={sizeProfile.shirtSize}
                          onChange={e => setSizeProfile({ ...sizeProfile, shirtSize: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                        >
                          <option>XXS</option>
                          <option>XS</option>
                          <option>S</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                          <option>XXL</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Pant Waist Size</label>
                        <input
                          type="number"
                          value={sizeProfile.pantSize}
                          onChange={e => setSizeProfile({ ...sizeProfile, pantSize: e.target.value })}
                          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: 6 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Shoe Size (EU)</label>
                      <input
                        type="number"
                        value={sizeProfile.shoeSize}
                        onChange={e => setSizeProfile({ ...sizeProfile, shoeSize: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Preferred Fit</label>
                      <select
                        value={sizeProfile.fitPreference}
                        onChange={e => setSizeProfile({ ...sizeProfile, fitPreference: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      >
                        <option value="Slim">Slim Fit</option>
                        <option value="Regular">Regular Fit</option>
                        <option value="Oversized">Oversized / Relaxed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sizing Recommendations Display */}
                <div style={{ background: '#FAF9F6', borderRadius: 8, padding: 24, border: '1px dashed #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <Ruler size={18} color="#D4AF37" />
                      <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>BloomAIR Sizing Engine</h4>
                    </div>
                    <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5, margin: 0 }}>
                      Based on your height of <strong>{sizeProfile.height}cm</strong> and weight of <strong>{sizeProfile.weight}kg</strong>, our AI sizing model recommends:
                    </p>
                    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '16px 20px', margin: '20px 0', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>RECOMMENDED FIT</span>
                      <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4, letterSpacing: 1 }}>{calculateRecommendedSize()}</div>
                    </div>
                    <p style={{ fontSize: 11, color: '#777', margin: 0 }}>
                      This model guarantees a 95% fit accuracy for our <em>Atelier Coat</em> and <em>Trench</em> collections.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      toast.success('Specs saved. Catalog sizing defaults adapted.');
                    }}
                    className="btn-black"
                    style={{ width: '100%', padding: '12px', borderRadius: 4, fontSize: 12, fontWeight: 600, marginTop: 24 }}
                  >
                    Save Size Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── AI OUTFIT STUDIO ──────────────── */}
          {activeTab === 'ai-profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: 0 }}>AI Outfit Studio</h2>
                <button
                  onClick={handleRegenerateOutfit}
                  className="btn-black"
                  style={{ padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <RefreshCw size={14} /> Regenerate Recommendations
                </button>
              </div>

              <div className="flat-card" style={{ marginBottom: 32 }}>
                <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 16, marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>STYLE PERSONALITY PROFILE</span>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{aiFashionProfile.preferredStyle}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                  {aiOutfits.map((outfit, index) => (
                    <div key={index} style={{ border: '1px solid #eee', borderRadius: 8, padding: 18, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{outfit.name}</span>
                          <span style={{ background: '#FAF9F6', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                            {outfit.tag.toUpperCase()}
                          </span>
                        </div>
                        <ul style={{ paddingLeft: 18, margin: '12px 0', fontSize: 12, color: '#555', lineHeight: 1.8 }}>
                          {outfit.items.map((it, idx) => (
                            <li key={idx}>{it}</li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          toast.success(`Lookbook "${outfit.name}" saved to collections.`);
                        }}
                        className="btn-white"
                        style={{ width: '100%', padding: '8px', fontSize: 11, fontWeight: 600, borderRadius: 4, marginTop: 12 }}
                      >
                        Save Look to Collections
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizing Outfit collection lists */}
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Saved Outfit Canvas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="flat-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200" alt="outfit" style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 6 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Parisian Fall Capsule</div>
                    <div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>Contains 3 Match coordinates</div>
                    <button style={{ border: 'none', background: 'none', color: '#D4AF37', fontSize: 11, cursor: 'pointer', fontWeight: 600, padding: 0, marginTop: 8 }}>View Outfit Canvas →</button>
                  </div>
                </div>
                <div className="flat-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200" alt="outfit" style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 6 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Minimalist Everyday Capsule</div>
                    <div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>Contains 2 Match coordinates</div>
                    <button style={{ border: 'none', background: 'none', color: '#D4AF37', fontSize: 11, cursor: 'pointer', fontWeight: 600, padding: 0, marginTop: 8 }}>View Outfit Canvas →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── FASHION INSIGHTS ──────────────── */}
          {activeTab === 'insights' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Fashion Insights</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                <div className="flat-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Shopping Profile</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Most Purchased Category', val: 'Coats & Blazers' },
                      { label: 'Favorite Colors', val: 'Oatmeal, Espresso, Cream' },
                      { label: 'Favorite Brands', val: 'BloomAIR Atelier, Couture' },
                      { label: 'Most Purchased Size', val: 'M / 38' },
                      { label: 'Shopping Frequency', val: 'Twice a Month' }
                    ].map((ins, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 10 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>{ins.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{ins.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>AI Styling Diagnosis</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {aiFashionProfile.personality.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, margin: 0 }}>
                      You prioritize tailored silhouettes, high-end wool textures, and monochrome palettes. Your selections tend to align with the Quiet Luxury trend.
                    </p>
                  </div>
                  <div style={{ background: '#FAF9F6', padding: 12, borderRadius: 6, border: '1px solid #eee', fontSize: 11, color: '#666', display: 'flex', gap: 10, alignItems: 'center', marginTop: 20 }}>
                    <Compass size={16} color="#D4AF37" />
                    We've filtered 18 new items in the shop matching this wardrobe signature.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── REVIEWS & RATINGS ──────────────── */}
          {activeTab === 'reviews' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Reviews & Activity</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="flat-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Your Reviews ({reviews.length})</h3>
                  {reviews.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#777' }}>You haven't posted any reviews yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {reviews.map(rev => (
                        <div key={rev.id} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{rev.name}</span>
                            <span style={{ fontSize: 11, color: '#999' }}>{rev.date}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < rev.rating ? '#D4AF37' : 'none'} color={i < rev.rating ? '#D4AF37' : '#ccc'} />
                            ))}
                          </div>
                          <p style={{ fontSize: 12, color: '#555', margin: 0, lineHeight: 1.5 }}>"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flat-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Pending Feedback</h3>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200" alt="slides" style={{ width: 45, height: 55, objectFit: 'cover', borderRadius: 4 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Suede Buckle Slides</div>
                        <div style={{ fontSize: 11, color: '#777' }}>Bought May 28, 2026</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setWritingReviewProduct({ name: 'Suede Buckle Slides' });
                        setReviewForm({ rating: 5, comment: '' });
                      }}
                      className="btn-black"
                      style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, borderRadius: 4 }}
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── LOYALTY REWARDS ──────────────── */}
          {activeTab === 'loyalty' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Loyalty & Rewards Program</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 30 }}>
                {/* Rewards overview card */}
                <div className="flat-card" style={{ background: 'linear-gradient(135deg, #111 0%, #222 100%)', color: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: '#D4AF37' }}>MEMBERSHIP STATUS</span>
                    <span style={{ fontSize: 10, background: '#D4AF37', color: '#000', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>PLATINUM ELITE</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#999' }}>CURRENT BALANCE</span>
                    <div style={{ fontSize: 36, fontWeight: 700, margin: '4px 0' }}>2,450 <span style={{ fontSize: 14, fontWeight: 400, color: '#ccc' }}>points</span></div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#ccc', marginBottom: 6 }}>
                      <span>Next Level: Platinum Diamond</span>
                      <span>2,450 / 3,000 Pts</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: '#333', borderRadius: 10 }}>
                      <div style={{ width: '81.6%', height: '100%', background: '#D4AF37', borderRadius: 10 }} />
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('Referral link copied to clipboard!')}
                    className="btn-white"
                    style={{ width: '100%', padding: '10px', fontSize: 12, fontWeight: 600, borderRadius: 4, marginTop: 24, background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                  >
                    Share Referral Link
                  </button>
                </div>

                {/* Available coupon discount lists */}
                <div className="flat-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Your Active Coupons</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { code: 'BA-PLATINUM20', desc: '20% off all apparel', val: '20%' },
                      { code: 'BA-BIRTHDAY15', desc: '15% off cart on your birthday month', val: '15%' },
                      { code: 'BA-FREESHIP', desc: 'Free express shipping across Sri Lanka', val: 'SHIP' }
                    ].map((cp, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed #ddd', padding: 12, borderRadius: 8 }}>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{cp.code}</span>
                          <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0 0' }}>{cp.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cp.code);
                            toast.success(`Coupon code ${cp.code} copied!`);
                          }}
                          className="btn-black"
                          style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, borderRadius: 4 }}
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── ACCOUNT SETTINGS ──────────────── */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Account Settings</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Personal Information settings */}
                <div className="flat-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Security Preferences</h3>
                  <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.current}
                        onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        placeholder="••••••••"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPass}
                        onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                        placeholder="••••••••"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        placeholder="••••••••"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 6 }}
                      />
                    </div>
                    <button type="submit" className="btn-black" style={{ padding: '10px 20px', borderRadius: 4, fontSize: 12, fontWeight: 600, alignSelf: 'flex-start', marginTop: 10 }}>
                      Change Password
                    </button>
                  </form>
                </div>

                {/* Notification settings toggle */}
                <div className="flat-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Email Notifications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { key: 'orders', title: 'Order Shipments & Tracking', desc: 'Realtime updates when packages depart hubs or arrive.' },
                      { key: 'marketing', title: 'Seasonal Fashion Promotions & Deals', desc: 'Exclusive discount code alerts and flash sales.' },
                      { key: 'styleMatches', title: 'AI Wardrobe Match Notifications', desc: 'Weekly curated outfit styling insights tailored for you.' }
                    ].map(nt => (
                      <div key={nt.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{nt.title}</div>
                          <div style={{ fontSize: 11, color: '#777', marginTop: 2 }}>{nt.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationToggles[nt.key]}
                          onChange={e => setNotificationToggles({ ...notificationToggles, [nt.key]: e.target.checked })}
                          style={{ width: 18, height: 18, accentColor: '#000', cursor: 'pointer' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger area */}
                <div className="flat-card" style={{ border: '1px solid #fee2e2', background: '#fffcfc' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b91c1c', marginBottom: 8 }}>Danger Zone</h3>
                  <p style={{ fontSize: 12, color: '#777', margin: '0 0 16px 0' }}>Permanently remove your BloomAIR fashion profile, reviews and address credentials. This cannot be undone.</p>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you absolutely sure you want to delete your BloomAIR account?')) {
                        toast.error('Account deletion simulation executed.');
                      }
                    }}
                    className="btn-white"
                    style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '10px 20px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── SUPPORT & FAQs ──────────────── */}
          {activeTab === 'support' && (
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, margin: '0 0 24px 0' }}>Support & Help Center</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {/* Accordion FAQs */}
                <div className="flat-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Frequently Asked Questions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { q: 'How long does shipping take across Sri Lanka?', a: 'Standard Colombo deliveries take 1-2 days. Outer regions take 3-4 days.' },
                      { q: 'What is your return policy?', a: 'We accept unused, tagged garments for refund or size exchanges within 14 days.' },
                      { q: 'How does the Supabase virtual try-on work?', a: 'Our AI model matches your height, weight and fit profiles to render overlays of the clothing items.' }
                    ].map((faq, idx) => (
                      <details key={idx} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 12, cursor: 'pointer' }}>
                        <summary style={{ fontSize: 13, fontWeight: 600, outline: 'none', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{faq.q}</span>
                          <ChevronDown size={14} />
                        </summary>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 8, lineHeight: 1.5 }}>{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>

                {/* Direct support inquiry forms */}
                <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Need Direct Assistance?</h3>
                    <p style={{ fontSize: 12, color: '#555', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                      Our fashion concierge agents are available 24/7. Submit an order inquiry, size swap request, or initiate a live chat.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button
                        onClick={() => toast.success('Live chat initiated. An agent will be with you shortly.')}
                        className="btn-black"
                        style={{ padding: '12px', borderRadius: 4, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                      >
                        <MessageSquare size={14} /> Start Live Support Chat
                      </button>
                      <button
                        onClick={() => toast.success('Return center loaded. Please select items from Purchase History.')}
                        className="btn-white"
                        style={{ padding: '12px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}
                      >
                        Request Return or Exchange
                      </button>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 20, paddingTop: 16, fontSize: 11, color: '#777', textAlign: 'center' }}>
                    Concierge Hotline: +94 11 200 4500 • support@bloomair.io
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ──────────────── MODALS OVERLAYS ──────────────── */}

      {/* A. Profile Edit Modal */}
      {editingProfile && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="flat-card anim-fade" style={{ width: '100%', maxWidth: 450, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edit Profile Information</h3>
              <button onClick={() => setEditingProfile(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Full Name</label>
                <input
                  required
                  value={profileForm.fullName}
                  onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Phone Number</label>
                <input
                  required
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setEditingProfile(false)} className="btn-white" style={{ padding: '10px 20px', borderRadius: 4 }}>Cancel</button>
                <button type="submit" className="btn-black" style={{ padding: '10px 20px', borderRadius: 4 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. Order Details Modal */}
      {selectedOrderDetails && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="flat-card anim-fade" style={{ width: '100%', maxWidth: 600, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: 16, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>Order Details: #{selectedOrderDetails.orderNumber}</h3>
              <button onClick={() => setSelectedOrderDetails(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 12, color: '#555' }}>
                <div>
                  <strong>Order Date:</strong> {selectedOrderDetails.date}<br />
                  <strong>Payment Method:</strong> {selectedOrderDetails.paymentMethod}
                </div>
                <div>
                  <strong>Shipping Status:</strong> {selectedOrderDetails.status}<br />
                  <strong>Delivery Address:</strong> {addresses[0]?.line1}, {addresses[0]?.city}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Items in Order</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedOrderDetails.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: '#777' }}>Size: {item.size} • Color: {item.color} • Qty: {item.qty}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total cost break */}
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#777' }}>Subtotal</span>
                  <span>Rs. {selectedOrderDetails.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#777' }}>Premium Insured Delivery</span>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: 8, fontWeight: 700 }}>
                  <span>Grand Total</span>
                  <span>Rs. {selectedOrderDetails.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
              <button onClick={() => setSelectedOrderDetails(null)} className="btn-white" style={{ padding: '8px 20px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>Close Dialog</button>
              <button
                onClick={() => {
                  setSelectedOrderDetails(null);
                  handleDownloadInvoice(selectedOrderDetails);
                }}
                className="btn-black"
                style={{ padding: '8px 20px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. Write Review Modal */}
      {writingReviewProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="flat-card anim-fade" style={{ width: '100%', maxWidth: 450, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>Post Customer Feedback</h3>
              <button onClick={() => setWritingReviewProduct(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Product Name</label>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{writingReviewProduct.name}</div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Rating Score</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(stars => (
                    <button
                      key={stars} type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: stars })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star size={24} fill={stars <= reviewForm.rating ? '#D4AF37' : 'none'} color={stars <= reviewForm.rating ? '#D4AF37' : '#ccc'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Detailed Comments</label>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Review the fabric texture, fit dimensions, sizing, etc."
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, minHeight: 100, fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setWritingReviewProduct(null)} className="btn-white" style={{ padding: '10px 20px', borderRadius: 4 }}>Cancel</button>
                <button type="submit" className="btn-black" style={{ padding: '10px 20px', borderRadius: 4 }}>Publish Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
